"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALIDATION_STATUS = exports.TRAINING_DOCS_UPPER = exports.TRAINING_DOCS_LOWER = exports.SKIP_BUCKET_SPAN_ESTIMATION = exports.NUM_CATEGORIES_THRESHOLD = exports.MINIMUM_NUM_FIELD_FOR_CHECK = exports.JOB_ID_MAX_LENGTH = exports.INCLUDED_FIELDS_THRESHOLD = exports.FRACTION_EMPTY_LIMIT = exports.ALL_CATEGORIES = exports.ALLOWED_DATA_UNITS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let VALIDATION_STATUS;
exports.VALIDATION_STATUS = VALIDATION_STATUS;

(function (VALIDATION_STATUS) {
  VALIDATION_STATUS["ERROR"] = "error";
  VALIDATION_STATUS["INFO"] = "info";
  VALIDATION_STATUS["SUCCESS"] = "success";
  VALIDATION_STATUS["WARNING"] = "warning";
})(VALIDATION_STATUS || (exports.VALIDATION_STATUS = VALIDATION_STATUS = {}));

const SKIP_BUCKET_SPAN_ESTIMATION = true;
exports.SKIP_BUCKET_SPAN_ESTIMATION = SKIP_BUCKET_SPAN_ESTIMATION;
const ALLOWED_DATA_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
exports.ALLOWED_DATA_UNITS = ALLOWED_DATA_UNITS;
const JOB_ID_MAX_LENGTH = 64; // Data Frame Analytics

exports.JOB_ID_MAX_LENGTH = JOB_ID_MAX_LENGTH;
const TRAINING_DOCS_UPPER = 200000;
exports.TRAINING_DOCS_UPPER = TRAINING_DOCS_UPPER;
const TRAINING_DOCS_LOWER = 200;
exports.TRAINING_DOCS_LOWER = TRAINING_DOCS_LOWER;
const INCLUDED_FIELDS_THRESHOLD = 100;
exports.INCLUDED_FIELDS_THRESHOLD = INCLUDED_FIELDS_THRESHOLD;
const MINIMUM_NUM_FIELD_FOR_CHECK = 25;
exports.MINIMUM_NUM_FIELD_FOR_CHECK = MINIMUM_NUM_FIELD_FOR_CHECK;
const FRACTION_EMPTY_LIMIT = 0.3;
exports.FRACTION_EMPTY_LIMIT = FRACTION_EMPTY_LIMIT;
const NUM_CATEGORIES_THRESHOLD = 10;
exports.NUM_CATEGORIES_THRESHOLD = NUM_CATEGORIES_THRESHOLD;
const ALL_CATEGORIES = -1;
exports.ALL_CATEGORIES = ALL_CATEGORIES;