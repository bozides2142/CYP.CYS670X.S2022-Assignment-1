"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleDataClient = void 0;

var _mapping_from_field_map = require("../../../../rule_registry/common/mapping_from_field_map");

var _experimental_rule_field_map = require("../../../../rule_registry/common/assets/field_maps/experimental_rule_field_map");

var _server = require("../../../../rule_registry/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRuleDataClient = ({
  ownerFeatureId,
  registrationContext,
  getStartServices,
  logger,
  ruleDataService
}) => {
  return ruleDataService.initializeIndex({
    feature: ownerFeatureId,
    registrationContext,
    dataset: _server.Dataset.alerts,
    componentTemplateRefs: [],
    componentTemplates: [{
      name: 'mappings',
      mappings: (0, _mapping_from_field_map.mappingFromFieldMap)(_experimental_rule_field_map.experimentalRuleFieldMap, 'strict')
    }]
  });
};

exports.createRuleDataClient = createRuleDataClient;