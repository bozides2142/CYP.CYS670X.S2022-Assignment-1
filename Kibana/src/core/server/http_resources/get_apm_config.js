"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmConfig = void 0;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _apmConfigLoader = require("@kbn/apm-config-loader");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const OMIT_APM_CONFIG = ['secretToken'];

const getApmConfig = requestPath => {
  const baseConfig = (0, _apmConfigLoader.getConfiguration)('kibana-frontend') || {}; // Omit configs not used by RUM agent.

  OMIT_APM_CONFIG.forEach(config => {
    delete baseConfig[config];
  });

  if (!(0, _apmConfigLoader.shouldInstrumentClient)(baseConfig)) {
    return null;
  }

  const config = { ...baseConfig,
    pageLoadTransactionName: requestPath
  }; // Get current active backend transaction to make distributed tracing
  // work for rendering the app

  const backendTransaction = _elasticApmNode.default.currentTransaction;

  if (backendTransaction) {
    const {
      sampled,
      traceId
    } = backendTransaction;
    return { ...config,
      pageLoadTraceId: traceId,
      pageLoadSampled: sampled,
      pageLoadSpanId: backendTransaction.ensureParentId()
    };
  }

  return config;
};

exports.getApmConfig = getApmConfig;