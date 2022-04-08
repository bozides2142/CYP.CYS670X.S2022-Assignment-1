"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rulesRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _server = require("../../../rule_registry/server");

var _create_observability_server_route = require("./create_observability_server_route");

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


const alertsDynamicIndexPatternRoute = (0, _create_observability_server_route.createObservabilityServerRoute)({
  endpoint: 'GET /api/observability/rules/alerts/dynamic_index_pattern',
  options: {
    tags: []
  },
  params: t.type({
    query: t.type({
      registrationContexts: t.array(t.string),
      namespace: t.string
    })
  }),
  handler: async ({
    ruleDataService,
    params
  }) => {
    const {
      namespace,
      registrationContexts
    } = params.query;
    const indexNames = registrationContexts.flatMap(registrationContext => {
      var _ruleDataService$find;

      const indexName = (_ruleDataService$find = ruleDataService.findIndexByName(registrationContext, _server.Dataset.alerts)) === null || _ruleDataService$find === void 0 ? void 0 : _ruleDataService$find.getPrimaryAlias(namespace);

      if (indexName != null) {
        return [indexName];
      } else {
        return [];
      }
    });
    return indexNames;
  }
});
const rulesRouteRepository = alertsDynamicIndexPatternRoute;
exports.rulesRouteRepository = rulesRouteRepository;