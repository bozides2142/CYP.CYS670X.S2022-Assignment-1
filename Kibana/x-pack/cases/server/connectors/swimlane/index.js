"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCaseConnector = void 0;

var _mapping = require("./mapping");

var _format = require("./format");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCaseConnector = () => ({
  getMapping: _mapping.getMapping,
  format: _format.format
});

exports.getCaseConnector = getCaseConnector;