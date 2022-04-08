"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeDependencies = void 0;

var _shared_imports = require("../../shared_imports");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const routeDependencies = {
  config: {
    isSecurityEnabled: jest.fn().mockReturnValue(true)
  },
  indexDataEnricher: new _services.IndexDataEnricher(),
  lib: {
    handleEsError: _shared_imports.handleEsError
  }
};
exports.routeDependencies = routeDependencies;