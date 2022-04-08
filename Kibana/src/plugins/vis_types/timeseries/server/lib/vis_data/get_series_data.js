"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeriesData = getSeriesData;

var _i18n = require("@kbn/i18n");

var _handle_error_response = require("./handle_error_response");

var _get_annotations = require("./get_annotations");

var _handle_response_body = require("./series/handle_response_body");

var _get_request_params = require("./series/get_request_params");

var _get_active_series = require("./helpers/get_active_series");

var _check_aggs = require("./helpers/check_aggs");

var _enums = require("../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getSeriesData(requestContext, req, panel, services) {
  const {
    cachedIndexPatternFetcher,
    searchStrategyRegistry,
    indexPatternsService,
    fieldFormatService
  } = services;
  const panelIndex = await cachedIndexPatternFetcher(panel.index_pattern, !panel.use_kibana_indexes);
  const strategy = await searchStrategyRegistry.getViableStrategy(requestContext, req, panelIndex);

  if (!strategy) {
    throw new Error(_i18n.i18n.translate('visTypeTimeseries.searchStrategyUndefinedErrorMessage', {
      defaultMessage: 'Search strategy was not defined'
    }));
  }

  const {
    searchStrategy,
    capabilities
  } = strategy;
  const handleError = (0, _handle_error_response.handleErrorResponse)(panel);
  const meta = {
    type: panel.type,
    uiRestrictions: capabilities.uiRestrictions,
    trackedEsSearches: {}
  };

  try {
    const bodiesPromises = (0, _get_active_series.getActiveSeries)(panel).map(series => {
      (0, _check_aggs.isAggSupported)(series.metrics, capabilities);
      return (0, _get_request_params.getSeriesRequestParams)(req, panel, panelIndex, series, capabilities, services);
    });
    const fieldFetchServices = {
      indexPatternsService,
      cachedIndexPatternFetcher,
      searchStrategy,
      capabilities
    };
    const handleResponseBodyFn = (0, _handle_response_body.handleResponseBody)(panel, req, fieldFetchServices, fieldFormatService);
    const searches = await Promise.all(bodiesPromises);
    const data = await searchStrategy.search(requestContext, req, searches, meta.trackedEsSearches);
    const series = await Promise.all(data.map(async resp => await handleResponseBodyFn(resp.rawResponse ? resp.rawResponse : resp)));
    let annotations = null;

    if (panel.type === _enums.PANEL_TYPES.TIMESERIES && panel.annotations && panel.annotations.length) {
      annotations = await (0, _get_annotations.getAnnotations)({
        req,
        panel,
        series,
        services: { ...services,
          requestContext,
          searchStrategy,
          capabilities
        },
        trackedEsSearches: meta.trackedEsSearches
      });
    }

    return { ...meta,
      [panel.id]: {
        annotations,
        id: panel.id,
        series: series.reduce((acc, s) => acc.concat(s), [])
      }
    };
  } catch (err) {
    return { ...meta,
      ...handleError(err)
    };
  }
}