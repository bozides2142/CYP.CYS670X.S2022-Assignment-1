"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestResponder = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * An API to specify information about a specific request that will be logged.
 * Create a new instance to log a request using {@link RequestAdapter#start}.
 */
class RequestResponder {
  constructor(request, onChange) {
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "onChange", void 0);
    this.request = request;
    this.onChange = onChange;
  }

  json(reqJson) {
    this.request.json = reqJson;
    this.onChange();
    return this;
  }

  stats(stats) {
    this.request.stats = { ...(this.request.stats || {}),
      ...stats
    };
    const startDate = new Date(this.request.startTime);
    this.request.stats.requestTimestamp = {
      label: _i18n.i18n.translate('inspector.reqTimestampKey', {
        defaultMessage: 'Request timestamp'
      }),
      value: startDate.toISOString(),
      description: _i18n.i18n.translate('inspector.reqTimestampDescription', {
        defaultMessage: 'Time when the start of the request has been logged'
      })
    };
    this.onChange();
    return this;
  }

  finish(status, response) {
    var _response$time;

    this.request.time = (_response$time = response.time) !== null && _response$time !== void 0 ? _response$time : Date.now() - this.request.startTime;
    this.request.status = status;
    this.request.response = response;
    this.onChange();
  }

  ok(response) {
    this.finish(_types.RequestStatus.OK, response);
  }

  error(response) {
    this.finish(_types.RequestStatus.ERROR, response);
  }

}

exports.RequestResponder = RequestResponder;