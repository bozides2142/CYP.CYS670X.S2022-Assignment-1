"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInternalConfigurationSubClient = exports.createConfigurationSubClient = void 0;
exports.getConnectors = getConnectors;

var _pMap = _interopRequireDefault(require("p-map"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _server = require("../../../../../../src/core/server");

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _error = require("../../common/error");

var _get_mappings = require("./get_mappings");

var _authorization = require("../../authorization");

var _utils = require("../utils");

var _create_mappings = require("./create_mappings");

var _update_mappings = require("./update_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * These functions should not be exposed on the plugin contract. They are for internal use to support the CRUD of
 * configurations.
 *
 * @ignore
 */


const createInternalConfigurationSubClient = (clientArgs, casesClientInternal) => {
  const configureSubClient = {
    getMappings: params => (0, _get_mappings.getMappings)(params, clientArgs),
    createMappings: params => (0, _create_mappings.createMappings)(params, clientArgs),
    updateMappings: params => (0, _update_mappings.updateMappings)(params, clientArgs)
  };
  return Object.freeze(configureSubClient);
};
/**
 * Creates an API object for interacting with the configuration entities
 *
 * @ignore
 */


exports.createInternalConfigurationSubClient = createInternalConfigurationSubClient;

const createConfigurationSubClient = (clientArgs, casesInternalClient) => {
  return Object.freeze({
    get: params => get(params, clientArgs, casesInternalClient),
    getConnectors: () => getConnectors(clientArgs),
    update: (configurationId, configuration) => update(configurationId, configuration, clientArgs, casesInternalClient),
    create: configuration => create(configuration, clientArgs, casesInternalClient)
  });
};

exports.createConfigurationSubClient = createConfigurationSubClient;

async function get(params, clientArgs, casesClientInternal) {
  const {
    unsecuredSavedObjectsClient,
    caseConfigureService,
    logger,
    authorization
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.GetConfigureFindRequestRt).decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findConfigurations);
    const filter = (0, _utils.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter, _authorization.Operations.findConfigurations.savedObjectType);
    let error = null;
    const myCaseConfigure = await caseConfigureService.find({
      unsecuredSavedObjectsClient,
      options: {
        filter
      }
    });
    ensureSavedObjectsAreAuthorized(myCaseConfigure.saved_objects.map(configuration => ({
      id: configuration.id,
      owner: configuration.attributes.owner
    })));
    const configurations = await (0, _pMap.default)(myCaseConfigure.saved_objects, async configuration => {
      var _configuration$attrib, _configuration$versio;

      const {
        connector,
        ...caseConfigureWithoutConnector
      } = (_configuration$attrib = configuration === null || configuration === void 0 ? void 0 : configuration.attributes) !== null && _configuration$attrib !== void 0 ? _configuration$attrib : {
        connector: null
      };
      let mappings = [];

      if (connector != null) {
        try {
          mappings = await casesClientInternal.configuration.getMappings({
            connector
          });
        } catch (e) {
          error = e.isBoom ? e.output.payload.message : `Failed to retrieve mapping for ${connector.name}`;
        }
      }

      return { ...caseConfigureWithoutConnector,
        connector,
        mappings: mappings.length > 0 ? mappings[0].attributes.mappings : [],
        version: (_configuration$versio = configuration.version) !== null && _configuration$versio !== void 0 ? _configuration$versio : '',
        error,
        id: configuration.id
      };
    });
    return _api.CaseConfigurationsResponseRt.encode(configurations);
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get case configure: ${error}`,
      error,
      logger
    });
  }
}

async function getConnectors({
  actionsClient,
  logger
}) {
  try {
    const actionTypes = (await actionsClient.listTypes()).reduce((types, type) => ({ ...types,
      [type.id]: type
    }), {});
    return (await actionsClient.getAll()).filter(action => isConnectorSupported(action, actionTypes));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get connectors: ${error}`,
      error,
      logger
    });
  }
}

function isConnectorSupported(action, actionTypes) {
  var _actionTypes$action$a;

  return _constants.SUPPORTED_CONNECTORS.includes(action.actionTypeId) && ((_actionTypes$action$a = actionTypes[action.actionTypeId]) === null || _actionTypes$action$a === void 0 ? void 0 : _actionTypes$action$a.enabledInLicense) && action.config != null && !action.isPreconfigured;
}

async function update(configurationId, req, clientArgs, casesClientInternal) {
  const {
    caseConfigureService,
    logger,
    unsecuredSavedObjectsClient,
    user,
    authorization
  } = clientArgs;

  try {
    var _patch$attributes$con, _patch$version;

    const request = (0, _pipeable.pipe)(_api.CasesConfigurePatchRt.decode(req), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      version,
      ...queryWithoutVersion
    } = request;
    /**
     * Excess function does not supports union or intersection types.
     * For that reason we need to check manually for excess properties
     * in the partial attributes.
     *
     * The owner attribute should not be allowed.
     */

    (0, _pipeable.pipe)((0, _api.excess)(_api.CasesConfigurePatchRt.types[0]).decode(queryWithoutVersion), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const configuration = await caseConfigureService.get({
      unsecuredSavedObjectsClient,
      configurationId
    });
    await authorization.ensureAuthorized({
      operation: _authorization.Operations.updateConfiguration,
      entities: [{
        owner: configuration.attributes.owner,
        id: configuration.id
      }]
    });

    if (version !== configuration.version) {
      throw _boom.default.conflict('This configuration has been updated. Please refresh before saving additional updates.');
    }

    let error = null;
    const updateDate = new Date().toISOString();
    let mappings = [];
    const {
      connector,
      ...queryWithoutVersionAndConnector
    } = queryWithoutVersion;

    try {
      const resMappings = await casesClientInternal.configuration.getMappings({
        connector: connector != null ? connector : configuration.attributes.connector
      });
      mappings = resMappings.length > 0 ? resMappings[0].attributes.mappings : [];

      if (connector != null) {
        if (resMappings.length !== 0) {
          mappings = await casesClientInternal.configuration.updateMappings({
            connector,
            mappingId: resMappings[0].id
          });
        } else {
          mappings = await casesClientInternal.configuration.createMappings({
            connector,
            owner: configuration.attributes.owner
          });
        }
      }
    } catch (e) {
      error = e.isBoom ? e.output.payload.message : `Error creating mapping for ${connector != null ? connector.name : configuration.attributes.connector.name}`;
    }

    const patch = await caseConfigureService.patch({
      unsecuredSavedObjectsClient,
      configurationId: configuration.id,
      updatedAttributes: { ...queryWithoutVersionAndConnector,
        ...(connector != null && {
          connector
        }),
        updated_at: updateDate,
        updated_by: user
      },
      originalConfiguration: configuration
    });
    return _api.CaseConfigureResponseRt.encode({ ...configuration.attributes,
      ...patch.attributes,
      connector: (_patch$attributes$con = patch.attributes.connector) !== null && _patch$attributes$con !== void 0 ? _patch$attributes$con : configuration.attributes.connector,
      mappings,
      version: (_patch$version = patch.version) !== null && _patch$version !== void 0 ? _patch$version : '',
      error,
      id: patch.id
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get patch configure in route: ${error}`,
      error,
      logger
    });
  }
}

async function create(configuration, clientArgs, casesClientInternal) {
  const {
    unsecuredSavedObjectsClient,
    caseConfigureService,
    logger,
    user,
    authorization
  } = clientArgs;

  try {
    var _post$version;

    let error = null;
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(
    /**
     * The operation is createConfiguration because the procedure is part of
     * the create route. The user should have all
     * permissions to delete the results.
     */
    _authorization.Operations.createConfiguration);
    const filter = (0, _utils.combineAuthorizedAndOwnerFilter)(configuration.owner, authorizationFilter, _authorization.Operations.createConfiguration.savedObjectType);
    const myCaseConfigure = await caseConfigureService.find({
      unsecuredSavedObjectsClient,
      options: {
        filter
      }
    });
    ensureSavedObjectsAreAuthorized(myCaseConfigure.saved_objects.map(conf => ({
      id: conf.id,
      owner: conf.attributes.owner
    })));

    if (myCaseConfigure.saved_objects.length > 0) {
      const deleteConfigurationMapper = async c => caseConfigureService.delete({
        unsecuredSavedObjectsClient,
        configurationId: c.id
      }); // Ensuring we don't too many concurrent deletions running.


      await (0, _pMap.default)(myCaseConfigure.saved_objects, deleteConfigurationMapper, {
        concurrency: _constants.MAX_CONCURRENT_SEARCHES
      });
    }

    const savedObjectID = _server.SavedObjectsUtils.generateId();

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.createConfiguration,
      entities: [{
        owner: configuration.owner,
        id: savedObjectID
      }]
    });
    const creationDate = new Date().toISOString();
    let mappings = [];

    try {
      mappings = await casesClientInternal.configuration.createMappings({
        connector: configuration.connector,
        owner: configuration.owner
      });
    } catch (e) {
      error = e.isBoom ? e.output.payload.message : `Error creating mapping for ${configuration.connector.name}`;
    }

    const post = await caseConfigureService.post({
      unsecuredSavedObjectsClient,
      attributes: { ...configuration,
        connector: configuration.connector,
        created_at: creationDate,
        created_by: user,
        updated_at: null,
        updated_by: null
      },
      id: savedObjectID
    });
    return _api.CaseConfigureResponseRt.encode({ ...post.attributes,
      // Reserve for future implementations
      connector: post.attributes.connector,
      mappings,
      version: (_post$version = post.version) !== null && _post$version !== void 0 ? _post$version : '',
      error,
      id: post.id
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to create case configuration: ${error}`,
      error,
      logger
    });
  }
}