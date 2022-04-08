"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapLegendConfig = void 0;

var _charts = require("@elastic/charts");

var _i18n = require("@kbn/i18n");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const heatmapLegendConfig = {
  name: _constants.EXPRESSION_HEATMAP_LEGEND_NAME,
  aliases: [],
  type: _constants.EXPRESSION_HEATMAP_LEGEND_NAME,
  help: `Configure the heatmap chart's legend`,
  inputTypes: ['null'],
  args: {
    isVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.isVisible.help', {
        defaultMessage: 'Specifies whether or not the legend is visible.'
      })
    },
    position: {
      types: ['string'],
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.position.help', {
        defaultMessage: 'Specifies the legend position.'
      })
    },
    maxLines: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.maxLines.help', {
        defaultMessage: 'Specifies the number of lines per legend item.'
      })
    },
    shouldTruncate: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.shouldTruncate.help', {
        defaultMessage: 'Specifies whether or not the legend items should be truncated.'
      })
    }
  },

  fn(input, args) {
    return {
      type: _constants.EXPRESSION_HEATMAP_LEGEND_NAME,
      ...args
    };
  }

};
exports.heatmapLegendConfig = heatmapLegendConfig;