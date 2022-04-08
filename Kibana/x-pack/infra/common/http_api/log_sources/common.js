"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogSourceConfigurationPath = exports.LOG_SOURCE_CONFIGURATION_PATH_PREFIX = exports.LOG_SOURCE_CONFIGURATION_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const LOG_SOURCE_CONFIGURATION_PATH_PREFIX = '/api/infra/log_source_configurations';
exports.LOG_SOURCE_CONFIGURATION_PATH_PREFIX = LOG_SOURCE_CONFIGURATION_PATH_PREFIX;
const LOG_SOURCE_CONFIGURATION_PATH = `${LOG_SOURCE_CONFIGURATION_PATH_PREFIX}/{sourceId}`;
exports.LOG_SOURCE_CONFIGURATION_PATH = LOG_SOURCE_CONFIGURATION_PATH;

const getLogSourceConfigurationPath = sourceId => `${LOG_SOURCE_CONFIGURATION_PATH_PREFIX}/${sourceId}`;

exports.getLogSourceConfigurationPath = getLogSourceConfigurationPath;