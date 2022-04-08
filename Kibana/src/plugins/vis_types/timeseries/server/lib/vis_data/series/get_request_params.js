"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeriesRequestParams = getSeriesRequestParams;

var _i18n = require("@kbn/i18n");

var _build_request_body = require("./build_request_body");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getSeriesRequestParams(req, panel, panelIndex, series, capabilities, {
  esQueryConfig,
  esShardTimeout,
  uiSettings,
  cachedIndexPatternFetcher,
  buildSeriesMetaParams
}) {
  var _seriesIndex$indexPat, _seriesIndex$indexPat2;

  let seriesIndex = panelIndex;

  if (series.override_index_pattern) {
    var _series$series_index_;

    seriesIndex = await cachedIndexPatternFetcher((_series$series_index_ = series.series_index_pattern) !== null && _series$series_index_ !== void 0 ? _series$series_index_ : '');
  }

  const request = await (0, _build_request_body.buildRequestBody)(req, panel, series, esQueryConfig, seriesIndex, capabilities, uiSettings, () => buildSeriesMetaParams(seriesIndex, Boolean(panel.use_kibana_indexes), series));
  return {
    index: seriesIndex.indexPatternString,
    body: { ...request,
      runtime_mappings: (_seriesIndex$indexPat = (_seriesIndex$indexPat2 = seriesIndex.indexPattern) === null || _seriesIndex$indexPat2 === void 0 ? void 0 : _seriesIndex$indexPat2.getComputedFields().runtimeFields) !== null && _seriesIndex$indexPat !== void 0 ? _seriesIndex$indexPat : {},
      timeout: esShardTimeout > 0 ? `${esShardTimeout}ms` : undefined
    },
    trackingEsSearchMeta: {
      requestId: series.id,
      requestLabel: _i18n.i18n.translate('visTypeTimeseries.seriesRequest.label', {
        defaultMessage: 'Series: {id}',
        values: {
          id: series.id
        }
      })
    }
  };
}