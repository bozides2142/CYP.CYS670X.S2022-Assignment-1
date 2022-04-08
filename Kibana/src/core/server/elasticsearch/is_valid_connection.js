"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidConnection = isValidConnection;

var _operators = require("rxjs/operators");

var _elasticsearch = require("@elastic/elasticsearch");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Validates the output of the ES Compatibility Check and waits for a valid connection.
 * It may also throw on specific config/connection errors to make Kibana halt.
 *
 * @param esNodesCompatibility$ ES Compatibility Check's observable
 *
 * @remarks: Ideally, this will be called during the start lifecycle to figure
 * out any configuration issue as soon as possible.
 */
async function isValidConnection(esNodesCompatibility$) {
  return await esNodesCompatibility$.pipe((0, _operators.filter)(({
    nodesInfoRequestError,
    isCompatible
  }) => {
    if (nodesInfoRequestError && nodesInfoRequestError instanceof _elasticsearch.errors.ProductNotSupportedError) {
      // Throw on the specific error of ProductNotSupported.
      // We explicitly want Kibana to halt in this case.
      throw nodesInfoRequestError;
    }

    return isCompatible;
  }), (0, _operators.first)()).toPromise();
}