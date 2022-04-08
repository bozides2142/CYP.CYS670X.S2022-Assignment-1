"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pieVisFunction = void 0;

var _i18n = require("@kbn/i18n");

var _expression_renderers = require("../types/expression_renderers");

var _prepare_log_table = require("../../../../visualizations/common/prepare_log_table");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const pieVisFunction = () => ({
  name: _constants.PIE_VIS_EXPRESSION_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressionPie.pieVis.function.help', {
    defaultMessage: 'Pie visualization'
  }),
  args: {
    metric: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.metricHelpText', {
        defaultMessage: 'Metric dimensions config'
      }),
      required: true
    },
    buckets: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.bucketsHelpText', {
        defaultMessage: 'Buckets dimensions config'
      }),
      multi: true
    },
    splitColumn: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.splitColumnHelpText', {
        defaultMessage: 'Split by column dimension config'
      }),
      multi: true
    },
    splitRow: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.splitRowHelpText', {
        defaultMessage: 'Split by row dimension config'
      }),
      multi: true
    },
    addTooltip: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.addTooltipHelpText', {
        defaultMessage: 'Show tooltip on slice hover'
      }),
      default: true
    },
    addLegend: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.addLegendHelpText', {
        defaultMessage: 'Show legend chart legend'
      })
    },
    legendPosition: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.legendPositionHelpText', {
        defaultMessage: 'Position the legend on top, bottom, left, right of the chart'
      })
    },
    nestedLegend: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.nestedLegendHelpText', {
        defaultMessage: 'Show a more detailed legend'
      }),
      default: false
    },
    truncateLegend: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.truncateLegendHelpText', {
        defaultMessage: 'Defines if the legend items will be truncated or not'
      }),
      default: true
    },
    maxLegendLines: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.maxLegendLinesHelpText', {
        defaultMessage: 'Defines the number of lines per legend item'
      })
    },
    distinctColors: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.distinctColorsHelpText', {
        defaultMessage: 'Maps different color per slice. Slices with the same value have the same color'
      }),
      default: false
    },
    isDonut: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.isDonutHelpText', {
        defaultMessage: 'Displays the pie chart as donut'
      }),
      default: false
    },
    emptySizeRatio: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.emptySizeRatioHelpText', {
        defaultMessage: 'Defines donut inner empty area size'
      }),
      default: _expression_renderers.EmptySizeRatios.SMALL
    },
    palette: {
      types: ['palette', 'system_palette'],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.paletteHelpText', {
        defaultMessage: 'Defines the chart palette name'
      }),
      default: '{palette}'
    },
    labels: {
      types: [_constants.PIE_LABELS_VALUE],
      help: _i18n.i18n.translate('expressionPie.pieVis.function.args.labelsHelpText', {
        defaultMessage: 'Pie labels config'
      }),
      default: `{${_constants.PIE_LABELS_FUNCTION}}`
    }
  },

  fn(context, args, handlers) {
    var _handlers$inspectorAd, _handlers$isSyncColor, _handlers$isSyncColor2;

    const visConfig = { ...args,
      palette: args.palette,
      dimensions: {
        metric: args.metric,
        buckets: args.buckets,
        splitColumn: args.splitColumn,
        splitRow: args.splitRow
      }
    };

    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      const logTable = (0, _prepare_log_table.prepareLogTable)(context, [[[args.metric], _i18n.i18n.translate('expressionPie.pieVis.function.dimension.metric', {
        defaultMessage: 'Slice size'
      })], [args.buckets, _i18n.i18n.translate('expressionPie.pieVis.function.dimension.buckets', {
        defaultMessage: 'Slice'
      })], [args.splitColumn, _i18n.i18n.translate('expressionPie.pieVis.function.dimension.splitcolumn', {
        defaultMessage: 'Column split'
      })], [args.splitRow, _i18n.i18n.translate('expressionPie.pieVis.function.dimension.splitrow', {
        defaultMessage: 'Row split'
      })]]);
      handlers.inspectorAdapters.tables.logDatatable('default', logTable);
    }

    return {
      type: 'render',
      as: _constants.PIE_VIS_EXPRESSION_NAME,
      value: {
        visData: context,
        visConfig,
        syncColors: (_handlers$isSyncColor = handlers === null || handlers === void 0 ? void 0 : (_handlers$isSyncColor2 = handlers.isSyncColorsEnabled) === null || _handlers$isSyncColor2 === void 0 ? void 0 : _handlers$isSyncColor2.call(handlers)) !== null && _handlers$isSyncColor !== void 0 ? _handlers$isSyncColor : false,
        visType: 'pie',
        params: {
          listenOnChange: true
        }
      }
    };
  }

});

exports.pieVisFunction = pieVisFunction;