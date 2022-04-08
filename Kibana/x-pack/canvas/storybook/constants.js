"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KIBANA_ROOT = void 0;

var _path = _interopRequireDefault(require("path"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const KIBANA_ROOT = _path.default.resolve(__dirname, '../../../..');

exports.KIBANA_ROOT = KIBANA_ROOT;