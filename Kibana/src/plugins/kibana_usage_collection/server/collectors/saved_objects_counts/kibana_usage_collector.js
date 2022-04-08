"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaSavedObjectCounts = getKibanaSavedObjectCounts;
exports.registerKibanaUsageCollector = registerKibanaUsageCollector;

var _lodash = require("lodash");

var _get_saved_object_counts = require("./get_saved_object_counts");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const TYPES = ['dashboard', 'visualization', 'search', 'index-pattern', 'graph-workspace'];

async function getKibanaSavedObjectCounts(esClient, kibanaIndex) {
  const buckets = await (0, _get_saved_object_counts.getSavedObjectsCounts)(esClient, kibanaIndex, TYPES);
  const allZeros = Object.fromEntries(TYPES.map(type => [(0, _lodash.snakeCase)(type), {
    total: 0
  }]));
  return buckets.reduce((acc, {
    key,
    doc_count: total = 0
  }) => {
    const type = (0, _lodash.snakeCase)(key);
    acc[type].total += total;
    return acc;
  }, allZeros);
}

function registerKibanaUsageCollector(usageCollection, kibanaIndex) {
  usageCollection.registerCollector(usageCollection.makeUsageCollector({
    type: 'kibana',
    isReady: () => true,
    schema: {
      index: {
        type: 'keyword',
        _meta: {
          description: 'The index storing the saved objects'
        }
      },
      dashboard: {
        total: {
          type: 'long',
          _meta: {
            description: 'Total number of dashboard saved objects'
          }
        }
      },
      visualization: {
        total: {
          type: 'long',
          _meta: {
            description: 'Total number of visualization saved objects'
          }
        }
      },
      search: {
        total: {
          type: 'long',
          _meta: {
            description: 'Total number of search saved objects'
          }
        }
      },
      index_pattern: {
        total: {
          type: 'long',
          _meta: {
            description: 'Total number of index_pattern saved objects'
          }
        }
      },
      graph_workspace: {
        total: {
          type: 'long',
          _meta: {
            description: 'Total number of graph_workspace saved objects'
          }
        }
      }
    },

    async fetch({
      esClient
    }) {
      return {
        index: kibanaIndex,
        ...(await getKibanaSavedObjectCounts(esClient, kibanaIndex))
      };
    }

  }));
}