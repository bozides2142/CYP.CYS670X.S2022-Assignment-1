"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = exports.SYS_DICTIONARY_ENDPOINT = void 0;

var _axios = _interopRequireDefault(require("axios"));

var i18n = _interopRequireWildcard(require("./translations"));

var _axios_utils = require("../lib/axios_utils");

var _utils = require("./utils");

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


const SYS_DICTIONARY_ENDPOINT = `api/now/table/sys_dictionary`;
exports.SYS_DICTIONARY_ENDPOINT = SYS_DICTIONARY_ENDPOINT;

const createExternalService = ({
  config,
  secrets
}, logger, configurationUtilities, {
  table,
  importSetTable,
  useImportAPI,
  appScope
}) => {
  const {
    apiUrl: url,
    usesTableApi: usesTableApiConfigValue
  } = config;
  const {
    username,
    password
  } = secrets;

  if (!url || !username || !password) {
    throw Error(`[Action]${i18n.SERVICENOW}: Wrong configuration.`);
  }

  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const importSetTableUrl = `${urlWithoutTrailingSlash}/api/now/import/${importSetTable}`;
  const tableApiIncidentUrl = `${urlWithoutTrailingSlash}/api/now/v2/table/${table}`;
  const fieldsUrl = `${urlWithoutTrailingSlash}/${SYS_DICTIONARY_ENDPOINT}?sysparm_query=name=task^ORname=${table}^internal_type=string&active=true&array=false&read_only=false&sysparm_fields=max_length,element,column_label,mandatory`;
  const choicesUrl = `${urlWithoutTrailingSlash}/api/now/table/sys_choice`;
  /**
   * Need to be set the same at:
   * x-pack/plugins/triggers_actions_ui/public/application/components/builtin_action_types/servicenow/api.ts
   */

  const getVersionUrl = () => `${urlWithoutTrailingSlash}/api/${appScope}/elastic_api/health`;

  const axiosInstance = _axios.default.create({
    auth: {
      username,
      password
    }
  });

  const useTableApi = !useImportAPI || usesTableApiConfigValue;

  const getCreateIncidentUrl = () => useTableApi ? tableApiIncidentUrl : importSetTableUrl;

  const getUpdateIncidentUrl = incidentId => useTableApi ? `${tableApiIncidentUrl}/${incidentId}` : importSetTableUrl;

  const getIncidentViewURL = id => {
    // Based on: https://docs.servicenow.com/bundle/orlando-platform-user-interface/page/use/navigation/reference/r_NavigatingByURLExamples.html
    return `${urlWithoutTrailingSlash}/nav_to.do?uri=${table}.do?sys_id=${id}`;
  };

  const getChoicesURL = fields => {
    const elements = fields.slice(1).reduce((acc, field) => `${acc}^ORelement=${field}`, `element=${fields[0]}`);
    return `${choicesUrl}?sysparm_query=name=task^ORname=${table}^${elements}^language=en&sysparm_fields=label,value,dependent_value,element`;
  };

  const checkInstance = res => {
    if (res.status >= 200 && res.status < 400 && res.data.result == null) {
      var _res$request$connecti, _res$request, _res$request$connecti2;

      throw new Error(`There is an issue with your Service Now Instance. Please check ${(_res$request$connecti = (_res$request = res.request) === null || _res$request === void 0 ? void 0 : (_res$request$connecti2 = _res$request.connection) === null || _res$request$connecti2 === void 0 ? void 0 : _res$request$connecti2.servername) !== null && _res$request$connecti !== void 0 ? _res$request$connecti : ''}.`);
    }
  };

  const isImportSetApiResponseAnError = data => data.status === 'error';

  const throwIfImportSetApiResponseIsAnError = res => {
    if (res.result.length === 0) {
      throw new Error('Unexpected result');
    }

    const data = res.result[0]; // Create ResponseError message?

    if (isImportSetApiResponseAnError(data)) {
      throw new Error(data.error_message);
    }
  };
  /**
   * Gets the Elastic SN Application information including the current version.
   * It should not be used on connectors that use the old API.
   */


  const getApplicationInformation = async () => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getVersionUrl(),
        logger,
        configurationUtilities,
        method: 'get'
      });
      checkInstance(res);
      return { ...res.data.result
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, 'Unable to get application version');
    }
  };

  const logApplicationInfo = (scope, version) => logger.debug(`Create incident: Application scope: ${scope}: Application version${version}`);

  const checkIfApplicationIsInstalled = async () => {
    if (!useTableApi) {
      const {
        version,
        scope
      } = await getApplicationInformation();
      logApplicationInfo(scope, version);
    }
  };

  const getIncident = async id => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${tableApiIncidentUrl}/${id}`,
        logger,
        configurationUtilities,
        method: 'get'
      });
      checkInstance(res);
      return { ...res.data.result
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to get incident with id ${id}`);
    }
  };

  const findIncidents = async params => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: tableApiIncidentUrl,
        logger,
        params,
        configurationUtilities
      });
      checkInstance(res);
      return res.data.result.length > 0 ? { ...res.data.result
      } : undefined;
    } catch (error) {
      throw (0, _utils.createServiceError)(error, 'Unable to find incidents by query');
    }
  };

  const getUrl = () => urlWithoutTrailingSlash;

  const createIncident = async ({
    incident
  }) => {
    try {
      await checkIfApplicationIsInstalled();
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getCreateIncidentUrl(),
        logger,
        method: 'post',
        data: (0, _utils.prepareIncident)(useTableApi, incident),
        configurationUtilities
      });
      checkInstance(res);

      if (!useTableApi) {
        throwIfImportSetApiResponseIsAnError(res.data);
      }

      const incidentId = useTableApi ? res.data.result.sys_id : res.data.result[0].sys_id;
      const insertedIncident = await getIncident(incidentId);
      return {
        title: insertedIncident.number,
        id: insertedIncident.sys_id,
        pushedDate: (0, _utils.getPushedDate)(insertedIncident.sys_created_on),
        url: getIncidentViewURL(insertedIncident.sys_id)
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, 'Unable to create incident');
    }
  };

  const updateIncident = async ({
    incidentId,
    incident
  }) => {
    try {
      await checkIfApplicationIsInstalled();
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getUpdateIncidentUrl(incidentId),
        // Import Set API supports only POST.
        method: useTableApi ? 'patch' : 'post',
        logger,
        data: { ...(0, _utils.prepareIncident)(useTableApi, incident),
          // elastic_incident_id is used to update the incident when using the Import Set API.
          ...(useTableApi ? {} : {
            elastic_incident_id: incidentId
          })
        },
        configurationUtilities
      });
      checkInstance(res);

      if (!useTableApi) {
        throwIfImportSetApiResponseIsAnError(res.data);
      }

      const id = useTableApi ? res.data.result.sys_id : res.data.result[0].sys_id;
      const updatedIncident = await getIncident(id);
      return {
        title: updatedIncident.number,
        id: updatedIncident.sys_id,
        pushedDate: (0, _utils.getPushedDate)(updatedIncident.sys_updated_on),
        url: getIncidentViewURL(updatedIncident.sys_id)
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to update incident with id ${incidentId}`);
    }
  };

  const getFields = async () => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: fieldsUrl,
        logger,
        configurationUtilities
      });
      checkInstance(res);
      return res.data.result.length > 0 ? res.data.result : [];
    } catch (error) {
      throw (0, _utils.createServiceError)(error, 'Unable to get fields');
    }
  };

  const getChoices = async fields => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getChoicesURL(fields),
        logger,
        configurationUtilities
      });
      checkInstance(res);
      return res.data.result;
    } catch (error) {
      throw (0, _utils.createServiceError)(error, 'Unable to get choices');
    }
  };

  return {
    createIncident,
    findIncidents,
    getFields,
    getIncident,
    updateIncident,
    getChoices,
    getUrl,
    checkInstance,
    getApplicationInformation,
    checkIfApplicationIsInstalled
  };
};

exports.createExternalService = createExternalService;