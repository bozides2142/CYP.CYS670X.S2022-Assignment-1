"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ServiceNowITOMActionTypeId", {
  enumerable: true,
  get: function () {
    return _config.ServiceNowITOMActionTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowITSMActionTypeId", {
  enumerable: true,
  get: function () {
    return _config.ServiceNowITSMActionTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowSIRActionTypeId", {
  enumerable: true,
  get: function () {
    return _config.ServiceNowSIRActionTypeId;
  }
});
exports.getServiceNowITOMActionType = getServiceNowITOMActionType;
exports.getServiceNowITSMActionType = getServiceNowITSMActionType;
exports.getServiceNowSIRActionType = getServiceNowSIRActionType;
Object.defineProperty(exports, "serviceNowITSMTable", {
  enumerable: true,
  get: function () {
    return _config.serviceNowITSMTable;
  }
});
Object.defineProperty(exports, "serviceNowSIRTable", {
  enumerable: true,
  get: function () {
    return _config.serviceNowSIRTable;
  }
});

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _validators = require("./validators");

var _schema = require("./schema");

var _service = require("./service");

var _api = require("./api");

var i18n = _interopRequireWildcard(require("./translations"));

var _config = require("./config");

var _service_sir = require("./service_sir");

var _api_sir = require("./api_sir");

var _utils = require("./utils");

var _service_itom = require("./service_itom");

var _api_itom = require("./api_itom");

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
// action type definition


function getServiceNowITSMActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: _config.ServiceNowITSMActionTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.SERVICENOW_ITSM,
    validate: {
      config: _configSchema.schema.object(_schema.ExternalIncidentServiceConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.ExternalIncidentServiceSecretConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchemaITSM
    },
    executor: (0, _lodash.curry)(executor)({
      logger,
      configurationUtilities,
      actionTypeId: _config.ServiceNowITSMActionTypeId,
      createService: _service.createExternalService,
      api: _api.api
    })
  };
}

function getServiceNowSIRActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: _config.ServiceNowSIRActionTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.SERVICENOW_SIR,
    validate: {
      config: _configSchema.schema.object(_schema.ExternalIncidentServiceConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.ExternalIncidentServiceSecretConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchemaSIR
    },
    executor: (0, _lodash.curry)(executor)({
      logger,
      configurationUtilities,
      actionTypeId: _config.ServiceNowSIRActionTypeId,
      createService: _service_sir.createExternalServiceSIR,
      api: _api_sir.apiSIR
    })
  };
}

function getServiceNowITOMActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: _config.ServiceNowITOMActionTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.SERVICENOW_ITOM,
    validate: {
      config: _configSchema.schema.object(_schema.ExternalIncidentServiceConfigurationBase, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.ExternalIncidentServiceSecretConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchemaITOM
    },
    executor: (0, _lodash.curry)(executorITOM)({
      logger,
      configurationUtilities,
      actionTypeId: _config.ServiceNowITOMActionTypeId,
      createService: _service_itom.createExternalServiceITOM,
      api: _api_itom.apiITOM
    })
  };
} // action executor


const supportedSubActions = ['getFields', 'pushToService', 'getChoices', 'getIncident'];

async function executor({
  logger,
  configurationUtilities,
  actionTypeId,
  createService,
  api
}, execOptions) {
  var _data;

  const {
    actionId,
    config,
    params,
    secrets
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  const externalServiceConfig = _config.snExternalServiceConfig[actionTypeId];
  let data = null;
  const externalService = createService({
    config,
    secrets
  }, logger, configurationUtilities, externalServiceConfig);
  const apiAsRecord = api;
  (0, _utils.throwIfSubActionIsNotSupported)({
    api: apiAsRecord,
    subAction,
    supportedSubActions,
    logger
  });

  if (subAction === 'pushToService') {
    const pushToServiceParams = subActionParams;
    data = await api.pushToService({
      externalService,
      params: pushToServiceParams,
      config,
      secrets,
      logger,
      commentFieldKey: externalServiceConfig.commentFieldKey
    });
    logger.debug(`response push to service for incident id: ${data.id}`);
  }

  if (subAction === 'getFields') {
    const getFieldsParams = subActionParams;
    data = await api.getFields({
      externalService,
      params: getFieldsParams,
      logger
    });
  }

  if (subAction === 'getChoices') {
    const getChoicesParams = subActionParams;
    data = await api.getChoices({
      externalService,
      params: getChoicesParams,
      logger
    });
  }

  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}

const supportedSubActionsITOM = ['addEvent', 'getChoices'];

async function executorITOM({
  logger,
  configurationUtilities,
  actionTypeId,
  createService,
  api
}, execOptions) {
  var _data2;

  const {
    actionId,
    config,
    params,
    secrets
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  const externalServiceConfig = _config.snExternalServiceConfig[actionTypeId];
  let data = null;
  const externalService = createService({
    config,
    secrets
  }, logger, configurationUtilities, externalServiceConfig);
  const apiAsRecord = api;
  (0, _utils.throwIfSubActionIsNotSupported)({
    api: apiAsRecord,
    subAction,
    supportedSubActions: supportedSubActionsITOM,
    logger
  });

  if (subAction === 'addEvent') {
    const eventParams = subActionParams;
    await api.addEvent({
      externalService,
      params: eventParams,
      logger
    });
  }

  if (subAction === 'getChoices') {
    const getChoicesParams = subActionParams;
    data = await api.getChoices({
      externalService,
      params: getChoicesParams,
      logger
    });
  }

  return {
    status: 'ok',
    data: (_data2 = data) !== null && _data2 !== void 0 ? _data2 : {},
    actionId
  };
}