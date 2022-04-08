"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagcloudFunction = exports.errors = void 0;

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
const strings = {
  help: _i18n.i18n.translate('expressionTagcloud.functions.tagcloudHelpText', {
    defaultMessage: 'Tagcloud visualization.'
  }),
  args: {
    scale: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.scaleHelpText', {
      defaultMessage: 'Scale to determine font size of a word'
    }),
    orientation: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.orientationHelpText', {
      defaultMessage: 'Orientation of words inside tagcloud'
    }),
    minFontSize: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.minFontSizeHelpText', {
      defaultMessage: 'Min font size'
    }),
    maxFontSize: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.maxFontSizeHelpText', {
      defaultMessage: 'Max font size'
    }),
    showLabel: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.showLabelHelpText', {
      defaultMessage: 'Show chart label'
    }),
    palette: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.paletteHelpText', {
      defaultMessage: 'Defines the chart palette name'
    }),
    metric: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.metricHelpText', {
      defaultMessage: 'metric dimension configuration'
    }),
    bucket: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.args.bucketHelpText', {
      defaultMessage: 'bucket dimension configuration'
    })
  },
  dimension: {
    tags: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.dimension.tags', {
      defaultMessage: 'Tags'
    }),
    tagSize: _i18n.i18n.translate('expressionTagcloud.functions.tagcloud.dimension.tagSize', {
      defaultMessage: 'Tag size'
    })
  }
};
const errors = {
  invalidPercent: percent => new Error(_i18n.i18n.translate('expressionTagcloud.functions.tagcloud.invalidPercentErrorMessage', {
    defaultMessage: "Invalid value: '{percent}'. Percentage must be between 0 and 1",
    values: {
      percent
    }
  })),
  invalidImageUrl: imageUrl => new Error(_i18n.i18n.translate('expressionTagcloud.functions.tagcloud.invalidImageUrl', {
    defaultMessage: "Invalid image url: '{imageUrl}'.",
    values: {
      imageUrl
    }
  }))
};
exports.errors = errors;

const tagcloudFunction = () => {
  const {
    help,
    args: argHelp,
    dimension
  } = strings;
  return {
    name: _constants.EXPRESSION_NAME,
    type: 'render',
    inputTypes: ['datatable'],
    help,
    args: {
      scale: {
        types: ['string'],
        default: 'linear',
        options: ['linear', 'log', 'square root'],
        help: argHelp.scale
      },
      orientation: {
        types: ['string'],
        default: 'single',
        options: ['single', 'right angled', 'multiple'],
        help: argHelp.orientation
      },
      minFontSize: {
        types: ['number'],
        default: 18,
        help: argHelp.minFontSize
      },
      maxFontSize: {
        types: ['number'],
        default: 72,
        help: argHelp.maxFontSize
      },
      showLabel: {
        types: ['boolean'],
        default: true,
        help: argHelp.showLabel
      },
      palette: {
        types: ['palette', 'system_palette'],
        help: argHelp.palette,
        default: '{palette}'
      },
      metric: {
        types: ['vis_dimension'],
        help: argHelp.metric,
        required: true
      },
      bucket: {
        types: ['vis_dimension'],
        help: argHelp.bucket
      }
    },

    fn(input, args, handlers) {
      var _handlers$inspectorAd, _handlers$isSyncColor, _handlers$isSyncColor2;

      const visParams = {
        scale: args.scale,
        orientation: args.orientation,
        minFontSize: args.minFontSize,
        maxFontSize: args.maxFontSize,
        showLabel: args.showLabel,
        metric: args.metric,
        ...(args.bucket && {
          bucket: args.bucket
        }),
        palette: args.palette
      };

      if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
        const argsTable = [[[args.metric], dimension.tagSize]];

        if (args.bucket) {
          argsTable.push([[args.bucket], dimension.tags]);
        }

        const logTable = (0, _prepare_log_table.prepareLogTable)(input, argsTable);
        handlers.inspectorAdapters.tables.logDatatable('default', logTable);
      }

      return {
        type: 'render',
        as: _constants.EXPRESSION_NAME,
        value: {
          visData: input,
          visType: _constants.EXPRESSION_NAME,
          visParams,
          syncColors: (_handlers$isSyncColor = handlers === null || handlers === void 0 ? void 0 : (_handlers$isSyncColor2 = handlers.isSyncColorsEnabled) === null || _handlers$isSyncColor2 === void 0 ? void 0 : _handlers$isSyncColor2.call(handlers)) !== null && _handlers$isSyncColor !== void 0 ? _handlers$isSyncColor : false
        }
      };
    }

  };
};

exports.tagcloudFunction = tagcloudFunction;