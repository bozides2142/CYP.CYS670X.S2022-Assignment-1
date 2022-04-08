"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.testRunner = testRunner;

var _cypress = _interopRequireDefault(require("cypress"));

var _cypress_start = require("./cypress_start");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function ftrConfigOpen({
  readConfigFile
}) {
  const kibanaConfig = await readConfigFile(require.resolve('./ftr_config.ts'));
  return { ...kibanaConfig.getAll(),
    testRunner
  };
}

async function testRunner({
  getService
}) {
  await (0, _cypress_start.cypressStart)(getService, _cypress.default.open);
} // eslint-disable-next-line import/no-default-export


var _default = ftrConfigOpen;
exports.default = _default;