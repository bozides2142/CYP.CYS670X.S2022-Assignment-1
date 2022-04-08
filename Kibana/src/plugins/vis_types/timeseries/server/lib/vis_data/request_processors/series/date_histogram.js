"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateHistogram = dateHistogram;

var _helpers = require("../../helpers");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _offset_time = require("../../offset_time");

var _get_timerange_mode = require("../../helpers/get_timerange_mode");

var _server = require("../../../../../../../../plugins/data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  dateHistogramInterval
} = _server.search.aggs;

function dateHistogram(req, panel, series, esQueryConfig, seriesIndex, capabilities, uiSettings, buildSeriesMetaParams) {
  return next => async doc => {
    var _seriesIndex$indexPat;

    const maxBarsUiSettings = await uiSettings.get(_server.UI_SETTINGS.HISTOGRAM_MAX_BARS);
    const barTargetUiSettings = await uiSettings.get(_server.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
    const {
      timeField,
      interval,
      maxBars
    } = await buildSeriesMetaParams();
    const {
      from,
      to
    } = (0, _offset_time.offsetTime)(req, series.offset_time);
    let bucketInterval;

    const overwriteDateHistogramForLastBucketMode = () => {
      const {
        timezone
      } = capabilities;
      const {
        intervalString
      } = (0, _get_bucket_size.getBucketSize)(req, interval, capabilities, maxBars ? Math.min(maxBarsUiSettings, maxBars) : barTargetUiSettings);
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs.timeseries.date_histogram`, {
        field: timeField,
        min_doc_count: 0,
        time_zone: timezone,
        extended_bounds: {
          min: from.valueOf(),
          max: to.valueOf()
        },
        ...dateHistogramInterval(intervalString)
      });
      bucketInterval = intervalString;
    };

    const overwriteDateHistogramForEntireTimerangeMode = () => {
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs.timeseries.auto_date_histogram`, {
        field: timeField,
        buckets: 1
      });
      bucketInterval = `${to.valueOf() - from.valueOf()}ms`;
    };

    (0, _get_timerange_mode.isLastValueTimerangeMode)(panel, series) ? overwriteDateHistogramForLastBucketMode() : overwriteDateHistogramForEntireTimerangeMode();
    (0, _helpers.overwrite)(doc, `aggs.${series.id}.meta`, {
      timeField,
      panelId: panel.id,
      seriesId: series.id,
      intervalString: bucketInterval,
      index: panel.use_kibana_indexes ? (_seriesIndex$indexPat = seriesIndex.indexPattern) === null || _seriesIndex$indexPat === void 0 ? void 0 : _seriesIndex$indexPat.id : undefined
    });
    return next(doc);
  };
}