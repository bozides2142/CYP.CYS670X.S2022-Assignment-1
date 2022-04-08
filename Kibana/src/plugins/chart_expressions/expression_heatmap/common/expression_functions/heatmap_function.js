"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapFunction = void 0;

var _i18n = require("@kbn/i18n");

var _prepare_log_table = require("../../../../visualizations/common/prepare_log_table");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const convertToVisDimension = (columns, accessor) => {
  var _column$meta$params, _column$meta$params2;

  const column = columns.find(c => c.id === accessor);
  if (!column) return;
  return {
    accessor: Number(column.id),
    format: {
      id: (_column$meta$params = column.meta.params) === null || _column$meta$params === void 0 ? void 0 : _column$meta$params.id,
      params: { ...((_column$meta$params2 = column.meta.params) === null || _column$meta$params2 === void 0 ? void 0 : _column$meta$params2.params)
      }
    },
    type: 'vis_dimension'
  };
};

const prepareHeatmapLogTable = (columns, accessor, table, label) => {
  const dimension = typeof accessor === 'string' ? convertToVisDimension(columns, accessor) : accessor;

  if (dimension) {
    table.push([[dimension], label]);
  }
};

const heatmapFunction = () => ({
  name: _constants.EXPRESSION_HEATMAP_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressionHeatmap.function.help', {
    defaultMessage: 'Heatmap visualization'
  }),
  args: {
    // used only in legacy heatmap, consider it as @deprecated
    percentageMode: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('expressionHeatmap.function.percentageMode.help', {
        defaultMessage: 'When is on, tooltip and legends appear as percentages.'
      })
    },
    palette: {
      types: ['palette'],
      help: _i18n.i18n.translate('expressionHeatmap.function.palette.help', {
        defaultMessage: 'Provides colors for the values, based on the bounds.'
      })
    },
    legend: {
      types: [_constants.EXPRESSION_HEATMAP_LEGEND_NAME],
      help: _i18n.i18n.translate('expressionHeatmap.function.legendConfig.help', {
        defaultMessage: 'Configure the chart legend.'
      }),
      default: `{${_constants.EXPRESSION_HEATMAP_LEGEND_NAME}}`
    },
    gridConfig: {
      types: [_constants.EXPRESSION_HEATMAP_GRID_NAME],
      help: _i18n.i18n.translate('expressionHeatmap.function.gridConfig.help', {
        defaultMessage: 'Configure the heatmap layout.'
      }),
      default: `{${_constants.EXPRESSION_HEATMAP_GRID_NAME}}`
    },
    showTooltip: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.addTooltipHelpText', {
        defaultMessage: 'Show tooltip on hover'
      }),
      default: true
    },
    // not supported yet
    highlightInHover: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.highlightInHoverHelpText', {
        defaultMessage: 'When this is enabled, it highlights the ranges of the same color on legend hover'
      })
    },
    lastRangeIsRightOpen: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.lastRangeIsRightOpen', {
        defaultMessage: 'If is set to true, the last range value will be right open'
      }),
      default: true
    },
    xAccessor: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.xAccessorHelpText', {
        defaultMessage: 'The id of the x axis column or the corresponding dimension'
      })
    },
    yAccessor: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.yAccessorHelpText', {
        defaultMessage: 'The id of the y axis column or the corresponding dimension'
      })
    },
    valueAccessor: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.valueAccessorHelpText', {
        defaultMessage: 'The id of the value column or the corresponding dimension'
      }),
      required: true
    },
    // not supported yet, small multiples accessor
    splitRowAccessor: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.splitRowAccessorHelpText', {
        defaultMessage: 'The id of the split row or the corresponding dimension'
      })
    },
    // not supported yet, small multiples accessor
    splitColumnAccessor: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.splitColumnAccessorHelpText', {
        defaultMessage: 'The id of the split column or the corresponding dimension'
      })
    }
  },

  fn(data, args, handlers) {
    var _handlers$inspectorAd;

    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      const argsTable = [];

      if (args.valueAccessor) {
        prepareHeatmapLogTable(data.columns, args.valueAccessor, argsTable, _i18n.i18n.translate('expressionHeatmap.function.dimension.metric', {
          defaultMessage: 'Metric'
        }));
      }

      if (args.yAccessor) {
        prepareHeatmapLogTable(data.columns, args.yAccessor, argsTable, _i18n.i18n.translate('expressionHeatmap.function.dimension.yaxis', {
          defaultMessage: 'Y axis'
        }));
      }

      if (args.xAccessor) {
        prepareHeatmapLogTable(data.columns, args.xAccessor, argsTable, _i18n.i18n.translate('expressionHeatmap.function.dimension.xaxis', {
          defaultMessage: 'X axis'
        }));
      }

      if (args.splitRowAccessor) {
        prepareHeatmapLogTable(data.columns, args.splitRowAccessor, argsTable, _i18n.i18n.translate('expressionHeatmap.function.dimension.splitRow', {
          defaultMessage: 'Split by row'
        }));
      }

      if (args.splitColumnAccessor) {
        prepareHeatmapLogTable(data.columns, args.splitColumnAccessor, argsTable, _i18n.i18n.translate('expressionHeatmap.function.dimension.splitColumn', {
          defaultMessage: 'Split by column'
        }));
      }

      const logTable = (0, _prepare_log_table.prepareLogTable)(data, argsTable);
      handlers.inspectorAdapters.tables.logDatatable('default', logTable);
    }

    return {
      type: 'render',
      as: _constants.EXPRESSION_HEATMAP_NAME,
      value: {
        data,
        args
      }
    };
  }

});

exports.heatmapFunction = heatmapFunction;