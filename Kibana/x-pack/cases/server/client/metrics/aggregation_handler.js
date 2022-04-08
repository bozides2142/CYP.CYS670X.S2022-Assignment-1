"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggregationHandler = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _base_handler = require("./base_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AggregationHandler extends _base_handler.BaseHandler {
  constructor(options, aggregations) {
    super(options);
    (0, _defineProperty2.default)(this, "aggregationBuilders", []);
    this.aggregations = aggregations;
  }

  getFeatures() {
    return new Set(this.aggregations.keys());
  }

  setupFeature(feature) {
    const aggregation = this.aggregations.get(feature);

    if (aggregation) {
      this.aggregationBuilders.push(aggregation);
    }
  }

}

exports.AggregationHandler = AggregationHandler;