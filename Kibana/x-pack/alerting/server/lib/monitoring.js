"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExecutionSuccessRatio = exports.getExecutionDurationPercentiles = void 0;

var _statsLite = _interopRequireDefault(require("stats-lite"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExecutionSuccessRatio = ruleMonitoring => {
  const {
    history
  } = ruleMonitoring.execution;
  return history.filter(({
    success
  }) => success).length / history.length;
};

exports.getExecutionSuccessRatio = getExecutionSuccessRatio;

const getExecutionDurationPercentiles = ruleMonitoring => {
  const durationSamples = ruleMonitoring.execution.history.reduce((duration, history) => {
    if (typeof history.duration === 'number') {
      return [...duration, history.duration];
    }

    return duration;
  }, []);

  if (durationSamples.length) {
    return {
      p50: _statsLite.default.percentile(durationSamples, 0.5),
      p95: _statsLite.default.percentile(durationSamples, 0.95),
      p99: _statsLite.default.percentile(durationSamples, 0.99)
    };
  }

  return {};
};

exports.getExecutionDurationPercentiles = getExecutionDurationPercentiles;