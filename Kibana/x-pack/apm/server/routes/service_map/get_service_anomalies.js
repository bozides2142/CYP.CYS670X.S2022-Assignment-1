"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ANOMALIES = void 0;
exports.getMLJobIds = getMLJobIds;
exports.getMLJobs = getMLJobs;
exports.getServiceAnomalies = getServiceAnomalies;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _anomaly_detection = require("../../../common/anomaly_detection");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _service_health_status = require("../../../common/service_health_status");

var _transaction_types = require("../../../common/transaction_types");

var _server = require("../../../../observability/server");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_ml_jobs_with_apm_group = require("../../lib/anomaly_detection/get_ml_jobs_with_apm_group");

var _apm_ml_anomaly_query = require("../../lib/anomaly_detection/apm_ml_anomaly_query");

var _apm_ml_detectors = require("../../../common/anomaly_detection/apm_ml_detectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_ANOMALIES = {
  mlJobIds: [],
  serviceAnomalies: []
};
exports.DEFAULT_ANOMALIES = DEFAULT_ANOMALIES;

async function getServiceAnomalies({
  setup,
  environment,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_anomalies', async () => {
    var _typedAnomalyResponse, _typedAnomalyResponse2;

    const {
      ml
    } = setup;

    if (!ml) {
      throw _boom.default.notImplemented(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
    }

    const params = {
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...(0, _apm_ml_anomaly_query.apmMlAnomalyQuery)({
              detectorTypes: [_apm_ml_detectors.ApmMlDetectorType.txLatency]
            }), ...(0, _server.rangeQuery)(Math.min(end - 30 * 60 * 1000, start), end, 'timestamp'), {
              terms: {
                // Only retrieving anomalies for transaction types "request" and "page-load"
                by_field_value: [_transaction_types.TRANSACTION_REQUEST, _transaction_types.TRANSACTION_PAGE_LOAD]
              }
            }]
          }
        },
        aggs: {
          services: {
            composite: {
              size: 5000,
              sources: [{
                serviceName: {
                  terms: {
                    field: 'partition_field_value'
                  }
                }
              }, {
                jobId: {
                  terms: {
                    field: 'job_id'
                  }
                }
              }]
            },
            aggs: {
              metrics: {
                top_metrics: {
                  metrics: [{
                    field: 'actual'
                  }, {
                    field: 'by_field_value'
                  }, {
                    field: 'result_type'
                  }, {
                    field: 'record_score'
                  }],
                  sort: {
                    record_score: 'desc'
                  }
                }
              }
            }
          }
        }
      }
    };
    const [anomalyResponse, jobIds] = await Promise.all([// pass an empty array of job ids to anomaly search
    // so any validation is skipped
    (0, _with_apm_span.withApmSpan)('ml_anomaly_search', () => ml.mlSystem.mlAnomalySearch(params, [])), getMLJobIds(ml.anomalyDetectors, environment)]);
    const typedAnomalyResponse = anomalyResponse;
    const relevantBuckets = (0, _lodash.uniqBy)((0, _lodash.sortBy)( // make sure we only return data for jobs that are available in this space
    (_typedAnomalyResponse = (_typedAnomalyResponse2 = typedAnomalyResponse.aggregations) === null || _typedAnomalyResponse2 === void 0 ? void 0 : _typedAnomalyResponse2.services.buckets.filter(bucket => jobIds.includes(bucket.key.jobId))) !== null && _typedAnomalyResponse !== void 0 ? _typedAnomalyResponse : [], // sort by job ID in case there are multiple jobs for one service to
    // ensure consistent results
    bucket => bucket.key.jobId), // return one bucket per service
    bucket => bucket.key.serviceName);
    return {
      mlJobIds: jobIds,
      serviceAnomalies: relevantBuckets.map(bucket => {
        const metrics = bucket.metrics.top[0].metrics;
        const anomalyScore = metrics.result_type === 'record' && metrics.record_score ? metrics.record_score : 0;
        const severity = (0, _anomaly_detection.getSeverity)(anomalyScore);
        const healthStatus = (0, _service_health_status.getServiceHealthStatus)({
          severity
        });
        return {
          serviceName: bucket.key.serviceName,
          jobId: bucket.key.jobId,
          transactionType: metrics.by_field_value,
          actualValue: metrics.actual,
          anomalyScore,
          healthStatus
        };
      })
    };
  });
}

async function getMLJobs(anomalyDetectors, environment) {
  const jobs = await (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(anomalyDetectors); // to filter out legacy jobs we are filtering by the existence of `apm_ml_version` in `custom_settings`
  // and checking that it is compatable.

  const mlJobs = jobs.filter(job => job.version >= 2);

  if (environment !== _environment_filter_values.ENVIRONMENT_ALL.value) {
    const matchingMLJob = mlJobs.find(job => job.environment === environment);

    if (!matchingMLJob) {
      return [];
    }

    return [matchingMLJob];
  }

  return mlJobs;
}

async function getMLJobIds(anomalyDetectors, environment) {
  const mlJobs = await getMLJobs(anomalyDetectors, environment);
  return mlJobs.map(job => job.jobId);
}