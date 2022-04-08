"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pieLabelsFunction = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const pieLabelsFunction = () => ({
  name: _constants.PIE_LABELS_FUNCTION,
  help: _i18n.i18n.translate('expressionPie.pieLabels.function.help', {
    defaultMessage: 'Generates the pie labels object'
  }),
  type: _constants.PIE_LABELS_VALUE,
  args: {
    show: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.show.help', {
        defaultMessage: 'Displays the pie labels'
      }),
      default: true
    },
    position: {
      types: ['string'],
      default: 'default',
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.position.help', {
        defaultMessage: 'Defines the label position'
      })
    },
    values: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.values.help', {
        defaultMessage: 'Displays the values inside the slices'
      }),
      default: true
    },
    percentDecimals: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.percentDecimals.help', {
        defaultMessage: 'Defines the number of decimals that will appear on the values as percent'
      }),
      default: 2
    },
    lastLevel: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.lastLevel.help', {
        defaultMessage: 'Show top level labels only'
      }),
      default: true
    },
    truncate: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.truncate.help', {
        defaultMessage: 'Defines the number of characters that the slice value will display'
      }),
      default: null
    },
    valuesFormat: {
      types: ['string'],
      default: 'percent',
      help: _i18n.i18n.translate('expressionPie.pieLabels.function.args.valuesFormat.help', {
        defaultMessage: 'Defines the format of the values'
      })
    }
  },
  fn: (context, args) => {
    return {
      type: _constants.PIE_LABELS_VALUE,
      show: args.show,
      position: args.position,
      percentDecimals: args.percentDecimals,
      values: args.values,
      truncate: args.truncate,
      valuesFormat: args.valuesFormat,
      last_level: args.lastLevel
    };
  }
});

exports.pieLabelsFunction = pieLabelsFunction;