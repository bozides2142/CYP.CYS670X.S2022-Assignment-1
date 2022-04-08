"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricAggType = void 0;
exports.isMetricAggType = isMetricAggType;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _agg_type = require("../agg_type");

var _metric_agg_types = require("./metric_agg_types");

var _param_types = require("../param_types");

var _agg_groups = require("../agg_groups");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const metricType = 'metrics';

class MetricAggType extends _agg_type.AggType {
  constructor(config) {
    super(config);
    (0, _defineProperty2.default)(this, "subtype", void 0);
    (0, _defineProperty2.default)(this, "isScalable", void 0);
    (0, _defineProperty2.default)(this, "type", metricType);
    (0, _defineProperty2.default)(this, "getKey", () => {});
    this.params.push(new _param_types.BaseParamType({
      name: 'timeShift',
      type: 'string',
      write: () => {}
    }));

    this.getValue = config.getValue || ((agg, bucket) => {
      // Metric types where an empty set equals `zero`
      const isSettableToZero = [_metric_agg_types.METRIC_TYPES.CARDINALITY, _metric_agg_types.METRIC_TYPES.SUM].includes(agg.type.name); // Return proper values when no buckets are present
      // `Count` handles empty sets properly

      if (!bucket[agg.id] && isSettableToZero) return 0;
      return bucket[agg.id] && bucket[agg.id].value;
    });

    this.subtype = config.subtype || _i18n.i18n.translate('data.search.aggs.metrics.metricAggregationsSubtypeTitle', {
      defaultMessage: 'Metric Aggregations'
    });

    this.isScalable = config.isScalable || (() => false); // split at this point if there are time shifts and this is the first metric


    this.splitForTimeShift = (agg, aggs) => aggs.hasTimeShifts() && aggs.byType(_agg_groups.AggGroupNames.Metrics)[0] === agg && !aggs.byType(_agg_groups.AggGroupNames.Buckets).some(bucketAgg => bucketAgg.type.splitForTimeShift(bucketAgg, aggs));
  }

}

exports.MetricAggType = MetricAggType;

function isMetricAggType(aggConfig) {
  return aggConfig && aggConfig.type === metricType;
}