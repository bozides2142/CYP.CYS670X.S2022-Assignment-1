"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsFilter = getEsFilter;

var _ux_ui_filter = require("../../../../common/ux_ui_filter");

var _environment_query = require("../../../../common/utils/environment_query");

var _environment_filter_values = require("../../../../common/environment_filter_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getEsFilter(uiFilters, exclude) {
  const localFilterValues = uiFilters;

  const mappedFilters = _ux_ui_filter.uxLocalUIFilterNames.filter(name => {
    const validFilter = (name in localFilterValues);

    if (exclude) {
      return name.includes('Excluded') && validFilter;
    }

    return !name.includes('Excluded') && validFilter;
  }).map(filterName => {
    const field = _ux_ui_filter.uxLocalUIFilters[filterName];
    const value = localFilterValues[filterName];
    return {
      terms: {
        [field.fieldName]: value
      }
    };
  });

  return [...mappedFilters, ...(exclude ? [] : (0, _environment_query.environmentQuery)(uiFilters.environment || _environment_filter_values.ENVIRONMENT_ALL.value))];
}