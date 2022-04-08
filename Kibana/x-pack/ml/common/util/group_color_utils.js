"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabColor = tabColor;

var _uiTheme = require("@kbn/ui-theme");

var _string_utils = require("./string_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const COLORS = [_uiTheme.euiDarkVars.euiColorVis0, _uiTheme.euiDarkVars.euiColorVis1, _uiTheme.euiDarkVars.euiColorVis2, _uiTheme.euiDarkVars.euiColorVis3, _uiTheme.euiDarkVars.euiColorVis4, _uiTheme.euiDarkVars.euiColorVis5, _uiTheme.euiDarkVars.euiColorVis6, _uiTheme.euiDarkVars.euiColorVis7, _uiTheme.euiDarkVars.euiColorVis8, _uiTheme.euiDarkVars.euiColorVis9, _uiTheme.euiDarkVars.euiColorDarkShade, _uiTheme.euiDarkVars.euiColorPrimary];
const colorMap = {};

function tabColor(name) {
  if (colorMap[name] === undefined) {
    const n = (0, _string_utils.stringHash)(name);
    const color = COLORS[n % COLORS.length];
    colorMap[name] = color;
    return color;
  } else {
    return colorMap[name];
  }
}