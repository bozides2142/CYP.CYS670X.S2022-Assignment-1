"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggsRequiredUiSettings = exports.AggsCommonService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _common = require("../../../common");

var _ = require("./");

var _datatable_column_meta = require("./utils/datatable_column_meta");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const aggsRequiredUiSettings = ['dateFormat', 'dateFormat:scaled', 'dateFormat:tz', _common.UI_SETTINGS.HISTOGRAM_BAR_TARGET, _common.UI_SETTINGS.HISTOGRAM_MAX_BARS, _common.UI_SETTINGS.SEARCH_QUERY_LANGUAGE, _common.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS, _common.UI_SETTINGS.QUERY_STRING_OPTIONS, _common.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX];
exports.aggsRequiredUiSettings = aggsRequiredUiSettings;

/**
 * The aggs service provides a means of modeling and manipulating the various
 * Elasticsearch aggregations supported by Kibana, providing the ability to
 * output the correct DSL when you are ready to send your request to ES.
 */
class AggsCommonService {
  constructor() {
    (0, _defineProperty2.default)(this, "aggTypesRegistry", new _.AggTypesRegistry());
  }

  setup({
    registerFunction
  }) {
    const aggTypesSetup = this.aggTypesRegistry.setup(); // register each agg type

    const aggTypes = (0, _.getAggTypes)();
    aggTypes.buckets.forEach(({
      name,
      fn
    }) => aggTypesSetup.registerBucket(name, fn));
    aggTypes.metrics.forEach(({
      name,
      fn
    }) => aggTypesSetup.registerMetric(name, fn)); // register expression functions for each agg type

    const aggFunctions = (0, _.getAggTypesFunctions)();
    aggFunctions.forEach(fn => registerFunction(fn));
    return {
      types: aggTypesSetup
    };
  }

  start({
    getConfig,
    getIndexPattern,
    isDefaultTimezone
  }) {
    const aggTypesStart = this.aggTypesRegistry.start();
    const calculateAutoTimeExpression = (0, _.getCalculateAutoTimeExpression)(getConfig);

    const createAggConfigs = (indexPattern, configStates) => {
      return new _.AggConfigs(indexPattern, configStates, {
        typesRegistry: aggTypesStart
      });
    };

    return {
      calculateAutoTimeExpression,
      datatableUtilities: (0, _datatable_column_meta.getDatatableColumnUtilities)({
        getIndexPattern,
        createAggConfigs,
        aggTypesStart
      }),
      createAggConfigs,
      types: aggTypesStart
    };
  }

}

exports.AggsCommonService = AggsCommonService;