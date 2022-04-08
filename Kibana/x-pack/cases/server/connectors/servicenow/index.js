"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNowSIRCaseConnector = exports.getServiceNowITSMCaseConnector = void 0;

var _itsm_mapping = require("./itsm_mapping");

var _itsm_format = require("./itsm_format");

var _sir_mapping = require("./sir_mapping");

var _sir_format = require("./sir_format");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getServiceNowITSMCaseConnector = () => ({
  getMapping: _itsm_mapping.getMapping,
  format: _itsm_format.format
});

exports.getServiceNowITSMCaseConnector = getServiceNowITSMCaseConnector;

const getServiceNowSIRCaseConnector = () => ({
  getMapping: _sir_mapping.getMapping,
  format: _sir_format.format
});

exports.getServiceNowSIRCaseConnector = getServiceNowSIRCaseConnector;