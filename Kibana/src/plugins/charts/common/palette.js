"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultCustomColors = void 0;
exports.palette = palette;
exports.systemPalette = systemPalette;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _constants = require("./constants");

var _static = require("./static");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultCustomColors = [// This set of defaults originated in Canvas, which, at present, is the primary
// consumer of this function.  Changing this default requires a change in Canvas
// logic, which would likely be a breaking change in 7.x.
'#882E72', '#B178A6', '#D6C1DE', '#1965B0', '#5289C7', '#7BAFDE', '#4EB265', '#90C987', '#CAE0AB', '#F7EE55', '#F6C141', '#F1932D', '#E8601C', '#DC050C'];
exports.defaultCustomColors = defaultCustomColors;

function palette() {
  return {
    name: 'palette',
    aliases: [],
    type: 'palette',
    inputTypes: ['null'],
    help: _i18n.i18n.translate('charts.functions.paletteHelpText', {
      defaultMessage: 'Creates a color palette.'
    }),
    args: {
      color: {
        aliases: ['_'],
        multi: true,
        types: ['string'],
        help: _i18n.i18n.translate('charts.functions.palette.args.colorHelpText', {
          defaultMessage: 'The palette colors. Accepts an {html} color name, {hex}, {hsl}, {hsla}, {rgb}, or {rgba}.',
          values: {
            html: 'HTML',
            rgb: 'RGB',
            rgba: 'RGBA',
            hex: 'HEX',
            hsl: 'HSL',
            hsla: 'HSLA'
          }
        }),
        required: false
      },
      stop: {
        multi: true,
        types: ['number'],
        help: _i18n.i18n.translate('charts.functions.palette.args.stopHelpText', {
          defaultMessage: 'The palette color stops. When used, it must be associated with each color.'
        }),
        required: false
      },
      continuity: {
        types: ['string'],
        options: ['above', 'below', 'all', 'none'],
        default: 'above',
        help: ''
      },
      rangeMin: {
        types: ['number'],
        help: ''
      },
      rangeMax: {
        types: ['number'],
        help: ''
      },
      range: {
        types: ['string'],
        options: ['number', 'percent'],
        default: 'percent',
        help: ''
      },
      gradient: {
        types: ['boolean'],
        default: false,
        help: _i18n.i18n.translate('charts.functions.palette.args.gradientHelpText', {
          defaultMessage: 'Make a gradient palette where supported?'
        }),
        options: [true, false]
      },
      reverse: {
        types: ['boolean'],
        default: false,
        help: _i18n.i18n.translate('charts.functions.palette.args.reverseHelpText', {
          defaultMessage: 'Reverse the palette?'
        }),
        options: [true, false]
      }
    },
    fn: (input, args) => {
      const {
        color,
        continuity,
        reverse,
        gradient,
        stop,
        range,
        rangeMin,
        rangeMax
      } = args;
      const colors = [].concat(color || defaultCustomColors);
      const stops = [].concat(stop || []);

      if (stops.length > 0 && colors.length !== stops.length) {
        throw Error('When stop is used, each color must have an associated stop value.');
      } // If the user has defined stops, choose rangeMin/Max, provided by user or range,
      // taken from first/last element of ranges or default range (0 or 100).


      const calculateRange = (userRange, stopsRange, defaultRange) => {
        var _ref;

        return (_ref = userRange !== null && userRange !== void 0 ? userRange : stopsRange) !== null && _ref !== void 0 ? _ref : defaultRange;
      };

      const rangeMinDefault = 0;
      const rangeMaxDefault = 100;
      return {
        type: 'palette',
        name: 'custom',
        params: {
          colors: reverse ? colors.reverse() : colors,
          stops,
          range: range !== null && range !== void 0 ? range : 'percent',
          gradient,
          continuity,
          rangeMin: (0, _static.checkIsMinContinuity)(continuity) ? Number.NEGATIVE_INFINITY : calculateRange(rangeMin, stops[0], rangeMinDefault),
          rangeMax: (0, _static.checkIsMaxContinuity)(continuity) ? Number.POSITIVE_INFINITY : calculateRange(rangeMax, (0, _lodash.last)(stops), rangeMaxDefault)
        }
      };
    }
  };
}

function systemPalette() {
  return {
    name: 'system_palette',
    aliases: [],
    type: 'palette',
    inputTypes: ['null'],
    help: _i18n.i18n.translate('charts.functions.systemPaletteHelpText', {
      defaultMessage: 'Creates a dynamic color palette.'
    }),
    args: {
      name: {
        types: ['string'],
        help: _i18n.i18n.translate('charts.functions.systemPalette.args.nameHelpText', {
          defaultMessage: 'Name of the palette in the palette list'
        }),
        options: _constants.paletteIds
      }
    },
    fn: (input, args) => {
      return {
        type: 'palette',
        name: args.name
      };
    }
  };
}