"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCollector = exports.getInternalSavedObjectsClient = void 0;

var _server = require("../../../../../src/core/server");

var _fetchers = require("./fetchers");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getInternalSavedObjectsClient = async getStartServices => {
  const [coreStart] = await getStartServices();
  return new _server.SavedObjectsClient(coreStart.savedObjects.createInternalRepository());
};

exports.getInternalSavedObjectsClient = getInternalSavedObjectsClient;

const registerCollector = ({
  core,
  osqueryContext,
  usageCollection
}) => {
  if (!usageCollection) {
    return;
  }

  const collector = usageCollection.makeUsageCollector({
    type: 'osquery',
    schema: _types.usageSchema,
    isReady: () => true,
    fetch: async ({
      esClient
    }) => {
      const savedObjectsClient = await getInternalSavedObjectsClient(core.getStartServices);
      return {
        beat_metrics: {
          usage: await (0, _fetchers.getBeatUsage)(esClient)
        },
        live_query_usage: await (0, _fetchers.getLiveQueryUsage)(savedObjectsClient, esClient),
        ...(await (0, _fetchers.getPolicyLevelUsage)(esClient, savedObjectsClient, osqueryContext.service.getPackagePolicyService()))
      };
    }
  });
  usageCollection.registerCollector(collector);
};

exports.registerCollector = registerCollector;