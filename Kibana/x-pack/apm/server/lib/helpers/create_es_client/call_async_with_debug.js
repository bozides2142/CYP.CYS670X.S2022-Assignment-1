"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callAsyncWithDebug = callAsyncWithDebug;
exports.getDebugTitle = exports.getDebugBody = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _inspector = require("../../../../../../../src/plugins/inspector");

var _register_apm_server_routes = require("../../../routes/apm_routes/register_apm_server_routes");

var _server = require("../../../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */


function formatObj(obj) {
  return JSON.stringify(obj, null, 2);
}

async function callAsyncWithDebug({
  cb,
  getDebugMessage,
  debug,
  request,
  requestType,
  requestParams,
  operationName,
  isCalledWithInternalUser
}) {
  if (!debug) {
    return cb();
  }

  const hrStartTime = process.hrtime();
  const startTime = Date.now();
  let res;
  let esError = null;
  let esRequestStatus = _inspector.RequestStatus.PENDING;

  try {
    res = await cb();
    esRequestStatus = _inspector.RequestStatus.OK;
  } catch (e) {
    // catch error and throw after outputting debug info
    esError = e;
    esRequestStatus = _inspector.RequestStatus.ERROR;
  }

  if (debug) {
    const highlightColor = esError ? 'bgRed' : 'inverse';
    const diff = process.hrtime(hrStartTime);
    const duration = Math.round(diff[0] * 1000 + diff[1] / 1e6); // duration in ms

    const {
      title,
      body
    } = getDebugMessage();
    console.log(_chalk.default.bold[highlightColor](`=== Debug: ${title} (${duration}ms) ===`));
    console.log(body);
    console.log(`\n`);

    const inspectableEsQueries = _register_apm_server_routes.inspectableEsQueriesMap.get(request);

    if (!isCalledWithInternalUser && inspectableEsQueries) {
      inspectableEsQueries.push((0, _server.getInspectResponse)({
        esError,
        esRequestParams: requestParams,
        esRequestStatus,
        esResponse: res,
        kibanaRequest: request,
        operationName,
        startTime
      }));
    }
  }

  if (esError) {
    throw esError;
  }

  return res;
}

const getDebugBody = ({
  params,
  requestType,
  operationName
}) => {
  const operationLine = `${operationName}\n`;

  if (requestType === 'search') {
    return `${operationLine}GET ${params.index}/_search\n${formatObj(params.body)}`;
  }

  return `${_chalk.default.bold('ES operation:')} ${requestType}\n${_chalk.default.bold('ES query:')}\n${operationLine}${formatObj(params)}`;
};

exports.getDebugBody = getDebugBody;

const getDebugTitle = request => `${request.route.method.toUpperCase()} ${request.route.path}`;

exports.getDebugTitle = getDebugTitle;