"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVisTableData = exports.isVisSeriesData = void 0;

var _enums = require("./enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isVisTableData = data => data.type === _enums.PANEL_TYPES.TABLE;

exports.isVisTableData = isVisTableData;

const isVisSeriesData = data => data.type !== _enums.PANEL_TYPES.TABLE;

exports.isVisSeriesData = isVisSeriesData;