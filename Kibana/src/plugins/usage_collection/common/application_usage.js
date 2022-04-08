"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDailyId = void 0;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getDailyId = ({
  appId,
  dayId,
  viewId
}) => {
  return !viewId || viewId === _constants.MAIN_APP_DEFAULT_VIEW_ID ? `${appId}:${dayId}` : `${appId}:${dayId}:${viewId}`;
};

exports.getDailyId = getDailyId;