"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortImportResponses = void 0;

var _fp = require("lodash/fp");

var _is_import_regular = require("./is_import_regular");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to sort responses into success and error and report on
 * final results
 * @param responses {array}
 * @returns {object} totals of successes and errors
 */


const sortImportResponses = responses => {
  const errorsResp = responses.filter(resp => (0, _fp.has)('error', resp));
  const successes = responses.filter(resp => {
    if ((0, _is_import_regular.isImportRegular)(resp)) {
      return resp.status_code === 200;
    } else {
      return false;
    }
  });
  return {
    errors: errorsResp,
    success: errorsResp.length === 0,
    success_count: successes.length
  };
};

exports.sortImportResponses = sortImportResponses;