"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _discovery = require("./discovery");

var _types = require("./types");

var _plugins_config = require("./plugins_config");

var _plugins_system = require("./plugins_system");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class PluginsService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "prebootPluginsSystem", void 0);
    (0, _defineProperty2.default)(this, "arePrebootPluginsStopped", false);
    (0, _defineProperty2.default)(this, "prebootUiPluginInternalInfo", new Map());
    (0, _defineProperty2.default)(this, "standardPluginsSystem", void 0);
    (0, _defineProperty2.default)(this, "standardUiPluginInternalInfo", new Map());
    (0, _defineProperty2.default)(this, "configService", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "pluginConfigDescriptors", new Map());
    (0, _defineProperty2.default)(this, "pluginConfigUsageDescriptors", new Map());
    this.coreContext = coreContext;
    this.log = coreContext.logger.get('plugins-service');
    this.configService = coreContext.configService;
    this.config$ = coreContext.configService.atPath('plugins').pipe((0, _operators.map)(rawConfig => new _plugins_config.PluginsConfig(rawConfig, coreContext.env)));
    this.prebootPluginsSystem = new _plugins_system.PluginsSystem(this.coreContext, _types.PluginType.preboot);
    this.standardPluginsSystem = new _plugins_system.PluginsSystem(this.coreContext, _types.PluginType.standard);
  }

  async discover({
    environment
  }) {
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    const {
      error$,
      plugin$
    } = (0, _discovery.discover)(config, this.coreContext, {
      uuid: environment.instanceUuid
    });
    await this.handleDiscoveryErrors(error$);
    await this.handleDiscoveredPlugins(plugin$);
    const prebootUiPlugins = this.prebootPluginsSystem.uiPlugins();
    const standardUiPlugins = this.standardPluginsSystem.uiPlugins();
    return {
      preboot: {
        pluginPaths: this.prebootPluginsSystem.getPlugins().map(plugin => plugin.path),
        pluginTree: this.prebootPluginsSystem.getPluginDependencies(),
        uiPlugins: {
          internal: this.prebootUiPluginInternalInfo,
          public: prebootUiPlugins,
          browserConfigs: this.generateUiPluginsConfigs(prebootUiPlugins)
        }
      },
      standard: {
        pluginPaths: this.standardPluginsSystem.getPlugins().map(plugin => plugin.path),
        pluginTree: this.standardPluginsSystem.getPluginDependencies(),
        uiPlugins: {
          internal: this.standardUiPluginInternalInfo,
          public: standardUiPlugins,
          browserConfigs: this.generateUiPluginsConfigs(standardUiPlugins)
        }
      }
    };
  }

  getExposedPluginConfigsToUsage() {
    return this.pluginConfigUsageDescriptors;
  }

  async preboot(deps) {
    this.log.debug('Prebooting plugins service');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();

    if (config.initialize) {
      await this.prebootPluginsSystem.setupPlugins(deps);
      this.registerPluginStaticDirs(deps, this.prebootUiPluginInternalInfo);
    } else {
      this.log.info('Skipping `setup` for `preboot` plugins since plugin initialization is disabled.');
    }
  }

  async setup(deps) {
    this.log.debug('Setting up plugins service');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    let contracts = new Map();

    if (config.initialize) {
      contracts = await this.standardPluginsSystem.setupPlugins(deps);
      this.registerPluginStaticDirs(deps, this.standardUiPluginInternalInfo);
    } else {
      this.log.info('Skipping `setup` for `standard` plugins since plugin initialization is disabled.');
    }

    return {
      initialized: config.initialize,
      contracts
    };
  }

  async start(deps) {
    this.log.debug('Plugins service starts plugins');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();

    if (!config.initialize) {
      this.log.info('Skipping `start` for `standard` plugins since plugin initialization is disabled.');
      return {
        contracts: new Map()
      };
    }

    await this.prebootPluginsSystem.stopPlugins();
    this.arePrebootPluginsStopped = true;
    const contracts = await this.standardPluginsSystem.startPlugins(deps);
    return {
      contracts
    };
  }

  async stop() {
    this.log.debug('Stopping plugins service');

    if (!this.arePrebootPluginsStopped) {
      this.arePrebootPluginsStopped = false;
      await this.prebootPluginsSystem.stopPlugins();
    }

    await this.standardPluginsSystem.stopPlugins();
  }

  generateUiPluginsConfigs(uiPlugins) {
    return new Map([...uiPlugins].filter(([pluginId, _]) => {
      const configDescriptor = this.pluginConfigDescriptors.get(pluginId);
      return configDescriptor && configDescriptor.exposeToBrowser && Object.values(configDescriptor === null || configDescriptor === void 0 ? void 0 : configDescriptor.exposeToBrowser).some(exposed => exposed);
    }).map(([pluginId, plugin]) => {
      const configDescriptor = this.pluginConfigDescriptors.get(pluginId);
      return [pluginId, this.configService.atPath(plugin.configPath).pipe((0, _operators.map)(config => (0, _std.pick)(config || {}, Object.entries(configDescriptor.exposeToBrowser).filter(([_, exposed]) => exposed).map(([key, _]) => key))))];
    }));
  }

  async handleDiscoveryErrors(error$) {
    // At this stage we report only errors that can occur when new platform plugin
    // manifest is present, otherwise we can't be sure that the plugin is for the new
    // platform and let legacy platform to handle it.
    const errorTypesToReport = [_discovery.PluginDiscoveryErrorType.IncompatibleVersion, _discovery.PluginDiscoveryErrorType.InvalidManifest];
    const errors = await error$.pipe((0, _operators.filter)(error => errorTypesToReport.includes(error.type)), (0, _operators.tap)(pluginError => this.log.error(pluginError)), (0, _operators.toArray)()).toPromise();

    if (errors.length > 0) {
      throw new Error(`Failed to initialize plugins:${errors.map(err => `\n\t${err.message}`).join('')}`);
    }
  }

  async handleDiscoveredPlugins(plugin$) {
    const pluginEnableStatuses = new Map();
    const plugins = await plugin$.pipe((0, _operators.toArray)()).toPromise(); // Register config descriptors and deprecations

    for (const plugin of plugins) {
      const configDescriptor = plugin.getConfigDescriptor();

      if (configDescriptor) {
        this.pluginConfigDescriptors.set(plugin.name, configDescriptor);

        if (configDescriptor.deprecations) {
          this.coreContext.configService.addDeprecationProvider(plugin.configPath, configDescriptor.deprecations);
        }

        if (configDescriptor.exposeToUsage) {
          this.pluginConfigUsageDescriptors.set(Array.isArray(plugin.configPath) ? plugin.configPath.join('.') : plugin.configPath, (0, _std.getFlattenedObject)(configDescriptor.exposeToUsage));
        }

        this.coreContext.configService.setSchema(plugin.configPath, configDescriptor.schema);
      }
    } // Validate config and handle enabled statuses.
    // NOTE: We can't do both in the same previous loop because some plugins' deprecations may affect others.
    // Hence, we need all the deprecations to be registered before accessing any config parameter.


    for (const plugin of plugins) {
      const isEnabled = await this.coreContext.configService.isEnabledAtPath(plugin.configPath);

      if (pluginEnableStatuses.has(plugin.name)) {
        throw new Error(`Plugin with id "${plugin.name}" is already registered!`);
      }

      if (plugin.includesUiPlugin) {
        const uiPluginInternalInfo = plugin.manifest.type === _types.PluginType.preboot ? this.prebootUiPluginInternalInfo : this.standardUiPluginInternalInfo;
        uiPluginInternalInfo.set(plugin.name, {
          requiredBundles: plugin.requiredBundles,
          version: plugin.manifest.version,
          publicTargetDir: _path.default.resolve(plugin.path, 'target/public'),
          publicAssetsDir: _path.default.resolve(plugin.path, 'public/assets')
        });
      }

      pluginEnableStatuses.set(plugin.name, {
        plugin,
        isEnabled
      });
    } // Add the plugins to the Plugin System if enabled and its dependencies are met


    for (const [pluginName, {
      plugin,
      isEnabled
    }] of pluginEnableStatuses) {
      this.validatePluginDependencies(plugin, pluginEnableStatuses);
      const pluginEnablement = this.shouldEnablePlugin(pluginName, pluginEnableStatuses);

      if (pluginEnablement.enabled) {
        if (plugin.manifest.type === _types.PluginType.preboot) {
          this.prebootPluginsSystem.addPlugin(plugin);
        } else {
          this.standardPluginsSystem.addPlugin(plugin);
        }
      } else if (isEnabled) {
        this.log.info(`Plugin "${pluginName}" has been disabled since the following direct or transitive dependencies are missing, disabled, or have incompatible types: [${pluginEnablement.missingOrIncompatibleDependencies.join(', ')}]`);
      } else {
        this.log.info(`Plugin "${pluginName}" is disabled.`);
      }
    }

    this.log.debug(`Discovered ${pluginEnableStatuses.size} plugins.`);
  }
  /** Throws an error if the plugin's dependencies are invalid. */


  validatePluginDependencies(plugin, pluginEnableStatuses) {
    const {
      name,
      manifest,
      requiredBundles,
      requiredPlugins
    } = plugin; // validate that `requiredBundles` ids point to a discovered plugin which `includesUiPlugin`

    for (const requiredBundleId of requiredBundles) {
      if (!pluginEnableStatuses.has(requiredBundleId)) {
        throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${name}" but it is missing.`);
      }

      const requiredPlugin = pluginEnableStatuses.get(requiredBundleId).plugin;

      if (!requiredPlugin.includesUiPlugin) {
        throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${name}" but it doesn't have a UI bundle.`);
      }

      if (requiredPlugin.manifest.type !== plugin.manifest.type) {
        throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${name}" and expected to have "${manifest.type}" type, but its type is "${requiredPlugin.manifest.type}".`);
      }
    } // validate that OSS plugins do not have required dependencies on X-Pack plugins


    if (plugin.source === 'oss') {
      for (const id of [...requiredPlugins, ...requiredBundles]) {
        const requiredPlugin = pluginEnableStatuses.get(id);

        if (requiredPlugin && requiredPlugin.plugin.source === 'x-pack') {
          throw new Error(`X-Pack plugin or bundle with id "${id}" is required by OSS plugin "${name}", which is prohibited. Consider making this an optional dependency instead.`);
        }
      }
    }
  }

  shouldEnablePlugin(pluginName, pluginEnableStatuses, parents = []) {
    const pluginInfo = pluginEnableStatuses.get(pluginName);

    if (pluginInfo === undefined || !pluginInfo.isEnabled) {
      return {
        enabled: false,
        missingOrIncompatibleDependencies: []
      };
    }

    const missingOrIncompatibleDependencies = pluginInfo.plugin.requiredPlugins.filter(dep => !parents.includes(dep)).filter(dependencyName => {
      var _pluginEnableStatuses;

      return ((_pluginEnableStatuses = pluginEnableStatuses.get(dependencyName)) === null || _pluginEnableStatuses === void 0 ? void 0 : _pluginEnableStatuses.plugin.manifest.type) !== pluginInfo.plugin.manifest.type || !this.shouldEnablePlugin(dependencyName, pluginEnableStatuses, [...parents, pluginName]).enabled;
    });

    if (missingOrIncompatibleDependencies.length === 0) {
      return {
        enabled: true
      };
    }

    return {
      enabled: false,
      missingOrIncompatibleDependencies
    };
  }

  registerPluginStaticDirs(deps, uiPluginInternalInfo) {
    for (const [pluginName, pluginInfo] of uiPluginInternalInfo) {
      deps.http.registerStaticDir(`/plugins/${pluginName}/assets/{path*}`, pluginInfo.publicAssetsDir);
    }
  }

}

exports.PluginsService = PluginsService;