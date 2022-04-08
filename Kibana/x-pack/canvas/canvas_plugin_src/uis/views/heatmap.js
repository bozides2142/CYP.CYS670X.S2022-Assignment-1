"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmap = void 0;

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
  Heatmap: strings
} = _i18n.ViewStrings;

const heatmap = () => ({
  name: 'heatmap',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'xAccessor',
    displayName: strings.getXAccessorDisplayName(),
    help: strings.getXAccessorHelp(),
    argType: 'vis_dimension',
    default: `{visdimension}`
  }, {
    name: 'yAccessor',
    displayName: strings.getYAccessorDisplayName(),
    help: strings.getYAccessorHelp(),
    argType: 'vis_dimension',
    default: `{visdimension}`
  }, {
    name: 'valueAccessor',
    displayName: strings.getValueAccessorDisplayName(),
    help: strings.getValueAccessorHelp(),
    argType: 'vis_dimension',
    default: `{visdimension}`
  }, {
    name: 'splitRowAccessor',
    displayName: strings.getSplitRowAccessorDisplayName(),
    help: strings.getSplitRowAccessorHelp(),
    argType: 'vis_dimension',
    default: `{visdimension}`
  }, {
    name: 'splitColumnAccessor',
    displayName: strings.getSplitColumnAccessorDisplayName(),
    help: strings.getSplitColumnAccessorHelp(),
    argType: 'vis_dimension',
    default: `{visdimension}`
  }, {
    name: 'showTooltip',
    displayName: strings.getShowTooltipDisplayName(),
    help: strings.getShowTooltipHelp(),
    argType: 'toggle',
    default: true
  }, {
    name: 'highlightInHover',
    displayName: strings.getHighlightInHoverDisplayName(),
    help: strings.getHighlightInHoverHelp(),
    argType: 'toggle'
  }, {
    name: 'lastRangeIsRightOpen',
    displayName: strings.getLastRangeIsRightOpenDisplayName(),
    help: strings.getLastRangeIsRightOpenHelp(),
    argType: 'toggle',
    default: true
  }, {
    name: 'palette',
    argType: 'stops_palette'
  }, {
    name: 'legend',
    displayName: strings.getLegendDisplayName(),
    help: strings.getLegendHelp(),
    type: 'model',
    argType: 'heatmap_legend'
  }, {
    name: 'gridConfig',
    displayName: strings.getGridConfigDisplayName(),
    help: strings.getGridConfigHelp(),
    type: 'model',
    argType: 'heatmap_grid'
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

exports.heatmap = heatmap;