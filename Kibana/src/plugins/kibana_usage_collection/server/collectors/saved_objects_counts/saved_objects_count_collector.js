"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSavedObjectsCountUsageCollector = registerSavedObjectsCountUsageCollector;

var _get_saved_object_counts = require("./get_saved_object_counts");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerSavedObjectsCountUsageCollector(usageCollection, kibanaIndex) {
  usageCollection.registerCollector(usageCollection.makeUsageCollector({
    type: 'saved_objects_counts',
    isReady: () => true,
    schema: {
      by_type: {
        type: 'array',
        items: {
          type: {
            type: 'keyword',
            _meta: {
              description: 'The SavedObjects type'
            }
          },
          count: {
            type: 'long',
            _meta: {
              description: 'How many SavedObjects of that type are stored in the cluster across all Spaces'
            }
          }
        }
      }
    },

    async fetch({
      esClient
    }) {
      const buckets = await (0, _get_saved_object_counts.getSavedObjectsCounts)(esClient, kibanaIndex);
      return {
        by_type: buckets.map(({
          key: type,
          doc_count: count
        }) => {
          return {
            type,
            count
          };
        })
      };
    }

  }));
}