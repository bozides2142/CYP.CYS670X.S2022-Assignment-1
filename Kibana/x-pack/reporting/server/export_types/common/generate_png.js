"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePngObservable = generatePngObservable;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _operators = require("rxjs/operators");

var _common = require("../../../../screenshotting/common");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function generatePngObservable(reporting, logger, options) {
  const apmTrans = _elasticApmNode.default.startTransaction('generate-png', _constants.REPORTING_TRANSACTION_TYPE);

  const apmLayout = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('create-layout', 'setup');

  if (!options.layout.dimensions) {
    throw new Error(`LayoutParams.Dimensions is undefined.`);
  }

  const layout = {
    id: _common.LayoutTypes.PRESERVE_LAYOUT,
    ...options.layout
  };
  apmLayout === null || apmLayout === void 0 ? void 0 : apmLayout.end();
  const apmScreenshots = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('screenshots-pipeline', 'setup');
  let apmBuffer;
  return reporting.getScreenshots({ ...options,
    layout
  }).pipe((0, _operators.tap)(({
    metrics$
  }) => {
    var _apmTrans$startSpan;

    metrics$.subscribe(({
      cpu,
      memory
    }) => {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('cpu', cpu, false);
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('memory', memory, false);
    });
    apmScreenshots === null || apmScreenshots === void 0 ? void 0 : apmScreenshots.end();
    apmBuffer = (_apmTrans$startSpan = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get-buffer', 'output')) !== null && _apmTrans$startSpan !== void 0 ? _apmTrans$startSpan : null;
  }), (0, _operators.map)(({
    results
  }) => ({
    buffer: results[0].screenshots[0].data,
    warnings: results.reduce((found, current) => {
      if (current.error) {
        found.push(current.error.message);
      }

      if (current.renderErrors) {
        found.push(...current.renderErrors);
      }

      return found;
    }, [])
  })), (0, _operators.tap)(({
    buffer
  }) => {
    logger.debug(`PNG buffer byte length: ${buffer.byteLength}`);
    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('byte-length', buffer.byteLength, false);
  }), (0, _operators.finalize)(() => {
    var _apmBuffer;

    (_apmBuffer = apmBuffer) === null || _apmBuffer === void 0 ? void 0 : _apmBuffer.end();
    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.end();
  }));
}