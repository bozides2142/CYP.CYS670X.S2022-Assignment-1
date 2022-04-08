"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsAuthorization = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _saved_objects = require("../constants/saved_objects");

var _get_authorization_mode_by_source = require("./get_authorization_mode_by_source");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const operationAlias = {
  execute: authorization => [authorization.actions.savedObject.get(_saved_objects.ACTION_SAVED_OBJECT_TYPE, 'get'), authorization.actions.savedObject.get(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, 'create')],
  list: authorization => authorization.actions.savedObject.get(_saved_objects.ACTION_SAVED_OBJECT_TYPE, 'find')
};
const LEGACY_RBAC_EXEMPT_OPERATIONS = new Set(['get', 'execute']);

class ActionsAuthorization {
  constructor({
    request,
    authorization,
    authentication,
    authorizationMode = _get_authorization_mode_by_source.AuthorizationMode.RBAC
  }) {
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "authorizationMode", void 0);
    this.request = request;
    this.authorization = authorization;
    this.authorizationMode = authorizationMode;
  }

  async ensureAuthorized(operation, actionTypeId) {
    var _authorization$mode;

    const {
      authorization
    } = this;

    if (authorization !== null && authorization !== void 0 && (_authorization$mode = authorization.mode) !== null && _authorization$mode !== void 0 && _authorization$mode.useRbacForRequest(this.request)) {
      if (!this.isOperationExemptDueToLegacyRbac(operation)) {
        const checkPrivileges = authorization.checkPrivilegesDynamicallyWithRequest(this.request);
        const {
          hasAllRequested
        } = await checkPrivileges({
          kibana: operationAlias[operation] ? operationAlias[operation](authorization) : authorization.actions.savedObject.get(_saved_objects.ACTION_SAVED_OBJECT_TYPE, operation)
        });

        if (!hasAllRequested) {
          throw _boom.default.forbidden(`Unauthorized to ${operation} ${actionTypeId ? `a "${actionTypeId}" action` : `actions`}`);
        }
      }
    }
  }

  isOperationExemptDueToLegacyRbac(operation) {
    return this.authorizationMode === _get_authorization_mode_by_source.AuthorizationMode.Legacy && LEGACY_RBAC_EXEMPT_OPERATIONS.has(operation);
  }

}

exports.ActionsAuthorization = ActionsAuthorization;