"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoSearchIdInSessionError = void 0;

var _common = require("../../../../kibana_utils/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class NoSearchIdInSessionError extends _common.KbnError {
  constructor() {
    super('No search ID in this session matching the given search request');
  }

}

exports.NoSearchIdInSessionError = NoSearchIdInSessionError;