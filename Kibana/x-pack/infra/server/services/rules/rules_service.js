"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RulesService = void 0;

var _server = require("../../../../rule_registry/server");

var _rule_data_client = require("./rule_data_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RulesService {
  constructor(ownerFeatureId, registrationContext, logger) {
    this.ownerFeatureId = ownerFeatureId;
    this.registrationContext = registrationContext;
    this.logger = logger;
  }

  setup(core, setupDeps) {
    const ruleDataClient = (0, _rule_data_client.createRuleDataClient)({
      getStartServices: core.getStartServices,
      logger: this.logger,
      ownerFeatureId: this.ownerFeatureId,
      registrationContext: this.registrationContext,
      ruleDataService: setupDeps.ruleRegistry.ruleDataService
    });
    const createLifecycleRuleExecutor = (0, _server.createLifecycleExecutor)(this.logger, ruleDataClient);
    return {
      createLifecycleRuleExecutor,
      ruleDataClient
    };
  }

  start(_startDeps) {
    return {};
  }

}

exports.RulesService = RulesService;