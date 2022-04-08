"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertingServiceProvider = getAlertingServiceProvider;

var _alerting_service = require("../../lib/alerts/alerting_service");

var _datafeeds = require("../../models/job_service/datafeeds");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAlertingServiceProvider(getGuards) {
  return {
    alertingServiceProvider(savedObjectsClient, request) {
      return {
        preview: async (...args) => {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(({
            mlClient,
            scopedClient,
            getFieldsFormatRegistry,
            getDataViewsService
          }) => (0, _alerting_service.alertingServiceProvider)(mlClient, (0, _datafeeds.datafeedsProvider)(scopedClient, mlClient), getFieldsFormatRegistry, getDataViewsService).preview(...args));
        },
        execute: async (...args) => {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(({
            mlClient,
            scopedClient,
            getFieldsFormatRegistry,
            getDataViewsService
          }) => (0, _alerting_service.alertingServiceProvider)(mlClient, (0, _datafeeds.datafeedsProvider)(scopedClient, mlClient), getFieldsFormatRegistry, getDataViewsService).execute(...args));
        }
      };
    }

  };
}