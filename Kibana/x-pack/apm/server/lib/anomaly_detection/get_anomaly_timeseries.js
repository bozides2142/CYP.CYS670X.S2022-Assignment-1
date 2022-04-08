"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalyTimeseries = getAnomalyTimeseries;

var _lodash = require("lodash");

var _server = require("../../../../observability/server");

var _apm_ml_anomaly_query = require("./apm_ml_anomaly_query");

var _apm_ml_detectors = require("../../../common/anomaly_detection/apm_ml_detectors");

var _apm_ml_jobs_query = require("./apm_ml_jobs_query");

var _as_mutable_array = require("../../../common/utils/as_mutable_array");

var _maybe = require("../../../common/utils/maybe");

var _anomaly_search = require("./anomaly_search");

var _get_anomaly_result_bucket_size = require("./get_anomaly_result_bucket_size");

var _get_ml_jobs_with_apm_group = require("./get_ml_jobs_with_apm_group");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getAnomalyTimeseries({
  serviceName,
  transactionType,
  start,
  end,
  logger,
  mlSetup
}) {
  var _anomaliesResponse$ag, _anomaliesResponse$ag2;

  if (!mlSetup) {
    return [];
  }

  const {
    intervalString
  } = (0, _get_anomaly_result_bucket_size.getAnomalyResultBucketSize)({
    start,
    end
  });
  const mlJobs = await (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(mlSetup.anomalyDetectors);

  if (!mlJobs.length) {
    return [];
  }

  const anomaliesResponse = await (0, _anomaly_search.anomalySearch)(mlSetup.mlSystem.mlAnomalySearch, {
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _apm_ml_anomaly_query.apmMlAnomalyQuery)({
            serviceName,
            transactionType
          }), ...(0, _server.rangeQuery)(start, end, 'timestamp'), ...(0, _apm_ml_jobs_query.apmMlJobsQuery)(mlJobs)]
        }
      },
      aggs: {
        by_timeseries_id: {
          composite: {
            size: 5000,
            sources: (0, _as_mutable_array.asMutableArray)([{
              jobId: {
                terms: {
                  field: 'job_id'
                }
              }
            }, {
              detectorIndex: {
                terms: {
                  field: 'detector_index'
                }
              }
            }, {
              serviceName: {
                terms: {
                  field: 'partition_field_value'
                }
              }
            }, {
              transactionType: {
                terms: {
                  field: 'by_field_value'
                }
              }
            }])
          },
          aggs: {
            timeseries: {
              date_histogram: {
                field: 'timestamp',
                fixed_interval: intervalString,
                extended_bounds: {
                  min: start,
                  max: end
                }
              },
              aggs: {
                top_anomaly: {
                  top_metrics: {
                    metrics: (0, _as_mutable_array.asMutableArray)([{
                      field: 'record_score'
                    }, {
                      field: 'actual'
                    }]),
                    size: 1,
                    sort: {
                      record_score: 'desc'
                    }
                  }
                },
                model_lower: {
                  min: {
                    field: 'model_lower'
                  }
                },
                model_upper: {
                  max: {
                    field: 'model_upper'
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  const jobsById = (0, _lodash.keyBy)(mlJobs, job => job.jobId);

  function divide(value, divider) {
    if (value === null) {
      return null;
    }

    return value / divider;
  }

  const series = (_anomaliesResponse$ag = (_anomaliesResponse$ag2 = anomaliesResponse.aggregations) === null || _anomaliesResponse$ag2 === void 0 ? void 0 : _anomaliesResponse$ag2.by_timeseries_id.buckets.map(bucket => {
    const jobId = bucket.key.jobId;
    const job = (0, _maybe.maybe)(jobsById[jobId]);

    if (!job) {
      logger.warn(`Could not find job for id ${jobId}`);
      return undefined;
    }

    const type = (0, _apm_ml_detectors.getApmMlDetectorType)(Number(bucket.key.detectorIndex)); // ml failure rate is stored as 0-100, we calculate failure rate as 0-1

    const divider = type === _apm_ml_detectors.ApmMlDetectorType.txFailureRate ? 100 : 1;
    return {
      jobId,
      type,
      serviceName: bucket.key.serviceName,
      environment: job.environment,
      transactionType: bucket.key.transactionType,
      version: job.version,
      anomalies: bucket.timeseries.buckets.map(dateBucket => {
        var _ref, _dateBucket$top_anoma, _ref2, _dateBucket$top_anoma2;

        return {
          x: dateBucket.key,
          y: (_ref = (_dateBucket$top_anoma = dateBucket.top_anomaly.top[0]) === null || _dateBucket$top_anoma === void 0 ? void 0 : _dateBucket$top_anoma.metrics.record_score) !== null && _ref !== void 0 ? _ref : null,
          actual: divide((_ref2 = (_dateBucket$top_anoma2 = dateBucket.top_anomaly.top[0]) === null || _dateBucket$top_anoma2 === void 0 ? void 0 : _dateBucket$top_anoma2.metrics.actual) !== null && _ref2 !== void 0 ? _ref2 : null, divider)
        };
      }),
      bounds: bucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key,
        y0: divide(dateBucket.model_lower.value, divider),
        y1: divide(dateBucket.model_upper.value, divider)
      }))
    };
  })) !== null && _anomaliesResponse$ag !== void 0 ? _anomaliesResponse$ag : [];
  return (0, _lodash.compact)(series);
}