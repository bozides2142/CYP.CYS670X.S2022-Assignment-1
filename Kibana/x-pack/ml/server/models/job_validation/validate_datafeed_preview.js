"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDatafeedPreview = validateDatafeedPreview;
exports.validateDatafeedPreviewWithMessages = validateDatafeedPreviewWithMessages;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function validateDatafeedPreviewWithMessages(mlClient, authHeader, job) {
  const {
    valid,
    documentsFound
  } = await validateDatafeedPreview(mlClient, authHeader, job);

  if (valid) {
    return documentsFound ? [] : [{
      id: 'datafeed_preview_no_documents'
    }];
  }

  return [{
    id: 'datafeed_preview_failed'
  }];
}

async function validateDatafeedPreview(mlClient, authHeader, job) {
  const {
    datafeed_config: datafeed,
    ...tempJob
  } = job;

  try {
    const {
      body
    } = await mlClient.previewDatafeed({
      body: {
        job_config: tempJob,
        datafeed_config: datafeed
      }
    }, authHeader // previewDatafeed response type is incorrect
    );
    return {
      valid: true,
      documentsFound: Array.isArray(body) && body.length > 0
    };
  } catch (error) {
    var _error$body;

    return {
      valid: false,
      documentsFound: false,
      error: (_error$body = error.body) !== null && _error$body !== void 0 ? _error$body : error
    };
  }
}