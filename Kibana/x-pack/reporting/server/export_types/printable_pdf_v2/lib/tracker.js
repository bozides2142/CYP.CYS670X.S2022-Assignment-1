"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTracker = getTracker;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SPANTYPE_SETUP = 'setup';
const SPANTYPE_OUTPUT = 'output';

function getTracker() {
  const apmTrans = _elasticApmNode.default.startTransaction('generate-pdf', _constants.REPORTING_TRANSACTION_TYPE);

  let apmScreenshots = null;
  let apmSetup = null;
  let apmAddImage = null;
  let apmCompilePdf = null;
  let apmGetBuffer = null;
  return {
    startScreenshots() {
      apmScreenshots = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('screenshots-pipeline', SPANTYPE_SETUP)) || null;
    },

    endScreenshots() {
      if (apmScreenshots) apmScreenshots.end();
    },

    startSetup() {
      apmSetup = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('setup-pdf', SPANTYPE_SETUP)) || null;
    },

    endSetup() {
      if (apmSetup) apmSetup.end();
    },

    startAddImage() {
      apmAddImage = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('add-pdf-image', SPANTYPE_OUTPUT)) || null;
    },

    endAddImage() {
      if (apmAddImage) apmAddImage.end();
    },

    startCompile() {
      apmCompilePdf = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('compile-pdf', SPANTYPE_OUTPUT)) || null;
    },

    endCompile() {
      if (apmCompilePdf) apmCompilePdf.end();
    },

    startGetBuffer() {
      apmGetBuffer = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get-buffer', SPANTYPE_OUTPUT)) || null;
    },

    endGetBuffer() {
      if (apmGetBuffer) apmGetBuffer.end();
    },

    setByteLength(byteLength) {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('byte-length', byteLength, false);
    },

    setCpuUsage(cpu) {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('cpu', cpu, false);
    },

    setMemoryUsage(memory) {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('memory', memory, false);
    },

    end() {
      if (apmTrans) apmTrans.end();
    }

  };
}