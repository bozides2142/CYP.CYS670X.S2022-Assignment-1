"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapLegend = void 0;

var _lodash = require("lodash");

var _resolved_arg = require("../../../public/lib/resolved_arg");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  HeatmapLegend: strings
} = _i18n.ModelStrings;

const heatmapLegend = () => ({
  name: 'heatmap_legend',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'isVisible',
    displayName: strings.getIsVisibleDisplayName(),
    help: strings.getIsVisibleHelp(),
    argType: 'toggle',
    default: true
  }, {
    name: 'position',
    displayName: strings.getPositionDisplayName(),
    help: strings.getPositionHelp(),
    argType: 'select',
    default: 'right',
    options: {
      choices: [{
        value: 'top',
        name: strings.getPositionTopOption()
      }, {
        value: 'right',
        name: strings.getPositionRightOption()
      }, {
        value: 'bottom',
        name: strings.getPositionBottomOption()
      }, {
        value: 'left',
        name: strings.getPositionLeftOption()
      }]
    }
  }, {
    name: 'maxLines',
    displayName: strings.getMaxLinesDisplayName(),
    help: strings.getMaxLinesHelp(),
    argType: 'number',
    default: 10
  }, {
    name: 'shouldTruncate',
    displayName: strings.getShouldTruncateDisplayName(),
    help: strings.getShouldTruncateHelp(),
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

exports.heatmapLegend = heatmapLegend;