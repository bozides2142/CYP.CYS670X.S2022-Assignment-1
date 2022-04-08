"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaletteType = void 0;

var _palette_picker = require("../../../../public/components/palette_picker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_PALETTE = 'default';
const STOPS_PALETTE = 'stops';
const paletteTypes = {
  [DEFAULT_PALETTE]: _palette_picker.PalettePicker,
  [STOPS_PALETTE]: _palette_picker.StopsPalettePicker
};

const getPaletteType = (type = DEFAULT_PALETTE) => {
  var _paletteTypes$type;

  return (_paletteTypes$type = paletteTypes[type]) !== null && _paletteTypes$type !== void 0 ? _paletteTypes$type : paletteTypes[DEFAULT_PALETTE];
};

exports.getPaletteType = getPaletteType;