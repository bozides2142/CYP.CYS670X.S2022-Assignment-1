"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MULTILAYER_TIME_AXIS_STYLE = void 0;

var _charts = require("@elastic/charts");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MULTILAYER_TIME_AXIS_STYLE = {
  tickLabel: {
    visible: true,
    padding: 0,
    rotation: 0,
    alignment: {
      vertical: _charts.Position.Bottom,
      horizontal: _charts.Position.Left
    }
  },
  tickLine: {
    visible: true,
    size: 0.0001,
    padding: 4
  }
};
exports.MULTILAYER_TIME_AXIS_STYLE = MULTILAYER_TIME_AXIS_STYLE;