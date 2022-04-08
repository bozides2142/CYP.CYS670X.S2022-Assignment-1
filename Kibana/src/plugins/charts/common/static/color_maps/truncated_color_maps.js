"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncatedColorSchemas = exports.truncatedColorMaps = void 0;

var _color_maps = require("./color_maps");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const truncatedColorMaps = {};
exports.truncatedColorMaps = truncatedColorMaps;
const colormaps = _color_maps.vislibColorMaps;

for (const key in colormaps) {
  if (colormaps.hasOwnProperty(key)) {
    // slice off lightest colors
    // @ts-ignore
    const color = colormaps[key];
    truncatedColorMaps[key] = { ...color,
      value: color.value.slice(Math.floor(color.value.length / 4))
    };
  }
}

const truncatedColorSchemas = Object.values(truncatedColorMaps).map(({
  id,
  label
}) => ({
  value: id,
  text: label
}));
exports.truncatedColorSchemas = truncatedColorSchemas;