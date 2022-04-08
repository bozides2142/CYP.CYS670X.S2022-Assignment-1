"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Report = exports.MIGRATION_VERSION = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _puid = _interopRequireDefault(require("puid"));

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const puid = new _puid.default();
const MIGRATION_VERSION = '7.14.0';
/*
 * Class for an ephemeral report document: possibly is not saved in Elasticsearch
 */

exports.MIGRATION_VERSION = MIGRATION_VERSION;

class Report {
  // set by ES
  // set by ES
  // fields with undefined values exist in report jobs that have not been claimed

  /*
   * Create an unsaved report
   * Index string is required
   */
  constructor(opts) {
    (0, _defineProperty2.default)(this, "_index", void 0);
    (0, _defineProperty2.default)(this, "_id", void 0);
    (0, _defineProperty2.default)(this, "_primary_term", void 0);
    (0, _defineProperty2.default)(this, "_seq_no", void 0);
    (0, _defineProperty2.default)(this, "jobtype", void 0);
    (0, _defineProperty2.default)(this, "created_at", void 0);
    (0, _defineProperty2.default)(this, "created_by", void 0);
    (0, _defineProperty2.default)(this, "payload", void 0);
    (0, _defineProperty2.default)(this, "meta", void 0);
    (0, _defineProperty2.default)(this, "status", void 0);
    (0, _defineProperty2.default)(this, "attempts", void 0);
    (0, _defineProperty2.default)(this, "kibana_name", void 0);
    (0, _defineProperty2.default)(this, "kibana_id", void 0);
    (0, _defineProperty2.default)(this, "output", void 0);
    (0, _defineProperty2.default)(this, "started_at", void 0);
    (0, _defineProperty2.default)(this, "completed_at", void 0);
    (0, _defineProperty2.default)(this, "timeout", void 0);
    (0, _defineProperty2.default)(this, "max_attempts", void 0);
    (0, _defineProperty2.default)(this, "process_expiration", void 0);
    (0, _defineProperty2.default)(this, "migration_version", void 0);
    this._id = opts._id != null ? opts._id : puid.generate();
    this._index = opts._index;
    this._primary_term = opts._primary_term;
    this._seq_no = opts._seq_no;
    this.migration_version = MIGRATION_VERSION; // see RequestHandler.enqueueJob for all the fields that are expected to exist when adding a report

    if (opts.jobtype == null) {
      throw new Error(`jobtype is expected!`);
    }

    if (opts.payload == null) {
      throw new Error(`payload is expected!`);
    }

    this.payload = opts.payload;
    this.kibana_id = opts.kibana_id;
    this.kibana_name = opts.kibana_name;
    this.jobtype = opts.jobtype;
    this.max_attempts = opts.max_attempts;
    this.attempts = opts.attempts || 0;
    this.timeout = opts.timeout;
    this.process_expiration = opts.process_expiration;
    this.started_at = opts.started_at;
    this.completed_at = opts.completed_at;
    this.created_at = opts.created_at || _moment.default.utc().toISOString();
    this.created_by = opts.created_by || false;
    this.meta = opts.meta || {
      objectType: 'unknown'
    };
    this.status = opts.status || _constants.JOB_STATUSES.PENDING;
    this.output = opts.output || null;
  }
  /*
   * Update the report with "live" storage metadata
   */


  updateWithEsDoc(doc) {
    if (doc._index == null || doc._id == null) {
      throw new Error(`Report object from ES has missing fields!`);
    }

    this._id = doc._id;
    this._index = doc._index;
    this._primary_term = doc._primary_term;
    this._seq_no = doc._seq_no;
    this.migration_version = MIGRATION_VERSION;
  }
  /*
   * Data structure for writing to Elasticsearch index
   */


  toReportSource() {
    return {
      migration_version: MIGRATION_VERSION,
      kibana_name: this.kibana_name,
      kibana_id: this.kibana_id,
      jobtype: this.jobtype,
      created_at: this.created_at,
      created_by: this.created_by,
      payload: this.payload,
      meta: this.meta,
      timeout: this.timeout,
      max_attempts: this.max_attempts,
      status: this.status,
      attempts: this.attempts,
      started_at: this.started_at,
      completed_at: this.completed_at,
      process_expiration: this.process_expiration,
      output: this.output || null
    };
  }
  /*
   * Parameters to save in a task instance
   */


  toReportTaskJSON() {
    if (!this._index) {
      throw new Error(`Task is missing the _index field!`);
    }

    return {
      id: this._id,
      index: this._index,
      jobtype: this.jobtype,
      created_at: this.created_at,
      created_by: this.created_by,
      payload: this.payload,
      meta: this.meta,
      attempts: this.attempts
    };
  }
  /*
   * Data structure for API responses
   */


  toApiJSON() {
    return {
      id: this._id,
      index: this._index,
      kibana_name: this.kibana_name,
      kibana_id: this.kibana_id,
      jobtype: this.jobtype,
      created_at: this.created_at,
      created_by: this.created_by,
      meta: this.meta,
      timeout: this.timeout,
      max_attempts: this.max_attempts,
      status: this.status,
      attempts: this.attempts,
      started_at: this.started_at,
      completed_at: this.completed_at,
      migration_version: this.migration_version,
      payload: (0, _lodash.omit)(this.payload, 'headers'),
      output: (0, _lodash.omit)(this.output, 'content')
    };
  }

}

exports.Report = Report;