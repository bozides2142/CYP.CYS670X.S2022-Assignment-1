"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.termsEnumSuggestions = termsEnumSuggestions;

var _data_views = require("../data_views");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function termsEnumSuggestions(config, savedObjectsClient, esClient, index, fieldName, query, filters, field, abortSignal) {
  var _field, _field2, _field$name, _field3;

  const {
    tiers
  } = config.autocomplete.valueSuggestions;

  if (!((_field = field) !== null && _field !== void 0 && _field.name) && !((_field2 = field) !== null && _field2 !== void 0 && _field2.type)) {
    const indexPattern = await (0, _data_views.findIndexPatternById)(savedObjectsClient, index);
    field = indexPattern && (0, _data_views.getFieldByName)(fieldName, indexPattern);
  }

  const result = await esClient.termsEnum({
    index,
    body: {
      field: (_field$name = (_field3 = field) === null || _field3 === void 0 ? void 0 : _field3.name) !== null && _field$name !== void 0 ? _field$name : fieldName,
      string: query,
      index_filter: {
        bool: {
          must: [...(filters !== null && filters !== void 0 ? filters : []), {
            terms: {
              _tier: tiers
            }
          }]
        }
      }
    }
  }, {
    signal: abortSignal
  });
  return result.body.terms;
}