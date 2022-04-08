"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertingServiceProvider = alertingServiceProvider;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _risonNode = _interopRequireDefault(require("rison-node"));

var _lodash = require("lodash");

var _anomalies = require("../../../common/constants/anomalies");

var _job_utils = require("../../../common/util/job_utils");

var _guards = require("../../../common/types/guards");

var _alerts = require("../../../common/util/alerts");

var _anomaly_utils = require("../../../common/util/anomaly_utils");

var _common = require("../../../../../../src/plugins/field_formats/common");

var _results_service = require("../../models/results_service/results_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TIME_RANGE_PADDING = 10;
/**
 * Mapping for result types and corresponding score fields.
 */

const resultTypeScoreMapping = {
  [_anomalies.ANOMALY_RESULT_TYPE.BUCKET]: 'anomaly_score',
  [_anomalies.ANOMALY_RESULT_TYPE.RECORD]: 'record_score',
  [_anomalies.ANOMALY_RESULT_TYPE.INFLUENCER]: 'influencer_score'
};
/**
 * Alerting related server-side methods
 * @param mlClient
 * @param datafeedsService
 */

function alertingServiceProvider(mlClient, datafeedsService, getFieldsFormatRegistry, getDataViewsService) {
  /**
   * Provides formatters based on the data view of the datafeed index pattern
   * and set of default formatters for fallback.
   */
  const getFormatters = (0, _lodash.memoize)(async datafeed => {
    const fieldFormatsRegistry = await getFieldsFormatRegistry();
    const numberFormatter = fieldFormatsRegistry.deserialize({
      id: _common.FIELD_FORMAT_IDS.NUMBER
    });
    const fieldFormatMap = await getFieldsFormatMap(datafeed.indices[0]);
    const fieldFormatters = fieldFormatMap ? Object.entries(fieldFormatMap).reduce((acc, [fieldName, config]) => {
      const formatter = fieldFormatsRegistry.deserialize(config);
      acc[fieldName] = formatter.convert.bind(formatter);
      return acc;
    }, {}) : {};
    return {
      numberFormatter: numberFormatter.convert.bind(numberFormatter),
      fieldFormatters
    };
  });
  /**
   * Attempts to find a data view based on the index pattern
   */

  const getFieldsFormatMap = (0, _lodash.memoize)(async indexPattern => {
    try {
      const dataViewsService = await getDataViewsService();
      const dataViews = await dataViewsService.find(indexPattern);
      const dataView = dataViews.find(({
        title
      }) => title === indexPattern);
      if (!dataView) return;
      return dataView.fieldFormatMap;
    } catch (e) {
      return;
    }
  });

  const getAggResultsLabel = resultType => {
    return {
      aggGroupLabel: `${resultType}_results`,
      topHitsLabel: `top_${resultType}_hits`
    };
  };
  /**
   * Builds an agg query based on the requested result type.
   * @param resultType
   * @param severity
   */


  const getResultTypeAggRequest = (resultType, severity, useInitialScore) => {
    const influencerScoreField = getScoreFields(_anomalies.ANOMALY_RESULT_TYPE.INFLUENCER, useInitialScore);
    const recordScoreField = getScoreFields(_anomalies.ANOMALY_RESULT_TYPE.RECORD, useInitialScore);
    const bucketScoreField = getScoreFields(_anomalies.ANOMALY_RESULT_TYPE.BUCKET, useInitialScore);
    return {
      influencer_results: {
        filter: {
          range: {
            [influencerScoreField]: {
              gte: resultType === _anomalies.ANOMALY_RESULT_TYPE.INFLUENCER ? severity : 0
            }
          }
        },
        aggs: {
          top_influencer_hits: {
            top_hits: {
              sort: [{
                [influencerScoreField]: {
                  order: 'desc'
                }
              }],
              _source: {
                includes: ['result_type', 'timestamp', 'influencer_field_name', 'influencer_field_value', 'influencer_score', 'initial_influencer_score', 'is_interim', 'job_id', 'bucket_span']
              },
              size: 3
            }
          }
        }
      },
      record_results: {
        filter: {
          range: {
            [recordScoreField]: {
              gte: resultType === _anomalies.ANOMALY_RESULT_TYPE.RECORD ? severity : 0
            }
          }
        },
        aggs: {
          top_record_hits: {
            top_hits: {
              sort: [{
                [recordScoreField]: {
                  order: 'desc'
                }
              }],
              _source: {
                includes: ['result_type', 'timestamp', 'record_score', 'initial_record_score', 'is_interim', 'function', 'function_description', 'field_name', 'by_field_name', 'by_field_value', 'over_field_name', 'over_field_value', 'partition_field_name', 'partition_field_value', 'job_id', 'detector_index', 'bucket_span', 'typical', 'actual', 'causes']
              },
              size: 3
            }
          }
        }
      },
      ...(resultType === _anomalies.ANOMALY_RESULT_TYPE.BUCKET ? {
        bucket_results: {
          filter: {
            range: {
              [bucketScoreField]: {
                gt: severity
              }
            }
          },
          aggs: {
            top_bucket_hits: {
              top_hits: {
                sort: [{
                  [bucketScoreField]: {
                    order: 'desc'
                  }
                }],
                _source: {
                  includes: ['job_id', 'result_type', 'timestamp', 'anomaly_score', 'initial_anomaly_score', 'is_interim', 'bucket_span']
                },
                size: 1
              }
            }
          }
        }
      } : {})
    };
  };
  /**
   * Provides a key for alert instance.
   */


  const getAlertInstanceKey = source => {
    return source.job_id;
  };

  const getScoreFields = (resultType, useInitialScore) => {
    return `${useInitialScore ? 'initial_' : ''}${resultTypeScoreMapping[resultType]}`;
  };

  const getRecordKey = source => {
    let alertInstanceKey = `${source.job_id}_${source.timestamp}`;
    const fieldName = (0, _anomaly_utils.getEntityFieldName)(source);
    const fieldValue = (0, _anomaly_utils.getEntityFieldValue)(source);
    const entity = fieldName !== undefined && fieldValue !== undefined ? `_${fieldName}_${fieldValue}` : '';
    alertInstanceKey += `_${source.detector_index}_${source.function}${entity}`;
    return alertInstanceKey;
  };
  /**
   * Returns a callback for formatting elasticsearch aggregation response
   * to the alert context.
   * @param resultType
   */


  const getResultsFormatter = (resultType, useInitialScore = false, formatters) => {
    const resultsLabel = getAggResultsLabel(resultType);
    return v => {
      const aggTypeResults = v[resultsLabel.aggGroupLabel];

      if (aggTypeResults.doc_count === 0) {
        return;
      }

      const requestedAnomalies = aggTypeResults[resultsLabel.topHitsLabel].hits.hits;
      const topAnomaly = requestedAnomalies[0];
      const alertInstanceKey = getAlertInstanceKey(topAnomaly._source);
      const timestamp = topAnomaly._source.timestamp;
      const bucketSpanInSeconds = topAnomaly._source.bucket_span;
      return {
        count: aggTypeResults.doc_count,
        key: v.key,
        message: 'Alerts are raised based on real-time scores. Remember that scores may be adjusted over time as data continues to be analyzed.',
        alertInstanceKey,
        jobIds: [...new Set(requestedAnomalies.map(h => h._source.job_id))],
        isInterim: requestedAnomalies.some(h => h._source.is_interim),
        timestamp,
        timestampIso8601: new Date(timestamp).toISOString(),
        timestampEpoch: timestamp / 1000,
        score: Math.floor(topAnomaly._source[getScoreFields(resultType, useInitialScore)]),
        bucketRange: {
          start: new Date(timestamp - bucketSpanInSeconds * 1000 * TIME_RANGE_PADDING).toISOString(),
          end: new Date(timestamp + bucketSpanInSeconds * 1000 * TIME_RANGE_PADDING).toISOString()
        },
        topRecords: v.record_results.top_record_hits.hits.hits.map(h => {
          var _formatters$fieldForm;

          const {
            actual,
            typical
          } = (0, _results_service.getTypicalAndActualValues)(h._source);
          const formatter = (_formatters$fieldForm = formatters.fieldFormatters[h._source.field_name]) !== null && _formatters$fieldForm !== void 0 ? _formatters$fieldForm : formatters.numberFormatter;
          return { ...h._source,
            typical: typical === null || typical === void 0 ? void 0 : typical.map(t => formatter(t)),
            actual: actual === null || actual === void 0 ? void 0 : actual.map(a => formatter(a)),
            score: Math.floor(h._source[getScoreFields(_anomalies.ANOMALY_RESULT_TYPE.RECORD, useInitialScore)]),
            unique_key: getRecordKey(h._source)
          };
        }),
        topInfluencers: v.influencer_results.top_influencer_hits.hits.hits.map(h => {
          return { ...h._source,
            score: Math.floor(h._source[getScoreFields(_anomalies.ANOMALY_RESULT_TYPE.INFLUENCER, useInitialScore)]),
            unique_key: `${h._source.timestamp}_${h._source.influencer_field_name}_${h._source.influencer_field_value}`
          };
        })
      };
    };
  };
  /**
   * Builds a request body
   * @param params - Alert params
   * @param previewTimeInterval - Relative time interval to test the alert condition
   * @param checkIntervalGap - Interval between alert executions
   */


  const fetchAnomalies = async (params, previewTimeInterval, checkIntervalGap) => {
    var _params$jobSelection$, _params$jobSelection$2;

    const jobAndGroupIds = [...((_params$jobSelection$ = params.jobSelection.jobIds) !== null && _params$jobSelection$ !== void 0 ? _params$jobSelection$ : []), ...((_params$jobSelection$2 = params.jobSelection.groupIds) !== null && _params$jobSelection$2 !== void 0 ? _params$jobSelection$2 : [])]; // Extract jobs from group ids and make sure provided jobs assigned to a current space

    const jobsResponse = (await mlClient.getJobs({
      job_id: jobAndGroupIds.join(',')
    })).body.jobs;

    if (jobsResponse.length === 0) {
      // Probably assigned groups don't contain any jobs anymore.
      throw new Error("Couldn't find the job with provided id");
    }

    const maxBucket = (0, _job_utils.resolveMaxTimeInterval)(jobsResponse.map(v => v.analysis_config.bucket_span));

    if (maxBucket === undefined) {
      // Technically it's not possible, just in case.
      throw new Error('Unable to resolve a valid bucket length');
    }
    /**
     * The check interval might be bigger than the 2x bucket span.
     * We need to check the biggest time range to make sure anomalies are not missed.
     */


    const lookBackTimeInterval = `${Math.max( // Double the max bucket span
    Math.round(maxBucket * 2), checkIntervalGap ? Math.round(checkIntervalGap.asSeconds()) : 0)}s`;
    const jobIds = jobsResponse.map(v => v.job_id);
    const datafeeds = await datafeedsService.getDatafeedByJobId(jobIds);
    const requestBody = {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              job_id: jobIds
            }
          }, {
            range: {
              timestamp: {
                gte: `now-${previewTimeInterval !== null && previewTimeInterval !== void 0 ? previewTimeInterval : lookBackTimeInterval}`,
                // Restricts data points to the current moment for preview
                ...(previewTimeInterval ? {
                  lte: 'now'
                } : {})
              }
            }
          }, {
            terms: {
              result_type: Object.values(_anomalies.ANOMALY_RESULT_TYPE)
            }
          }, ...(params.includeInterim ? [] : [{
            term: {
              is_interim: false
            }
          }])]
        }
      },
      aggs: previewTimeInterval ? {
        alerts_over_time: {
          date_histogram: {
            field: 'timestamp',
            fixed_interval: `${maxBucket}s`,
            // Ignore empty buckets
            min_doc_count: 1
          },
          aggs: getResultTypeAggRequest(params.resultType, params.severity, true)
        }
      } : getResultTypeAggRequest(params.resultType, params.severity)
    };
    const response = await mlClient.anomalySearch({
      // @ts-expect-error
      body: requestBody
    }, jobIds);
    const result = response.body.aggregations;
    const resultsLabel = getAggResultsLabel(params.resultType);
    const fieldsFormatters = await getFormatters(datafeeds[0]);
    const formatter = getResultsFormatter(params.resultType, !!previewTimeInterval, fieldsFormatters);
    return (previewTimeInterval ? result.alerts_over_time.buckets // Filter out empty buckets
    .filter(v => v.doc_count > 0 && v[resultsLabel.aggGroupLabel].doc_count > 0) // Map response
    .map(formatter) : [formatter(result)]).filter(_guards.isDefined);
  };
  /**
   * Fetches the most recent anomaly according the top N buckets within the lookback interval
   * that satisfies a rule criteria.
   *
   * @param params - Alert params
   */


  const fetchResult = async params => {
    var _params$jobSelection$3, _params$jobSelection$4, _params$lookbackInter, _params$topNBuckets;

    const jobAndGroupIds = [...((_params$jobSelection$3 = params.jobSelection.jobIds) !== null && _params$jobSelection$3 !== void 0 ? _params$jobSelection$3 : []), ...((_params$jobSelection$4 = params.jobSelection.groupIds) !== null && _params$jobSelection$4 !== void 0 ? _params$jobSelection$4 : [])]; // Extract jobs from group ids and make sure provided jobs assigned to a current space

    const jobsResponse = (await mlClient.getJobs({
      job_id: jobAndGroupIds.join(',')
    })).body.jobs;

    if (jobsResponse.length === 0) {
      // Probably assigned groups don't contain any jobs anymore.
      return;
    }

    const jobIds = jobsResponse.map(v => v.job_id);
    const datafeeds = await datafeedsService.getDatafeedByJobId(jobIds);
    const maxBucketInSeconds = (0, _job_utils.resolveMaxTimeInterval)(jobsResponse.map(v => v.analysis_config.bucket_span));

    if (maxBucketInSeconds === undefined) {
      // Technically it's not possible, just in case.
      throw new Error('Unable to resolve a valid bucket length');
    }

    const lookBackTimeInterval = (_params$lookbackInter = params.lookbackInterval) !== null && _params$lookbackInter !== void 0 ? _params$lookbackInter : (0, _alerts.resolveLookbackInterval)(jobsResponse, datafeeds !== null && datafeeds !== void 0 ? datafeeds : []);
    const topNBuckets = (_params$topNBuckets = params.topNBuckets) !== null && _params$topNBuckets !== void 0 ? _params$topNBuckets : (0, _alerts.getTopNBuckets)(jobsResponse[0]);
    const requestBody = {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              job_id: jobIds
            }
          }, {
            terms: {
              result_type: Object.values(_anomalies.ANOMALY_RESULT_TYPE)
            }
          }, {
            range: {
              timestamp: {
                gte: `now-${lookBackTimeInterval}`
              }
            }
          }, ...(params.includeInterim ? [] : [{
            term: {
              is_interim: false
            }
          }])]
        }
      },
      aggs: {
        alerts_over_time: {
          date_histogram: {
            field: 'timestamp',
            fixed_interval: `${maxBucketInSeconds}s`,
            order: {
              _key: 'desc'
            }
          },
          aggs: {
            max_score: {
              max: {
                field: resultTypeScoreMapping[params.resultType]
              }
            },
            ...getResultTypeAggRequest(params.resultType, params.severity),
            truncate: {
              bucket_sort: {
                size: topNBuckets
              }
            }
          }
        }
      }
    };
    const response = await mlClient.anomalySearch({
      // @ts-expect-error
      body: requestBody
    }, jobIds);
    const result = response.body.aggregations;

    if (result.alerts_over_time.buckets.length === 0) {
      return;
    } // Find the most anomalous result from the top N buckets


    const topResult = result.alerts_over_time.buckets.reduce((prev, current) => prev.max_score.value > current.max_score.value ? prev : current);
    const formatters = await getFormatters(datafeeds[0]);
    return getResultsFormatter(params.resultType, false, formatters)(topResult);
  };
  /**
   * TODO Replace with URL generator when https://github.com/elastic/kibana/issues/59453 is resolved
   * @param r
   * @param type
   */


  const buildExplorerUrl = (r, type) => {
    const isInfluencerResult = type === _anomalies.ANOMALY_RESULT_TYPE.INFLUENCER;
    /**
     * Disabled until Anomaly Explorer page is fixed and properly
     * support single point time selection
     */

    const highlightSwimLaneSelection = false;
    const globalState = {
      ml: {
        jobIds: r.jobIds
      },
      time: {
        from: r.bucketRange.start,
        to: r.bucketRange.end,
        mode: 'absolute'
      }
    };
    const appState = {
      explorer: {
        mlExplorerFilter: { ...(isInfluencerResult ? {
            filterActive: true,
            filteredFields: [r.topInfluencers[0].influencer_field_name, r.topInfluencers[0].influencer_field_value],
            influencersFilterQuery: {
              bool: {
                minimum_should_match: 1,
                should: [{
                  match_phrase: {
                    [r.topInfluencers[0].influencer_field_name]: r.topInfluencers[0].influencer_field_value
                  }
                }]
              }
            },
            queryString: `${r.topInfluencers[0].influencer_field_name}:"${r.topInfluencers[0].influencer_field_value}"`
          } : {})
        },
        mlExplorerSwimlane: { ...(highlightSwimLaneSelection ? {
            selectedLanes: [isInfluencerResult ? r.topInfluencers[0].influencer_field_value : 'Overall'],
            selectedTimes: r.timestampEpoch,
            selectedType: isInfluencerResult ? 'viewBy' : 'overall',
            ...(isInfluencerResult ? {
              viewByFieldName: r.topInfluencers[0].influencer_field_name
            } : {}),
            ...(isInfluencerResult ? {} : {
              showTopFieldValues: true
            })
          } : {})
        }
      }
    };
    return `/app/ml/explorer/?_g=${encodeURIComponent(_risonNode.default.encode(globalState))}&_a=${encodeURIComponent(_risonNode.default.encode(appState))}`;
  };

  return {
    /**
     * Return the result of an alert condition execution.
     *
     * @param params - Alert params
     * @param startedAt
     * @param previousStartedAt
     */
    execute: async (params, startedAt, previousStartedAt) => {
      const result = await fetchResult(params);
      if (!result) return;
      const anomalyExplorerUrl = buildExplorerUrl(result, params.resultType);
      const executionResult = { ...result,
        name: result.alertInstanceKey,
        anomalyExplorerUrl
      };
      return executionResult;
    },

    /**
     * Checks how often the alert condition will fire an alert instance
     * based on the provided relative time window.
     *
     * @param previewParams
     */
    preview: async ({
      alertParams,
      timeRange,
      sampleSize
    }) => {
      const res = await fetchAnomalies(alertParams, timeRange);

      if (!res) {
        throw _boom.default.notFound(`No results found`);
      }

      return {
        // sum of all alert responses within the time range
        count: res.length,
        results: res.slice(0, sampleSize)
      };
    }
  };
}