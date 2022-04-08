"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERIFICATION_CODE_LENGTH = exports.ERROR_PING_FAILURE = exports.ERROR_OUTSIDE_PREBOOT_STAGE = exports.ERROR_KIBANA_CONFIG_NOT_WRITABLE = exports.ERROR_KIBANA_CONFIG_FAILURE = exports.ERROR_ENROLL_FAILURE = exports.ERROR_ELASTICSEARCH_CONNECTION_CONFIGURED = exports.ERROR_CONFIGURE_FAILURE = exports.ERROR_COMPATIBILITY_FAILURE = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const VERIFICATION_CODE_LENGTH = 6;
exports.VERIFICATION_CODE_LENGTH = VERIFICATION_CODE_LENGTH;
const ERROR_OUTSIDE_PREBOOT_STAGE = 'outside_preboot_stage';
exports.ERROR_OUTSIDE_PREBOOT_STAGE = ERROR_OUTSIDE_PREBOOT_STAGE;
const ERROR_ELASTICSEARCH_CONNECTION_CONFIGURED = 'elasticsearch_connection_configured';
exports.ERROR_ELASTICSEARCH_CONNECTION_CONFIGURED = ERROR_ELASTICSEARCH_CONNECTION_CONFIGURED;
const ERROR_KIBANA_CONFIG_NOT_WRITABLE = 'kibana_config_not_writable';
exports.ERROR_KIBANA_CONFIG_NOT_WRITABLE = ERROR_KIBANA_CONFIG_NOT_WRITABLE;
const ERROR_KIBANA_CONFIG_FAILURE = 'kibana_config_failure';
exports.ERROR_KIBANA_CONFIG_FAILURE = ERROR_KIBANA_CONFIG_FAILURE;
const ERROR_ENROLL_FAILURE = 'enroll_failure';
exports.ERROR_ENROLL_FAILURE = ERROR_ENROLL_FAILURE;
const ERROR_CONFIGURE_FAILURE = 'configure_failure';
exports.ERROR_CONFIGURE_FAILURE = ERROR_CONFIGURE_FAILURE;
const ERROR_PING_FAILURE = 'ping_failure';
exports.ERROR_PING_FAILURE = ERROR_PING_FAILURE;
const ERROR_COMPATIBILITY_FAILURE = 'compatibility_failure';
exports.ERROR_COMPATIBILITY_FAILURE = ERROR_COMPATIBILITY_FAILURE;