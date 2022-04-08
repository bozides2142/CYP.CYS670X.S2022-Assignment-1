"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJobsHealthServiceProvider = getJobsHealthServiceProvider;
exports.jobsHealthServiceProvider = jobsHealthServiceProvider;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _datafeeds = require("../../models/job_service/datafeeds");

var _alerts = require("../../../common/constants/alerts");

var _alerts2 = require("../../../common/util/alerts");

var _annotation_service = require("../../models/annotation_service");

var _parse_interval = require("../../../common/util/parse_interval");

var _guards = require("../../../common/types/guards");

var _job_audit_messages = require("../../models/job_audit_messages/job_audit_messages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function jobsHealthServiceProvider(mlClient, datafeedsService, annotationService, jobAuditMessagesService, getFieldsFormatRegistry, logger) {
  /**
   * Provides a callback for date formatting based on the Kibana settings.
   */
  const getFormatters = (0, _lodash.memoize)(async () => {
    const fieldFormatsRegistry = await getFieldsFormatRegistry();
    const dateFormatter = fieldFormatsRegistry.deserialize({
      id: 'date'
    });
    const bytesFormatter = fieldFormatsRegistry.deserialize({
      id: 'bytes'
    });
    return {
      dateFormatter: dateFormatter.convert.bind(dateFormatter),
      bytesFormatter: bytesFormatter.convert.bind(bytesFormatter)
    };
  });
  /**
   * Extracts result list of jobs based on included and excluded selection of jobs and groups.
   * @param includeJobs
   * @param excludeJobs
   */

  const getResultJobs = async (includeJobs, excludeJobs) => {
    var _includeJobs$jobIds, _includeJobs$groupIds;

    const jobAndGroupIds = [...((_includeJobs$jobIds = includeJobs.jobIds) !== null && _includeJobs$jobIds !== void 0 ? _includeJobs$jobIds : []), ...((_includeJobs$groupIds = includeJobs.groupIds) !== null && _includeJobs$groupIds !== void 0 ? _includeJobs$groupIds : [])];
    const includeAllJobs = jobAndGroupIds.some(id => id === _alerts.ALL_JOBS_SELECTION); // Extract jobs from group ids and make sure provided jobs assigned to a current space

    const jobsResponse = (await mlClient.getJobs({ ...(includeAllJobs ? {} : {
        job_id: jobAndGroupIds
      })
    })).body.jobs;
    let resultJobs = jobsResponse;

    if (excludeJobs && (!!excludeJobs.jobIds.length || !!(excludeJobs !== null && excludeJobs !== void 0 && excludeJobs.groupIds.length))) {
      var _excludeJobs$jobIds, _excludeJobs$groupIds;

      const excludedJobAndGroupIds = [...((_excludeJobs$jobIds = excludeJobs === null || excludeJobs === void 0 ? void 0 : excludeJobs.jobIds) !== null && _excludeJobs$jobIds !== void 0 ? _excludeJobs$jobIds : []), ...((_excludeJobs$groupIds = excludeJobs === null || excludeJobs === void 0 ? void 0 : excludeJobs.groupIds) !== null && _excludeJobs$groupIds !== void 0 ? _excludeJobs$groupIds : [])];
      const excludedJobsResponse = (await mlClient.getJobs({
        job_id: excludedJobAndGroupIds
      })).body.jobs;
      const excludedJobsIds = new Set(excludedJobsResponse.map(v => v.job_id));
      resultJobs = resultJobs.filter(v => !excludedJobsIds.has(v.job_id));
    }

    return resultJobs;
  };
  /**
   * Resolves the timestamp for delayed data check.
   *
   * @param timeInterval - Custom time interval provided by the user.
   * @param defaultLookbackInterval - Interval derived from the jobs and datefeeds configs.
   */


  const getDelayedDataLookbackTimestamp = (timeInterval, defaultLookbackInterval) => {
    const currentTimestamp = Date.now();
    const defaultLookbackTimestamp = currentTimestamp - (0, _parse_interval.parseInterval)(defaultLookbackInterval).asMilliseconds();
    const customIntervalOffsetTimestamp = timeInterval ? currentTimestamp - (0, _parse_interval.parseInterval)(timeInterval).asMilliseconds() : null;
    return Math.min(...[defaultLookbackTimestamp, customIntervalOffsetTimestamp].filter(_guards.isDefined));
  };

  const getJobIds = (0, _lodash.memoize)(jobs => jobs.map(j => j.job_id));
  const getDatafeeds = (0, _lodash.memoize)(datafeedsService.getDatafeedByJobId);
  const getJobStats = (0, _lodash.memoize)(async jobIds => (await mlClient.getJobStats({
    job_id: jobIds.join(',')
  })).body.jobs);
  /** Gets values for translation string */

  const getJobsAlertingMessageValues = results => {
    const jobIds = (results || []).filter(_guards.isDefined).map(v => v.job_id);
    return {
      count: jobIds.length,
      jobsString: jobIds.join(', ')
    };
  };

  return {
    /**
     * Gets not started datafeeds for opened jobs.
     * @param jobIds
     */
    async getNotStartedDatafeeds(jobIds) {
      const datafeeds = await getDatafeeds(jobIds);

      if (datafeeds) {
        const jobsStats = await getJobStats(jobIds);
        const {
          body: {
            datafeeds: datafeedsStats
          }
        } = await mlClient.getDatafeedStats({
          datafeed_id: datafeeds.map(d => d.datafeed_id).join(',')
        }); // match datafeed stats with the job ids

        return datafeedsStats.map(datafeedStats => {
          var _jobsStats$find$state, _jobsStats$find;

          const jobId = datafeedStats.timing_stats.job_id;
          const jobState = (_jobsStats$find$state = (_jobsStats$find = jobsStats.find(jobStats => jobStats.job_id === jobId)) === null || _jobsStats$find === void 0 ? void 0 : _jobsStats$find.state) !== null && _jobsStats$find$state !== void 0 ? _jobsStats$find$state : 'failed';
          return {
            datafeed_id: datafeedStats.datafeed_id,
            datafeed_state: datafeedStats.state,
            job_id: jobId,
            job_state: jobState
          };
        }).filter(datafeedStat => {
          // Find opened jobs with not started datafeeds
          return datafeedStat.job_state === 'opened' && datafeedStat.datafeed_state !== 'started';
        });
      }
    },

    /**
     * Gets jobs that reached soft or hard model memory limits.
     * @param jobIds
     */
    async getMmlReport(jobIds) {
      const jobsStats = await getJobStats(jobIds);
      const {
        dateFormatter,
        bytesFormatter
      } = await getFormatters();
      return jobsStats.filter(j => j.state === 'opened' && j.model_size_stats.memory_status !== 'ok').map(({
        job_id: jobId,
        model_size_stats: modelSizeStats
      }) => {
        return {
          job_id: jobId,
          memory_status: modelSizeStats.memory_status,
          log_time: dateFormatter(modelSizeStats.log_time),
          model_bytes: bytesFormatter(modelSizeStats.model_bytes),
          model_bytes_memory_limit: bytesFormatter(modelSizeStats.model_bytes_memory_limit),
          peak_model_bytes: bytesFormatter(modelSizeStats.peak_model_bytes),
          model_bytes_exceeded: bytesFormatter(modelSizeStats.model_bytes_exceeded)
        };
      });
    },

    /**
     * Returns annotations about delayed data.
     *
     * @param jobs
     * @param timeInterval - Custom time interval provided by the user.
     * @param docsCount - The threshold for a number of missing documents to alert upon.
     */
    async getDelayedDataReport(jobs, timeInterval, docsCount) {
      const jobIds = getJobIds(jobs);
      const datafeeds = await getDatafeeds(jobIds);
      const datafeedsMap = (0, _lodash.keyBy)(datafeeds, 'job_id'); // We shouldn't check jobs that don't have associated datafeeds

      const resultJobs = jobs.filter(j => datafeedsMap[j.job_id] !== undefined);
      const resultJobIds = getJobIds(resultJobs);
      const jobsMap = (0, _lodash.keyBy)(resultJobs, 'job_id');
      const defaultLookbackInterval = (0, _alerts2.resolveLookbackInterval)(resultJobs, datafeeds);
      const earliestMs = getDelayedDataLookbackTimestamp(timeInterval, defaultLookbackInterval);
      const {
        dateFormatter
      } = await getFormatters();
      return (await annotationService.getDelayedDataAnnotations({
        jobIds: resultJobIds,
        earliestMs
      })).map(v => {
        const match = v.annotation.match(/Datafeed has missed (\d+)\s/);
        const missedDocsCount = match ? parseInt(match[1], 10) : 0;
        return {
          annotation: v.annotation,
          // end_timestamp is always defined for delayed_data annotation
          end_timestamp: v.end_timestamp,
          missed_docs_count: missedDocsCount,
          job_id: v.job_id
        };
      }).filter(v => {
        // As we retrieved annotations based on the longest bucket span and query delay,
        // we need to check end_timestamp against appropriate job configuration.
        const job = jobsMap[v.job_id];
        const datafeed = datafeedsMap[v.job_id];
        const isDocCountExceededThreshold = docsCount ? v.missed_docs_count >= docsCount : true;
        const jobLookbackInterval = (0, _alerts2.resolveLookbackInterval)([job], [datafeed]);
        const isEndTimestampWithinRange = v.end_timestamp > getDelayedDataLookbackTimestamp(timeInterval, jobLookbackInterval);
        return isDocCountExceededThreshold && isEndTimestampWithinRange;
      }).map(v => {
        return { ...v,
          end_timestamp: dateFormatter(v.end_timestamp)
        };
      });
    },

    /**
     * Retrieves a list of the latest errors per jobs.
     * @param jobIds List of job IDs.
     * @param previousStartedAt Time of the previous rule execution. As we intend to notify
     *                          about an error only once, limit the scope of the errors search.
     */
    async getErrorsReport(jobIds, previousStartedAt) {
      const {
        dateFormatter
      } = await getFormatters();
      return (await jobAuditMessagesService.getJobsErrorMessages(jobIds, previousStartedAt.getTime())).map(v => {
        return { ...v,
          errors: v.errors.map(e => {
            return { ...e,
              timestamp: dateFormatter(e.timestamp)
            };
          })
        };
      });
    },

    /**
     * Retrieves report grouped by test.
     */
    async getTestsResults(executorOptions) {
      const {
        rule,
        previousStartedAt,
        params: {
          testsConfig,
          includeJobs,
          excludeJobs
        }
      } = executorOptions;
      const config = (0, _alerts2.getResultJobsHealthRuleConfig)(testsConfig);
      const results = [];
      const jobs = await getResultJobs(includeJobs, excludeJobs);
      const jobIds = getJobIds(jobs);

      if (jobIds.length === 0) {
        logger.warn(`Rule "${rule.name}" does not have associated jobs.`);
        return results;
      }

      logger.debug(`Performing health checks for job IDs: ${jobIds.join(', ')}`);

      if (config.datafeed.enabled) {
        const response = await this.getNotStartedDatafeeds(jobIds);

        if (response && response.length > 0) {
          const {
            count,
            jobsString
          } = getJobsAlertingMessageValues(response);
          results.push({
            name: _alerts.HEALTH_CHECK_NAMES.datafeed.name,
            context: {
              results: response,
              message: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.datafeedStateMessage', {
                defaultMessage: 'Datafeed is not started for {count, plural, one {job} other {jobs}} {jobsString}',
                values: {
                  count,
                  jobsString
                }
              })
            }
          });
        }
      }

      if (config.mml.enabled) {
        const response = await this.getMmlReport(jobIds);

        if (response && response.length > 0) {
          const {
            hard_limit: hardLimitJobs,
            soft_limit: softLimitJobs
          } = (0, _lodash.groupBy)(response, 'memory_status');
          const {
            count: hardLimitCount,
            jobsString: hardLimitJobsString
          } = getJobsAlertingMessageValues(hardLimitJobs);
          const {
            count: softLimitCount,
            jobsString: softLimitJobsString
          } = getJobsAlertingMessageValues(softLimitJobs);
          let message = '';

          if (hardLimitCount > 0) {
            message = _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.mmlMessage', {
              defaultMessage: `{count, plural, one {Job} other {Jobs}} {jobsString} reached the hard model memory limit. Assign the job more memory and restore from a snapshot from prior to reaching the hard limit.`,
              values: {
                count: hardLimitCount,
                jobsString: hardLimitJobsString
              }
            });
          }

          if (softLimitCount > 0) {
            if (message.length > 0) {
              message += '\n';
            }

            message += _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.mmlSoftLimitMessage', {
              defaultMessage: '{count, plural, one {Job} other {Jobs}} {jobsString} reached the soft model memory limit. Assign the job more memory or edit the datafeed filter to limit scope of analysis.',
              values: {
                count: softLimitCount,
                jobsString: softLimitJobsString
              }
            });
          }

          results.push({
            name: _alerts.HEALTH_CHECK_NAMES.mml.name,
            context: {
              results: response,
              message
            }
          });
        }
      }

      if (config.delayedData.enabled) {
        const response = await this.getDelayedDataReport(jobs, config.delayedData.timeInterval, config.delayedData.docsCount);
        const {
          count,
          jobsString
        } = getJobsAlertingMessageValues(response);

        if (response.length > 0) {
          results.push({
            name: _alerts.HEALTH_CHECK_NAMES.delayedData.name,
            context: {
              results: response,
              message: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.delayedDataMessage', {
                defaultMessage: '{count, plural, one {Job} other {Jobs}} {jobsString} {count, plural, one {is} other {are}} suffering from delayed data.',
                values: {
                  count,
                  jobsString
                }
              })
            }
          });
        }
      }

      if (config.errorMessages.enabled && previousStartedAt) {
        const response = await this.getErrorsReport(jobIds, previousStartedAt);

        if (response.length > 0) {
          const {
            count,
            jobsString
          } = getJobsAlertingMessageValues(response);
          results.push({
            name: _alerts.HEALTH_CHECK_NAMES.errorMessages.name,
            context: {
              results: response,
              message: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.errorMessagesMessage', {
                defaultMessage: '{count, plural, one {Job} other {Jobs}} {jobsString} {count, plural, one {contains} other {contain}} errors in the messages.',
                values: {
                  count,
                  jobsString
                }
              })
            }
          });
        }
      }

      return results;
    }

  };
}

function getJobsHealthServiceProvider(getGuards) {
  return {
    jobsHealthServiceProvider(savedObjectsClient, request, logger) {
      return {
        getTestsResults: async (...args) => {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(({
            mlClient,
            scopedClient,
            getFieldsFormatRegistry
          }) => jobsHealthServiceProvider(mlClient, (0, _datafeeds.datafeedsProvider)(scopedClient, mlClient), (0, _annotation_service.annotationServiceProvider)(scopedClient), (0, _job_audit_messages.jobAuditMessagesProvider)(scopedClient, mlClient), getFieldsFormatRegistry, logger).getTestsResults(...args));
        }
      };
    }

  };
}