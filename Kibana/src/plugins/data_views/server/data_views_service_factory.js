"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataViewsServiceFactory = void 0;

var _common = require("../common");

var _ui_settings_wrapper = require("./ui_settings_wrapper");

var _index_patterns_api_client = require("./index_patterns_api_client");

var _saved_objects_client_wrapper = require("./saved_objects_client_wrapper");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dataViewsServiceFactory = ({
  logger,
  uiSettings,
  fieldFormats,
  capabilities
}) => async function (savedObjectsClient, elasticsearchClient, request, byPassCapabilities) {
  const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
  const formats = await fieldFormats.fieldFormatServiceFactory(uiSettingsClient);
  return new _common.DataViewsService({
    uiSettings: new _ui_settings_wrapper.UiSettingsServerToCommon(uiSettingsClient),
    savedObjectsClient: new _saved_objects_client_wrapper.SavedObjectsClientServerToCommon(savedObjectsClient),
    apiClient: new _index_patterns_api_client.IndexPatternsApiServer(elasticsearchClient, savedObjectsClient),
    fieldFormats: formats,
    onError: error => {
      logger.error(error);
    },
    onNotification: ({
      title,
      text
    }) => {
      logger.warn(`${title}${text ? ` : ${text}` : ''}`);
    },
    getCanSave: async () => byPassCapabilities ? true : request ? (await capabilities.resolveCapabilities(request)).indexPatterns.save === true : false
  });
};

exports.dataViewsServiceFactory = dataViewsServiceFactory;