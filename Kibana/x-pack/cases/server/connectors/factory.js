"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.casesConnectors = void 0;

var _api = require("../../common/api");

var _jira = require("./jira");

var _resilient = require("./resilient");

var _servicenow = require("./servicenow");

var _swimlane = require("./swimlane");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mapping = {
  [_api.ConnectorTypes.jira]: (0, _jira.getCaseConnector)(),
  [_api.ConnectorTypes.serviceNowITSM]: (0, _servicenow.getServiceNowITSMCaseConnector)(),
  [_api.ConnectorTypes.serviceNowSIR]: (0, _servicenow.getServiceNowSIRCaseConnector)(),
  [_api.ConnectorTypes.resilient]: (0, _resilient.getCaseConnector)(),
  [_api.ConnectorTypes.swimlane]: (0, _swimlane.getCaseConnector)(),
  [_api.ConnectorTypes.none]: null
};

const isConnectorTypeSupported = type => Object.values(_api.ConnectorTypes).includes(type);

const casesConnectors = {
  get: type => isConnectorTypeSupported(type) ? mapping[type] : undefined
};
exports.casesConnectors = casesConnectors;