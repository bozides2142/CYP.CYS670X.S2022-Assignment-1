"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSearchStrategy = void 0;

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _fields_utils = require("../../../../common/fields_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class AbstractSearchStrategy {
  async search(requestContext, req, esRequests, trackedEsSearches, indexType) {
    const requests = [];
    esRequests.forEach(({
      body,
      index,
      trackingEsSearchMeta
    }) => {
      const startTime = Date.now();
      requests.push(requestContext.search.search({
        indexType,
        params: {
          body,
          index
        }
      }, req.body.searchSession).pipe((0, _operators.tap)(data => {
        if (trackingEsSearchMeta !== null && trackingEsSearchMeta !== void 0 && trackingEsSearchMeta.requestId && trackedEsSearches) {
          trackedEsSearches[trackingEsSearchMeta.requestId] = {
            body,
            time: Date.now() - startTime,
            label: trackingEsSearchMeta.requestLabel,
            response: (0, _lodash.omit)(data.rawResponse, 'aggregations')
          };
        }
      })).toPromise());
    });
    return Promise.all(requests);
  }

  checkForViability(requestContext, req, fetchedIndexPattern) {
    throw new TypeError('Must override method');
  }

  async getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, capabilities, options) {
    var _fetchedIndexPattern$;

    return (0, _fields_utils.toSanitizedFieldType)(fetchedIndexPattern.indexPattern ? fetchedIndexPattern.indexPattern.getNonScriptedFields() : await indexPatternsService.getFieldsForWildcard({
      pattern: (_fetchedIndexPattern$ = fetchedIndexPattern.indexPatternString) !== null && _fetchedIndexPattern$ !== void 0 ? _fetchedIndexPattern$ : '',
      metaFields: [],
      ...options
    }));
  }

}

exports.AbstractSearchStrategy = AbstractSearchStrategy;