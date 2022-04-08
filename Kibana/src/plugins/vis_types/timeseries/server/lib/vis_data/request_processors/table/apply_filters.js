"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyFilters = void 0;

var _lodash = require("lodash");

var _esQuery = require("@kbn/es-query");

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const applyFilters = ({
  panel,
  esQueryConfig,
  seriesIndex
}) => next => doc => {
  panel.series.forEach(column => {
    var _column$filter, _column$filter2;

    const hasAggregateByApplied = Boolean(column.aggregate_by && column.aggregate_function);
    let filterSelector = `aggs.pivot.aggs.${column.id}.filter`;

    if (hasAggregateByApplied && (_column$filter = column.filter) !== null && _column$filter !== void 0 && _column$filter.query) {
      const originalAggsSelector = `aggs.pivot.aggs.${column.id}.aggs`;
      const originalAggs = (0, _lodash.get)(doc, originalAggsSelector);
      (0, _helpers.overwrite)(doc, originalAggsSelector, {
        column_filter: {
          aggs: originalAggs
        }
      });
      filterSelector = `${originalAggsSelector}.column_filter.filter`;
    }

    if ((_column$filter2 = column.filter) !== null && _column$filter2 !== void 0 && _column$filter2.query) {
      (0, _helpers.overwrite)(doc, filterSelector, (0, _esQuery.buildEsQuery)(seriesIndex.indexPattern || undefined, [column.filter], [], esQueryConfig));
    } else {
      if (!hasAggregateByApplied) {
        (0, _helpers.overwrite)(doc, `${filterSelector}.match_all`, {});
      }
    }
  });
  return next(doc);
};

exports.applyFilters = applyFilters;