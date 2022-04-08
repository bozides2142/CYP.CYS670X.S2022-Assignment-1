"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterRatios = void 0;

var _esQuery = require("@kbn/es-query");

var _helpers = require("../../helpers");

var _calculate_agg_root = require("./calculate_agg_root");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filter = metric => metric.type === 'filter_ratio';

const filterRatios = ({
  panel,
  esQueryConfig,
  seriesIndex
}) => {
  const indexPattern = seriesIndex.indexPattern || undefined;
  return next => doc => {
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);

      if (column.metrics.some(filter)) {
        column.metrics.filter(filter).forEach(metric => {
          (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}-numerator.filter`, (0, _esQuery.buildEsQuery)(indexPattern, metric.numerator, [], esQueryConfig));
          (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}-denominator.filter`, (0, _esQuery.buildEsQuery)(indexPattern, metric.denominator, [], esQueryConfig));
          let numeratorPath = `${metric.id}-numerator>_count`;
          let denominatorPath = `${metric.id}-denominator>_count`;

          if (metric.metric_agg !== 'count' && _helpers.bucketTransform[metric.metric_agg]) {
            const aggBody = {
              metric: _helpers.bucketTransform[metric.metric_agg]({
                type: metric.metric_agg,
                field: metric.field
              })
            };
            (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}-numerator.aggs`, aggBody);
            (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}-denominator.aggs`, aggBody);
            numeratorPath = `${metric.id}-numerator>metric`;
            denominatorPath = `${metric.id}-denominator>metric`;
          }

          (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}`, {
            bucket_script: {
              buckets_path: {
                numerator: numeratorPath,
                denominator: denominatorPath
              },
              script: 'params.numerator != null && params.denominator != null && params.denominator > 0 ? params.numerator / params.denominator : 0'
            }
          });
        });
      }
    });
    return next(doc);
  };
};

exports.filterRatios = filterRatios;