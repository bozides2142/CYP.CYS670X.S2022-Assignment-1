"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportingCore = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _server = require("../../../../src/core/server");

var _constants = require("../../spaces/common/constants");

var _constants2 = require("../common/constants");

var _schema_utils = require("../common/schema_utils");

var _lib = require("./lib");

var _logger = require("./lib/event_logger/logger");

var _tasks = require("./lib/tasks");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @internal
 */


class ReportingCore {
  // observe async background setupDeps and config each are done
  // observe async background startDeps
  // DEPRECATED. If `false`, the deprecated features have been disableed
  // final config, includes dynamic values based on OS type
  constructor(logger, context) {
    (0, _defineProperty2.default)(this, "packageInfo", void 0);
    (0, _defineProperty2.default)(this, "pluginSetupDeps", void 0);
    (0, _defineProperty2.default)(this, "pluginStartDeps", void 0);
    (0, _defineProperty2.default)(this, "pluginSetup$", new Rx.ReplaySubject());
    (0, _defineProperty2.default)(this, "pluginStart$", new Rx.ReplaySubject());
    (0, _defineProperty2.default)(this, "deprecatedAllowedRoles", false);
    (0, _defineProperty2.default)(this, "exportTypesRegistry", (0, _lib.getExportTypesRegistry)());
    (0, _defineProperty2.default)(this, "executeTask", void 0);
    (0, _defineProperty2.default)(this, "monitorTask", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "executing", void 0);
    (0, _defineProperty2.default)(this, "getContract", void 0);
    this.logger = logger;
    this.packageInfo = context.env.packageInfo;
    const syncConfig = context.config.get();
    this.deprecatedAllowedRoles = syncConfig.roles.enabled ? syncConfig.roles.allow : false;
    this.executeTask = new _tasks.ExecuteReportTask(this, syncConfig, this.logger);
    this.monitorTask = new _tasks.MonitorReportsTask(this, syncConfig, this.logger);

    this.getContract = () => ({
      usesUiCapabilities: () => syncConfig.roles.enabled === false
    });

    this.executing = new Set();
  }

  getKibanaPackageInfo() {
    return this.packageInfo;
  }
  /*
   * Register setupDeps
   */


  pluginSetup(setupDeps) {
    this.pluginSetup$.next(true); // trigger the observer

    this.pluginSetupDeps = setupDeps; // cache

    const {
      executeTask,
      monitorTask
    } = this;
    setupDeps.taskManager.registerTaskDefinitions({
      [executeTask.TYPE]: executeTask.getTaskDefinition(),
      [monitorTask.TYPE]: monitorTask.getTaskDefinition()
    });
  }
  /*
   * Register startDeps
   */


  async pluginStart(startDeps) {
    this.pluginStart$.next(startDeps); // trigger the observer

    this.pluginStartDeps = startDeps; // cache

    await this.assertKibanaIsAvailable();
    const {
      taskManager
    } = startDeps;
    const {
      executeTask,
      monitorTask
    } = this; // enable this instance to generate reports and to monitor for pending reports

    await Promise.all([executeTask.init(taskManager), monitorTask.init(taskManager)]);
  }

  async assertKibanaIsAvailable() {
    const {
      status
    } = this.getPluginSetupDeps();
    await status.overall$.pipe((0, _operators.filter)(current => current.level === _server.ServiceStatusLevels.available), (0, _operators.first)()).toPromise();
  }
  /*
   * Blocks the caller until setup is done
   */


  async pluginSetsUp() {
    // use deps and config as a cached resolver
    if (this.pluginSetupDeps && this.config) {
      return true;
    }

    return await this.pluginSetup$.pipe((0, _operators.take)(2)).toPromise(); // once for pluginSetupDeps (sync) and twice for config (async)
  }
  /*
   * Blocks the caller until start is done
   */


  async pluginStartsUp() {
    return await this.getPluginStartDeps().then(() => true);
  }
  /*
   * Synchronously checks if all async background setup and startup is completed
   */


  pluginIsStarted() {
    return this.pluginSetupDeps != null && this.config != null && this.pluginStartDeps != null;
  }
  /*
   * Allows config to be set in the background
   */


  setConfig(config) {
    this.config = config;
    this.pluginSetup$.next(true);
  }
  /**
   * If xpack.reporting.roles.enabled === true, register Reporting as a feature
   * that is controlled by user role names
   */


  registerFeature() {
    const {
      features
    } = this.getPluginSetupDeps();
    const deprecatedRoles = this.getDeprecatedAllowedRoles();

    if (deprecatedRoles !== false) {
      // refer to roles.allow configuration (deprecated path)
      const allowedRoles = ['superuser', ...(deprecatedRoles !== null && deprecatedRoles !== void 0 ? deprecatedRoles : [])];
      const privileges = allowedRoles.map(role => ({
        requiredClusterPrivileges: [],
        requiredRoles: [role],
        ui: []
      })); // self-register as an elasticsearch feature (deprecated)

      features.registerElasticsearchFeature({
        id: 'reporting',
        catalogue: ['reporting'],
        management: {
          insightsAndAlerting: ['reporting']
        },
        privileges
      });
    } else {
      this.logger.debug(`Reporting roles configuration is disabled. Please assign access to Reporting use Kibana feature controls for applications.`); // trigger application to register Reporting as a subfeature

      features.enableReportingUiCapabilities();
    }
  }
  /*
   * Gives synchronous access to the config
   */


  getConfig() {
    if (!this.config) {
      throw new Error('Config is not yet initialized');
    }

    return this.config;
  }
  /*
   * If deprecated feature has not been disabled,
   * this returns an array of allowed role names
   * that have access to Reporting.
   */


  getDeprecatedAllowedRoles() {
    return this.deprecatedAllowedRoles;
  }
  /*
   * Gives async access to the startDeps
   */


  async getPluginStartDeps() {
    if (this.pluginStartDeps) {
      return this.pluginStartDeps;
    }

    return await this.pluginStart$.pipe((0, _operators.first)()).toPromise();
  }

  getExportTypesRegistry() {
    return this.exportTypesRegistry;
  }

  async scheduleTask(report) {
    return await this.executeTask.scheduleTask(report);
  }

  async getStore() {
    return (await this.getPluginStartDeps()).store;
  }

  async getLicenseInfo() {
    const {
      license$
    } = (await this.getPluginStartDeps()).licensing;
    const registry = this.getExportTypesRegistry();
    return await license$.pipe((0, _operators.map)(license => (0, _lib.checkLicense)(registry, license)), (0, _operators.first)()).toPromise();
  }
  /*
   * Gives synchronous access to the setupDeps
   */


  getPluginSetupDeps() {
    if (!this.pluginSetupDeps) {
      throw new Error(`"pluginSetupDeps" dependencies haven't initialized yet`);
    }

    return this.pluginSetupDeps;
  }

  async getSavedObjectsClient(request) {
    const {
      savedObjects
    } = await this.getPluginStartDeps();
    return savedObjects.getScopedClient(request);
  }

  async getUiSettingsServiceFactory(savedObjectsClient) {
    const {
      uiSettings: uiSettingsService
    } = await this.getPluginStartDeps();
    const scopedUiSettingsService = uiSettingsService.asScopedToClient(savedObjectsClient);
    return scopedUiSettingsService;
  }

  getSpaceId(request, logger = this.logger) {
    var _this$getPluginSetupD;

    const spacesService = (_this$getPluginSetupD = this.getPluginSetupDeps().spaces) === null || _this$getPluginSetupD === void 0 ? void 0 : _this$getPluginSetupD.spacesService;

    if (spacesService) {
      const spaceId = spacesService === null || spacesService === void 0 ? void 0 : spacesService.getSpaceId(request);

      if (spaceId !== _constants.DEFAULT_SPACE_ID) {
        logger.info(`Request uses Space ID: ${spaceId}`);
        return spaceId;
      } else {
        logger.debug(`Request uses default Space`);
      }
    }
  }

  getFakeRequest(baseRequest, spaceId, logger = this.logger) {
    var _this$getPluginSetupD2;

    const fakeRequest = _server.KibanaRequest.from({
      path: '/',
      route: {
        settings: {}
      },
      url: {
        href: '/'
      },
      raw: {
        req: {
          url: '/'
        }
      },
      ...baseRequest
    });

    const spacesService = (_this$getPluginSetupD2 = this.getPluginSetupDeps().spaces) === null || _this$getPluginSetupD2 === void 0 ? void 0 : _this$getPluginSetupD2.spacesService;

    if (spacesService) {
      if (spaceId && spaceId !== _constants.DEFAULT_SPACE_ID) {
        logger.info(`Generating request for space: ${spaceId}`);
        this.getPluginSetupDeps().basePath.set(fakeRequest, `/s/${spaceId}`);
      }
    }

    return fakeRequest;
  }

  async getUiSettingsClient(request, logger = this.logger) {
    var _this$getPluginSetupD3;

    const spacesService = (_this$getPluginSetupD3 = this.getPluginSetupDeps().spaces) === null || _this$getPluginSetupD3 === void 0 ? void 0 : _this$getPluginSetupD3.spacesService;
    const spaceId = this.getSpaceId(request, logger);

    if (spacesService && spaceId) {
      logger.info(`Creating UI Settings Client for space: ${spaceId}`);
    }

    const savedObjectsClient = await this.getSavedObjectsClient(request);
    return await this.getUiSettingsServiceFactory(savedObjectsClient);
  }

  async getDataViewsService(request) {
    const {
      savedObjects
    } = await this.getPluginStartDeps();
    const savedObjectsClient = savedObjects.getScopedClient(request);
    const {
      indexPatterns
    } = await this.getDataService();
    const {
      asCurrentUser: esClient
    } = (await this.getEsClient()).asScoped(request);
    const dataViews = await indexPatterns.dataViewsServiceFactory(savedObjectsClient, esClient);
    return dataViews;
  }

  async getDataService() {
    const startDeps = await this.getPluginStartDeps();
    return startDeps.data;
  }

  async getEsClient() {
    const startDeps = await this.getPluginStartDeps();
    return startDeps.esClient;
  }

  getScreenshots(options) {
    return Rx.defer(() => this.getPluginStartDeps()).pipe((0, _operators.switchMap)(({
      screenshotting
    }) => {
      const config = this.getConfig();
      return screenshotting.getScreenshots({ ...options,
        timeouts: {
          loadDelay: (0, _schema_utils.durationToNumber)(config.get('capture', 'loadDelay')),
          openUrl: (0, _schema_utils.durationToNumber)(config.get('capture', 'timeouts', 'openUrl')),
          waitForElements: (0, _schema_utils.durationToNumber)(config.get('capture', 'timeouts', 'waitForElements')),
          renderComplete: (0, _schema_utils.durationToNumber)(config.get('capture', 'timeouts', 'renderComplete'))
        },
        layout: {
          zoom: config.get('capture', 'zoom'),
          ...options.layout
        },
        urls: options.urls.map(url => typeof url === 'string' ? url : [url[0], {
          [_constants2.REPORTING_REDIRECT_LOCATOR_STORE_KEY]: url[1]
        }])
      });
    }));
  }

  trackReport(reportId) {
    this.executing.add(reportId);
  }

  untrackReport(reportId) {
    this.executing.delete(reportId);
  }

  countConcurrentReports() {
    return this.executing.size;
  }

  getEventLogger(report, task) {
    const ReportingEventLogger = (0, _logger.reportingEventLoggerFactory)(this.logger);
    return new ReportingEventLogger(report, task);
  }

}

exports.ReportingCore = ReportingCore;