"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportingStore = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require("../");

var _constants = require("../../../common/constants");

var _2 = require("./");

var _ilm_policy_manager = require("./ilm_policy_manager");

var _index_timestamp = require("./index_timestamp");

var _mapping = require("./mapping");

var _report = require("./report");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * When searching for long-pending reports, we get a subset of fields
 */


const sourceDoc = doc => {
  return { ...doc,
    migration_version: _report.MIGRATION_VERSION
  };
};

const jobDebugMessage = report => `${report._id} ` + `[_index: ${report._index}] ` + `[_seq_no: ${report._seq_no}]  ` + `[_primary_term: ${report._primary_term}]` + `[attempts: ${report.attempts}] ` + `[process_expiration: ${report.process_expiration}]`;
/*
 * A class to give an interface to historical reports in the reporting.index
 * - track the state: pending, processing, completed, etc
 * - handle updates and deletes to the reporting document
 * - interface for downloading the report
 */


class ReportingStore {
  // config setting of index prefix in system index name
  // config setting of index prefix: how often to poll for pending work
  constructor(reportingCore, logger) {
    (0, _defineProperty2.default)(this, "indexPrefix", void 0);
    (0, _defineProperty2.default)(this, "indexInterval", void 0);
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "ilmPolicyManager", void 0);
    this.reportingCore = reportingCore;
    this.logger = logger;
    const config = reportingCore.getConfig();
    this.indexPrefix = _constants.REPORTING_SYSTEM_INDEX;
    this.indexInterval = config.get('queue', 'indexInterval');
    this.logger = logger.clone(['store']);
  }

  async getClient() {
    if (!this.client) {
      ({
        asInternalUser: this.client
      } = await this.reportingCore.getEsClient());
    }

    return this.client;
  }

  async getIlmPolicyManager() {
    if (!this.ilmPolicyManager) {
      const client = await this.getClient();
      this.ilmPolicyManager = _ilm_policy_manager.IlmPolicyManager.create({
        client
      });
    }

    return this.ilmPolicyManager;
  }

  async createIndex(indexName) {
    const client = await this.getClient();
    const {
      body: exists
    } = await client.indices.exists({
      index: indexName
    });

    if (exists) {
      return exists;
    }

    try {
      await client.indices.create({
        index: indexName,
        body: {
          settings: {
            number_of_shards: 1,
            auto_expand_replicas: '0-1',
            lifecycle: {
              name: _constants.ILM_POLICY_NAME
            }
          },
          mappings: {
            properties: _mapping.mapping
          }
        }
      });
      return true;
    } catch (error) {
      const isIndexExistsError = error.message.match(/resource_already_exists_exception/);

      if (isIndexExistsError) {
        // Do not fail a job if the job runner hits the race condition.
        this.logger.warn(`Automatic index creation failed: index already exists: ${error}`);
        return;
      }

      this.logger.error(error);
      throw error;
    }
  }
  /*
   * Called from addReport, which handles any errors
   */


  async indexReport(report) {
    const doc = {
      index: report._index,
      id: report._id,
      refresh: true,
      body: { ...report.toReportSource(),
        ...sourceDoc({
          process_expiration: new Date(0).toISOString(),
          attempts: 0,
          status: _.statuses.JOB_STATUS_PENDING
        })
      }
    };
    const client = await this.getClient();
    const {
      body
    } = await client.index(doc);
    return body;
  }
  /*
   * Called from addReport, which handles any errors
   */


  async refreshIndex(index) {
    const client = await this.getClient();
    return client.indices.refresh({
      index
    });
  }
  /**
   * Function to be called during plugin start phase. This ensures the environment is correctly
   * configured for storage of reports.
   */


  async start() {
    const ilmPolicyManager = await this.getIlmPolicyManager();

    try {
      if (await ilmPolicyManager.doesIlmPolicyExist()) {
        this.logger.debug(`Found ILM policy ${_constants.ILM_POLICY_NAME}; skipping creation.`);
        return;
      }

      this.logger.info(`Creating ILM policy for managing reporting indices: ${_constants.ILM_POLICY_NAME}`);
      await ilmPolicyManager.createIlmPolicy();
    } catch (e) {
      var _e$body;

      this.logger.error('Error in start phase');
      this.logger.error((_e$body = e.body) === null || _e$body === void 0 ? void 0 : _e$body.error);
      throw e;
    }
  }

  async addReport(report) {
    let index = report._index;

    if (!index) {
      const timestamp = (0, _index_timestamp.indexTimestamp)(this.indexInterval);
      index = `${this.indexPrefix}-${timestamp}`;
      report._index = index;
    }

    await this.createIndex(index);

    try {
      report.updateWithEsDoc(await this.indexReport(report));
      await this.refreshIndex(index);
      return report;
    } catch (err) {
      this.reportingCore.getEventLogger(report).logError(err);
      this.logError(`Error in adding a report!`, err, report);
      throw err;
    }
  }
  /*
   * Search for a report from task data and return back the report
   */


  async findReportFromTask(taskJson) {
    if (!taskJson.index) {
      throw new Error('Task JSON is missing index field!');
    }

    if (!taskJson.id || !taskJson.index) {
      const notRetrievable = new Error(`Unable to retrieve pending report: Invalid report ID!`);
      this.logger.error(notRetrievable); // for stack trace

      throw notRetrievable;
    }

    try {
      var _document$_source, _document$_source2, _document$_source3, _document$_source4, _document$_source5, _document$_source6, _document$_source7, _document$_source8, _document$_source9, _document$_source10;

      const client = await this.getClient();
      const {
        body: document
      } = await client.get({
        index: taskJson.index,
        id: taskJson.id
      });
      return new _2.SavedReport({
        _id: document._id,
        _index: document._index,
        _seq_no: document._seq_no,
        _primary_term: document._primary_term,
        jobtype: (_document$_source = document._source) === null || _document$_source === void 0 ? void 0 : _document$_source.jobtype,
        attempts: (_document$_source2 = document._source) === null || _document$_source2 === void 0 ? void 0 : _document$_source2.attempts,
        created_at: (_document$_source3 = document._source) === null || _document$_source3 === void 0 ? void 0 : _document$_source3.created_at,
        created_by: (_document$_source4 = document._source) === null || _document$_source4 === void 0 ? void 0 : _document$_source4.created_by,
        max_attempts: (_document$_source5 = document._source) === null || _document$_source5 === void 0 ? void 0 : _document$_source5.max_attempts,
        meta: (_document$_source6 = document._source) === null || _document$_source6 === void 0 ? void 0 : _document$_source6.meta,
        payload: (_document$_source7 = document._source) === null || _document$_source7 === void 0 ? void 0 : _document$_source7.payload,
        process_expiration: (_document$_source8 = document._source) === null || _document$_source8 === void 0 ? void 0 : _document$_source8.process_expiration,
        status: (_document$_source9 = document._source) === null || _document$_source9 === void 0 ? void 0 : _document$_source9.status,
        timeout: (_document$_source10 = document._source) === null || _document$_source10 === void 0 ? void 0 : _document$_source10.timeout
      });
    } catch (err) {
      this.logger.error(`Error in finding the report from the scheduled task info! ` + `[id: ${taskJson.id}] [index: ${taskJson.index}]`);
      this.logger.error(err);
      this.reportingCore.getEventLogger({
        _id: taskJson.id
      }).logError(err);
      throw err;
    }
  }

  async setReportClaimed(report, processingInfo) {
    const doc = sourceDoc({ ...processingInfo,
      status: _.statuses.JOB_STATUS_PROCESSING
    });
    let body;

    try {
      const client = await this.getClient();
      body = (await client.update({
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        refresh: true,
        body: {
          doc
        }
      })).body;
    } catch (err) {
      this.logError(`Error in updating status to processing! Report: ${jobDebugMessage(report)}`, err, report); // prettier-ignore

      throw err;
    }

    this.reportingCore.getEventLogger(report).logClaimTask();
    return body;
  }

  logError(message, err, report) {
    this.logger.error(message);
    this.logger.error(err);
    this.reportingCore.getEventLogger(report).logError(err);
  }

  async setReportFailed(report, failedInfo) {
    const doc = sourceDoc({ ...failedInfo,
      status: _.statuses.JOB_STATUS_FAILED
    });
    let body;

    try {
      const client = await this.getClient();
      body = (await client.update({
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        refresh: true,
        body: {
          doc
        }
      })).body;
    } catch (err) {
      this.logError(`Error in updating status to failed! Report: ${jobDebugMessage(report)}`, err, report); // prettier-ignore

      throw err;
    }

    this.reportingCore.getEventLogger(report).logReportFailure();
    return body;
  }

  async setReportCompleted(report, completedInfo) {
    const {
      output
    } = completedInfo;
    const status = output && output.warnings && output.warnings.length > 0 ? _.statuses.JOB_STATUS_WARNINGS : _.statuses.JOB_STATUS_COMPLETED;
    const doc = sourceDoc({ ...completedInfo,
      status
    });
    let body;

    try {
      const client = await this.getClient();
      body = (await client.update({
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        refresh: true,
        body: {
          doc
        }
      })).body;
    } catch (err) {
      this.logError(`Error in updating status to complete! Report: ${jobDebugMessage(report)}`, err, report); // prettier-ignore

      throw err;
    }

    this.reportingCore.getEventLogger(report).logReportSaved();
    return body;
  }

  async prepareReportForRetry(report) {
    const doc = sourceDoc({
      status: _.statuses.JOB_STATUS_PENDING,
      process_expiration: null
    });
    let body;

    try {
      const client = await this.getClient();
      body = (await client.update({
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        refresh: true,
        body: {
          doc
        }
      })).body;
    } catch (err) {
      this.logError(`Error in clearing expiration and status for retry! Report: ${jobDebugMessage(report)}`, err, report); // prettier-ignore

      throw err;
    }

    return body;
  }
  /*
   * A report needs to be rescheduled when:
   *   1. An older version of Kibana created jobs with ESQueue, and they have
   *   not yet started running.
   *   2. The report process_expiration field is overdue, which happens if the
   *   report runs too long or Kibana restarts during execution
   */


  async findStaleReportJob() {
    var _body$hits;

    const client = await this.getClient();
    const expiredFilter = {
      bool: {
        must: [{
          range: {
            process_expiration: {
              lt: `now`
            }
          }
        }, {
          terms: {
            status: [_.statuses.JOB_STATUS_PROCESSING]
          }
        }]
      }
    };
    const oldVersionFilter = {
      bool: {
        must: [{
          terms: {
            status: [_.statuses.JOB_STATUS_PENDING]
          }
        }],
        must_not: [{
          exists: {
            field: 'migration_version'
          }
        }]
      }
    };
    const {
      body
    } = await client.search({
      size: 1,
      index: this.indexPrefix + '-*',
      seq_no_primary_term: true,
      _source_excludes: ['output'],
      body: {
        sort: {
          created_at: {
            order: 'asc'
          }
        },
        // find the oldest first
        query: {
          bool: {
            filter: {
              bool: {
                should: [expiredFilter, oldVersionFilter]
              }
            }
          }
        }
      }
    });
    return (_body$hits = body.hits) === null || _body$hits === void 0 ? void 0 : _body$hits.hits[0];
  }

  getReportingIndexPattern() {
    return `${this.indexPrefix}-*`;
  }

}

exports.ReportingStore = ReportingStore;