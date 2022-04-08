"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRollupUsageCollector = registerRollupUsageCollector;

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createIdToFlagMap(ids) {
  return ids.reduce((map, id) => {
    map[id] = true;
    return map;
  }, {});
}

function registerRollupUsageCollector(usageCollection, kibanaIndex) {
  const collector = usageCollection.makeUsageCollector({
    type: 'rollups',
    isReady: () => true,
    schema: {
      index_patterns: {
        total: {
          type: 'long',
          _meta: {
            description: 'Counts all the rollup index patterns'
          }
        }
      },
      saved_searches: {
        total: {
          type: 'long',
          _meta: {
            description: 'Counts all the rollup saved searches'
          }
        }
      },
      visualizations: {
        saved_searches: {
          total: {
            type: 'long',
            _meta: {
              description: 'Counts all the visualizations that are based on rollup saved searches'
            }
          },
          lens_total: {
            type: 'long',
            _meta: {
              description: 'Counts all the lens visualizations that are based on rollup saved searches'
            }
          }
        },
        total: {
          type: 'long',
          _meta: {
            description: 'Counts all the visualizations that are based on rollup index patterns'
          }
        },
        lens_total: {
          type: 'long',
          _meta: {
            description: 'Counts all the lens visualizations that are based on rollup index patterns'
          }
        }
      }
    },
    fetch: async ({
      esClient
    }) => {
      const rollupIndexPatterns = await (0, _helpers.fetchRollupIndexPatterns)(kibanaIndex, esClient);
      const rollupIndexPatternToFlagMap = createIdToFlagMap(rollupIndexPatterns);
      const rollupSavedSearches = await (0, _helpers.fetchRollupSavedSearches)(kibanaIndex, esClient, rollupIndexPatternToFlagMap);
      const rollupSavedSearchesToFlagMap = createIdToFlagMap(rollupSavedSearches);
      const {
        rollupVisualizations,
        rollupVisualizationsFromSavedSearches,
        rollupLensVisualizations,
        rollupLensVisualizationsFromSavedSearches
      } = await (0, _helpers.fetchRollupVisualizations)(kibanaIndex, esClient, rollupIndexPatternToFlagMap, rollupSavedSearchesToFlagMap);
      return {
        index_patterns: {
          total: rollupIndexPatterns.length
        },
        saved_searches: {
          total: rollupSavedSearches.length
        },
        visualizations: {
          total: rollupVisualizations,
          lens_total: rollupLensVisualizations,
          saved_searches: {
            total: rollupVisualizationsFromSavedSearches,
            lens_total: rollupLensVisualizationsFromSavedSearches
          }
        }
      };
    }
  });
  usageCollection.registerCollector(collector);
}