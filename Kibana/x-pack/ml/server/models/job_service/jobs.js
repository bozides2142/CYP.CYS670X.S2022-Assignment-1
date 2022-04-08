"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobsProvider = jobsProvider;

var _lodash = require("lodash");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _job_utils = require("../../../common/util/job_utils");

var _states = require("../../../common/constants/states");

var _job_actions = require("../../../common/constants/job_actions");

var _calendars = require("../../../common/constants/calendars");

var _datafeeds = require("./datafeeds");

var _job_audit_messages = require("../job_audit_messages");

var _results_service = require("../results_service");

var _calendar = require("../calendar");

var _error_utils = require("./error_utils");

var _groups = require("./groups");

var _object_utils = require("../../../common/util/object_utils");

var _alerts = require("../../../common/constants/alerts");

var _parse_interval = require("../../../common/util/parse_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function jobsProvider(client, mlClient, rulesClient) {
  const {
    asInternalUser
  } = client;
  const {
    forceDeleteDatafeed,
    getDatafeedIdsByJobId,
    getDatafeedByJobId
  } = (0, _datafeeds.datafeedsProvider)(client, mlClient);
  const {
    getAuditMessagesSummary
  } = (0, _job_audit_messages.jobAuditMessagesProvider)(client, mlClient);
  const {
    getLatestBucketTimestampByJob
  } = (0, _results_service.resultsServiceProvider)(mlClient);
  const calMngr = new _calendar.CalendarManager(mlClient);

  async function forceDeleteJob(jobId) {
    await mlClient.deleteJob({
      job_id: jobId,
      force: true,
      wait_for_completion: false
    });
  }

  async function deleteJobs(jobIds) {
    const results = {};
    const datafeedIds = await getDatafeedIdsByJobId();

    for (const jobId of jobIds) {
      try {
        const datafeedResp = datafeedIds[jobId] === undefined ? {
          acknowledged: true
        } : await forceDeleteDatafeed(datafeedIds[jobId]);

        if (datafeedResp.acknowledged) {
          try {
            await forceDeleteJob(jobId);
            results[jobId] = {
              deleted: true
            };
          } catch (error) {
            if ((0, _error_utils.isRequestTimeout)(error)) {
              return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _states.DATAFEED_STATE.DELETED);
            }

            results[jobId] = {
              deleted: false,
              error: error.body
            };
          }
        }
      } catch (error) {
        if ((0, _error_utils.isRequestTimeout)(error)) {
          return (0, _error_utils.fillResultsWithTimeouts)(results, datafeedIds[jobId], jobIds, _states.DATAFEED_STATE.DELETED);
        }

        results[jobId] = {
          deleted: false,
          error: error.body
        };
      }
    }

    return results;
  }

  async function closeJobs(jobIds) {
    const results = {};

    for (const jobId of jobIds) {
      try {
        await mlClient.closeJob({
          job_id: jobId
        });
        results[jobId] = {
          closed: true
        };
      } catch (error) {
        var _error$body$error;

        if ((0, _error_utils.isRequestTimeout)(error)) {
          return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _states.JOB_STATE.CLOSED);
        }

        if (error.statusCode === 409 && (_error$body$error = error.body.error) !== null && _error$body$error !== void 0 && _error$body$error.reason && error.body.error.reason.includes('datafeed') === false) {
          // the close job request may fail (409) if the job has failed or if the datafeed hasn't been stopped.
          // if the job has failed we want to attempt a force close.
          // however, if we received a 409 due to the datafeed being started we should not attempt a force close.
          try {
            await mlClient.closeJob({
              job_id: jobId,
              force: true
            });
            results[jobId] = {
              closed: true
            };
          } catch (error2) {
            if ((0, _error_utils.isRequestTimeout)(error2)) {
              return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _states.JOB_STATE.CLOSED);
            }

            results[jobId] = {
              closed: false,
              error: error2.body
            };
          }
        } else {
          results[jobId] = {
            closed: false,
            error: error.body
          };
        }
      }
    }

    return results;
  }

  async function resetJobs(jobIds) {
    const results = {};

    for (const jobId of jobIds) {
      try {
        const {
          // @ts-expect-error @elastic-elasticsearch resetJob response incorrect, missing task
          body: {
            task
          }
        } = await mlClient.resetJob({
          job_id: jobId,
          wait_for_completion: false
        });
        results[jobId] = {
          reset: true,
          task
        };
      } catch (error) {
        if ((0, _error_utils.isRequestTimeout)(error)) {
          return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _job_actions.JOB_ACTION.RESET);
        } else {
          results[jobId] = {
            reset: false,
            error: error.body
          };
        }
      }
    }

    return results;
  }

  async function forceStopAndCloseJob(jobId) {
    const datafeedIds = await getDatafeedIdsByJobId();
    const datafeedId = datafeedIds[jobId];

    if (datafeedId === undefined) {
      throw _boom.default.notFound(`Cannot find datafeed for job ${jobId}`);
    }

    const {
      body
    } = await mlClient.stopDatafeed({
      datafeed_id: datafeedId,
      body: {
        force: true
      }
    });

    if (body.stopped !== true) {
      return {
        success: false
      };
    }

    await mlClient.closeJob({
      job_id: jobId,
      force: true
    });
    return {
      success: true
    };
  }

  async function jobsSummary(jobIds = []) {
    const fullJobsList = await createFullJobsList();
    const fullJobsIds = fullJobsList.map(job => job.job_id);
    let auditMessagesByJob = {}; // even if there are errors getting the audit messages, we still want to show the full list

    try {
      const auditMessages = await getAuditMessagesSummary(fullJobsIds);
      auditMessagesByJob = auditMessages.reduce((acc, cur) => {
        acc[cur.job_id] = cur;
        return acc;
      }, auditMessagesByJob);
    } catch (e) {// fail silently
    }

    const jobs = fullJobsList.map(job => {
      var _job$data_counts, _job$analysis_config, _job$blocked, _job$custom_settings$, _job$custom_settings;

      const hasDatafeed = (0, _object_utils.isPopulatedObject)(job.datafeed_config);
      const dataCounts = job.data_counts;
      const errorMessage = (0, _job_utils.getSingleMetricViewerJobErrorMessage)(job);
      const tempJob = {
        id: job.job_id,
        description: job.description || '',
        customSettings: job.custom_settings,
        groups: Array.isArray(job.groups) ? job.groups.sort() : [],
        processed_record_count: (_job$data_counts = job.data_counts) === null || _job$data_counts === void 0 ? void 0 : _job$data_counts.processed_record_count,
        earliestStartTimestampMs: (0, _job_utils.getEarliestDatafeedStartTime)(dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_record_timestamp, dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_bucket_timestamp, (0, _job_utils.parseTimeIntervalForJob)((_job$analysis_config = job.analysis_config) === null || _job$analysis_config === void 0 ? void 0 : _job$analysis_config.bucket_span)),
        memory_status: job.model_size_stats ? job.model_size_stats.memory_status : '',
        jobState: job.blocked === undefined ? job.state : (0, _job_actions.getJobActionString)(job.blocked.reason),
        hasDatafeed,
        datafeedId: hasDatafeed && job.datafeed_config.datafeed_id ? job.datafeed_config.datafeed_id : '',
        datafeedIndices: hasDatafeed && job.datafeed_config.indices ? job.datafeed_config.indices : [],
        datafeedState: hasDatafeed && job.datafeed_config.state ? job.datafeed_config.state : '',
        latestTimestampMs: dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_record_timestamp,
        earliestTimestampMs: dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.earliest_record_timestamp,
        latestResultsTimestampMs: (0, _job_utils.getLatestDataOrBucketTimestamp)(dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_record_timestamp, dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_bucket_timestamp),
        isSingleMetricViewerJob: errorMessage === undefined,
        isNotSingleMetricViewerJobMessage: errorMessage,
        nodeName: job.node ? job.node.name : undefined,
        blocked: (_job$blocked = job.blocked) !== null && _job$blocked !== void 0 ? _job$blocked : undefined,
        awaitingNodeAssignment: isJobAwaitingNodeAssignment(job),
        alertingRules: job.alerting_rules,
        jobTags: (_job$custom_settings$ = (_job$custom_settings = job.custom_settings) === null || _job$custom_settings === void 0 ? void 0 : _job$custom_settings.job_tags) !== null && _job$custom_settings$ !== void 0 ? _job$custom_settings$ : {},
        bucketSpanSeconds: (0, _parse_interval.parseInterval)(job.analysis_config.bucket_span).asSeconds()
      };

      if (jobIds.find(j => j === tempJob.id)) {
        tempJob.fullJob = job;
      }

      const auditMessage = auditMessagesByJob[tempJob.id];

      if (auditMessage !== undefined && job.create_time !== undefined && job.create_time <= auditMessage.msgTime) {
        tempJob.auditMessage = {
          level: auditMessage.highestLevel,
          text: auditMessage.highestLevelText
        };
      }

      return tempJob;
    });
    return jobs;
  }

  async function getJobIdsWithGeo() {
    const {
      body
    } = await mlClient.getJobs();
    return body.jobs.filter(_job_utils.isJobWithGeoData).map(job => job.job_id);
  }

  async function jobsWithTimerange() {
    const fullJobsList = await createFullJobsList();
    const jobsMap = {};
    const jobs = fullJobsList.map(job => {
      jobsMap[job.job_id] = job.groups || [];
      const hasDatafeed = (0, _object_utils.isPopulatedObject)(job.datafeed_config);
      const timeRange = {};
      const dataCounts = job.data_counts;

      if (dataCounts !== undefined) {
        timeRange.to = (0, _job_utils.getLatestDataOrBucketTimestamp)(dataCounts.latest_record_timestamp, dataCounts.latest_bucket_timestamp);
        timeRange.from = dataCounts.earliest_record_timestamp;
      }

      const errorMessage = (0, _job_utils.getSingleMetricViewerJobErrorMessage)(job);
      const tempJob = {
        id: job.job_id,
        job_id: job.job_id,
        groups: Array.isArray(job.groups) ? job.groups.sort() : [],
        isRunning: hasDatafeed && job.datafeed_config.state === 'started',
        isSingleMetricViewerJob: errorMessage === undefined,
        isNotSingleMetricViewerJobMessage: errorMessage,
        timeRange
      };
      return tempJob;
    });
    return {
      jobs,
      jobsMap
    };
  }

  async function getJobForCloning(jobId) {
    const [{
      body: jobResults
    }, datafeedResult] = await Promise.all([mlClient.getJobs({
      job_id: jobId,
      exclude_generated: true
    }), getDatafeedByJobId(jobId, true)]);
    const result = {
      job: undefined,
      datafeed: undefined
    };

    if (datafeedResult && datafeedResult.job_id === jobId) {
      result.datafeed = datafeedResult;
    }

    if (jobResults && jobResults.jobs) {
      const job = jobResults.jobs.find(j => j.job_id === jobId);

      if (job) {
        removeUnClonableCustomSettings(job);
        result.job = job;
      }
    }

    return result;
  }

  function removeUnClonableCustomSettings(job) {
    if ((0, _object_utils.isPopulatedObject)(job.custom_settings)) {
      delete job.custom_settings.managed;
    }
  }

  async function createFullJobsList(jobIds = []) {
    const jobs = [];
    const groups = {};
    const datafeeds = {};
    const calendarsByJobId = {};
    const globalCalendars = [];
    const jobIdsString = jobIds.join();
    const [{
      body: jobResults
    }, {
      body: jobStatsResults
    }, {
      body: datafeedResults
    }, {
      body: datafeedStatsResults
    }, calendarResults, latestBucketTimestampByJob] = await Promise.all([mlClient.getJobs(jobIds.length > 0 ? {
      job_id: jobIdsString
    } : undefined), mlClient.getJobStats(jobIds.length > 0 ? {
      job_id: jobIdsString
    } : undefined), mlClient.getDatafeeds(), mlClient.getDatafeedStats(), calMngr.getAllCalendars(), getLatestBucketTimestampByJob()]);

    if (datafeedResults && datafeedResults.datafeeds) {
      datafeedResults.datafeeds.forEach(datafeed => {
        if (datafeedStatsResults && datafeedStatsResults.datafeeds) {
          const datafeedStats = datafeedStatsResults.datafeeds.find(ds => ds.datafeed_id === datafeed.datafeed_id);

          if (datafeedStats) {
            datafeeds[datafeed.job_id] = { ...datafeed,
              ...datafeedStats
            };
          }
        }
      });
    } // create list of jobs per group.
    // used for assigning calendars to jobs when a calendar has
    // only been attached to a group


    if (jobResults && jobResults.jobs) {
      jobResults.jobs.forEach(job => {
        calendarsByJobId[job.job_id] = [];

        if (job.groups !== undefined) {
          job.groups.forEach(gId => {
            if (groups[gId] === undefined) {
              groups[gId] = [];
            }

            groups[gId].push(job.job_id);
          });
        }
      });
    } // assign calendars to jobs


    if (calendarResults) {
      calendarResults.forEach(cal => {
        cal.job_ids.forEach(id => {
          if (id === _calendars.GLOBAL_CALENDAR) {
            globalCalendars.push(cal.calendar_id);
          } else if (groups[id]) {
            groups[id].forEach(jId => {
              if (calendarsByJobId[jId] !== undefined) {
                calendarsByJobId[jId].push(cal.calendar_id);
              }
            });
          } else {
            if (calendarsByJobId[id] !== undefined) {
              calendarsByJobId[id].push(cal.calendar_id);
            }
          }
        });
      }); // de-duplicate calendars

      for (const cal in calendarsByJobId) {
        if (calendarsByJobId.hasOwnProperty(cal)) {
          calendarsByJobId[cal] = (0, _lodash.uniq)(calendarsByJobId[cal]);
        }
      }
    } // create jobs objects containing job stats, datafeeds, datafeed stats and calendars


    if (jobResults && jobResults.jobs) {
      jobResults.jobs.forEach(job => {
        let tempJob = job;
        const calendars = [...(calendarsByJobId[tempJob.job_id] || []), ...(globalCalendars || [])];

        if (calendars.length) {
          tempJob.calendars = calendars;
        }

        if (jobStatsResults && jobStatsResults.jobs) {
          const jobStats = jobStatsResults.jobs.find(js => js.job_id === tempJob.job_id);

          if (jobStats !== undefined) {
            tempJob = { ...tempJob,
              ...jobStats
            };

            if (jobStats.node) {
              tempJob.node = jobStats.node;
            }

            if (jobStats.open_time) {
              tempJob.open_time = jobStats.open_time;
            } // Add in the timestamp of the last bucket processed for each job if available.


            const latestBucketTimestamp = latestBucketTimestampByJob && latestBucketTimestampByJob[tempJob.job_id];

            if (latestBucketTimestamp) {
              tempJob.data_counts.latest_bucket_timestamp = latestBucketTimestamp;
            }
          }
        }

        const datafeed = datafeeds[tempJob.job_id];

        if (datafeed !== undefined) {
          tempJob.datafeed_config = datafeed;
        }

        jobs.push(tempJob);
      });

      if (rulesClient) {
        const mlAlertingRules = await rulesClient.find({
          options: {
            filter: `alert.attributes.alertTypeId:${_alerts.ML_ALERT_TYPES.ANOMALY_DETECTION}`,
            perPage: 1000
          }
        });
        mlAlertingRules.data.forEach(curr => {
          const {
            params: {
              jobSelection: {
                jobIds: ruleJobIds,
                groupIds: ruleGroupIds
              }
            }
          } = curr;
          jobs.forEach(j => {
            const isIncluded = Array.isArray(ruleJobIds) && ruleJobIds.includes(j.job_id) || Array.isArray(ruleGroupIds) && Array.isArray(j.groups) && j.groups.some(g => ruleGroupIds.includes(g));

            if (isIncluded) {
              if (Array.isArray(j.alerting_rules)) {
                j.alerting_rules.push(curr);
              } else {
                j.alerting_rules = [curr];
              }
            }
          });
        });
      }
    }

    return jobs;
  }

  async function blockingJobTasks() {
    const jobs = [];

    try {
      const {
        body
      } = await asInternalUser.tasks.list({
        actions: _job_actions.JOB_ACTION_TASKS,
        detailed: true
      });

      if (body.nodes !== undefined) {
        Object.values(body.nodes).forEach(({
          tasks
        }) => {
          Object.values(tasks).forEach(({
            action,
            description
          }) => {
            if (description === undefined) {
              return;
            }

            if (_job_actions.JOB_ACTION_TASK[action] === _job_actions.JOB_ACTION.DELETE) {
              jobs.push({
                [description.replace(/^delete-job-/, '')]: _job_actions.JOB_ACTION.DELETE
              });
            } else {
              jobs.push({
                [description]: _job_actions.JOB_ACTION_TASK[action]
              });
            }
          });
        });
      }
    } catch (e) {
      // if the user doesn't have permission to load the task list,
      // use the jobs list to get the ids of deleting jobs
      const {
        body: {
          jobs: tempJobs
        }
      } = await mlClient.getJobs();
      jobs.push(...tempJobs.filter(j => j.blocked !== undefined).map(j => ({
        [j.job_id]: j.blocked.reason
      })));
    }

    return {
      jobs
    };
  } // Checks if each of the jobs in the specified list of IDs exist.
  // Job IDs in supplied array may contain wildcard '*' characters
  // e.g. *_low_request_rate_ecs


  async function jobsExist(jobIds = [], allSpaces = false) {
    const results = {};

    for (const jobId of jobIds) {
      try {
        if (jobId === '') {
          results[jobId] = {
            exists: false,
            isGroup: false
          };
          continue;
        }

        const {
          body
        } = allSpaces ? await client.asInternalUser.ml.getJobs({
          job_id: jobId
        }) : await mlClient.getJobs({
          job_id: jobId
        });
        const isGroup = body.jobs.some(j => j.groups !== undefined && j.groups.includes(jobId));
        results[jobId] = {
          exists: body.count > 0,
          isGroup
        };
      } catch (e) {
        // if a non-wildcarded job id is supplied, the get jobs endpoint will 404
        if (e.statusCode !== 404) {
          throw e;
        }

        results[jobId] = {
          exists: false,
          isGroup: false
        };
      }
    }

    return results;
  }

  async function getAllJobAndGroupIds() {
    const {
      getAllGroups
    } = (0, _groups.groupsProvider)(mlClient);
    const {
      body
    } = await mlClient.getJobs();
    const jobIds = body.jobs.map(job => job.job_id);
    const groups = await getAllGroups();
    const groupIds = groups.map(group => group.id);
    return {
      jobIds,
      groupIds
    };
  }

  async function getLookBackProgress(jobId, start, end) {
    const datafeedId = `datafeed-${jobId}`;
    const [{
      body
    }, isRunning] = await Promise.all([mlClient.getJobStats({
      job_id: jobId
    }), isDatafeedRunning(datafeedId)]);

    if (body.jobs.length) {
      const statsForJob = body.jobs[0];
      const time = statsForJob.data_counts.latest_record_timestamp;
      const progress = (time - start) / (end - start);
      const isJobClosed = statsForJob.state === _states.JOB_STATE.CLOSED;
      return {
        progress: progress > 0 ? Math.round(progress * 100) : 0,
        isRunning,
        isJobClosed
      };
    }

    return {
      progress: 0,
      isRunning: false,
      isJobClosed: true
    };
  }

  async function isDatafeedRunning(datafeedId) {
    const {
      body
    } = await mlClient.getDatafeedStats({
      datafeed_id: datafeedId
    });

    if (body.datafeeds.length) {
      const state = body.datafeeds[0].state;
      return state === _states.DATAFEED_STATE.STARTED || state === _states.DATAFEED_STATE.STARTING || state === _states.DATAFEED_STATE.STOPPING;
    }

    return false;
  }

  function isJobAwaitingNodeAssignment(job) {
    return job.node === undefined && job.state === _states.JOB_STATE.OPENING;
  }

  async function bulkCreate(jobs, authHeader) {
    const results = {};
    await Promise.all(jobs.map(async ({
      job,
      datafeed
    }) => {
      results[job.job_id] = {
        job: {
          success: false
        },
        datafeed: {
          success: false
        }
      };

      try {
        await mlClient.putJob({
          job_id: job.job_id,
          body: job
        });
        results[job.job_id].job = {
          success: true
        };
      } catch (error) {
        var _error$body;

        results[job.job_id].job = {
          success: false,
          error: (_error$body = error.body) !== null && _error$body !== void 0 ? _error$body : error
        };
      }

      try {
        await mlClient.putDatafeed({
          datafeed_id: datafeed.datafeed_id,
          body: datafeed
        }, authHeader);
        results[job.job_id].datafeed = {
          success: true
        };
      } catch (error) {
        var _error$body2;

        results[job.job_id].datafeed = {
          success: false,
          error: (_error$body2 = error.body) !== null && _error$body2 !== void 0 ? _error$body2 : error
        };
      }
    }));
    return results;
  }

  return {
    forceDeleteJob,
    deleteJobs,
    closeJobs,
    resetJobs,
    forceStopAndCloseJob,
    jobsSummary,
    jobsWithTimerange,
    getJobForCloning,
    createFullJobsList,
    blockingJobTasks,
    jobsExist,
    getAllJobAndGroupIds,
    getLookBackProgress,
    bulkCreate,
    getJobIdsWithGeo
  };
}