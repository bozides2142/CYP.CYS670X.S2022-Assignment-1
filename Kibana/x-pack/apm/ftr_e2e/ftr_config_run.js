"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dockerImage = exports.default = void 0;

var _test = require("@kbn/test");

var _cypress = _interopRequireDefault(require("cypress"));

var _path = _interopRequireDefault(require("path"));

var _cypress_start = require("./cypress_start");

var _ftr_config = require("./ftr_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const dockerImage = 'docker.elastic.co/package-registry/distribution@sha256:c5bf8e058727de72e561b228f4b254a14a6f880e582190d01bd5ff74318e1d0b';
exports.dockerImage = dockerImage;

async function ftrConfigRun({
  readConfigFile
}) {
  const kibanaConfig = await readConfigFile(require.resolve('./ftr_config.ts')); // mount the config file for the package registry

  const dockerArgs = ['-v', `${_path.default.join(_path.default.dirname(__filename), './apis/fixtures/package_registry_config.yml')}:/package-registry/config.yml`];
  return { ...kibanaConfig.getAll(),
    testRunner,
    dockerServers: (0, _test.defineDockerServersConfig)({
      registry: {
        enabled: true,
        image: dockerImage,
        portInContainer: 8080,
        port: _ftr_config.packageRegistryPort,
        args: dockerArgs,
        waitForLogLine: 'package manifests loaded'
      }
    })
  };
}

async function testRunner({
  getService
}) {
  const result = await (0, _cypress_start.cypressStart)(getService, _cypress.default.run);

  if (result && (result.status === 'failed' || result.totalFailed > 0)) {
    throw new Error(`APM Cypress tests failed`);
  }
} // eslint-disable-next-line import/no-default-export


var _default = ftrConfigRun;
exports.default = _default;