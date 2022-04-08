"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAliases = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _elasticsearch = require("@elastic/elasticsearch");

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Calls the Update index alias API `_alias` with the provided alias actions.
 */
const updateAliases = ({
  client,
  aliasActions
}) => () => {
  return client.indices.updateAliases({
    body: {
      actions: aliasActions
    }
  }, {
    maxRetries: 0
  }).then(() => {
    // Ignore `acknowledged: false`. When the coordinating node accepts
    // the new cluster state update but not all nodes have applied the
    // update within the timeout `acknowledged` will be false. However,
    // retrying this update will always immediately result in `acknowledged:
    // true` even if there are still nodes which are falling behind with
    // cluster state updates.
    // The only impact for using `updateAliases` to mark the version index
    // as ready is that it could take longer for other Kibana instances to
    // see that the version index is ready so they are more likely to
    // perform unnecessary duplicate work.
    return Either.right('update_aliases_succeeded');
  }).catch(err => {
    if (err instanceof _elasticsearch.errors.ResponseError) {
      var _err$body, _err$body$error, _err$body2, _err$body2$error, _err$body3, _err$body3$error, _err$body3$error$reas, _err$body4, _err$body4$error, _err$body5, _err$body5$error, _err$body6, _err$body6$error, _err$body6$error$reas;

      if ((err === null || err === void 0 ? void 0 : (_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) === 'index_not_found_exception') {
        return Either.left({
          type: 'index_not_found_exception',
          index: err.body.error.index
        });
      } else if ((err === null || err === void 0 ? void 0 : (_err$body2 = err.body) === null || _err$body2 === void 0 ? void 0 : (_err$body2$error = _err$body2.error) === null || _err$body2$error === void 0 ? void 0 : _err$body2$error.type) === 'illegal_argument_exception' && err !== null && err !== void 0 && (_err$body3 = err.body) !== null && _err$body3 !== void 0 && (_err$body3$error = _err$body3.error) !== null && _err$body3$error !== void 0 && (_err$body3$error$reas = _err$body3$error.reason) !== null && _err$body3$error$reas !== void 0 && _err$body3$error$reas.match(/The provided expression \[.+\] matches an alias, specify the corresponding concrete indices instead./)) {
        return Either.left({
          type: 'remove_index_not_a_concrete_index'
        });
      } else if ((err === null || err === void 0 ? void 0 : (_err$body4 = err.body) === null || _err$body4 === void 0 ? void 0 : (_err$body4$error = _err$body4.error) === null || _err$body4$error === void 0 ? void 0 : _err$body4$error.type) === 'aliases_not_found_exception' || (err === null || err === void 0 ? void 0 : (_err$body5 = err.body) === null || _err$body5 === void 0 ? void 0 : (_err$body5$error = _err$body5.error) === null || _err$body5$error === void 0 ? void 0 : _err$body5$error.type) === 'resource_not_found_exception' && err !== null && err !== void 0 && (_err$body6 = err.body) !== null && _err$body6 !== void 0 && (_err$body6$error = _err$body6.error) !== null && _err$body6$error !== void 0 && (_err$body6$error$reas = _err$body6$error.reason) !== null && _err$body6$error$reas !== void 0 && _err$body6$error$reas.match(/required alias \[.+\] does not exist/)) {
        return Either.left({
          type: 'alias_not_found_exception'
        });
      }
    }

    throw err;
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.updateAliases = updateAliases;