"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollupSearchStrategy = void 0;

var _server = require("../../../../../../data/server");

var _abstract_search_strategy = require("./abstract_search_strategy");

var _rollup_search_capabilities = require("../capabilities/rollup_search_capabilities");

var _constants = require("../../../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getRollupIndices = rollupData => Object.keys(rollupData);

const isIndexPatternContainsWildcard = indexPattern => indexPattern.includes('*');

class RollupSearchStrategy extends _abstract_search_strategy.AbstractSearchStrategy {
  async search(requestContext, req, esRequests, trackedEsSearches) {
    return super.search(requestContext, req, esRequests, trackedEsSearches, 'rollup');
  }

  async getRollupData(requestContext, indexPattern) {
    try {
      const {
        body
      } = await requestContext.core.elasticsearch.client.asCurrentUser.rollup.getRollupIndexCaps({
        index: indexPattern
      });
      return body;
    } catch (e) {
      return {};
    }
  }

  async checkForViability(requestContext, req, {
    indexPatternString,
    indexPattern
  }) {
    let isViable = false;
    let capabilities = null;

    if (indexPatternString && (!indexPattern && !isIndexPatternContainsWildcard(indexPatternString) || (indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.type) === 'rollup')) {
      const rollupData = await this.getRollupData(requestContext, indexPatternString);
      const rollupIndices = getRollupIndices(rollupData);
      const uiSettings = requestContext.core.uiSettings.client;
      isViable = rollupIndices.length === 1;

      if (isViable) {
        const [rollupIndex] = rollupIndices;
        const fieldsCapabilities = (0, _server.getCapabilitiesForRollupIndices)(rollupData);
        capabilities = new _rollup_search_capabilities.RollupSearchCapabilities({
          maxBucketsLimit: await uiSettings.get(_constants.UI_SETTINGS.MAX_BUCKETS_SETTING),
          panel: req.body.panels ? req.body.panels[0] : null
        }, fieldsCapabilities, rollupIndex);
      }
    }

    return {
      isViable,
      capabilities
    };
  }

  async getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, getCachedIndexPatternFetcher, capabilities) {
    return super.getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, capabilities, {
      type: 'rollup',
      rollupIndex: fetchedIndexPattern.indexPatternString
    });
  }

}

exports.RollupSearchStrategy = RollupSearchStrategy;