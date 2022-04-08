"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteGuard = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _saved_objects = require("../saved_objects");

var _ml_client = require("../lib/ml_client");

var _data_views_utils = require("./data_views_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RouteGuard {
  constructor(mlLicense, getSavedObject, getInternalSavedObject, spacesPlugin, authorization, isMlReady, getDataViews) {
    (0, _defineProperty2.default)(this, "_mlLicense", void 0);
    (0, _defineProperty2.default)(this, "_getMlSavedObjectClient", void 0);
    (0, _defineProperty2.default)(this, "_getInternalSavedObjectClient", void 0);
    (0, _defineProperty2.default)(this, "_spacesPlugin", void 0);
    (0, _defineProperty2.default)(this, "_authorization", void 0);
    (0, _defineProperty2.default)(this, "_isMlReady", void 0);
    (0, _defineProperty2.default)(this, "_getDataViews", void 0);
    this._mlLicense = mlLicense;
    this._getMlSavedObjectClient = getSavedObject;
    this._getInternalSavedObjectClient = getInternalSavedObject;
    this._spacesPlugin = spacesPlugin;
    this._authorization = authorization;
    this._isMlReady = isMlReady;
    this._getDataViews = getDataViews;
  }

  fullLicenseAPIGuard(handler) {
    return this._guard(() => this._mlLicense.isFullLicense(), handler);
  }

  basicLicenseAPIGuard(handler) {
    return this._guard(() => this._mlLicense.isMinimumLicense(), handler);
  }

  _guard(check, handler) {
    return (context, request, response) => {
      if (check() === false) {
        return response.forbidden();
      }

      const client = context.core.elasticsearch.client;

      const mlSavedObjectClient = this._getMlSavedObjectClient(request);

      const internalSavedObjectsClient = this._getInternalSavedObjectClient();

      if (mlSavedObjectClient === null || internalSavedObjectsClient === null) {
        return response.badRequest({
          body: {
            message: 'saved object client has not been initialized'
          }
        });
      }

      const jobSavedObjectService = (0, _saved_objects.jobSavedObjectServiceFactory)(mlSavedObjectClient, internalSavedObjectsClient, this._spacesPlugin !== undefined, this._authorization, this._isMlReady);
      return handler({
        client,
        request,
        response,
        context,
        jobSavedObjectService,
        mlClient: (0, _ml_client.getMlClient)(client, jobSavedObjectService),
        getDataViewsService: (0, _data_views_utils.getDataViewsServiceFactory)(this._getDataViews, context.core.savedObjects.client, client, request)
      });
    };
  }

}

exports.RouteGuard = RouteGuard;