"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateHistogramMetaDataByDatatableColumn = void 0;

var _bucket_agg_types = require("../buckets/bucket_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Helper function returning the used interval, used time zone and applied time filters for data table column created by the date_histogramm agg type.
 * "auto" will get expanded to the actually used interval.
 * If the column is not a column created by a date_histogram aggregation of the esaggs data source,
 * this function will return undefined.
 */
const getDateHistogramMetaDataByDatatableColumn = (column, defaults = {}) => {
  var _column$meta$sourcePa;

  if (column.meta.source !== 'esaggs') return;
  if (((_column$meta$sourcePa = column.meta.sourceParams) === null || _column$meta$sourcePa === void 0 ? void 0 : _column$meta$sourcePa.type) !== _bucket_agg_types.BUCKET_TYPES.DATE_HISTOGRAM) return;
  const params = column.meta.sourceParams.params;
  let interval;

  if (params.used_interval && params.used_interval !== 'auto') {
    interval = params.used_interval;
  }

  return {
    interval,
    timeZone: params.used_time_zone || defaults.timeZone,
    timeRange: column.meta.sourceParams.appliedTimeRange
  };
};

exports.getDateHistogramMetaDataByDatatableColumn = getDateHistogramMetaDataByDatatableColumn;