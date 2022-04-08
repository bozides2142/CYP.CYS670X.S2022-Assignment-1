"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDatasetForField = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDatasetForField = async (client, field, indexPattern, timerange) => {
  var _response$hits$hits, _response$hits$hits$;

  const params = {
    allow_no_indices: true,
    ignore_unavailable: true,
    terminate_after: 1,
    index: indexPattern,
    body: {
      query: {
        bool: {
          filter: [{
            exists: {
              field
            }
          }, {
            range: {
              [_constants.TIMESTAMP_FIELD]: {
                gte: timerange.from,
                lte: timerange.to,
                format: 'epoch_millis'
              }
            }
          }]
        }
      },
      size: 1,
      _source: ['event.dataset'],
      sort: [{
        [_constants.TIMESTAMP_FIELD]: {
          order: 'desc'
        }
      }]
    }
  };
  const response = await client(params);

  if (response.hits.total.value === 0) {
    return null;
  }

  return (_response$hits$hits = response.hits.hits) === null || _response$hits$hits === void 0 ? void 0 : (_response$hits$hits$ = _response$hits$hits[0]._source.event) === null || _response$hits$hits$ === void 0 ? void 0 : _response$hits$hits$.dataset;
};

exports.getDatasetForField = getDatasetForField;