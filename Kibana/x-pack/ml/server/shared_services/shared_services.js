"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSharedServices = createSharedServices;

var _server = require("../../.././../../src/core/server");

var _license_checks = require("./license_checks");

var _system = require("./providers/system");

var _job_service = require("./providers/job_service");

var _modules = require("./providers/modules");

var _results_service = require("./providers/results_service");

var _anomaly_detectors = require("./providers/anomaly_detectors");

var _capabilities = require("../lib/capabilities");

var _errors = require("./errors");

var _ml_client = require("../lib/ml_client");

var _saved_objects = require("../saved_objects");

var _alerting_service = require("./providers/alerting_service");

var _jobs_health_service = require("../lib/alerts/jobs_health_service");

var _data_views_utils = require("../lib/data_views_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createSharedServices(mlLicense, getSpaces, cloud, authorization, resolveMlCapabilities, getClusterClient, getInternalSavedObjectsClient, getUiSettings, getFieldsFormat, getDataViews, isMlReady) {
  const {
    isFullLicense,
    isMinimumLicense
  } = (0, _license_checks.licenseChecks)(mlLicense);

  function getGuards(request, savedObjectsClient) {
    const internalSavedObjectsClient = getInternalSavedObjectsClient();

    if (internalSavedObjectsClient === null) {
      throw new Error('Internal saved object client not initialized');
    }

    const getRequestItems = getRequestItemsProvider(resolveMlCapabilities, getClusterClient, savedObjectsClient, internalSavedObjectsClient, authorization, getSpaces !== undefined, isMlReady, getUiSettings, getFieldsFormat, getDataViews);
    const {
      hasMlCapabilities,
      scopedClient,
      mlClient,
      jobSavedObjectService,
      getFieldsFormatRegistry,
      getDataViewsService
    } = getRequestItems(request);
    const asyncGuards = [];
    const guards = {
      isMinimumLicense: () => {
        isMinimumLicense();
        return guards;
      },
      isFullLicense: () => {
        isFullLicense();
        return guards;
      },
      hasMlCapabilities: caps => {
        asyncGuards.push(hasMlCapabilities(caps));
        return guards;
      },

      async ok(callback) {
        await Promise.all(asyncGuards);
        return callback({
          scopedClient,
          mlClient,
          jobSavedObjectService,
          getFieldsFormatRegistry,
          getDataViewsService
        });
      }

    };
    return guards;
  }

  return {
    /**
     * Exposed providers for shared services used by other plugins
     */
    sharedServicesProviders: { ...(0, _job_service.getJobServiceProvider)(getGuards),
      ...(0, _anomaly_detectors.getAnomalyDetectorsProvider)(getGuards),
      ...(0, _modules.getModulesProvider)(getGuards, getDataViews),
      ...(0, _results_service.getResultsServiceProvider)(getGuards),
      ...(0, _system.getMlSystemProvider)(getGuards, mlLicense, getSpaces, cloud, resolveMlCapabilities),
      ...(0, _alerting_service.getAlertingServiceProvider)(getGuards)
    },

    /**
     * Services providers for ML internal usage
     */
    internalServicesProviders: { ...(0, _jobs_health_service.getJobsHealthServiceProvider)(getGuards)
    }
  };
}

function getRequestItemsProvider(resolveMlCapabilities, getClusterClient, savedObjectsClient, internalSavedObjectsClient, authorization, spaceEnabled, isMlReady, getUiSettings, getFieldsFormat, getDataViews) {
  return request => {
    var _getUiSettings;

    const getHasMlCapabilities = (0, _capabilities.hasMlCapabilitiesProvider)(resolveMlCapabilities);
    let hasMlCapabilities;
    let scopedClient;
    let mlClient; // While https://github.com/elastic/kibana/issues/64588 exists we
    // will not receive a real request object when being called from an alert.
    // instead a dummy request object will be supplied

    const clusterClient = getClusterClient();
    const jobSavedObjectService = (0, _saved_objects.jobSavedObjectServiceFactory)(savedObjectsClient, internalSavedObjectsClient, spaceEnabled, authorization, isMlReady);

    if (clusterClient === null) {
      throw new _errors.MLClusterClientUninitialized(`ML's cluster client has not been initialized`);
    }

    const uiSettingsClient = (_getUiSettings = getUiSettings()) === null || _getUiSettings === void 0 ? void 0 : _getUiSettings.asScopedToClient(savedObjectsClient);

    if (!uiSettingsClient) {
      throw new _errors.MLUISettingsClientUninitialized(`ML's UI settings client has not been initialized`);
    }

    const getFieldsFormatRegistry = async () => {
      let fieldFormatRegistry;

      try {
        fieldFormatRegistry = await getFieldsFormat().fieldFormatServiceFactory(uiSettingsClient);
      } catch (e) {// throw an custom error during the fieldFormatRegistry check
      }

      if (!fieldFormatRegistry) {
        throw new _errors.MLFieldFormatRegistryUninitialized(`ML's field format registry has not been initialized`);
      }

      return fieldFormatRegistry;
    };

    if (request instanceof _server.KibanaRequest) {
      hasMlCapabilities = getHasMlCapabilities(request);
      scopedClient = clusterClient.asScoped(request);
      mlClient = (0, _ml_client.getMlClient)(scopedClient, jobSavedObjectService);
    } else {
      hasMlCapabilities = () => Promise.resolve();

      const {
        asInternalUser
      } = clusterClient;
      scopedClient = {
        asInternalUser,
        asCurrentUser: asInternalUser
      };
      mlClient = (0, _ml_client.getMlClient)(scopedClient, jobSavedObjectService);
    }

    const getDataViewsService = (0, _data_views_utils.getDataViewsServiceFactory)(getDataViews, savedObjectsClient, scopedClient, request);
    return {
      hasMlCapabilities,
      scopedClient,
      mlClient,
      jobSavedObjectService,
      getFieldsFormatRegistry,
      getDataViewsService
    };
  };
}