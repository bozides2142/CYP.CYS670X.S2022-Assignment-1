"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSavedObjectsFactory = syncSavedObjectsFactory;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _checks = require("./checks");

var _util = require("./util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function syncSavedObjectsFactory(client, jobSavedObjectService) {
  const {
    checkStatus
  } = (0, _checks.checksFactory)(client, jobSavedObjectService);

  async function syncSavedObjects(simulate = false) {
    const results = {
      savedObjectsCreated: {},
      savedObjectsDeleted: {},
      datafeedsAdded: {},
      datafeedsRemoved: {}
    };
    const {
      body: datafeeds
    } = await client.asInternalUser.ml.getDatafeeds();
    const tasks = [];
    const status = await checkStatus();
    const adJobsById = status.jobs['anomaly-detector'].reduce((acc, j) => {
      acc[j.jobId] = j;
      return acc;
    }, {});

    for (const job of status.jobs['anomaly-detector']) {
      if (job.checks.savedObjectExits === false) {
        const type = 'anomaly-detector';

        if (simulate === true) {
          results.savedObjectsCreated[job.jobId] = {
            success: true,
            type
          };
        } else {
          // create AD saved objects for jobs which are missing them
          const jobId = job.jobId;
          const datafeedId = job.datafeedId;
          tasks.push(async () => {
            try {
              await jobSavedObjectService.createAnomalyDetectionJob(jobId, datafeedId !== null && datafeedId !== void 0 ? datafeedId : undefined);
              results.savedObjectsCreated[job.jobId] = {
                success: true,
                type
              };
            } catch (error) {
              results.savedObjectsCreated[job.jobId] = {
                success: false,
                type,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.jobs['data-frame-analytics']) {
      if (job.checks.savedObjectExits === false) {
        const type = 'data-frame-analytics';

        if (simulate === true) {
          results.savedObjectsCreated[job.jobId] = {
            success: true,
            type
          };
        } else {
          // create DFA saved objects for jobs which are missing them
          const jobId = job.jobId;
          tasks.push(async () => {
            try {
              await jobSavedObjectService.createDataFrameAnalyticsJob(jobId);
              results.savedObjectsCreated[job.jobId] = {
                success: true,
                type
              };
            } catch (error) {
              results.savedObjectsCreated[job.jobId] = {
                success: false,
                type,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.savedObjects['anomaly-detector']) {
      if (job.checks.jobExists === false) {
        const type = 'anomaly-detector';

        if (simulate === true) {
          results.savedObjectsDeleted[job.jobId] = {
            success: true,
            type
          };
        } else {
          // Delete AD saved objects for jobs which no longer exist
          const {
            jobId,
            namespaces
          } = job;
          tasks.push(async () => {
            try {
              if (namespaces !== undefined && namespaces.length) {
                await jobSavedObjectService.forceDeleteAnomalyDetectionJob(jobId, namespaces[0]);
              } else {
                await jobSavedObjectService.deleteAnomalyDetectionJob(jobId);
              }

              results.savedObjectsDeleted[job.jobId] = {
                success: true,
                type
              };
            } catch (error) {
              results.savedObjectsDeleted[job.jobId] = {
                success: false,
                type,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.savedObjects['data-frame-analytics']) {
      if (job.checks.jobExists === false) {
        const type = 'data-frame-analytics';

        if (simulate === true) {
          results.savedObjectsDeleted[job.jobId] = {
            success: true,
            type
          };
        } else {
          // Delete DFA saved objects for jobs which no longer exist
          const {
            jobId,
            namespaces
          } = job;
          tasks.push(async () => {
            try {
              if (namespaces !== undefined && namespaces.length) {
                await jobSavedObjectService.forceDeleteDataFrameAnalyticsJob(jobId, namespaces[0]);
              } else {
                await jobSavedObjectService.deleteDataFrameAnalyticsJob(jobId);
              }

              results.savedObjectsDeleted[job.jobId] = {
                success: true,
                type
              };
            } catch (error) {
              results.savedObjectsDeleted[job.jobId] = {
                success: false,
                type,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.savedObjects['anomaly-detector']) {
      const type = 'anomaly-detector';

      if (job.checks.datafeedExists === true && job.datafeedId === null || job.checks.datafeedExists === true && job.datafeedId !== null && adJobsById[job.jobId] && adJobsById[job.jobId].datafeedId !== job.datafeedId) {
        // add datafeed id for jobs where the datafeed exists but the id is missing from the saved object
        // or if the datafeed id in the saved object is not the same as the one attached to the job in es
        if (simulate === true) {
          results.datafeedsAdded[job.jobId] = {
            success: true,
            type
          };
        } else {
          const df = datafeeds.datafeeds.find(d => d.job_id === job.jobId);
          const jobId = job.jobId;
          const datafeedId = df === null || df === void 0 ? void 0 : df.datafeed_id;
          tasks.push(async () => {
            try {
              if (datafeedId !== undefined) {
                await jobSavedObjectService.addDatafeed(datafeedId, jobId);
              }

              results.datafeedsAdded[job.jobId] = {
                success: true,
                type
              };
            } catch (error) {
              results.datafeedsAdded[job.jobId] = {
                success: false,
                type,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      } else if (job.checks.jobExists === true && job.checks.datafeedExists === false && job.datafeedId !== null && job.datafeedId !== undefined) {
        // remove datafeed id for jobs where the datafeed no longer exists but the id is populated in the saved object
        if (simulate === true) {
          results.datafeedsRemoved[job.jobId] = {
            success: true,
            type
          };
        } else {
          const datafeedId = job.datafeedId;
          tasks.push(async () => {
            try {
              await jobSavedObjectService.deleteDatafeed(datafeedId);
              results.datafeedsRemoved[job.jobId] = {
                success: true,
                type
              };
            } catch (error) {
              results.datafeedsRemoved[job.jobId] = {
                success: false,
                type,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    await Promise.allSettled(tasks.map(t => t()));
    return results;
  }

  async function initSavedObjects(simulate = false, spaceOverrides) {
    const results = {
      jobs: [],
      datafeeds: [],
      success: true
    };
    const status = await checkStatus();
    const adJobsById = status.jobs['anomaly-detector'].reduce((acc, j) => {
      acc[j.jobId] = j;
      return acc;
    }, {});
    const jobs = [];
    const datafeeds = [];
    const types = ['anomaly-detector', 'data-frame-analytics'];
    types.forEach(type => {
      status.jobs[type].forEach(job => {
        if (job.checks.savedObjectExits === false) {
          if (simulate === true) {
            results.jobs.push({
              id: job.jobId,
              type
            });
          } else {
            var _job$datafeedId, _spaceOverrides$overr;

            jobs.push({
              job: {
                job_id: job.jobId,
                datafeed_id: (_job$datafeedId = job.datafeedId) !== null && _job$datafeedId !== void 0 ? _job$datafeedId : null,
                type
              },
              // allow some jobs to be assigned to specific spaces when initializing
              namespaces: (_spaceOverrides$overr = spaceOverrides === null || spaceOverrides === void 0 ? void 0 : spaceOverrides.overrides[type][job.jobId]) !== null && _spaceOverrides$overr !== void 0 ? _spaceOverrides$overr : ['*']
            });
          }
        }
      });
    });
    status.savedObjects['anomaly-detector'].forEach(job => {
      var _adJobsById$job$jobId;

      const type = 'anomaly-detector';
      const datafeedId = (_adJobsById$job$jobId = adJobsById[job.jobId]) === null || _adJobsById$job$jobId === void 0 ? void 0 : _adJobsById$job$jobId.datafeedId;

      if (!datafeedId) {
        return;
      }

      if (job.checks.datafeedExists === true && (job.datafeedId === null || job.datafeedId !== null && adJobsById[job.jobId] && adJobsById[job.jobId].datafeedId !== job.datafeedId)) {
        if (simulate === true) {
          results.datafeeds.push({
            id: datafeedId,
            type
          });
        } else {
          datafeeds.push({
            jobId: job.jobId,
            datafeedId
          });
        }
      }
    });

    try {
      // create missing job saved objects
      const createResults = await jobSavedObjectService.bulkCreateJobs(jobs);
      createResults.saved_objects.forEach(({
        attributes
      }) => {
        results.jobs.push({
          id: attributes.job_id,
          type: attributes.type
        });
      }); //  create missing datafeed ids

      for (const {
        jobId,
        datafeedId
      } of datafeeds) {
        await jobSavedObjectService.addDatafeed(datafeedId, jobId);
        results.datafeeds.push({
          id: datafeedId,
          type: 'anomaly-detector'
        });
      }
    } catch (error) {
      results.success = false;
      results.error = _boom.default.boomify(error);
    }

    return results;
  }

  async function isSyncNeeded(jobType) {
    const {
      jobs,
      datafeeds
    } = await initSavedObjects(true);
    const missingJobs = jobs.length > 0 && (jobType === undefined || jobs.some(({
      type
    }) => type === jobType));
    const missingDatafeeds = datafeeds.length > 0 && jobType !== 'data-frame-analytics';
    return missingJobs || missingDatafeeds;
  }

  return {
    checkStatus,
    syncSavedObjects,
    initSavedObjects,
    isSyncNeeded
  };
}