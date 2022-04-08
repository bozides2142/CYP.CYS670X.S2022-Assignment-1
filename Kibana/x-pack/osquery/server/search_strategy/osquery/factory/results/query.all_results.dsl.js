"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildResultsQuery = void 0;

var _common = require("../../../../../common");

var _build_query = require("../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildResultsQuery = ({
  actionId,
  agentId,
  filterQuery,
  sort,
  pagination: {
    activePage,
    querySize
  }
}) => {
  var _sort$map;

  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    match_phrase: {
      action_id: actionId
    }
  }, ...(agentId ? [{
    match_phrase: {
      'agent.id': agentId
    }
  }] : [])];
  const dslQuery = {
    allow_no_indices: true,
    index: `logs-${_common.OSQUERY_INTEGRATION_NAME}.result*`,
    ignore_unavailable: true,
    body: {
      aggs: {
        count_by_agent_id: {
          terms: {
            field: 'elastic_agent.id',
            size: 10000
          }
        },
        unique_agents: {
          cardinality: {
            field: 'elastic_agent.id'
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      from: activePage * querySize,
      size: querySize,
      track_total_hits: true,
      fields: ['elastic_agent.*', 'agent.*', 'osquery.*'],
      sort: (_sort$map = sort === null || sort === void 0 ? void 0 : sort.map(sortConfig => ({
        [sortConfig.field]: {
          order: sortConfig.direction
        }
      }))) !== null && _sort$map !== void 0 ? _sort$map : []
    }
  };
  return dslQuery;
};

exports.buildResultsQuery = buildResultsQuery;