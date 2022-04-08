"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMetricAggregations = void 0;

var _lodash = require("lodash");

var _inventory_models = require("../../../../../common/inventory_models");

var _is_rate = require("./is_rate");

var _create_rate_aggs = require("./create_rate_aggs");

var _create_log_rate_aggs = require("./create_log_rate_aggs");

var _create_rate_agg_with_interface = require("./create_rate_agg_with_interface");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMetricAggregations = (timerange, nodeType, metric, customMetric) => {
  const inventoryModel = (0, _inventory_models.findInventoryModel)(nodeType);

  if (customMetric && customMetric.field) {
    if ((0, _is_rate.isCustomMetricRate)(customMetric)) {
      return (0, _create_rate_aggs.createRateAggs)(timerange, customMetric.id, customMetric.field);
    }

    return {
      [customMetric.id]: {
        [customMetric.aggregation]: {
          field: customMetric.field
        }
      }
    };
  } else if (metric === 'logRate') {
    return (0, _create_log_rate_aggs.createLogRateAggs)(timerange, metric);
  } else {
    const metricAgg = inventoryModel.metrics.snapshot[metric];

    if ((0, _is_rate.isInterfaceRateAgg)(metricAgg)) {
      const field = (0, _lodash.get)(metricAgg, `${metric}_interfaces.aggregations.${metric}_interface_max.max.field`);
      const interfaceField = (0, _lodash.get)(metricAgg, `${metric}_interfaces.terms.field`);
      return (0, _create_rate_agg_with_interface.createRateAggsWithInterface)(timerange, metric, field, interfaceField);
    }

    if ((0, _is_rate.isMetricRate)(metricAgg)) {
      const field = (0, _lodash.get)(metricAgg, `${metric}_max.max.field`);
      return (0, _create_rate_aggs.createRateAggs)(timerange, metric, field);
    }

    return metricAgg;
  }
};

exports.createMetricAggregations = createMetricAggregations;