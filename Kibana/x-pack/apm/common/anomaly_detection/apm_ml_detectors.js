"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApmMlDetectorType = void 0;
exports.getApmMlDetectorIndex = getApmMlDetectorIndex;
exports.getApmMlDetectorType = getApmMlDetectorType;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ApmMlDetectorType;
exports.ApmMlDetectorType = ApmMlDetectorType;

(function (ApmMlDetectorType) {
  ApmMlDetectorType["txLatency"] = "txLatency";
  ApmMlDetectorType["txThroughput"] = "txThroughput";
  ApmMlDetectorType["txFailureRate"] = "txFailureRate";
})(ApmMlDetectorType || (exports.ApmMlDetectorType = ApmMlDetectorType = {}));

const detectorIndices = {
  [ApmMlDetectorType.txLatency]: 0,
  [ApmMlDetectorType.txThroughput]: 1,
  [ApmMlDetectorType.txFailureRate]: 2
};

function getApmMlDetectorIndex(type) {
  return detectorIndices[type];
}

function getApmMlDetectorType(detectorIndex) {
  let type;

  for (type in detectorIndices) {
    if (detectorIndices[type] === detectorIndex) {
      return type;
    }
  }

  throw new Error('Could not map detector index to type');
}