"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateJob = validateJob;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _fields_service = require("../fields_service");

var _messages = require("../../../common/constants/messages");

var _validation = require("../../../common/constants/validation");

var _job_utils = require("../../../common/util/job_utils");

var _validate_bucket_span = require("./validate_bucket_span");

var _validate_cardinality = require("./validate_cardinality");

var _validate_influencers = require("./validate_influencers");

var _validate_datafeed_preview = require("./validate_datafeed_preview");

var _validate_model_memory_limit = require("./validate_model_memory_limit");

var _validate_time_range = require("./validate_time_range");

var _datafeed_utils = require("../../../common/util/datafeed_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error importing js file

/**
 * Validates the job configuration after
 * @kbn/config-schema has checked the payload {@link validateJobSchema}.
 */


async function validateJob(client, mlClient, payload, authHeader, isSecurityDisabled) {
  const messages = (0, _messages.getMessages)();

  try {
    const {
      fields
    } = payload;
    let {
      duration
    } = payload;
    const job = payload.job; // check if basic tests pass the requirements to run the extended tests.
    // if so, run the extended tests and merge the messages.
    // otherwise just return the basic test messages.

    const basicValidation = (0, _job_utils.basicJobValidation)(job, fields, {}, true);
    let validationMessages;

    if (basicValidation.valid === true) {
      var _job$analysis_config; // remove basic success messages from tests
      // where we run additional extended tests.


      const filteredBasicValidationMessages = basicValidation.messages.filter(m => {
        return m.id !== 'bucket_span_valid';
      }); // if no duration was part of the request, fall back to finding out
      // the time range of the time field of the index, but also check first
      // if the time field is a valid field of type 'date' using isValidTimeField()

      if (typeof duration === 'undefined' && (await (0, _validate_time_range.isValidTimeField)(client, job))) {
        const fs = (0, _fields_service.fieldsServiceProvider)(client);
        const index = job.datafeed_config.indices.join(',');
        const timeField = job.data_description.time_field;
        const timeRange = await fs.getTimeFieldRange(index, timeField, job.datafeed_config.query, job.datafeed_config.runtime_mappings, job.datafeed_config.indices_options);
        duration = {
          start: timeRange.start.epoch,
          end: timeRange.end.epoch
        };
      }

      validationMessages = filteredBasicValidationMessages; // next run only the cardinality tests to find out if they trigger an error
      // so we can decide later whether certain additional tests should be run

      const cardinalityMessages = await (0, _validate_cardinality.validateCardinality)(client, job);
      validationMessages.push(...cardinalityMessages);
      const cardinalityError = cardinalityMessages.some(m => {
        return messages[m.id].status === _validation.VALIDATION_STATUS.ERROR;
      });
      validationMessages.push(...(await (0, _validate_bucket_span.validateBucketSpan)(client, job, duration, isSecurityDisabled)));
      validationMessages.push(...(await (0, _validate_time_range.validateTimeRange)(client, job, duration))); // only run the influencer and model memory limit checks
      // if cardinality checks didn't return a message with an error level

      if (cardinalityError === false) {
        validationMessages.push(...(await (0, _validate_influencers.validateInfluencers)(job)));
        validationMessages.push(...(await (0, _validate_model_memory_limit.validateModelMemoryLimit)(client, mlClient, job, duration)));
      } // if datafeed has aggregation, require job config to include a valid summary_doc_field_name


      const datafeedAggregations = (0, _datafeed_utils.getDatafeedAggregations)(job.datafeed_config);

      if (datafeedAggregations !== undefined && !((_job$analysis_config = job.analysis_config) !== null && _job$analysis_config !== void 0 && _job$analysis_config.summary_count_field_name)) {
        validationMessages.push({
          id: 'missing_summary_count_field_name'
        });
      }

      validationMessages.push(...(await (0, _validate_datafeed_preview.validateDatafeedPreviewWithMessages)(mlClient, authHeader, job)));
    } else {
      validationMessages = basicValidation.messages;
      validationMessages.push({
        id: 'skipped_extended_tests'
      });
    }

    return (0, _job_utils.uniqWithIsEqual)(validationMessages);
  } catch (error) {
    throw _boom.default.badRequest(error);
  }
}