"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggingSystem = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _logging = require("@kbn/logging");

var _appenders = require("./appenders/appenders");

var _buffer_appender = require("./appenders/buffer/buffer_appender");

var _logger = require("./logger");

var _logger_adapter = require("./logger_adapter");

var _logging_config = require("./logging_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * System that is responsible for maintaining loggers and logger appenders.
 * @internal
 */
class LoggingSystem {
  /** The configuration set by the user. */

  /** The fully computed configuration extended by context-specific configurations set programmatically */
  constructor() {
    (0, _defineProperty2.default)(this, "baseConfig", void 0);
    (0, _defineProperty2.default)(this, "computedConfig", void 0);
    (0, _defineProperty2.default)(this, "appenders", new Map());
    (0, _defineProperty2.default)(this, "bufferAppender", new _buffer_appender.BufferAppender());
    (0, _defineProperty2.default)(this, "loggers", new Map());
    (0, _defineProperty2.default)(this, "contextConfigs", new Map());
  }

  get(...contextParts) {
    const context = _logging_config.LoggingConfig.getLoggerContext(contextParts);

    if (!this.loggers.has(context)) {
      this.loggers.set(context, new _logger_adapter.LoggerAdapter(this.createLogger(context, this.computedConfig)));
    }

    return this.loggers.get(context);
  }
  /**
   * Safe wrapper that allows passing logging service as immutable LoggerFactory.
   */


  asLoggerFactory() {
    return {
      get: (...contextParts) => this.get(...contextParts)
    };
  }
  /**
   * Updates all current active loggers with the new config values.
   * @param rawConfig New config instance. if unspecified, the default logging configuration
   *                  will be used.
   */


  async upgrade(rawConfig) {
    const usedConfig = rawConfig !== null && rawConfig !== void 0 ? rawConfig : _logging_config.config.schema.validate({});
    const config = new _logging_config.LoggingConfig(usedConfig);
    await this.applyBaseConfig(config);
  }
  /**
   * Customizes the logging config for a specific context.
   *
   * @remarks
   * Assumes that that the `context` property of the individual items in `rawConfig.loggers`
   * are relative to the `baseContextParts`.
   *
   * @example
   * Customize the configuration for the plugins.data.search context.
   * ```ts
   * loggingSystem.setContextConfig(
   *   ['plugins', 'data'],
   *   {
   *     loggers: [{ name: 'search', appenders: ['default'] }]
   *   }
   * )
   * ```
   *
   * @param baseContextParts
   * @param rawConfig
   */


  async setContextConfig(baseContextParts, rawConfig) {
    const context = _logging_config.LoggingConfig.getLoggerContext(baseContextParts);

    const contextConfig = _logging_config.loggerContextConfigSchema.validate(rawConfig);

    this.contextConfigs.set(context, { ...contextConfig,
      // Automatically prepend the base context to the logger sub-contexts
      loggers: contextConfig.loggers.map(l => ({ ...l,
        name: _logging_config.LoggingConfig.getLoggerContext(l.name.length > 0 ? [context, l.name] : [context])
      }))
    }); // If we already have a base config, apply the config. If not, custom context configs
    // will be picked up on next call to `upgrade`.

    if (this.baseConfig) {
      await this.applyBaseConfig(this.baseConfig);
    }
  }
  /**
   * Disposes all loggers (closes log files, clears buffers etc.). Service is not usable after
   * calling of this method until new config is provided via `upgrade` method.
   * @returns Promise that is resolved once all loggers are successfully disposed.
   */


  async stop() {
    await Promise.all([...this.appenders.values()].map(a => a.dispose()));
    await this.bufferAppender.dispose();
    this.appenders.clear();
    this.loggers.clear();
  }

  createLogger(context, config) {
    if (config === undefined) {
      // If we don't have config yet, use `buffered` appender that will store all logged messages in the memory
      // until the config is ready.
      return new _logger.BaseLogger(context, _logging.LogLevel.All, [this.bufferAppender], this.asLoggerFactory());
    }

    const {
      level,
      appenders
    } = this.getLoggerConfigByContext(config, context);

    const loggerLevel = _logging.LogLevel.fromId(level);

    const loggerAppenders = appenders.map(appenderKey => this.appenders.get(appenderKey));
    return new _logger.BaseLogger(context, loggerLevel, loggerAppenders, this.asLoggerFactory());
  }

  getLoggerConfigByContext(config, context) {
    const loggerConfig = config.loggers.get(context);

    if (loggerConfig !== undefined) {
      return loggerConfig;
    } // If we don't have configuration for the specified context and it's the "nested" one (eg. `foo.bar.baz`),
    // let's move up to the parent context (eg. `foo.bar`) and check if it has config we can rely on. Otherwise
    // we fallback to the `root` context that should always be defined (enforced by configuration schema).


    return this.getLoggerConfigByContext(config, _logging_config.LoggingConfig.getParentLoggerContext(context));
  }
  /**
   * Retrieves an appender by the provided key, after first checking that no circular
   * dependencies exist between appender refs.
   */


  getAppenderByRef(appenderRef) {
    const checkCircularRefs = (key, stack) => {
      if (stack.includes(key)) {
        throw new Error(`Circular appender reference detected: [${stack.join(' -> ')} -> ${key}]`);
      }

      stack.push(key);
      const appender = this.appenders.get(key);

      if (appender !== null && appender !== void 0 && appender.appenderRefs) {
        appender.appenderRefs.forEach(ref => checkCircularRefs(ref, [...stack]));
      }

      return appender;
    };

    return checkCircularRefs(appenderRef, []);
  }

  async applyBaseConfig(newBaseConfig) {
    this.enforceBufferAppendersUsage();
    const computedConfig = [...this.contextConfigs.values()].reduce((baseConfig, contextConfig) => baseConfig.extend(contextConfig), newBaseConfig); // Appenders must be reset, so we first dispose of the current ones, then
    // build up a new set of appenders.

    await Promise.all([...this.appenders.values()].map(a => a.dispose()));
    this.appenders.clear();

    for (const [appenderKey, appenderConfig] of computedConfig.appenders) {
      this.appenders.set(appenderKey, _appenders.Appenders.create(appenderConfig));
    } // Once all appenders have been created, check for any that have explicitly
    // declared `appenderRefs` dependencies, and look up those dependencies to
    // attach to the appender. This enables appenders to act as a sort of
    // middleware and call `append` on each other if needed.


    for (const [key, appender] of this.appenders) {
      if (!appender.addAppender || !appender.appenderRefs) {
        continue;
      }

      for (const ref of appender.appenderRefs) {
        const foundAppender = this.getAppenderByRef(ref);

        if (!foundAppender) {
          throw new Error(`Appender "${key}" config contains unknown appender key "${ref}".`);
        }

        appender.addAppender(ref, foundAppender);
      }
    }

    this.enforceConfiguredAppendersUsage(computedConfig); // We keep a reference to the base config so we can properly extend it
    // on each config change.

    this.baseConfig = newBaseConfig; // Re-log all buffered log records with newly configured appenders.

    for (const logRecord of this.bufferAppender.flush()) {
      this.get(logRecord.context).log(logRecord);
    }
  } // reconfigure all the loggers to have them use the buffer appender
  // while we are awaiting for the appenders to be disposed.


  enforceBufferAppendersUsage() {
    for (const [loggerKey, loggerAdapter] of this.loggers) {
      loggerAdapter.updateLogger(this.createLogger(loggerKey, undefined));
    } // new loggers created during applyBaseConfig execution should use the buffer appender as well


    this.computedConfig = undefined;
  }

  enforceConfiguredAppendersUsage(config) {
    for (const [loggerKey, loggerAdapter] of this.loggers) {
      loggerAdapter.updateLogger(this.createLogger(loggerKey, config));
    }

    this.computedConfig = config;
  }

}

exports.LoggingSystem = LoggingSystem;