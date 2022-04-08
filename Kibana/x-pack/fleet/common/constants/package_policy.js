"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PACKAGE_POLICY_SAVED_OBJECT_TYPE = exports.PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PACKAGE_POLICY_SAVED_OBJECT_TYPE = 'ingest-package-policies';
exports.PACKAGE_POLICY_SAVED_OBJECT_TYPE = PACKAGE_POLICY_SAVED_OBJECT_TYPE;
const PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES = ['auto_configure', 'create_doc'];
exports.PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES = PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES;