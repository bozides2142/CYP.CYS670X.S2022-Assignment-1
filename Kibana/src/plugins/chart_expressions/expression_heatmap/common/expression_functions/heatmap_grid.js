"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapGridConfig = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const heatmapGridConfig = {
  name: _constants.EXPRESSION_HEATMAP_GRID_NAME,
  aliases: [],
  type: _constants.EXPRESSION_HEATMAP_GRID_NAME,
  help: `Configure the heatmap layout`,
  inputTypes: ['null'],
  args: {
    // grid
    strokeWidth: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.strokeWidth.help', {
        defaultMessage: 'Specifies the grid stroke width'
      }),
      required: false
    },
    strokeColor: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.strokeColor.help', {
        defaultMessage: 'Specifies the grid stroke color'
      }),
      required: false
    },
    // cells
    isCellLabelVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.isCellLabelVisible.help', {
        defaultMessage: 'Specifies whether or not the cell label is visible.'
      })
    },
    // Y-axis
    isYAxisLabelVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.isYAxisLabelVisible.help', {
        defaultMessage: 'Specifies whether or not the Y-axis labels are visible.'
      })
    },
    isYAxisTitleVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.isYAxisTitleVisible.help', {
        defaultMessage: 'Specifies whether or not the Y-axis title is visible.'
      })
    },
    yTitle: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.yTitle.help', {
        defaultMessage: 'Specifies the title of the y axis'
      }),
      required: false
    },
    // X-axis
    isXAxisLabelVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.isXAxisLabelVisible.help', {
        defaultMessage: 'Specifies whether or not the X-axis labels are visible.'
      })
    },
    isXAxisTitleVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.isXAxisTitleVisible.help', {
        defaultMessage: 'Specifies whether or not the X-axis title is visible.'
      })
    },
    xTitle: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.grid.xTitle.help', {
        defaultMessage: 'Specifies the title of the x axis'
      }),
      required: false
    }
  },

  fn(input, args) {
    return {
      type: _constants.EXPRESSION_HEATMAP_GRID_NAME,
      ...args
    };
  }

};
exports.heatmapGridConfig = heatmapGridConfig;