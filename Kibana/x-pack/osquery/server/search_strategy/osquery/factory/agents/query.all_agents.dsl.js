"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAgentsQuery = void 0;

var _build_query = require("../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildAgentsQuery = ({
  filterQuery,
  pagination: {
    cursorStart,
    querySize
  },
  sort,
  aggregations
}) => {
  const filter = [{
    term: {
      active: {
        value: 'true'
      }
    }
  }, ...(0, _build_query.createQueryFilterClauses)(filterQuery)];
  const dslQuery = {
    allow_no_indices: true,
    index: '.fleet-agents',
    ignore_unavailable: true,
    body: {
      query: {
        bool: {
          filter
        }
      },
      aggs: aggregations,
      track_total_hits: true,
      sort: [{
        [sort.field]: {
          order: sort.direction
        }
      }],
      size: querySize,
      from: cursorStart
    }
  };
  return dslQuery;
};

exports.buildAgentsQuery = buildAgentsQuery;