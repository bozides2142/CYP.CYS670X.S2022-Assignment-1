"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultRequestParameters = exports.createTimeRangeFilters = exports.createResultTypeFilters = exports.createLogTimeRangeFilters = exports.createJobIdsFilters = exports.createJobIdFilters = exports.createDatasetsFilters = exports.createCategoryIdFilters = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultRequestParameters = {
  allow_no_indices: true,
  ignore_unavailable: true,
  track_scores: false,
  track_total_hits: false
};
exports.defaultRequestParameters = defaultRequestParameters;

const createJobIdFilters = jobId => [{
  term: {
    job_id: {
      value: jobId
    }
  }
}];

exports.createJobIdFilters = createJobIdFilters;

const createJobIdsFilters = jobIds => [{
  terms: {
    job_id: jobIds
  }
}];

exports.createJobIdsFilters = createJobIdsFilters;

const createTimeRangeFilters = (startTime, endTime) => [{
  range: {
    timestamp: {
      gte: startTime,
      lte: endTime,
      format: 'epoch_millis'
    }
  }
}];

exports.createTimeRangeFilters = createTimeRangeFilters;

const createLogTimeRangeFilters = (startTime, endTime) => [{
  range: {
    log_time: {
      gte: startTime,
      lte: endTime
    }
  }
}];

exports.createLogTimeRangeFilters = createLogTimeRangeFilters;

const createResultTypeFilters = resultTypes => [{
  terms: {
    result_type: resultTypes
  }
}];

exports.createResultTypeFilters = createResultTypeFilters;

const createCategoryIdFilters = categoryIds => [{
  terms: {
    category_id: categoryIds
  }
}];

exports.createCategoryIdFilters = createCategoryIdFilters;

const createDatasetsFilters = datasets => datasets && datasets.length > 0 ? [{
  terms: {
    partition_field_value: datasets
  }
}] : [];

exports.createDatasetsFilters = createDatasetsFilters;