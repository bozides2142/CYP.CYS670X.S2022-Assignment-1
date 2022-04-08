"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUB_CASE_SAVED_OBJECT = exports.GENERATED_ALERT = exports.COMMENT_ASSOCIATION_TYPE = exports.CASE_TYPE_INDIVIDUAL = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Before 8.0.0 we had a few types of cases, comments, and other fields that were never actually used, I'm preserving them here for the migrations
 */

const GENERATED_ALERT = 'generated_alert';
exports.GENERATED_ALERT = GENERATED_ALERT;
const COMMENT_ASSOCIATION_TYPE = 'case';
exports.COMMENT_ASSOCIATION_TYPE = COMMENT_ASSOCIATION_TYPE;
const CASE_TYPE_INDIVIDUAL = 'individual';
exports.CASE_TYPE_INDIVIDUAL = CASE_TYPE_INDIVIDUAL;
const SUB_CASE_SAVED_OBJECT = 'cases-sub-case';
exports.SUB_CASE_SAVED_OBJECT = SUB_CASE_SAVED_OBJECT;