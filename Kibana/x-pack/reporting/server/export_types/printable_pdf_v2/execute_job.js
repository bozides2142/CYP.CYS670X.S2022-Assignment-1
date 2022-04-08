"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _constants = require("../../../common/constants");

var _common = require("../common");

var _generate_pdf = require("./lib/generate_pdf");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runTaskFnFactory = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  const encryptionKey = config.get('encryptionKey');
  return async function runTask(jobId, job, cancellationToken, stream) {
    const jobLogger = parentLogger.clone([_constants.PDF_JOB_TYPE_V2, 'execute-job', jobId]);

    const apmTrans = _elasticApmNode.default.startTransaction('execute-job-pdf-v2', _constants.REPORTING_TRANSACTION_TYPE);

    const apmGetAssets = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get-assets', 'setup');
    let apmGeneratePdf;
    const process$ = Rx.of(1).pipe((0, _operators.mergeMap)(() => (0, _common.decryptJobHeaders)(encryptionKey, job.headers, jobLogger)), (0, _operators.map)(decryptedHeaders => (0, _common.omitBlockedHeaders)(decryptedHeaders)), (0, _operators.map)(filteredHeaders => (0, _common.getConditionalHeaders)(config, filteredHeaders)), (0, _operators.mergeMap)(conditionalHeaders => (0, _common.getCustomLogo)(reporting, conditionalHeaders, job.spaceId, jobLogger)), (0, _operators.mergeMap)(({
      logo,
      conditionalHeaders
    }) => {
      const {
        browserTimezone,
        layout,
        title,
        locatorParams
      } = job;
      apmGetAssets === null || apmGetAssets === void 0 ? void 0 : apmGetAssets.end();
      apmGeneratePdf = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('generate-pdf-pipeline', 'execute');
      return (0, _generate_pdf.generatePdfObservable)(reporting, jobLogger, job, title, locatorParams, {
        browserTimezone,
        conditionalHeaders,
        layout
      }, logo);
    }), (0, _operators.tap)(({
      buffer,
      warnings
    }) => {
      var _apmGeneratePdf;

      (_apmGeneratePdf = apmGeneratePdf) === null || _apmGeneratePdf === void 0 ? void 0 : _apmGeneratePdf.end();

      if (buffer) {
        stream.write(buffer);
      }
    }), (0, _operators.map)(({
      warnings
    }) => ({
      content_type: 'application/pdf',
      warnings
    })), (0, _operators.catchError)(err => {
      jobLogger.error(err);
      return Rx.throwError(err);
    }));
    const stop$ = Rx.fromEventPattern(cancellationToken.on);
    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.end();
    return process$.pipe((0, _operators.takeUntil)(stop$)).toPromise();
  };
};

exports.runTaskFnFactory = runTaskFnFactory;