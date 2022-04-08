"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricVisFunction = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../types");

var _prepare_log_table = require("../../../../visualizations/common/prepare_log_table");

var _common = require("../../../../charts/common");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const metricVisFunction = () => ({
  name: _constants.EXPRESSION_METRIC_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressionMetricVis.function.help', {
    defaultMessage: 'Metric visualization'
  }),
  args: {
    percentageMode: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('expressionMetricVis.function.percentageMode.help', {
        defaultMessage: 'Shows metric in percentage mode. Requires colorRange to be set.'
      })
    },
    colorMode: {
      types: ['string'],
      default: `"${_common.ColorMode.None}"`,
      options: [_common.ColorMode.None, _common.ColorMode.Labels, _common.ColorMode.Background],
      help: _i18n.i18n.translate('expressionMetricVis.function.colorMode.help', {
        defaultMessage: 'Which part of metric to color'
      })
    },
    palette: {
      types: ['palette'],
      help: _i18n.i18n.translate('expressionMetricVis.function.palette.help', {
        defaultMessage: 'Provides colors for the values, based on the bounds.'
      })
    },
    showLabels: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('expressionMetricVis.function.showLabels.help', {
        defaultMessage: 'Shows labels under the metric values.'
      })
    },
    font: {
      types: ['style'],
      help: _i18n.i18n.translate('expressionMetricVis.function.font.help', {
        defaultMessage: 'Font settings.'
      }),
      default: `{font size=60 align="center"}`
    },
    metric: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('expressionMetricVis.function.metric.help', {
        defaultMessage: 'metric dimension configuration'
      }),
      required: true,
      multi: true
    },
    bucket: {
      types: ['vis_dimension'],
      help: _i18n.i18n.translate('expressionMetricVis.function.bucket.help', {
        defaultMessage: 'bucket dimension configuration'
      })
    }
  },

  fn(input, args, handlers) {
    var _args$palette, _handlers$inspectorAd, _args$palette2;

    if (args.percentageMode && !((_args$palette = args.palette) !== null && _args$palette !== void 0 && _args$palette.params)) {
      throw new Error('Palette must be provided when using percentageMode');
    }

    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      const argsTable = [[args.metric, _i18n.i18n.translate('expressionMetricVis.function.dimension.metric', {
        defaultMessage: 'Metric'
      })]];

      if (args.bucket) {
        argsTable.push([[args.bucket], _i18n.i18n.translate('expressionMetricVis.function.dimension.splitGroup', {
          defaultMessage: 'Split group'
        })]);
      }

      const logTable = (0, _prepare_log_table.prepareLogTable)(input, argsTable);
      handlers.inspectorAdapters.tables.logDatatable('default', logTable);
    }

    return {
      type: 'render',
      as: _constants.EXPRESSION_METRIC_NAME,
      value: {
        visData: input,
        visType: _types.visType,
        visConfig: {
          metric: {
            palette: (_args$palette2 = args.palette) === null || _args$palette2 === void 0 ? void 0 : _args$palette2.params,
            percentageMode: args.percentageMode,
            metricColorMode: args.colorMode,
            labels: {
              show: args.showLabels
            },
            style: {
              bgColor: args.colorMode === _common.ColorMode.Background,
              labelColor: args.colorMode === _common.ColorMode.Labels,
              ...args.font
            }
          },
          dimensions: {
            metrics: args.metric,
            ...(args.bucket ? {
              bucket: args.bucket
            } : {})
          }
        }
      }
    };
  }

});

exports.metricVisFunction = metricVisFunction;