"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSessionStatus = getSessionStatus;

var _moment = _interopRequireDefault(require("moment"));

var _common = require("../../../../../../src/plugins/data/common/");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getSessionStatus(session, config) {
  const searchStatuses = Object.values(session.idMapping);
  const curTime = (0, _moment.default)();

  if (searchStatuses.some(item => item.status === _types.SearchStatus.ERROR)) {
    return _common.SearchSessionStatus.ERROR;
  } else if (searchStatuses.length === 0 && curTime.diff((0, _moment.default)(session.touched), 'ms') > _moment.default.duration(config.notTouchedInProgressTimeout).asMilliseconds()) {
    // Expire empty sessions that weren't touched for a minute
    return _common.SearchSessionStatus.EXPIRED;
  } else if (searchStatuses.length > 0 && searchStatuses.every(item => item.status === _types.SearchStatus.COMPLETE)) {
    return _common.SearchSessionStatus.COMPLETE;
  } else {
    return _common.SearchSessionStatus.IN_PROGRESS;
  }
}