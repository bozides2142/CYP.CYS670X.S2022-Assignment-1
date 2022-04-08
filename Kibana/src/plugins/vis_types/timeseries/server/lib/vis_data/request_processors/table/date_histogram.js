"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateHistogram = void 0;

var _helpers = require("../../helpers");

var _calculate_agg_root = require("./calculate_agg_root");

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

const dateHistogram = ({
  req,
  panel,
  seriesIndex,
  capabilities,
  uiSettings,
  buildSeriesMetaParams
}) => next => async doc => {
  var _seriesIndex$indexPat;

  const barTargetUiSettings = await uiSettings.get(_server.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
  const {
    timeField,
    interval
  } = await buildSeriesMetaParams();
  const {
    from,
    to
  } = (0, _helpers.getTimerange)(req);
  const meta = {
    timeField,
    index: panel.use_kibana_indexes ? (_seriesIndex$indexPat = seriesIndex.indexPattern) === null || _seriesIndex$indexPat === void 0 ? void 0 : _seriesIndex$indexPat.id : undefined,
    panelId: panel.id
  };

  const overwriteDateHistogramForLastBucketMode = () => {
    const {
      intervalString
    } = (0, _helpers.getBucketSize)(req, interval, capabilities, barTargetUiSettings);
    const {
      timezone
    } = capabilities;
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);
      (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.date_histogram`, {
        field: timeField,
        min_doc_count: 0,
        time_zone: timezone,
        extended_bounds: {
          min: from.valueOf(),
          max: to.valueOf()
        },
        ...dateHistogramInterval(intervalString)
      });
      (0, _helpers.overwrite)(doc, aggRoot.replace(/\.aggs$/, '.meta'), { ...meta,
        intervalString
      });
    });
  };

  const overwriteDateHistogramForEntireTimerangeMode = () => {
    const intervalString = `${to.valueOf() - from.valueOf()}ms`;
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);
      (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.auto_date_histogram`, {
        field: timeField,
        buckets: 1
      });
      (0, _helpers.overwrite)(doc, aggRoot.replace(/\.aggs$/, '.meta'), { ...meta,
        intervalString
      });
    });
  };

  if ((0, _helpers.isLastValueTimerangeMode)(panel)) {
    overwriteDateHistogramForLastBucketMode();
  } else {
    overwriteDateHistogramForEntireTimerangeMode();
  }

  return next(doc);
};

exports.dateHistogram = dateHistogram;