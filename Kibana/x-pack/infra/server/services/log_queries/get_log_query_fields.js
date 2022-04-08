"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetLogQueryFields = void 0;

var _log_sources = require("../../../common/log_sources");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetLogQueryFields = (sources, framework) => {
  return async (sourceId, savedObjectsClient, elasticsearchClient) => {
    const source = await sources.getSourceConfiguration(savedObjectsClient, sourceId);
    const resolvedLogSourceConfiguration = await (0, _log_sources.resolveLogSourceConfiguration)(source.configuration, await framework.getIndexPatternsService(savedObjectsClient, elasticsearchClient));
    return {
      indexPattern: resolvedLogSourceConfiguration.indices
    };
  };
};

exports.createGetLogQueryFields = createGetLogQueryFields;