"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollingFileAppender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _layouts = require("../../layouts/layouts");

var _buffer_appender = require("../buffer/buffer_appender");

var _policies = require("./policies");

var _strategies = require("./strategies");

var _rolling_file_manager = require("./rolling_file_manager");

var _rolling_file_context = require("./rolling_file_context");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Appender that formats all the `LogRecord` instances it receives and writes them to the specified file.
 * @internal
 */
class RollingFileAppender {
  constructor(config) {
    (0, _defineProperty2.default)(this, "isRolling", false);
    (0, _defineProperty2.default)(this, "disposed", false);
    (0, _defineProperty2.default)(this, "rollingPromise", void 0);
    (0, _defineProperty2.default)(this, "layout", void 0);
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "fileManager", void 0);
    (0, _defineProperty2.default)(this, "policy", void 0);
    (0, _defineProperty2.default)(this, "strategy", void 0);
    (0, _defineProperty2.default)(this, "buffer", void 0);
    this.context = new _rolling_file_context.RollingFileContext(config.fileName);
    this.context.refreshFileInfo();
    this.fileManager = new _rolling_file_manager.RollingFileManager(this.context);
    this.layout = _layouts.Layouts.create(config.layout);
    this.policy = (0, _policies.createTriggeringPolicy)(config.policy, this.context);
    this.strategy = (0, _strategies.createRollingStrategy)(config.strategy, this.context);
    this.buffer = new _buffer_appender.BufferAppender();
  }
  /**
   * Formats specified `record` and writes it to the specified file. If the record
   * would trigger a rollover, it will be performed before the effective write operation.
   */


  append(record) {
    // if we are currently rolling the files, push the log record
    // into the buffer, which will be flushed once rolling is complete
    if (this.isRolling) {
      this.buffer.append(record);
      return;
    }

    if (this.needRollout(record)) {
      this.buffer.append(record);
      this.rollingPromise = this.performRollout();
      return;
    }

    this._writeToFile(record);
  }

  _writeToFile(record) {
    this.fileManager.write(`${this.layout.format(record)}\n`);
  }
  /**
   * Disposes the appender.
   * If a rollout is currently in progress, it will be awaited.
   */


  async dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    if (this.rollingPromise) {
      await this.rollingPromise;
    }

    await this.buffer.dispose();
    await this.fileManager.closeStream();
  }

  async performRollout() {
    if (this.isRolling) {
      return;
    }

    this.isRolling = true;

    try {
      await this.strategy.rollout();
      await this.fileManager.closeStream();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[RollingFileAppender]: error while rolling file: ', e);
    }

    this.rollingPromise = undefined;
    this.isRolling = false;
    this.flushBuffer();
  }

  flushBuffer() {
    const pendingLogs = this.buffer.flush(); // in some extreme scenarios, `dispose` can be called during a rollover
    // where the internal buffered logs would trigger another rollover
    // (rollover started, logs keep coming and got buffered, dispose is called, rollover ends and we then flush)
    // this would cause a second rollover that would not be awaited
    // and could result in a race with the newly created appender
    // that would also be performing a rollover.
    // so if we are disposed, we just flush the buffer directly to the file instead to avoid losing the entries.

    for (const log of pendingLogs) {
      if (this.disposed) {
        this._writeToFile(log);
      } else {
        this.append(log);
      }
    }
  }
  /**
   * Checks if the current event should trigger a rollout
   */


  needRollout(record) {
    return this.policy.isTriggeringEvent(record);
  }

}

exports.RollingFileAppender = RollingFileAppender;
(0, _defineProperty2.default)(RollingFileAppender, "configSchema", _configSchema.schema.object({
  type: _configSchema.schema.literal('rolling-file'),
  layout: _layouts.Layouts.configSchema,
  fileName: _configSchema.schema.string(),
  policy: _policies.triggeringPolicyConfigSchema,
  strategy: _strategies.rollingStrategyConfigSchema
}));