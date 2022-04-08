"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternsApiServer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lib = require("../common/lib");

var _fetcher = require("./fetcher");

var _has_user_index_pattern = require("./has_user_index_pattern");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class IndexPatternsApiServer {
  constructor(elasticsearchClient, savedObjectsClient) {
    (0, _defineProperty2.default)(this, "esClient", void 0);
    this.savedObjectsClient = savedObjectsClient;
    this.esClient = elasticsearchClient;
  }

  async getFieldsForWildcard({
    pattern,
    metaFields,
    type,
    rollupIndex,
    allowNoIndex,
    filter
  }) {
    const indexPatterns = new _fetcher.IndexPatternsFetcher(this.esClient, allowNoIndex);
    return await indexPatterns.getFieldsForWildcard({
      pattern,
      metaFields,
      type,
      rollupIndex,
      filter
    }).catch(err => {
      if (err.output.payload.statusCode === 404 && err.output.payload.code === 'no_matching_indices') {
        throw new _lib.DataViewMissingIndices(pattern);
      } else {
        throw err;
      }
    });
  }

  async getFieldsForTimePattern(options) {
    const indexPatterns = new _fetcher.IndexPatternsFetcher(this.esClient);
    return await indexPatterns.getFieldsForTimePattern(options);
  }

  async hasUserIndexPattern() {
    return (0, _has_user_index_pattern.hasUserIndexPattern)({
      esClient: this.esClient,
      soClient: this.savedObjectsClient
    });
  }

}

exports.IndexPatternsApiServer = IndexPatternsApiServer;