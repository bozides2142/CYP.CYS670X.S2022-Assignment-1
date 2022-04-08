"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryTotalGroupings = void 0;

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const queryTotalGroupings = async (client, options) => {
  var _response$aggregation, _response$aggregation2;

  if (!options.groupBy || (0, _lodash.isArray)(options.groupBy) && options.groupBy.length === 0) {
    return Promise.resolve(0);
  }

  let filters = [{
    range: {
      [_constants.TIMESTAMP_FIELD]: {
        gte: options.timerange.from,
        lte: options.timerange.to,
        format: 'epoch_millis'
      }
    }
  }, ...options.groupBy.map(field => ({
    exists: {
      field
    }
  }))];

  if (options.filters) {
    filters = [...filters, ...options.filters];
  }

  const params = {
    allow_no_indices: true,
    ignore_unavailable: true,
    index: options.indexPattern,
    body: {
      size: 0,
      query: {
        bool: {
          filter: filters
        }
      },
      aggs: {
        count: {
          cardinality: {
            script: options.groupBy.map(field => `doc['${field}'].value`).join('+')
          }
        }
      }
    }
  };
  const response = await client(params);
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.count.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0;
};

exports.queryTotalGroupings = queryTotalGroupings;