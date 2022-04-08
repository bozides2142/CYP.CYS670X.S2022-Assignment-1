"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkParamsVersion = checkParamsVersion;

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function checkParamsVersion(jobParams, logger) {
  if (jobParams.version) {
    logger.debug(`Using reporting job params v${jobParams.version}`);
    return jobParams.version;
  }

  logger.warning(`No version provided in report job params. Assuming ${_constants.UNVERSIONED_VERSION}`);
  return _constants.UNVERSIONED_VERSION;
}