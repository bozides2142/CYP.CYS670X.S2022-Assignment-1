"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEmbeddableFilters = buildEmbeddableFilters;
exports.getQueryFilters = getQueryFilters;

var _esQuery = require("@kbn/es-query");

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _lodash = require("lodash");

var _build_bool_array = require("./build_bool_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error untyped local


const TimeFilterType = 'time';

const formatTime = (str, roundUp = false) => {
  if (!str) {
    return null;
  }

  const moment = _datemath.default.parse(str, {
    roundUp
  });

  return !moment || !moment.isValid() ? null : moment.valueOf();
};

function getTimeRangeFromFilters(filters) {
  const timeFilters = filters.filter(filter => filter.filterType !== undefined && filter.filterType === TimeFilterType && filter.from !== undefined && filter.to !== undefined);
  const validatedTimeFilters = timeFilters.filter(filter => formatTime(filter.from) !== null && formatTime(filter.to, true) !== null);
  const minFromFilter = (0, _lodash.minBy)(validatedTimeFilters, filter => formatTime(filter.from));
  const maxToFilter = (0, _lodash.maxBy)(validatedTimeFilters, filter => formatTime(filter.to, true));
  return minFromFilter !== null && minFromFilter !== void 0 && minFromFilter.from && maxToFilter !== null && maxToFilter !== void 0 && maxToFilter.to ? {
    from: minFromFilter.from,
    to: maxToFilter.to
  } : undefined;
}

function getQueryFilters(filters) {
  const dataFilters = filters.map(filter => ({ ...filter,
    type: filter.filterType
  }));
  return (0, _build_bool_array.buildBoolArray)(dataFilters).map((filter, index) => {
    const {
      group,
      ...restFilter
    } = filter;
    return (0, _esQuery.buildQueryFilter)(restFilter, index.toString(), '', {
      group
    });
  });
}

function buildEmbeddableFilters(filters) {
  return {
    timeRange: getTimeRangeFromFilters(filters),
    filters: getQueryFilters(filters)
  };
}