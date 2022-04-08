"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strings = exports.metricFunction = void 0;

var _i18n = require("@kbn/i18n");

var _fonts = require("../../../expressions/common/fonts");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const strings = {
  help: _i18n.i18n.translate('expressionMetric.functions.metricHelpText', {
    defaultMessage: 'Displays a number over a label.'
  }),
  args: {
    label: _i18n.i18n.translate('expressionMetric.functions.metric.args.labelHelpText', {
      defaultMessage: 'The text describing the metric.'
    }),
    labelFont: _i18n.i18n.translate('expressionMetric.functions.metric.args.labelFontHelpText', {
      defaultMessage: 'The {CSS} font properties for the label. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    metricFont: _i18n.i18n.translate('expressionMetric.functions.metric.args.metricFontHelpText', {
      defaultMessage: 'The {CSS} font properties for the metric. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    // TODO: Find a way to generate the docs URL here
    metricFormat: _i18n.i18n.translate('expressionMetric.functions.metric.args.metricFormatHelpText', {
      defaultMessage: 'A {NUMERALJS} format string. For example, {example1} or {example2}.',
      values: {
        example1: '`"0.0a"`',
        example2: '`"0%"`',
        NUMERALJS: _constants.NUMERALJS
      }
    })
  }
};
exports.strings = strings;

const metricFunction = () => {
  const {
    help,
    args: argHelp
  } = strings;
  return {
    name: 'metric',
    aliases: [],
    type: 'render',
    inputTypes: ['number', 'string', 'null'],
    help,
    args: {
      label: {
        types: ['string'],
        aliases: ['_', 'text', 'description'],
        help: argHelp.label,
        default: '""'
      },
      labelFont: {
        types: ['style'],
        help: argHelp.labelFont,
        default: `{font size=14 family="${_fonts.openSans.value}" color="#000000" align=center}`
      },
      metricFont: {
        types: ['style'],
        help: argHelp.metricFont,
        default: `{font size=48 family="${_fonts.openSans.value}" color="#000000" align=center lHeight=48}`
      },
      metricFormat: {
        types: ['string'],
        aliases: ['format'],
        help: argHelp.metricFormat
      }
    },
    fn: (input, {
      label,
      labelFont,
      metricFont,
      metricFormat
    }) => {
      return {
        type: 'render',
        as: 'metric',
        value: {
          metric: input === null ? '?' : input,
          label,
          labelFont,
          metricFont,
          metricFormat
        }
      };
    }
  };
};

exports.metricFunction = metricFunction;