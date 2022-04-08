"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strings = exports.progressFunction = exports.errors = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _common = require("../../../expressions/common");

var _constants = require("../constants");

var _types = require("../types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const strings = {
  help: _i18n.i18n.translate('expressionShape.functions.progressHelpText', {
    defaultMessage: 'Configures a progress element.'
  }),
  args: {
    barColor: _i18n.i18n.translate('expressionShape.functions.progress.args.barColorHelpText', {
      defaultMessage: 'The color of the background bar.'
    }),
    barWeight: _i18n.i18n.translate('expressionShape.functions.progress.args.barWeightHelpText', {
      defaultMessage: 'The thickness of the background bar.'
    }),
    font: _i18n.i18n.translate('expressionShape.functions.progress.args.fontHelpText', {
      defaultMessage: 'The {CSS} font properties for the label. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    label: _i18n.i18n.translate('expressionShape.functions.progress.args.labelHelpText', {
      defaultMessage: 'To show or hide the label, use {BOOLEAN_TRUE} or {BOOLEAN_FALSE}. Alternatively, provide a string to display as a label.',
      values: {
        BOOLEAN_TRUE: _constants.BOOLEAN_TRUE,
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE
      }
    }),
    max: _i18n.i18n.translate('expressionShape.functions.progress.args.maxHelpText', {
      defaultMessage: 'The maximum value of the progress element.'
    }),
    shape: _i18n.i18n.translate('expressionShape.functions.progress.args.shapeHelpText', {
      defaultMessage: `Select {list}, or {end}.`,
      values: {
        list: Object.values(_types.Progress).slice(0, -1).map(shape => `\`"${shape}"\``).join(', '),
        end: `\`"${Object.values(_types.Progress).slice(-1)[0]}"\``
      }
    }),
    valueColor: _i18n.i18n.translate('expressionShape.functions.progress.args.valueColorHelpText', {
      defaultMessage: 'The color of the progress bar.'
    }),
    valueWeight: _i18n.i18n.translate('expressionShape.functions.progress.args.valueWeightHelpText', {
      defaultMessage: 'The thickness of the progress bar.'
    })
  }
};
exports.strings = strings;
const errors = {
  invalidMaxValue: max => new Error(_i18n.i18n.translate('expressionShape.functions.progress.invalidMaxValueErrorMessage', {
    defaultMessage: "Invalid {arg} value: '{max, number}'. '{arg}' must be greater than 0",
    values: {
      arg: 'max',
      max
    }
  })),
  invalidValue: (value, max = 1) => new Error(_i18n.i18n.translate('expressionShape.functions.progress.invalidValueErrorMessage', {
    defaultMessage: "Invalid value: '{value, number}'. Value must be between 0 and {max, number}",
    values: {
      value,
      max
    }
  }))
};
exports.errors = errors;

const progressFunction = () => {
  const {
    help,
    args: argHelp
  } = strings;
  return {
    name: 'progress',
    aliases: [],
    type: 'render',
    inputTypes: ['number'],
    help,
    args: {
      shape: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.shape,
        options: Object.values(_types.Progress),
        default: 'gauge'
      },
      barColor: {
        types: ['string'],
        help: argHelp.barColor,
        default: `#f0f0f0`
      },
      barWeight: {
        types: ['number'],
        help: argHelp.barWeight,
        default: 20
      },
      font: {
        types: ['style'],
        help: argHelp.font,
        default: `{font size=24 family="${_common.openSans.value}" color="#000000" align=center}`
      },
      label: {
        types: ['boolean', 'string'],
        help: argHelp.label,
        default: true
      },
      max: {
        types: ['number'],
        help: argHelp.max,
        default: 1
      },
      valueColor: {
        types: ['string'],
        help: argHelp.valueColor,
        default: `#1785b0`
      },
      valueWeight: {
        types: ['number'],
        help: argHelp.valueWeight,
        default: 20
      }
    },
    fn: (value, args) => {
      if (args.max <= 0) {
        throw errors.invalidMaxValue(args.max);
      }

      if (value > args.max || value < 0) {
        throw errors.invalidValue(value, args.max);
      }

      let label = '';

      if (args.label) {
        label = typeof args.label === 'string' ? args.label : `${value}`;
      }

      let font = {};

      if ((0, _lodash.get)(args, 'font.spec')) {
        font = { ...args.font
        };
        font.spec.fill = args.font.spec.color; // SVG <text> uses fill for font color
      }

      return {
        type: 'render',
        as: 'progress',
        value: {
          value,
          ...args,
          label,
          font
        }
      };
    }
  };
};

exports.progressFunction = progressFunction;