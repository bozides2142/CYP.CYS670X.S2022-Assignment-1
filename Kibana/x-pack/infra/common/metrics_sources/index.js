"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partialMetricsSourceConfigurationPropertiesRT = exports.metricsSourceStatusRT = exports.metricsSourceConfigurationResponseRT = exports.metricsSourceConfigurationRT = exports.metricsSourceConfigurationPropertiesRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _source_configuration = require("../source_configuration/source_configuration");

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

/**
 * Properties specific to the Metrics Source Configuration.
 */


const metricsSourceConfigurationPropertiesRT = rt.strict({
  name: _source_configuration.SourceConfigurationRT.props.name,
  description: _source_configuration.SourceConfigurationRT.props.description,
  metricAlias: _source_configuration.SourceConfigurationRT.props.metricAlias,
  inventoryDefaultView: _source_configuration.SourceConfigurationRT.props.inventoryDefaultView,
  metricsExplorerDefaultView: _source_configuration.SourceConfigurationRT.props.metricsExplorerDefaultView,
  anomalyThreshold: rt.number
});
exports.metricsSourceConfigurationPropertiesRT = metricsSourceConfigurationPropertiesRT;
const partialMetricsSourceConfigurationPropertiesRT = rt.partial({ ...metricsSourceConfigurationPropertiesRT.type.props
});
exports.partialMetricsSourceConfigurationPropertiesRT = partialMetricsSourceConfigurationPropertiesRT;
const metricsSourceConfigurationOriginRT = rt.keyof({
  fallback: null,
  internal: null,
  stored: null
});
const metricsSourceStatusRT = rt.strict({
  metricIndicesExist: _source_configuration.SourceStatusRuntimeType.props.metricIndicesExist,
  indexFields: _source_configuration.SourceStatusRuntimeType.props.indexFields
});
exports.metricsSourceStatusRT = metricsSourceStatusRT;
const metricsSourceConfigurationRT = rt.exact(rt.intersection([rt.type({
  id: rt.string,
  origin: metricsSourceConfigurationOriginRT,
  configuration: metricsSourceConfigurationPropertiesRT
}), rt.partial({
  updatedAt: rt.number,
  version: rt.string,
  status: metricsSourceStatusRT
})]));
exports.metricsSourceConfigurationRT = metricsSourceConfigurationRT;
const metricsSourceConfigurationResponseRT = rt.type({
  source: metricsSourceConfigurationRT
});
exports.metricsSourceConfigurationResponseRT = metricsSourceConfigurationResponseRT;