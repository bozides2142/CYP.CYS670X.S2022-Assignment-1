"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraMetricsDomain = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class InfraMetricsDomain {
  constructor(adapter) {
    (0, _defineProperty2.default)(this, "adapter", void 0);
    this.adapter = adapter;
  }

  async getMetrics(requestContext, options, rawRequest) {
    return await this.adapter.getMetrics(requestContext, options, rawRequest);
  }

}

exports.InfraMetricsDomain = InfraMetricsDomain;