"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricVis = void 0;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");

var _resolved_arg = require("../../../public/lib/resolved_arg");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  MetricVis: strings
} = _i18n.ViewStrings;

const metricVis = () => ({
  name: 'metricVis',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'metric',
    displayName: strings.getMetricColumnDisplayName(),
    help: strings.getMetricColumnHelp(),
    argType: 'vis_dimension',
    multi: true,
    default: `{visdimension}`
  }, {
    name: 'bucket',
    displayName: strings.getBucketColumnDisplayName(),
    help: strings.getBucketColumnHelp(),
    argType: 'vis_dimension',
    default: `{visdimension}`
  }, {
    name: 'palette',
    argType: 'stops_palette'
  }, {
    name: 'font',
    displayName: strings.getFontColumnDisplayName(),
    help: strings.getFontColumnHelp(),
    argType: 'font',
    default: `{font size=60 align="center"}`
  }, {
    name: 'colorMode',
    displayName: strings.getColorModeColumnDisplayName(),
    help: strings.getColorModeColumnHelp(),
    argType: 'select',
    default: 'Labels',
    options: {
      choices: [{
        value: 'None',
        name: strings.getColorModeNoneOption()
      }, {
        value: 'Labels',
        name: strings.getColorModeLabelOption()
      }, {
        value: 'Background',
        name: strings.getColorModeBackgroundOption()
      }]
    }
  }, {
    name: 'showLabels',
    displayName: strings.getShowLabelsColumnDisplayName(),
    help: strings.getShowLabelsColumnHelp(),
    argType: 'toggle',
    default: true
  }, {
    name: 'percentageMode',
    displayName: strings.getPercentageModeColumnDisplayName(),
    help: strings.getPercentageModeColumnHelp(),
    argType: 'toggle'
  }],

  resolve({
    context
  }) {
    if ((0, _resolved_arg.getState)(context) !== 'ready') {
      return {
        columns: []
      };
    }

    return {
      columns: (0, _lodash.get)((0, _resolved_arg.getValue)(context), 'columns', [])
    };
  }

});

exports.metricVis = metricVis;