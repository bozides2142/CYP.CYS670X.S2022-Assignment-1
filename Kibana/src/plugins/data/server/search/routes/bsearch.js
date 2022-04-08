"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBsearchRoute = registerBsearchRoute;

var _operators = require("rxjs/operators");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerBsearchRoute(bfetch, getScoped, executionContextService) {
  bfetch.addBatchProcessingRoute('/internal/bsearch', request => {
    const search = getScoped(request);
    return {
      /**
       * @param requestOptions
       * @throws `KibanaServerError`
       */
      onBatchItem: async ({
        request: requestData,
        options
      }) => {
        const {
          executionContext,
          ...restOptions
        } = options || {};
        return executionContextService.withContext(executionContext, () => {
          _elasticApmNode.default.addLabels(executionContextService.getAsLabels());

          return search.search(requestData, restOptions).pipe((0, _operators.first)(), (0, _operators.catchError)(err => {
            var _err$errBody;

            // Re-throw as object, to get attributes passed to the client
            // eslint-disable-next-line no-throw-literal
            throw {
              message: err.message,
              statusCode: err.statusCode,
              attributes: (_err$errBody = err.errBody) === null || _err$errBody === void 0 ? void 0 : _err$errBody.error
            };
          })).toPromise();
        });
      }
    };
  });
}