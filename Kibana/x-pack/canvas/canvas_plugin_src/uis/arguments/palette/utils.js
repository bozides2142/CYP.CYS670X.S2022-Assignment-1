"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCustomPalette = exports.astToPalette = exports.CUSTOM_PALETTE = void 0;

var _interpreter = require("@kbn/interpreter");

var _lib = require("../../../../common/lib");

var _i18n = require("../../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Palette: strings
} = _i18n.ArgumentStrings;
const CUSTOM_PALETTE = 'custom';
exports.CUSTOM_PALETTE = CUSTOM_PALETTE;

const createCustomPalette = paletteParams => ({
  id: CUSTOM_PALETTE,
  label: strings.getCustomPaletteLabel(),
  ...paletteParams
});

exports.createCustomPalette = createCustomPalette;

function reduceElementsWithType(arr, arg, type, onError) {
  if ((0, _interpreter.getType)(arg) !== type) {
    onError();
  }

  return [...arr, arg];
} // TODO: This is weird, its basically a reimplementation of what the interpretter would return.
// Probably a better way todo this, and maybe a better way to handle template type objects in general?


const astToPalette = ({
  chain
}, onError) => {
  var _chain$0$arguments;

  if (chain.length !== 1 || chain[0].function !== 'palette') {
    onError();
    return null;
  }

  const {
    _,
    stop: argStops,
    gradient: argGradient,
    ...restArgs
  } = (_chain$0$arguments = chain[0].arguments) !== null && _chain$0$arguments !== void 0 ? _chain$0$arguments : {};

  try {
    var _$reduce, _argStops$reduce;

    const colors = (_$reduce = _ === null || _ === void 0 ? void 0 : _.reduce((args, arg) => {
      return reduceElementsWithType(args, arg, 'string', onError);
    }, [])) !== null && _$reduce !== void 0 ? _$reduce : [];
    const stops = (_argStops$reduce = argStops === null || argStops === void 0 ? void 0 : argStops.reduce((args, arg) => {
      return reduceElementsWithType(args, arg, 'number', onError);
    }, [])) !== null && _argStops$reduce !== void 0 ? _argStops$reduce : [];
    const gradient = !!(argGradient !== null && argGradient !== void 0 && argGradient[0]);
    const palette = (stops.length ? _lib.identifyPartialPalette : _lib.identifyPalette)({
      colors,
      gradient
    });
    const restPreparedArgs = Object.keys(restArgs).reduce((acc, argName) => {
      var _restArgs$argName, _restArgs$argName2;

      acc[argName] = ((_restArgs$argName = restArgs[argName]) === null || _restArgs$argName === void 0 ? void 0 : _restArgs$argName.length) > 1 ? restArgs[argName] : (_restArgs$argName2 = restArgs[argName]) === null || _restArgs$argName2 === void 0 ? void 0 : _restArgs$argName2[0];
      return acc;
    }, {});

    if (palette) {
      return { ...palette,
        ...restPreparedArgs,
        stops
      };
    }

    return createCustomPalette({
      colors,
      gradient,
      stops,
      ...restPreparedArgs
    });
  } catch (e) {
    onError();
  }

  return null;
};

exports.astToPalette = astToPalette;