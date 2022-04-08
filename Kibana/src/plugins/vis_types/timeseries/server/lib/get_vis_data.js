"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVisData = getVisData;

var _lodash = _interopRequireDefault(require("lodash"));

var _enums = require("../../common/enums");

var _get_series_data = require("./vis_data/get_series_data");

var _get_table_data = require("./vis_data/get_table_data");

var _get_es_query_uisettings = require("./vis_data/helpers/get_es_query_uisettings");

var _cached_index_pattern_fetcher = require("./search_strategies/lib/cached_index_pattern_fetcher");

var _get_interval_and_timefield = require("./vis_data/get_interval_and_timefield");

var _constants = require("../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getVisData(requestContext, request, framework) {
  const uiSettings = requestContext.core.uiSettings.client;
  const esShardTimeout = await framework.getEsShardTimeout();
  const fieldFormatService = await framework.getFieldFormatsService(uiSettings);
  const indexPatternsService = await framework.getIndexPatternsService(requestContext);
  const esQueryConfig = await (0, _get_es_query_uisettings.getEsQueryConfig)(uiSettings);
  const promises = request.body.panels.map(panel => {
    const cachedIndexPatternFetcher = (0, _cached_index_pattern_fetcher.getCachedIndexPatternFetcher)(indexPatternsService, {
      fetchKibanaIndexForStringIndexes: Boolean(panel.use_kibana_indexes)
    });
    const services = {
      esQueryConfig,
      esShardTimeout,
      fieldFormatService,
      indexPatternsService,
      uiSettings,
      cachedIndexPatternFetcher,
      searchStrategyRegistry: framework.searchStrategyRegistry,
      buildSeriesMetaParams: async (index, useKibanaIndexes, series) => {
        /** This part of code is required to try to get the default timefield for string indices.
         *  The rest of the functionality available for Kibana indexes should not be active **/
        if (!useKibanaIndexes && index.indexPatternString) {
          index = await cachedIndexPatternFetcher(index.indexPatternString, true);
        }

        const maxBuckets = await uiSettings.get(_constants.UI_SETTINGS.MAX_BUCKETS_SETTING);
        const {
          min,
          max
        } = request.body.timerange;
        return (0, _get_interval_and_timefield.getIntervalAndTimefield)(panel, index, {
          min,
          max,
          maxBuckets
        }, series);
      }
    };
    return panel.type === _enums.PANEL_TYPES.TABLE ? (0, _get_table_data.getTableData)(requestContext, request, panel, services) : (0, _get_series_data.getSeriesData)(requestContext, request, panel, services);
  });
  return Promise.all(promises).then(res => {
    return res.reduce((acc, data) => {
      return _lodash.default.assign(acc, data);
    }, {});
  });
}