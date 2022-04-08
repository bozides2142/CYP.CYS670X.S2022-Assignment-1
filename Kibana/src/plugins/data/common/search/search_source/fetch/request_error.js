"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestFailure = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _common = require("../../../../../kibana_utils/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Request Failure - When an entire multi request fails
 * @param {Error} err - the Error that came back
 * @param {Object} resp - optional HTTP response
 */
class RequestFailure extends _common.KbnError {
  constructor(err = null, resp) {
    super(`Request to Elasticsearch failed: ${JSON.stringify((resp === null || resp === void 0 ? void 0 : resp.rawResponse) || (err === null || err === void 0 ? void 0 : err.message))}`);
    (0, _defineProperty2.default)(this, "resp", void 0);
    this.resp = resp;
  }

}

exports.RequestFailure = RequestFailure;