"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmMlJobsQuery = apmMlJobsQuery;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function apmMlJobsQuery(jobs) {
  if (!jobs.length) {
    throw new Error('At least one ML job should be given');
  }

  return [{
    terms: {
      job_id: jobs.map(job => job.jobId)
    }
  }];
}