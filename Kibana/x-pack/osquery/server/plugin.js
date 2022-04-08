"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsqueryPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _create_config = require("./create_config");

var _routes = require("./routes");

var _osquery = require("./search_strategy/osquery");

var _saved_objects = require("./saved_objects");

var _usage = require("./usage");

var _osquery_app_context_services = require("./lib/osquery_app_context_services");

var _types = require("../common/types");

var _common = require("../common");

var _fleet_integration = require("./lib/fleet_integration");

var _sender = require("./lib/telemetry/sender");

var _receiver = require("./lib/telemetry/receiver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerFeatures = features => {
  features.registerKibanaFeature({
    id: _common.PLUGIN_ID,
    name: _i18n.i18n.translate('xpack.osquery.features.osqueryFeatureName', {
      defaultMessage: 'Osquery'
    }),
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: [_common.PLUGIN_ID, 'kibana'],
    catalogue: [_common.PLUGIN_ID],
    order: 2300,
    excludeFromBasePrivileges: true,
    privileges: {
      all: {
        api: [`${_common.PLUGIN_ID}-read`, `${_common.PLUGIN_ID}-write`],
        app: [_common.PLUGIN_ID, 'kibana'],
        catalogue: [_common.PLUGIN_ID],
        savedObject: {
          all: [],
          read: []
        },
        ui: ['write']
      },
      read: {
        api: [`${_common.PLUGIN_ID}-read`],
        app: [_common.PLUGIN_ID, 'kibana'],
        catalogue: [_common.PLUGIN_ID],
        savedObject: {
          all: [],
          read: []
        },
        ui: ['read']
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.osquery.features.liveQueriesSubFeatureName', {
        defaultMessage: 'Live queries'
      }),
      privilegeGroups: [{
        groupType: 'mutually_exclusive',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-writeLiveQueries`, `${_common.PLUGIN_ID}-readLiveQueries`],
          id: 'live_queries_all',
          includeIn: 'all',
          name: 'All',
          savedObject: {
            all: [],
            read: []
          },
          ui: ['writeLiveQueries', 'readLiveQueries']
        }, {
          api: [`${_common.PLUGIN_ID}-readLiveQueries`],
          id: 'live_queries_read',
          includeIn: 'read',
          name: 'Read',
          savedObject: {
            all: [],
            read: []
          },
          ui: ['readLiveQueries']
        }]
      }, {
        groupType: 'independent',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-runSavedQueries`],
          id: 'run_saved_queries',
          name: _i18n.i18n.translate('xpack.osquery.features.runSavedQueriesPrivilegeName', {
            defaultMessage: 'Run Saved queries'
          }),
          includeIn: 'all',
          savedObject: {
            all: [],
            read: []
          },
          ui: ['runSavedQueries']
        }]
      }]
    }, {
      name: _i18n.i18n.translate('xpack.osquery.features.savedQueriesSubFeatureName', {
        defaultMessage: 'Saved queries'
      }),
      privilegeGroups: [{
        groupType: 'mutually_exclusive',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-writeSavedQueries`, `${_common.PLUGIN_ID}-readSavedQueries`],
          id: 'saved_queries_all',
          includeIn: 'all',
          name: 'All',
          savedObject: {
            all: [_types.savedQuerySavedObjectType],
            read: []
          },
          ui: ['writeSavedQueries', 'readSavedQueries']
        }, {
          api: [`${_common.PLUGIN_ID}-readSavedQueries`],
          id: 'saved_queries_read',
          includeIn: 'read',
          name: 'Read',
          savedObject: {
            all: [],
            read: [_types.savedQuerySavedObjectType]
          },
          ui: ['readSavedQueries']
        }]
      }]
    }, {
      name: _i18n.i18n.translate('xpack.osquery.features.packsSubFeatureName', {
        defaultMessage: 'Packs'
      }),
      privilegeGroups: [{
        groupType: 'mutually_exclusive',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-writePacks`, `${_common.PLUGIN_ID}-readPacks`],
          id: 'packs_all',
          includeIn: 'all',
          name: 'All',
          savedObject: {
            all: [_types.packSavedObjectType],
            read: []
          },
          ui: ['writePacks', 'readPacks']
        }, {
          api: [`${_common.PLUGIN_ID}-readPacks`],
          id: 'packs_read',
          includeIn: 'read',
          name: 'Read',
          savedObject: {
            all: [],
            read: [_types.packSavedObjectType]
          },
          ui: ['readPacks']
        }]
      }]
    }]
  });
};

class OsqueryPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "osqueryAppContextService", new _osquery_app_context_services.OsqueryAppContextService());
    (0, _defineProperty2.default)(this, "telemetryReceiver", void 0);
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
    (0, _defineProperty2.default)(this, "telemetryUsageCounter", void 0);
    this.initializerContext = initializerContext;
    this.context = initializerContext;
    this.logger = initializerContext.logger.get();
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger);
    this.telemetryReceiver = new _receiver.TelemetryReceiver(this.logger);
  }

  setup(core, plugins) {
    var _plugins$usageCollect;

    this.logger.debug('osquery: Setup');
    const config = (0, _create_config.createConfig)(this.initializerContext);
    registerFeatures(plugins.features);
    const router = core.http.createRouter();
    const osqueryContext = {
      logFactory: this.context.logger,
      getStartServices: core.getStartServices,
      service: this.osqueryAppContextService,
      config: () => config,
      security: plugins.security,
      telemetryEventsSender: this.telemetryEventsSender
    };
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    (0, _usage.initUsageCollectors)({
      core,
      osqueryContext,
      usageCollection: plugins.usageCollection
    });
    this.telemetryUsageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(_common.PLUGIN_ID);
    (0, _routes.defineRoutes)(router, osqueryContext);
    core.getStartServices().then(([, depsStart]) => {
      const osquerySearchStrategy = (0, _osquery.osquerySearchStrategyProvider)(depsStart.data);
      plugins.data.search.registerSearchStrategy('osquerySearchStrategy', osquerySearchStrategy);
    });
    this.telemetryEventsSender.setup(this.telemetryReceiver, plugins.telemetry, plugins.taskManager, this.telemetryUsageCounter);
    return {};
  }

  start(core, plugins) {
    var _plugins$fleet;

    this.logger.debug('osquery: Started');
    const registerIngestCallback = (_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.registerExternalCallback;
    this.osqueryAppContextService.start({ ...plugins.fleet,
      // @ts-expect-error update types
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      config: this.config,
      logger: this.logger,
      registerIngestCallback
    });
    this.telemetryReceiver.start(core, this.osqueryAppContextService);
    this.telemetryEventsSender.start(plugins.telemetry, plugins.taskManager, this.telemetryReceiver);

    if (registerIngestCallback) {
      const client = new _server.SavedObjectsClient(core.savedObjects.createInternalRepository());
      registerIngestCallback('postPackagePolicyDelete', (0, _fleet_integration.getPackagePolicyDeleteCallback)(client));
    }

    return {};
  }

  stop() {
    this.logger.debug('osquery: Stopped');
    this.telemetryEventsSender.stop();
    this.osqueryAppContextService.stop();
  }

}

exports.OsqueryPlugin = OsqueryPlugin;