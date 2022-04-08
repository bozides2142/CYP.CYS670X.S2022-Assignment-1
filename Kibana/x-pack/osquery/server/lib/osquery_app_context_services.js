"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsqueryAppContextService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A singleton that holds shared services that are initialized during the start up phase
 * of the plugin lifecycle. And stop during the stop phase, if needed.
 */


class OsqueryAppContextService {
  constructor() {
    (0, _defineProperty2.default)(this, "agentService", void 0);
    (0, _defineProperty2.default)(this, "packageService", void 0);
    (0, _defineProperty2.default)(this, "packagePolicyService", void 0);
    (0, _defineProperty2.default)(this, "agentPolicyService", void 0);
  }

  start(dependencies) {
    this.agentService = dependencies.agentService;
    this.packageService = dependencies.packageService;
    this.packagePolicyService = dependencies.packagePolicyService;
    this.agentPolicyService = dependencies.agentPolicyService;
  } // eslint-disable-next-line @typescript-eslint/no-empty-function


  stop() {}

  getAgentService() {
    return this.agentService;
  }

  getPackageService() {
    return this.packageService;
  }

  getPackagePolicyService() {
    return this.packagePolicyService;
  }

  getAgentPolicyService() {
    return this.agentPolicyService;
  }

}
/**
 * The context for Osquery app.
 */


exports.OsqueryAppContextService = OsqueryAppContextService;