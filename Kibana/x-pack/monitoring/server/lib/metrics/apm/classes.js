"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApmMetric = exports.ApmEventsRateClusterMetric = exports.ApmCpuUtilizationMetric = exports.ApmClusterMetric = void 0;

var _i18n = require("@kbn/i18n");

var _classes = require("../classes");

var _formatting = require("../../../../common/formatting");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */
// @ts-ignore


class ApmClusterMetric extends _classes.ClusterMetric {
  // @ts-ignore
  constructor(opts) {
    super({ ...opts,
      app: 'apm',
      ...ApmClusterMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'cluster_uuid',
      timestampField: 'beats_stats.timestamp'
    };
  }

}

exports.ApmClusterMetric = ApmClusterMetric;

class ApmMetric extends _classes.Metric {
  // @ts-ignore
  constructor(opts) {
    super({ ...opts,
      app: 'apm',
      ...ApmMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'beats_stats.beat.uuid',
      timestampField: 'beats_stats.timestamp'
    };
  }

}

exports.ApmMetric = ApmMetric;

class ApmCpuUtilizationMetric extends ApmMetric {
  // @ts-ignore
  constructor(opts) {
    super({ ...opts,
      format: _formatting.SMALL_FLOAT,
      metricAgg: 'max',
      units: '%',
      derivative: true
    });
    /*
     * Convert a counter of milliseconds of utilization time into a percentage of the bucket size
     */
    // @ts-ignore

    this.calculation = ({
      metric_deriv: metricDeriv
    } = {}, _key, _metric, bucketSizeInSeconds) => {
      if (metricDeriv) {
        const {
          value: metricDerivValue
        } = metricDeriv;
        const bucketSizeInMillis = bucketSizeInSeconds * 1000;

        if (metricDerivValue >= 0 && metricDerivValue !== null) {
          return metricDerivValue / bucketSizeInMillis * 100;
        }
      }

      return null;
    };
  }

}

exports.ApmCpuUtilizationMetric = ApmCpuUtilizationMetric;

class ApmEventsRateClusterMetric extends ApmClusterMetric {
  // @ts-ignore
  constructor(opts) {
    super({ ...opts,
      derivative: true,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'max',
      units: _i18n.i18n.translate('xpack.monitoring.metrics.apm.perSecondUnitLabel', {
        defaultMessage: '/s'
      })
    }); // @ts-ignore

    this.aggs = {
      beats_uuids: {
        terms: {
          field: 'beats_stats.beat.uuid',
          size: 10000
        },
        aggs: {
          event_rate_per_beat: {
            max: {
              // @ts-ignore
              field: this.field
            }
          }
        }
      },
      event_rate: {
        sum_bucket: {
          buckets_path: 'beats_uuids>event_rate_per_beat',
          gap_policy: 'skip'
        }
      },
      metric_deriv: {
        derivative: {
          buckets_path: 'event_rate',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      }
    };
  }

}

exports.ApmEventsRateClusterMetric = ApmEventsRateClusterMetric;