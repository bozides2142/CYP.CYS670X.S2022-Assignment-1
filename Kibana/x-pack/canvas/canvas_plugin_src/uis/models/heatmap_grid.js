"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapGrid = void 0;

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
  HeatmapGrid: strings
} = _i18n.ModelStrings;

const heatmapGrid = () => ({
  name: 'heatmap_grid',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'strokeWidth',
    displayName: strings.getStrokeWidthDisplayName(),
    help: strings.getStrokeWidthHelp(),
    argType: 'number'
  }, {
    name: 'strokeColor',
    displayName: strings.getStrokeColorDisplayName(),
    help: strings.getStrokeColorDisplayName(),
    argType: 'color_picker'
  }, {
    name: 'isCellLabelVisible',
    displayName: strings.getIsCellLabelVisibleDisplayName(),
    help: strings.getIsCellLabelVisibleHelp(),
    argType: 'toggle'
  }, {
    name: 'isYAxisLabelVisible',
    displayName: strings.getIsYAxisLabelVisibleDisplayName(),
    help: strings.getIsYAxisLabelVisibleHelp(),
    argType: 'toggle'
  }, {
    name: 'isYAxisTitleVisible',
    displayName: strings.getIsYAxisTitleVisibleDisplayName(),
    help: strings.getIsYAxisTitleVisibleHelp(),
    argType: 'toggle'
  }, {
    name: 'isXAxisLabelVisible',
    displayName: strings.getIsXAxisLabelVisibleDisplayName(),
    help: strings.getIsXAxisLabelVisibleHelp(),
    argType: 'toggle'
  }, {
    name: 'isXAxisTitleVisible',
    displayName: strings.getIsXAxisTitleVisibleDisplayName(),
    help: strings.getIsXAxisTitleVisibleHelp(),
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

exports.heatmapGrid = heatmapGrid;