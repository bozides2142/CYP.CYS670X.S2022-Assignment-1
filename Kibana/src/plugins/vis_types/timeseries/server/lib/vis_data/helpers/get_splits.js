"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSplits = getSplits;

var _color = _interopRequireDefault(require("color"));

var _lodash = require("lodash");

var _helpers = require("../helpers");

var _calculate_label = require("../../../../common/calculate_label");

var _constants = require("../../../../common/constants");

var _get_last_metric = require("./get_last_metric");

var _format_key = require("./format_key");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getTimeSeries = (resp, series) => (0, _lodash.get)(resp, `aggregations.timeseries`) || (0, _lodash.get)(resp, `aggregations.${series.id}.timeseries`);

async function getSplits(resp, panel, series, meta, extractFields) {
  var _meta;

  if (!meta) {
    meta = (0, _lodash.get)(resp, `aggregations.${series.id}.meta`);
  }

  const color = new _color.default(series.color);
  const metric = (0, _get_last_metric.getLastMetric)(series);
  const buckets = (0, _lodash.get)(resp, `aggregations.${series.id}.buckets`);
  const fieldsForSeries = (_meta = meta) !== null && _meta !== void 0 && _meta.index ? await extractFields({
    id: meta.index
  }) : [];
  const splitByLabel = (0, _calculate_label.calculateLabel)(metric, series.metrics, fieldsForSeries);

  if (buckets) {
    if (Array.isArray(buckets)) {
      return buckets.map(bucket => {
        if (bucket.column_filter) {
          bucket = { ...bucket,
            ...bucket.column_filter
          };
        }

        bucket.id = `${series.id}${_constants.SERIES_SEPARATOR}${bucket.key}`;
        bucket.splitByLabel = splitByLabel;
        bucket.label = (0, _format_key.formatKey)(bucket.key, series);
        bucket.labelFormatted = bucket.key_as_string ? (0, _format_key.formatKey)(bucket.key_as_string, series) : '';
        bucket.color = color.string();
        bucket.meta = meta;
        return bucket;
      });
    }

    if (series.split_mode === 'filters' && (0, _lodash.isPlainObject)(buckets)) {
      return (series.split_filters || []).map(filter => {
        var _ref, _filter$filter;

        const bucket = (0, _lodash.get)(resp, `aggregations.${series.id}.buckets.${filter.id}`);
        bucket.id = `${series.id}${_constants.SERIES_SEPARATOR}${filter.id}`;
        bucket.key = filter.id;
        bucket.splitByLabel = splitByLabel;
        bucket.color = filter.color;
        bucket.label = (_ref = filter.label || ((_filter$filter = filter.filter) === null || _filter$filter === void 0 ? void 0 : _filter$filter.query)) !== null && _ref !== void 0 ? _ref : '*';
        bucket.meta = meta;
        return bucket;
      });
    }
  }

  const timeseries = getTimeSeries(resp, series);
  const mergeObj = {
    timeseries
  };
  series.metrics.filter(m => /_bucket/.test(m.type)).forEach(m => {
    (0, _helpers.overwrite)(mergeObj, m.id, (0, _lodash.get)(resp, `aggregations.${series.id}.${m.id}`));
  });
  return [{
    id: series.id,
    splitByLabel,
    label: series.label || splitByLabel,
    color: color.string(),
    ...mergeObj,
    meta: meta
  }];
}