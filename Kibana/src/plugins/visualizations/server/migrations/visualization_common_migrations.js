"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commonRemoveMarkdownLessFromTSVB = exports.commonRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel = exports.commonMigrateVislibPie = exports.commonMigrateTagCloud = exports.commonHideTSVBLastValueIndicator = exports.commonAddSupportOfDualIndexSelectionModeInTSVB = exports.commonAddEmptyValueColorRule = exports.commonAddDropLastBucketIntoTSVBModel714Above = exports.commonAddDropLastBucketIntoTSVBModel = void 0;

var _lodash = require("lodash");

var _uuid = _interopRequireDefault(require("uuid"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const commonAddSupportOfDualIndexSelectionModeInTSVB = visState => {
  if (visState && visState.type === 'metrics') {
    const {
      params
    } = visState;

    if (typeof (params === null || params === void 0 ? void 0 : params.index_pattern) === 'string') {
      params.use_kibana_indexes = false;
    }
  }

  return visState;
};

exports.commonAddSupportOfDualIndexSelectionModeInTSVB = commonAddSupportOfDualIndexSelectionModeInTSVB;

const commonAddDropLastBucketIntoTSVBModel = visState => {
  if (visState && visState.type === 'metrics') {
    var _visState$params, _visState$params$seri, _visState$params$drop;

    return { ...visState,
      params: { ...visState.params,
        series: (_visState$params = visState.params) === null || _visState$params === void 0 ? void 0 : (_visState$params$seri = _visState$params.series) === null || _visState$params$seri === void 0 ? void 0 : _visState$params$seri.map(s => {
          var _s$series_drop_last_b;

          return s.override_index_pattern ? { ...s,
            series_drop_last_bucket: (_s$series_drop_last_b = s.series_drop_last_bucket) !== null && _s$series_drop_last_b !== void 0 ? _s$series_drop_last_b : 1
          } : s;
        }),
        drop_last_bucket: (_visState$params$drop = visState.params.drop_last_bucket) !== null && _visState$params$drop !== void 0 ? _visState$params$drop : 1
      }
    };
  }

  return visState;
};

exports.commonAddDropLastBucketIntoTSVBModel = commonAddDropLastBucketIntoTSVBModel;

const commonAddDropLastBucketIntoTSVBModel714Above = visState => {
  if (visState && visState.type === 'metrics') {
    var _visState$params$drop2;

    return { ...visState,
      params: { ...visState.params,
        drop_last_bucket: (_visState$params$drop2 = visState.params.drop_last_bucket) !== null && _visState$params$drop2 !== void 0 ? _visState$params$drop2 : 1
      }
    };
  }

  return visState;
};

exports.commonAddDropLastBucketIntoTSVBModel714Above = commonAddDropLastBucketIntoTSVBModel714Above;

const commonHideTSVBLastValueIndicator = visState => {
  if (visState && visState.type === 'metrics' && visState.params.type !== 'timeseries') {
    return { ...visState,
      params: { ...visState.params,
        hide_last_value_indicator: true
      }
    };
  }

  return visState;
};

exports.commonHideTSVBLastValueIndicator = commonHideTSVBLastValueIndicator;

const commonRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel = visState => {
  if (visState && visState.type === 'metrics') {
    const {
      params
    } = visState;
    delete params.default_index_pattern;
    delete params.default_timefield;
    return visState;
  }

  return visState;
};

exports.commonRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel = commonRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel;

const commonAddEmptyValueColorRule = visState => {
  if (visState && visState.type === 'metrics') {
    const params = (0, _lodash.get)(visState, 'params') || {};

    const getRuleWithComparingToZero = (rules = []) => {
      const compareWithEqualMethods = ['gte', 'lte'];
      return (0, _lodash.last)(rules.filter(rule => compareWithEqualMethods.includes(rule.operator) && rule.value === 0));
    };

    const convertRuleToEmpty = (rule = {}) => ({ ...rule,
      id: _uuid.default.v4(),
      operator: 'empty',
      value: null
    });

    const addEmptyRuleToListIfNecessary = rules => {
      const rule = getRuleWithComparingToZero(rules);

      if (rule) {
        return [...rules, convertRuleToEmpty(rule)];
      }

      return rules;
    };

    const colorRules = {
      bar_color_rules: addEmptyRuleToListIfNecessary(params.bar_color_rules),
      background_color_rules: addEmptyRuleToListIfNecessary(params.background_color_rules),
      gauge_color_rules: addEmptyRuleToListIfNecessary(params.gauge_color_rules)
    };
    return { ...visState,
      params: { ...params,
        ...colorRules
      }
    };
  }

  return visState;
};

exports.commonAddEmptyValueColorRule = commonAddEmptyValueColorRule;

const commonMigrateVislibPie = visState => {
  if (visState && visState.type === 'pie') {
    const {
      params
    } = visState;
    const hasPalette = params === null || params === void 0 ? void 0 : params.palette;
    return { ...visState,
      params: { ...visState.params,
        ...(!hasPalette && {
          palette: {
            type: 'palette',
            name: 'kibana_palette'
          }
        }),
        distinctColors: true
      }
    };
  }

  return visState;
};

exports.commonMigrateVislibPie = commonMigrateVislibPie;

const commonMigrateTagCloud = visState => {
  if (visState && visState.type === 'tagcloud') {
    const {
      params
    } = visState;
    const hasPalette = params === null || params === void 0 ? void 0 : params.palette;
    return { ...visState,
      params: { ...visState.params,
        ...(!hasPalette && {
          palette: {
            type: 'palette',
            name: 'kibana_palette'
          }
        })
      }
    };
  }

  return visState;
};

exports.commonMigrateTagCloud = commonMigrateTagCloud;

const commonRemoveMarkdownLessFromTSVB = visState => {
  if (visState && visState.type === 'metrics') {
    const params = (0, _lodash.get)(visState, 'params') || {};

    if (params.type === 'markdown') {
      // remove less
      if (params.markdown_less) {
        delete params.markdown_less;
      } // remove markdown id from css


      if (params.markdown_css) {
        params.markdown_css = params.markdown_css.replace(new RegExp(`#markdown-${params.id}`, 'g'), '').trim();
      }
    }

    return { ...visState,
      params: { ...params
      }
    };
  }

  return visState;
};

exports.commonRemoveMarkdownLessFromTSVB = commonRemoveMarkdownLessFromTSVB;