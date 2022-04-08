"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmFleetRouteRepository = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");

var _create_cloud_apm_package_policy = require("./create_cloud_apm_package_policy");

var _get_agents = require("./get_agents");

var _get_apm_package_policies = require("./get_apm_package_policies");

var _get_cloud_apm_package_policy = require("./get_cloud_apm_package_policy");

var _get_unsupported_apm_server_schema = require("./get_unsupported_apm_server_schema");

var _is_superuser = require("./is_superuser");

var _get_internal_saved_objects_client = require("../../lib/helpers/get_internal_saved_objects_client");

var _setup_request = require("../../lib/helpers/setup_request");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

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


const hasFleetDataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/fleet/has_apm_policies',
  options: {
    tags: []
  },
  handler: async ({
    core,
    plugins
  }) => {
    var _plugins$fleet;

    const fleetPluginStart = await ((_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.start());

    if (!fleetPluginStart) {
      return {
        hasApmPolicies: false
      };
    }

    const packagePolicies = await (0, _get_apm_package_policies.getApmPackgePolicies)({
      core,
      fleetPluginStart
    });
    return {
      hasApmPolicies: packagePolicies.total > 0
    };
  }
});
const fleetAgentsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/fleet/agents',
  options: {
    tags: []
  },
  handler: async ({
    core,
    plugins
  }) => {
    var _plugins$cloud, _plugins$fleet2;

    const cloudSetup = (_plugins$cloud = plugins.cloud) === null || _plugins$cloud === void 0 ? void 0 : _plugins$cloud.setup;
    const cloudStandaloneSetup = cloudSetup ? {
      apmServerUrl: cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.url,
      secretToken: cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.secretToken
    } : undefined;
    const fleetPluginStart = await ((_plugins$fleet2 = plugins.fleet) === null || _plugins$fleet2 === void 0 ? void 0 : _plugins$fleet2.start());

    if (!fleetPluginStart) {
      return {
        cloudStandaloneSetup,
        fleetAgents: [],
        isFleetEnabled: false
      };
    } // fetches package policies that contains APM integrations


    const packagePolicies = await (0, _get_apm_package_policies.getApmPackgePolicies)({
      core,
      fleetPluginStart
    });
    const policiesGroupedById = (0, _lodash.keyBy)(packagePolicies.items, 'policy_id'); // fetches all agents with the found package policies

    const fleetAgents = await (0, _get_agents.getFleetAgents)({
      policyIds: Object.keys(policiesGroupedById),
      core,
      fleetPluginStart
    });
    return {
      cloudStandaloneSetup,
      isFleetEnabled: true,
      fleetAgents: fleetAgents.map(agent => {
        var _packagePolicy$inputs, _packagePolicyVars$ur, _packagePolicyVars$se;

        const packagePolicy = policiesGroupedById[agent.id];
        const packagePolicyVars = (_packagePolicy$inputs = packagePolicy.inputs[0]) === null || _packagePolicy$inputs === void 0 ? void 0 : _packagePolicy$inputs.vars;
        return {
          id: agent.id,
          name: agent.name,
          apmServerUrl: packagePolicyVars === null || packagePolicyVars === void 0 ? void 0 : (_packagePolicyVars$ur = packagePolicyVars.url) === null || _packagePolicyVars$ur === void 0 ? void 0 : _packagePolicyVars$ur.value,
          secretToken: packagePolicyVars === null || packagePolicyVars === void 0 ? void 0 : (_packagePolicyVars$se = packagePolicyVars.secret_token) === null || _packagePolicyVars$se === void 0 ? void 0 : _packagePolicyVars$se.value
        };
      })
    };
  }
});
const saveApmServerSchemaRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /api/apm/fleet/apm_server_schema',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    body: t.type({
      schema: t.record(t.string, t.unknown)
    })
  }),
  handler: async resources => {
    const {
      params,
      logger,
      core
    } = resources;
    const savedObjectsClient = await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core.setup);
    const {
      schema
    } = params.body;
    await savedObjectsClient.create(_apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE, {
      schemaJson: JSON.stringify(schema)
    }, {
      id: _apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_ID,
      overwrite: true
    });
    logger.info(`Stored apm-server schema.`);
  }
});
const getUnsupportedApmServerSchemaRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/fleet/apm_server_schema/unsupported',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;
    const savedObjectsClient = context.core.savedObjects.client;
    return {
      unsupported: await (0, _get_unsupported_apm_server_schema.getUnsupportedApmServerSchema)({
        savedObjectsClient
      })
    };
  }
});
const getMigrationCheckRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/fleet/migration_check',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      core,
      plugins,
      context,
      config,
      request
    } = resources;
    const cloudApmMigrationEnabled = config.agent.migrations.enabled;

    if (!plugins.fleet || !plugins.security) {
      throw _boom.default.internal(FLEET_SECURITY_REQUIRED_MESSAGE);
    }

    const savedObjectsClient = context.core.savedObjects.client;
    const [fleetPluginStart, securityPluginStart] = await Promise.all([plugins.fleet.start(), plugins.security.start()]);
    const hasRequiredRole = (0, _is_superuser.isSuperuser)({
      securityPluginStart,
      request
    });
    const cloudAgentPolicy = hasRequiredRole ? await (0, _get_cloud_apm_package_policy.getCloudAgentPolicy)({
      savedObjectsClient,
      fleetPluginStart
    }) : undefined;
    const apmPackagePolicy = (0, _get_cloud_apm_package_policy.getApmPackagePolicy)(cloudAgentPolicy);
    const packagePolicies = await (0, _get_apm_package_policies.getApmPackgePolicies)({
      core,
      fleetPluginStart
    });
    return {
      has_cloud_agent_policy: !!cloudAgentPolicy,
      has_cloud_apm_package_policy: !!apmPackagePolicy,
      cloud_apm_migration_enabled: cloudApmMigrationEnabled,
      has_required_role: hasRequiredRole,
      cloud_apm_package_policy: apmPackagePolicy,
      has_apm_integrations: packagePolicies.total > 0
    };
  }
});
const createCloudApmPackagePolicyRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/fleet/cloud_apm_package_policy',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    var _plugins$cloud2;

    const {
      plugins,
      context,
      config,
      request,
      logger,
      kibanaVersion
    } = resources;
    const cloudApmMigrationEnabled = config.agent.migrations.enabled;

    if (!plugins.fleet || !plugins.security) {
      throw _boom.default.internal(FLEET_SECURITY_REQUIRED_MESSAGE);
    }

    const savedObjectsClient = context.core.savedObjects.client;
    const coreStart = await resources.core.start();
    const esClient = coreStart.elasticsearch.client.asScoped(resources.request).asCurrentUser;
    const cloudPluginSetup = (_plugins$cloud2 = plugins.cloud) === null || _plugins$cloud2 === void 0 ? void 0 : _plugins$cloud2.setup;
    const fleetPluginStart = await plugins.fleet.start();
    const securityPluginStart = await plugins.security.start();
    const hasRequiredRole = (0, _is_superuser.isSuperuser)({
      securityPluginStart,
      request
    });

    if (!hasRequiredRole || !cloudApmMigrationEnabled) {
      throw _boom.default.forbidden(CLOUD_SUPERUSER_REQUIRED_MESSAGE);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const cloudApmPackagePolicy = await (0, _create_cloud_apm_package_policy.createCloudApmPackgePolicy)({
      cloudPluginSetup,
      fleetPluginStart,
      savedObjectsClient,
      esClient,
      logger,
      setup,
      kibanaVersion
    });
    return {
      cloudApmPackagePolicy
    };
  }
});
const apmFleetRouteRepository = { ...hasFleetDataRoute,
  ...fleetAgentsRoute,
  ...saveApmServerSchemaRoute,
  ...getUnsupportedApmServerSchemaRoute,
  ...getMigrationCheckRoute,
  ...createCloudApmPackagePolicyRoute
};
exports.apmFleetRouteRepository = apmFleetRouteRepository;

const FLEET_SECURITY_REQUIRED_MESSAGE = _i18n.i18n.translate('xpack.apm.api.fleet.fleetSecurityRequired', {
  defaultMessage: `Fleet and Security plugins are required`
});

const CLOUD_SUPERUSER_REQUIRED_MESSAGE = _i18n.i18n.translate('xpack.apm.api.fleet.cloud_apm_package_policy.requiredRoleOnCloud', {
  defaultMessage: 'Operation only permitted by Elastic Cloud users with the superuser role.'
});