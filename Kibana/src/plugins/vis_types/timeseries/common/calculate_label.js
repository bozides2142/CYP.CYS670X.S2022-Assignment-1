"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLabel = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _agg_utils = require("./agg_utils");

var _fields_utils = require("./fields_utils");

var _common = require("../../../data/common");

var _enums = require("./enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const paths = ['cumulative_sum', 'derivative', 'moving_average', 'avg_bucket', 'sum_bucket', 'min_bucket', 'max_bucket', 'std_deviation_bucket', 'variance_bucket', 'sum_of_squares_bucket', 'serial_diff', 'positive_only'];

const calculateLabel = (metric, metrics = [], fields = [], isThrowErrorOnFieldNotFound = true) => {
  if (!metric) {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.unknownLabel', {
      defaultMessage: 'Unknown'
    });
  }

  if (metric.alias) {
    return metric.alias;
  }

  switch (metric.type) {
    case _common.METRIC_TYPES.COUNT:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.countLabel', {
        defaultMessage: 'Count'
      });

    case _enums.TSVB_METRIC_TYPES.CALCULATION:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.bucketScriptsLabel', {
        defaultMessage: 'Bucket Script'
      });

    case _enums.TSVB_METRIC_TYPES.MATH:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.mathLabel', {
        defaultMessage: 'Math'
      });

    case _enums.TSVB_METRIC_TYPES.SERIES_AGG:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.seriesAggLabel', {
        defaultMessage: 'Series Agg ({metricFunction})',
        values: {
          metricFunction: metric.function
        }
      });

    case _enums.TSVB_METRIC_TYPES.FILTER_RATIO:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.filterRatioLabel', {
        defaultMessage: 'Filter Ratio'
      });

    case _enums.TSVB_METRIC_TYPES.POSITIVE_RATE:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.positiveRateLabel', {
        defaultMessage: 'Counter Rate of {field}',
        values: {
          field: (0, _fields_utils.extractFieldLabel)(fields, metric.field, isThrowErrorOnFieldNotFound)
        }
      });

    case _enums.TSVB_METRIC_TYPES.STATIC:
      return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.staticValueLabel', {
        defaultMessage: 'Static Value of {metricValue}',
        values: {
          metricValue: metric.value
        }
      });
  }

  const metricTypeLabel = (0, _agg_utils.getMetricLabel)(metric.type);

  if ((0, _lodash.includes)(paths, metric.type)) {
    const targetMetric = metrics.find(m => (0, _lodash.startsWith)(metric.field, m.id));
    const targetLabel = calculateLabel(targetMetric, metrics, fields, isThrowErrorOnFieldNotFound); // For percentiles we need to parse the field id to extract the percentile
    // the user configured in the percentile aggregation and specified in the
    // submetric they selected. This applies only to pipeline aggs.

    if (targetMetric && targetMetric.type === 'percentile') {
      const percentileValueMatch = /\[([0-9\.]+)\]$/;
      const matches = metric.field.match(percentileValueMatch);

      if (matches) {
        return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.metricTypeOfTargetWithAdditionalLabel', {
          defaultMessage: '{metricTypeLabel} of {targetLabel} ({additionalLabel})',
          values: {
            metricTypeLabel,
            targetLabel,
            additionalLabel: matches[1]
          }
        });
      }
    }

    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.metricTypeOfTargetLabel', {
      defaultMessage: '{metricTypeLabel} of {targetLabel}',
      values: {
        metricTypeLabel,
        targetLabel
      }
    });
  }

  return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.metricTypeOfMetricFieldRankLabel', {
    defaultMessage: '{metricTypeLabel} of {metricField}',
    values: {
      metricTypeLabel,
      metricField: (0, _fields_utils.extractFieldLabel)(fields, metric.field, isThrowErrorOnFieldNotFound)
    }
  });
};

exports.calculateLabel = calculateLabel;