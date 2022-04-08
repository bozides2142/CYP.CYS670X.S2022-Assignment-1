"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _utils = require("@kbn/utils");

var _config = require("./config");

var _core_app = require("./core_app");

var _i18n = require("./i18n");

var _elasticsearch = require("./elasticsearch");

var _http = require("./http");

var _http_resources = require("./http_resources");

var _rendering = require("./rendering");

var _logging = require("./logging");

var _ui_settings = require("./ui_settings");

var _plugins = require("./plugins");

var _saved_objects = require("./saved_objects");

var _metrics = require("./metrics");

var _capabilities = require("./capabilities");

var _environment = require("./environment");

var _status_service = require("./status/status_service");

var _execution_context = require("./execution_context");

var _doc_links = require("./doc_links");

var _csp = require("./csp");

var _status = require("./status");

var _context = require("./context");

var _core_usage_data = require("./core_usage_data");

var _deprecations = require("./deprecations");

var _core_route_handler_context = require("./core_route_handler_context");

var _external_url = require("./external_url");

var _preboot_core_route_handler_context = require("./preboot_core_route_handler_context");

var _preboot = require("./preboot");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

const coreId = Symbol('core');
const rootConfigPath = '';

var _pluginsInitialized = /*#__PURE__*/new WeakMap();

class Server {
  constructor(rawConfigProvider, env, loggingSystem) {
    (0, _defineProperty2.default)(this, "configService", void 0);
    (0, _defineProperty2.default)(this, "capabilities", void 0);
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "elasticsearch", void 0);
    (0, _defineProperty2.default)(this, "http", void 0);
    (0, _defineProperty2.default)(this, "rendering", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "plugins", void 0);
    (0, _defineProperty2.default)(this, "savedObjects", void 0);
    (0, _defineProperty2.default)(this, "uiSettings", void 0);
    (0, _defineProperty2.default)(this, "environment", void 0);
    (0, _defineProperty2.default)(this, "metrics", void 0);
    (0, _defineProperty2.default)(this, "httpResources", void 0);
    (0, _defineProperty2.default)(this, "status", void 0);
    (0, _defineProperty2.default)(this, "logging", void 0);
    (0, _defineProperty2.default)(this, "coreApp", void 0);
    (0, _defineProperty2.default)(this, "coreUsageData", void 0);
    (0, _defineProperty2.default)(this, "i18n", void 0);
    (0, _defineProperty2.default)(this, "deprecations", void 0);
    (0, _defineProperty2.default)(this, "executionContext", void 0);
    (0, _defineProperty2.default)(this, "prebootService", void 0);
    (0, _defineProperty2.default)(this, "docLinks", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsStartPromise", void 0);
    (0, _defineProperty2.default)(this, "resolveSavedObjectsStartPromise", void 0);

    _classPrivateFieldInitSpec(this, _pluginsInitialized, {
      writable: true,
      value: void 0
    });

    (0, _defineProperty2.default)(this, "coreStart", void 0);
    (0, _defineProperty2.default)(this, "discoveredPlugins", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.env = env;
    this.loggingSystem = loggingSystem;
    this.logger = this.loggingSystem.asLoggerFactory();
    this.log = this.logger.get('server');
    this.configService = new _config.ConfigService(rawConfigProvider, env, this.logger);
    const core = {
      coreId,
      configService: this.configService,
      env,
      logger: this.logger
    };
    this.context = new _context.ContextService(core);
    this.http = new _http.HttpService(core);
    this.rendering = new _rendering.RenderingService(core);
    this.plugins = new _plugins.PluginsService(core);
    this.elasticsearch = new _elasticsearch.ElasticsearchService(core);
    this.savedObjects = new _saved_objects.SavedObjectsService(core);
    this.uiSettings = new _ui_settings.UiSettingsService(core);
    this.capabilities = new _capabilities.CapabilitiesService(core);
    this.environment = new _environment.EnvironmentService(core);
    this.metrics = new _metrics.MetricsService(core);
    this.status = new _status_service.StatusService(core);
    this.coreApp = new _core_app.CoreApp(core);
    this.httpResources = new _http_resources.HttpResourcesService(core);
    this.logging = new _logging.LoggingService(core);
    this.coreUsageData = new _core_usage_data.CoreUsageDataService(core);
    this.i18n = new _i18n.I18nService(core);
    this.deprecations = new _deprecations.DeprecationsService(core);
    this.executionContext = new _execution_context.ExecutionContextService(core);
    this.prebootService = new _preboot.PrebootService(core);
    this.docLinks = new _doc_links.DocLinksService(core);
    this.savedObjectsStartPromise = new Promise(resolve => {
      this.resolveSavedObjectsStartPromise = resolve;
    });
  }

  async preboot() {
    this.log.debug('prebooting server');

    const prebootTransaction = _elasticApmNode.default.startTransaction('server-preboot', 'kibana-platform');

    const environmentPreboot = await this.environment.preboot(); // Discover any plugins before continuing. This allows other systems to utilize the plugin dependency graph.

    this.discoveredPlugins = await this.plugins.discover({
      environment: environmentPreboot
    }); // Immediately terminate in case of invalid configuration. This needs to be done after plugin discovery. We also
    // silent deprecation warnings until `setup` stage where we'll validate config once again.

    await (0, _config.ensureValidConfiguration)(this.configService, {
      logDeprecations: false
    });
    const {
      uiPlugins,
      pluginTree,
      pluginPaths
    } = this.discoveredPlugins.preboot;
    const contextServicePreboot = this.context.preboot({
      pluginDependencies: new Map([...pluginTree.asOpaqueIds])
    });
    const httpPreboot = await this.http.preboot({
      context: contextServicePreboot
    }); // setup i18n prior to any other service, to have translations ready

    await this.i18n.preboot({
      http: httpPreboot,
      pluginPaths
    });
    this.capabilities.preboot({
      http: httpPreboot
    });
    const elasticsearchServicePreboot = await this.elasticsearch.preboot();
    const uiSettingsPreboot = await this.uiSettings.preboot();
    const renderingPreboot = await this.rendering.preboot({
      http: httpPreboot,
      uiPlugins
    });
    const httpResourcesPreboot = this.httpResources.preboot({
      http: httpPreboot,
      rendering: renderingPreboot
    });
    const loggingPreboot = this.logging.preboot({
      loggingSystem: this.loggingSystem
    });
    const corePreboot = {
      context: contextServicePreboot,
      elasticsearch: elasticsearchServicePreboot,
      http: httpPreboot,
      uiSettings: uiSettingsPreboot,
      httpResources: httpResourcesPreboot,
      logging: loggingPreboot,
      preboot: this.prebootService.preboot()
    };
    await this.plugins.preboot(corePreboot);
    httpPreboot.registerRouteHandlerContext(coreId, 'core', () => {
      return new _preboot_core_route_handler_context.PrebootCoreRouteHandlerContext(corePreboot);
    });
    this.coreApp.preboot(corePreboot, uiPlugins);
    prebootTransaction === null || prebootTransaction === void 0 ? void 0 : prebootTransaction.end();
    return corePreboot;
  }

  async setup() {
    this.log.debug('setting up server');

    const setupTransaction = _elasticApmNode.default.startTransaction('server-setup', 'kibana-platform');

    const environmentSetup = this.environment.setup(); // Configuration could have changed after preboot.

    await (0, _config.ensureValidConfiguration)(this.configService);
    const {
      uiPlugins,
      pluginPaths,
      pluginTree
    } = this.discoveredPlugins.standard;
    const contextServiceSetup = this.context.setup({
      pluginDependencies: new Map([...pluginTree.asOpaqueIds])
    });
    const executionContextSetup = this.executionContext.setup();
    const docLinksSetup = this.docLinks.setup();
    const httpSetup = await this.http.setup({
      context: contextServiceSetup,
      executionContext: executionContextSetup
    });
    const deprecationsSetup = await this.deprecations.setup({
      http: httpSetup
    }); // setup i18n prior to any other service, to have translations ready

    const i18nServiceSetup = await this.i18n.setup({
      http: httpSetup,
      pluginPaths
    });
    const capabilitiesSetup = this.capabilities.setup({
      http: httpSetup
    });
    const elasticsearchServiceSetup = await this.elasticsearch.setup({
      http: httpSetup,
      executionContext: executionContextSetup
    });
    const metricsSetup = await this.metrics.setup({
      http: httpSetup
    });
    const coreUsageDataSetup = this.coreUsageData.setup({
      http: httpSetup,
      metrics: metricsSetup,
      savedObjectsStartPromise: this.savedObjectsStartPromise,
      changedDeprecatedConfigPath$: this.configService.getDeprecatedConfigPath$()
    });
    const savedObjectsSetup = await this.savedObjects.setup({
      http: httpSetup,
      elasticsearch: elasticsearchServiceSetup,
      deprecations: deprecationsSetup,
      coreUsageData: coreUsageDataSetup
    });
    const uiSettingsSetup = await this.uiSettings.setup({
      http: httpSetup,
      savedObjects: savedObjectsSetup
    });
    const statusSetup = await this.status.setup({
      elasticsearch: elasticsearchServiceSetup,
      pluginDependencies: pluginTree.asNames,
      savedObjects: savedObjectsSetup,
      environment: environmentSetup,
      http: httpSetup,
      metrics: metricsSetup,
      coreUsageData: coreUsageDataSetup
    });
    const renderingSetup = await this.rendering.setup({
      http: httpSetup,
      status: statusSetup,
      uiPlugins
    });
    const httpResourcesSetup = this.httpResources.setup({
      http: httpSetup,
      rendering: renderingSetup
    });
    const loggingSetup = this.logging.setup();
    const coreSetup = {
      capabilities: capabilitiesSetup,
      context: contextServiceSetup,
      docLinks: docLinksSetup,
      elasticsearch: elasticsearchServiceSetup,
      environment: environmentSetup,
      executionContext: executionContextSetup,
      http: httpSetup,
      i18n: i18nServiceSetup,
      savedObjects: savedObjectsSetup,
      status: statusSetup,
      uiSettings: uiSettingsSetup,
      rendering: renderingSetup,
      httpResources: httpResourcesSetup,
      logging: loggingSetup,
      metrics: metricsSetup,
      deprecations: deprecationsSetup,
      coreUsageData: coreUsageDataSetup
    };
    const pluginsSetup = await this.plugins.setup(coreSetup);
    (0, _classPrivateFieldSet2.default)(this, _pluginsInitialized, pluginsSetup.initialized);
    this.registerCoreContext(coreSetup);
    this.coreApp.setup(coreSetup, uiPlugins);
    setupTransaction === null || setupTransaction === void 0 ? void 0 : setupTransaction.end();
    return coreSetup;
  }

  async start() {
    this.log.debug('starting server');

    const startTransaction = _elasticApmNode.default.startTransaction('server-start', 'kibana-platform');

    const executionContextStart = this.executionContext.start();
    const docLinkStart = this.docLinks.start();
    const elasticsearchStart = await this.elasticsearch.start();
    const deprecationsStart = this.deprecations.start();
    const soStartSpan = startTransaction === null || startTransaction === void 0 ? void 0 : startTransaction.startSpan('saved_objects.migration', 'migration');
    const savedObjectsStart = await this.savedObjects.start({
      elasticsearch: elasticsearchStart,
      pluginsInitialized: (0, _classPrivateFieldGet2.default)(this, _pluginsInitialized)
    });
    await this.resolveSavedObjectsStartPromise(savedObjectsStart);
    soStartSpan === null || soStartSpan === void 0 ? void 0 : soStartSpan.end();
    const capabilitiesStart = this.capabilities.start();
    const uiSettingsStart = await this.uiSettings.start();
    const metricsStart = await this.metrics.start();
    const httpStart = this.http.getStartContract();
    const coreUsageDataStart = this.coreUsageData.start({
      elasticsearch: elasticsearchStart,
      savedObjects: savedObjectsStart,
      exposedConfigsToUsage: this.plugins.getExposedPluginConfigsToUsage()
    });
    this.status.start();
    this.coreStart = {
      capabilities: capabilitiesStart,
      docLinks: docLinkStart,
      elasticsearch: elasticsearchStart,
      executionContext: executionContextStart,
      http: httpStart,
      metrics: metricsStart,
      savedObjects: savedObjectsStart,
      uiSettings: uiSettingsStart,
      coreUsageData: coreUsageDataStart,
      deprecations: deprecationsStart
    };
    await this.plugins.start(this.coreStart);
    await this.http.start();
    startTransaction === null || startTransaction === void 0 ? void 0 : startTransaction.end();
    return this.coreStart;
  }

  async stop() {
    this.log.debug('stopping server');
    await this.http.stop(); // HTTP server has to stop before savedObjects and ES clients are closed to be able to gracefully attempt to resolve any pending requests

    await this.plugins.stop();
    await this.savedObjects.stop();
    await this.elasticsearch.stop();
    await this.uiSettings.stop();
    await this.rendering.stop();
    await this.metrics.stop();
    await this.status.stop();
    await this.logging.stop();
    this.deprecations.stop();
  }

  registerCoreContext(coreSetup) {
    coreSetup.http.registerRouteHandlerContext(coreId, 'core', (context, req, res) => {
      return new _core_route_handler_context.CoreRouteHandlerContext(this.coreStart, req);
    });
  }

  setupCoreConfig() {
    const configDescriptors = [_execution_context.config, _utils.config, _csp.config, _elasticsearch.config, _external_url.config, _logging.config, _http.config, _plugins.config, _saved_objects.savedObjectsConfig, _saved_objects.savedObjectsMigrationConfig, _ui_settings.config, _metrics.opsConfig, _status.config, _environment.config, _i18n.config, _deprecations.config];
    this.configService.addDeprecationProvider(rootConfigPath, _config.coreDeprecationProvider);

    for (const descriptor of configDescriptors) {
      if (descriptor.deprecations) {
        this.configService.addDeprecationProvider(descriptor.path, descriptor.deprecations);
      }

      this.configService.setSchema(descriptor.path, descriptor.schema);
    }
  }

}

exports.Server = Server;