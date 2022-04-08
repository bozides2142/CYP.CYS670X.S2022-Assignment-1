"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBasicAgg = exports.getMetricLabel = exports.getAggsByType = exports.getAggsByPredicate = exports.getAggByPredicate = exports.aggs = exports.AGG_TYPE = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _common = require("../../../data/common");

var _enums = require("./enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let AGG_TYPE;
exports.AGG_TYPE = AGG_TYPE;

(function (AGG_TYPE) {
  AGG_TYPE["METRIC"] = "metric";
  AGG_TYPE["PARENT_PIPELINE"] = "parent_pipeline";
  AGG_TYPE["SIBLING_PIPELINE"] = "sibling_pipeline";
  AGG_TYPE["SPECIAL"] = "special";
})(AGG_TYPE || (exports.AGG_TYPE = AGG_TYPE = {}));

const aggDefaultMeta = {
  type: AGG_TYPE.METRIC,
  isFieldRequired: true,
  isFilterRatioSupported: false,
  isHistogramSupported: false,
  isFieldFormattingDisabled: false,
  hasExtendedStats: false
};
const aggs = [{
  id: _common.METRIC_TYPES.AVG,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    isHistogramSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.averageLabel', {
      defaultMessage: 'Average'
    })
  }
}, {
  id: _common.METRIC_TYPES.CARDINALITY,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.cardinalityLabel', {
      defaultMessage: 'Cardinality'
    })
  }
}, {
  id: _common.METRIC_TYPES.COUNT,
  meta: { ...aggDefaultMeta,
    isFieldRequired: false,
    isFilterRatioSupported: true,
    isHistogramSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.countLabel', {
      defaultMessage: 'Count'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.FILTER_RATIO,
  meta: { ...aggDefaultMeta,
    isFieldRequired: false,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.filterRatioLabel', {
      defaultMessage: 'Filter Ratio'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.POSITIVE_RATE,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.positiveRateLabel', {
      defaultMessage: 'Counter Rate'
    })
  }
}, {
  id: _common.METRIC_TYPES.MAX,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    isHistogramSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.maxLabel', {
      defaultMessage: 'Max'
    })
  }
}, {
  id: _common.METRIC_TYPES.MIN,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    isHistogramSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.minLabel', {
      defaultMessage: 'Min'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.PERCENTILE,
  meta: { ...aggDefaultMeta,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.percentileLabel', {
      defaultMessage: 'Percentile'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.PERCENTILE_RANK,
  meta: { ...aggDefaultMeta,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.percentileRankLabel', {
      defaultMessage: 'Percentile Rank'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.STATIC,
  meta: { ...aggDefaultMeta,
    isFieldRequired: false,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.staticValueLabel', {
      defaultMessage: 'Static Value'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.STD_DEVIATION,
  meta: { ...aggDefaultMeta,
    hasExtendedStats: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.deviationLabel', {
      defaultMessage: 'Std. Deviation'
    })
  }
}, {
  id: _common.METRIC_TYPES.SUM,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    isHistogramSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.sumLabel', {
      defaultMessage: 'Sum'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.SUM_OF_SQUARES,
  meta: { ...aggDefaultMeta,
    hasExtendedStats: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.sumOfSquaresLabel', {
      defaultMessage: 'Sum of Squares'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.TOP_HIT,
  meta: { ...aggDefaultMeta,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.topHitLabel', {
      defaultMessage: 'Top Hit'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.VALUE_COUNT,
  meta: { ...aggDefaultMeta,
    isFilterRatioSupported: true,
    isHistogramSupported: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.valueCountLabel', {
      defaultMessage: 'Value Count'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.VARIANCE,
  meta: { ...aggDefaultMeta,
    hasExtendedStats: true,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.varianceLabel', {
      defaultMessage: 'Variance'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.CALCULATION,
  meta: { ...aggDefaultMeta,
    isFieldFormattingDisabled: true,
    type: AGG_TYPE.PARENT_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.bucketScriptLabel', {
      defaultMessage: 'Bucket Script'
    })
  }
}, {
  id: _common.METRIC_TYPES.CUMULATIVE_SUM,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.PARENT_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.cumulativeSumLabel', {
      defaultMessage: 'Cumulative Sum'
    })
  }
}, {
  id: _common.METRIC_TYPES.DERIVATIVE,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.PARENT_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.derivativeLabel', {
      defaultMessage: 'Derivative'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.MOVING_AVERAGE,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.PARENT_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.movingAverageLabel', {
      defaultMessage: 'Moving Average'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.POSITIVE_ONLY,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.PARENT_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.positiveOnlyLabel', {
      defaultMessage: 'Positive Only'
    })
  }
}, {
  id: _common.METRIC_TYPES.SERIAL_DIFF,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.PARENT_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.serialDifferenceLabel', {
      defaultMessage: 'Serial Difference'
    })
  }
}, {
  id: _common.METRIC_TYPES.AVG_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallAverageLabel', {
      defaultMessage: 'Overall Average'
    })
  }
}, {
  id: _common.METRIC_TYPES.MAX_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallMaxLabel', {
      defaultMessage: 'Overall Max'
    })
  }
}, {
  id: _common.METRIC_TYPES.MIN_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallMinLabel', {
      defaultMessage: 'Overall Min'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.STD_DEVIATION_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallStdDeviationLabel', {
      defaultMessage: 'Overall Std. Deviation'
    })
  }
}, {
  id: _common.METRIC_TYPES.SUM_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallSumLabel', {
      defaultMessage: 'Overall Sum'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.SUM_OF_SQUARES_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallSumOfSquaresLabel', {
      defaultMessage: 'Overall Sum of Squares'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.VARIANCE_BUCKET,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SIBLING_PIPELINE,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.overallVarianceLabel', {
      defaultMessage: 'Overall Variance'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.SERIES_AGG,
  meta: { ...aggDefaultMeta,
    type: AGG_TYPE.SPECIAL,
    isFieldRequired: false,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.seriesAggLabel', {
      defaultMessage: 'Series Agg'
    })
  }
}, {
  id: _enums.TSVB_METRIC_TYPES.MATH,
  meta: { ...aggDefaultMeta,
    isFieldFormattingDisabled: true,
    type: AGG_TYPE.SPECIAL,
    label: _i18n.i18n.translate('visTypeTimeseries.aggUtils.mathLabel', {
      defaultMessage: 'Math'
    })
  }
}];
exports.aggs = aggs;

const getAggsByPredicate = predicate => (0, _lodash.filter)(aggs, predicate);

exports.getAggsByPredicate = getAggsByPredicate;

const getAggByPredicate = (metricType, metaPredicate) => {
  const predicate = {
    id: metricType,
    ...(metaPredicate && {
      meta: metaPredicate
    })
  };
  return getAggsByPredicate(predicate)[0];
};

exports.getAggByPredicate = getAggByPredicate;

const getMetricLabel = metricType => {
  var _getAggByPredicate;

  return (_getAggByPredicate = getAggByPredicate(metricType)) === null || _getAggByPredicate === void 0 ? void 0 : _getAggByPredicate.meta.label;
};

exports.getMetricLabel = getMetricLabel;

const isBasicAgg = metric => Boolean(getAggByPredicate(metric.type, {
  type: AGG_TYPE.METRIC
}));

exports.isBasicAgg = isBasicAgg;

const getAggsByType = mapFn => aggs.reduce((acc, agg) => {
  acc[agg.meta.type].push(mapFn(agg));
  return acc;
}, {
  [AGG_TYPE.METRIC]: [],
  [AGG_TYPE.PARENT_PIPELINE]: [],
  [AGG_TYPE.SIBLING_PIPELINE]: [],
  [AGG_TYPE.SPECIAL]: []
});

exports.getAggsByType = getAggsByType;