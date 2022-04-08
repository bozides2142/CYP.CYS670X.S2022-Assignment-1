"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLegendConfig = void 0;

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const acceptedPositions = [_types.Legend.NORTH_WEST, _types.Legend.SOUTH_WEST, _types.Legend.NORTH_EAST, _types.Legend.SOUTH_EAST];

const getLegendConfig = (legend, size) => {
  if (!legend || size < 2) {
    return {
      show: false
    };
  }

  const config = {
    show: true,
    backgroundOpacity: 0,
    labelBoxBorderColor: 'transparent'
  }; // @ts-expect-error

  config.position = !legend || acceptedPositions.includes(legend) ? legend : 'ne';
  return config;
};

exports.getLegendConfig = getLegendConfig;