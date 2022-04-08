"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClearable = isClearable;
exports.jobAuditMessagesProvider = jobAuditMessagesProvider;

var _moment = _interopRequireDefault(require("moment"));

var _index_patterns = require("../../../common/constants/index_patterns");

var _message_levels = require("../../../common/constants/message_levels");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SIZE = 1000;
const LEVEL = {
  system_info: -1,
  info: 0,
  warning: 1,
  error: 2
}; // filter to match job_type: 'anomaly_detector' or no job_type field at all
// if no job_type field exist, we can assume the message is for an anomaly detector job

const anomalyDetectorTypeFilter = {
  bool: {
    should: [{
      term: {
        job_type: 'anomaly_detector'
      }
    }, {
      bool: {
        must_not: {
          exists: {
            field: 'job_type'
          }
        }
      }
    }],
    minimum_should_match: 1
  }
};

function isClearable(index) {
  if (typeof index === 'string') {
    const match = index.match(/\d{6}$/);
    return match !== null && !!match.length && Number(match[match.length - 1]) >= 2;
  }

  return false;
}

function jobAuditMessagesProvider({
  asInternalUser
}, mlClient) {
  // search for audit messages,
  // jobId is optional. without it, all jobs will be listed.
  // from is optional and should be a string formatted in ES time units. e.g. 12h, 1d, 7d
  async function getJobAuditMessages(jobSavedObjectService, {
    jobId,
    from,
    start,
    end
  }) {
    let gte = null;

    if (jobId !== undefined && from === undefined) {
      const jobs = await mlClient.getJobs({
        job_id: jobId
      });

      if (jobs.body.count > 0 && jobs.body.jobs !== undefined) {
        gte = (0, _moment.default)(jobs.body.jobs[0].create_time).valueOf();
      }
    } else if (from !== undefined) {
      gte = `now-${from}`;
    }

    let timeFilter = {};

    if (from !== null) {
      timeFilter = {
        range: {
          timestamp: {
            gte,
            lte: 'now'
          }
        }
      };
    }

    if (start !== undefined && end !== undefined) {
      timeFilter = {
        range: {
          timestamp: {
            gte: start,
            lte: end
          }
        }
      };
    }

    const query = {
      bool: {
        filter: [{
          bool: {
            must_not: {
              term: {
                level: 'activity'
              }
            }
          }
        }, anomalyDetectorTypeFilter, timeFilter]
      }
    }; // if no jobId specified, load all of the messages

    if (jobId !== undefined) {
      query.bool.filter.push({
        bool: {
          should: [{
            term: {
              job_id: '' // catch system messages

            }
          }, {
            term: {
              job_id: jobId // messages for specified jobId

            }
          }]
        }
      });
    }

    const {
      body
    } = await asInternalUser.search({
      index: _index_patterns.ML_NOTIFICATION_INDEX_PATTERN,
      ignore_unavailable: true,
      size: SIZE,
      body: {
        sort: [{
          timestamp: {
            order: 'desc'
          }
        }, {
          job_id: {
            order: 'asc'
          }
        }],
        query
      }
    });
    let messages = [];
    const notificationIndices = [];

    if (body.hits.total.value > 0) {
      let notificationIndex;
      body.hits.hits.forEach(hit => {
        if (notificationIndex !== hit._index && isClearable(hit._index)) {
          notificationIndices.push(hit._index);
          notificationIndex = hit._index;
        }

        messages.push(hit._source);
      });
    }

    messages = await jobSavedObjectService.filterJobsForSpace('anomaly-detector', messages, 'job_id');
    return {
      messages,
      notificationIndices
    };
  }
  /**
   * Search highest, most recent audit messages for all jobs for the last 24hrs.
   * @param jobIds
   */


  async function getAuditMessagesSummary(jobIds) {
    // TODO This is the current default value of the cluster setting `search.max_buckets`.
    // This should possibly consider the real settings in a future update.
    const maxBuckets = 10000;
    const levelsPerJobAggSize = Array.isArray(jobIds) && jobIds.length > 0 ? jobIds.length : maxBuckets;
    const query = {
      bool: {
        filter: [{
          range: {
            timestamp: {
              gte: 'now-1d'
            }
          }
        }, anomalyDetectorTypeFilter, ...(Array.isArray(jobIds) && jobIds.length > 0 ? [{
          terms: {
            job_id: jobIds
          }
        }] : [])],
        must_not: {
          term: {
            cleared: true
          }
        }
      }
    };
    const {
      body
    } = await asInternalUser.search({
      index: _index_patterns.ML_NOTIFICATION_INDEX_PATTERN,
      ignore_unavailable: true,
      size: 0,
      body: {
        query,
        aggs: {
          levelsPerJob: {
            terms: {
              field: 'job_id',
              size: levelsPerJobAggSize
            },
            aggs: {
              levels: {
                terms: {
                  field: 'level'
                },
                aggs: {
                  latestMessage: {
                    terms: {
                      field: 'message.raw',
                      size: 1,
                      order: {
                        latestMessage: 'desc'
                      }
                    },
                    aggs: {
                      latestMessage: {
                        max: {
                          field: 'timestamp'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    let messagesPerJob = [];
    const jobMessages = [];
    const bodyAgg = body.aggregations;

    if (body.hits.total.value > 0 && bodyAgg && bodyAgg.levelsPerJob && bodyAgg.levelsPerJob.buckets && bodyAgg.levelsPerJob.buckets.length) {
      messagesPerJob = bodyAgg.levelsPerJob.buckets;
    }

    messagesPerJob.forEach(job => {
      // ignore system messages (id==='')
      if (job.key !== '' && job.levels && job.levels.buckets && job.levels.buckets.length) {
        let highestLevel = 0;
        let highestLevelText = '';
        let msgTime = 0;
        job.levels.buckets.forEach(level => {
          const label = level.key; // note the highest message level

          if (LEVEL[label] > highestLevel) {
            highestLevel = LEVEL[label];

            if (level.latestMessage && level.latestMessage.buckets && level.latestMessage.buckets.length) {
              level.latestMessage.buckets.forEach(msg => {
                // there should only be one result here.
                highestLevelText = msg.key; // note the time in ms for the highest level
                // so we can filter them out later if they're earlier than the
                // job's create time.

                if (msg.latestMessage && msg.latestMessage.value_as_string) {
                  const time = (0, _moment.default)(msg.latestMessage.value_as_string);
                  msgTime = time.valueOf();
                }
              });
            }
          }
        });

        if (msgTime !== 0 && highestLevel !== 0) {
          jobMessages.push({
            job_id: job.key,
            highestLevelText,
            highestLevel: levelToText(highestLevel),
            msgTime
          });
        }
      }
    });
    return jobMessages;
  }

  const clearedTime = new Date().getTime(); // Sets 'cleared' to true for messages in the last 24hrs and index new message for clear action

  async function clearJobAuditMessages(jobId, notificationIndices) {
    const newClearedMessage = {
      job_id: jobId,
      job_type: 'anomaly_detection',
      level: _message_levels.MESSAGE_LEVEL.INFO,
      message: 'Cleared set to true for messages in the last 24hrs.',
      timestamp: clearedTime
    };
    const query = {
      bool: {
        filter: [{
          range: {
            timestamp: {
              gte: 'now-24h'
            }
          }
        }, {
          term: {
            job_id: jobId
          }
        }]
      }
    };
    const promises = [asInternalUser.updateByQuery({
      index: notificationIndices.join(','),
      ignore_unavailable: true,
      refresh: false,
      conflicts: 'proceed',
      body: {
        query,
        script: {
          source: 'ctx._source.cleared = true',
          lang: 'painless'
        }
      }
    }), ...notificationIndices.map(index => asInternalUser.index({
      index,
      body: newClearedMessage,
      refresh: 'wait_for'
    }))];
    await Promise.all(promises);
    return {
      success: true,
      last_cleared: clearedTime
    };
  }

  function levelToText(level) {
    return Object.keys(LEVEL)[Object.values(LEVEL).indexOf(level)];
  }
  /**
   * Retrieve list of errors per job.
   * @param jobIds
   */


  async function getJobsErrorMessages(jobIds, earliestMs) {
    const {
      body
    } = await asInternalUser.search({
      index: _index_patterns.ML_NOTIFICATION_INDEX_PATTERN,
      ignore_unavailable: true,
      size: 0,
      body: {
        query: {
          bool: {
            filter: [...(earliestMs ? [{
              range: {
                timestamp: {
                  gte: earliestMs
                }
              }
            }] : []), {
              terms: {
                job_id: jobIds
              }
            }, {
              term: {
                level: {
                  value: _message_levels.MESSAGE_LEVEL.ERROR
                }
              }
            }]
          }
        },
        aggs: {
          by_job: {
            terms: {
              field: 'job_id',
              size: jobIds.length
            },
            aggs: {
              latest_errors: {
                top_hits: {
                  size: 10,
                  sort: [{
                    timestamp: {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          }
        }
      }
    });
    const errors = body.aggregations.by_job;
    return errors.buckets.map(bucket => {
      return {
        job_id: bucket.key,
        errors: bucket.latest_errors.hits.hits.map(v => v._source)
      };
    });
  }

  return {
    getJobAuditMessages,
    getAuditMessagesSummary,
    clearJobAuditMessages,
    getJobsErrorMessages
  };
}