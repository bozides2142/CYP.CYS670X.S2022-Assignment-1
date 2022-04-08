"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUPPORTED_APM_PACKAGE_VERSION = exports.POLICY_ELASTIC_AGENT_ON_CLOUD = exports.ELASTIC_CLOUD_APM_AGENT_POLICY_ID = void 0;
exports.isPrereleaseVersion = isPrereleaseVersion;

var _parse = _interopRequireDefault(require("semver/functions/parse"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const POLICY_ELASTIC_AGENT_ON_CLOUD = 'policy-elastic-agent-on-cloud';
exports.POLICY_ELASTIC_AGENT_ON_CLOUD = POLICY_ELASTIC_AGENT_ON_CLOUD;
const SUPPORTED_APM_PACKAGE_VERSION = '8.1.0';
exports.SUPPORTED_APM_PACKAGE_VERSION = SUPPORTED_APM_PACKAGE_VERSION;

function isPrereleaseVersion(version) {
  var _semverParse$prerelea, _semverParse, _semverParse$prerelea2;

  return (_semverParse$prerelea = (_semverParse = (0, _parse.default)(version)) === null || _semverParse === void 0 ? void 0 : (_semverParse$prerelea2 = _semverParse.prerelease) === null || _semverParse$prerelea2 === void 0 ? void 0 : _semverParse$prerelea2.length) !== null && _semverParse$prerelea !== void 0 ? _semverParse$prerelea : 0 > 0;
}

const ELASTIC_CLOUD_APM_AGENT_POLICY_ID = 'elastic-cloud-apm';
exports.ELASTIC_CLOUD_APM_AGENT_POLICY_ID = ELASTIC_CLOUD_APM_AGENT_POLICY_ID;