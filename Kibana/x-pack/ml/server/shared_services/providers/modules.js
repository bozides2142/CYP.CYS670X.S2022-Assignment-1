"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModulesProvider = getModulesProvider;

var _data_recognizer = require("../../models/data_recognizer");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getModulesProvider(getGuards, getDataViews) {
  return {
    modulesProvider(request, savedObjectsClient) {
      return {
        async recognize(...args) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(async ({
            scopedClient,
            mlClient,
            jobSavedObjectService,
            getDataViewsService
          }) => {
            const dataViewsService = await getDataViewsService();
            const dr = (0, _data_recognizer.dataRecognizerFactory)(scopedClient, mlClient, savedObjectsClient, dataViewsService, jobSavedObjectService, request);
            return dr.findMatches(...args);
          });
        },

        async getModule(moduleId) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(async ({
            scopedClient,
            mlClient,
            jobSavedObjectService,
            getDataViewsService
          }) => {
            const dataViewsService = await getDataViewsService();
            const dr = (0, _data_recognizer.dataRecognizerFactory)(scopedClient, mlClient, savedObjectsClient, dataViewsService, jobSavedObjectService, request);
            return dr.getModule(moduleId);
          });
        },

        async listModules() {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(async ({
            scopedClient,
            mlClient,
            jobSavedObjectService,
            getDataViewsService
          }) => {
            const dataViewsService = await getDataViewsService();
            const dr = (0, _data_recognizer.dataRecognizerFactory)(scopedClient, mlClient, savedObjectsClient, dataViewsService, jobSavedObjectService, request);
            return dr.listModules();
          });
        },

        async setup(payload) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canCreateJob']).ok(async ({
            scopedClient,
            mlClient,
            jobSavedObjectService,
            getDataViewsService
          }) => {
            const dataViewsService = await getDataViewsService();
            const dr = (0, _data_recognizer.dataRecognizerFactory)(scopedClient, mlClient, savedObjectsClient, dataViewsService, jobSavedObjectService, request);
            return dr.setup(payload.moduleId, payload.prefix, payload.groups, payload.indexPatternName, payload.query, payload.useDedicatedIndex, payload.startDatafeed, payload.start, payload.end, payload.jobOverrides, payload.datafeedOverrides, payload.estimateModelMemory);
          });
        }

      };
    }

  };
}