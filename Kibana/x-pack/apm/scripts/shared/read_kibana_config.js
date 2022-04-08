"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readKibanaConfig = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readKibanaConfig = () => {
  const kibanaConfigDir = _path.default.join(__filename, '../../../../../../config');

  const kibanaDevConfig = _path.default.join(kibanaConfigDir, 'kibana.dev.yml');

  const kibanaConfig = _path.default.join(kibanaConfigDir, 'kibana.yml');

  const loadedKibanaConfig = _jsYaml.default.safeLoad(_fs.default.readFileSync(_fs.default.existsSync(kibanaDevConfig) ? kibanaDevConfig : kibanaConfig, 'utf8')) || {};
  const cliEsCredentials = (0, _lodash.pickBy)({
    'elasticsearch.username': process.env.ELASTICSEARCH_USERNAME,
    'elasticsearch.password': process.env.ELASTICSEARCH_PASSWORD,
    'elasticsearch.hosts': process.env.ELASTICSEARCH_HOST
  }, _lodash.identity);
  return {
    'xpack.apm.indices.transaction': 'traces-apm*,apm-*',
    'xpack.apm.indices.metric': 'metrics-apm*,apm-*',
    'xpack.apm.indices.error': 'logs-apm*,apm-*',
    'xpack.apm.indices.span': 'traces-apm*,apm-*',
    'xpack.apm.indices.onboarding': 'apm-*',
    'xpack.apm.indices.sourcemap': 'apm-*',
    'elasticsearch.hosts': 'http://localhost:9200',
    ...loadedKibanaConfig,
    ...cliEsCredentials
  };
};

exports.readKibanaConfig = readKibanaConfig;