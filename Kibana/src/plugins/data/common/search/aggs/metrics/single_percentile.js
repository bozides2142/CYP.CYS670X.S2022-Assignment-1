"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSinglePercentileMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _single_percentile_fn = require("./single_percentile_fn");

var _metric_agg_type = require("./metric_agg_type");

var _metric_agg_types = require("./metric_agg_types");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const singlePercentileTitle = _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileTitle', {
  defaultMessage: 'Percentile'
});

const getSinglePercentileMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.SINGLE_PERCENTILE,
    expressionName: _single_percentile_fn.aggSinglePercentileFnName,
    dslName: 'percentiles',
    title: singlePercentileTitle,
    valueType: 'number',

    makeLabel(aggConfig) {
      return _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileLabel', {
        defaultMessage: 'Percentile {field}',
        values: {
          field: aggConfig.getFieldDisplayName()
        }
      });
    },

    getValueBucketPath(aggConfig) {
      return `${aggConfig.id}.${aggConfig.params.percentile}`;
    },

    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.DATE, _common.KBN_FIELD_TYPES.HISTOGRAM]
    }, {
      name: 'percentile',
      default: 95,
      write: (agg, output) => {
        output.params.percents = [agg.params.percentile];
      }
    }],

    getValue(agg, bucket) {
      var _bucket$agg$id;

      let valueKey = String(agg.params.percentile);

      if (Number.isInteger(agg.params.percentile)) {
        valueKey += '.0';
      }

      const {
        values
      } = (_bucket$agg$id = bucket[agg.id]) !== null && _bucket$agg$id !== void 0 ? _bucket$agg$id : {};
      return values ? values[valueKey] : NaN;
    }

  });
};

exports.getSinglePercentileMetricAgg = getSinglePercentileMetricAgg;