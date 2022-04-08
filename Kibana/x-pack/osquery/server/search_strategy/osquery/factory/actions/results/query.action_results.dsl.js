"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildActionResultsQuery = void 0;

var _build_query = require("../../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildActionResultsQuery = ({
  actionId,
  filterQuery,
  // pagination: { activePage, querySize },
  sort
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    match_phrase: {
      action_id: actionId
    }
  }];
  const dslQuery = {
    allow_no_indices: true,
    index: '.fleet-actions-results*',
    ignore_unavailable: true,
    body: {
      aggs: {
        aggs: {
          global: {},
          aggs: {
            responses_by_action_id: {
              filter: {
                bool: {
                  must: [{
                    match: {
                      action_id: actionId
                    }
                  }]
                }
              },
              aggs: {
                rows_count: {
                  sum: {
                    field: 'action_response.osquery.count'
                  }
                },
                responses: {
                  terms: {
                    script: {
                      lang: 'painless',
                      source: "if (doc['error.keyword'].size()==0) { return 'success' } else { return 'error' }"
                    }
                  }
                }
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      // from: activePage * querySize,
      size: 10000,
      // querySize,
      track_total_hits: true,
      fields: ['*'],
      sort: [{
        [sort.field]: {
          order: sort.direction
        }
      }]
    }
  };
  return dslQuery;
};

exports.buildActionResultsQuery = buildActionResultsQuery;