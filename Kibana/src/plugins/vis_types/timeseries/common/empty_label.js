"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueOrEmpty = exports.emptyLabel = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const emptyLabel = _i18n.i18n.translate('visTypeTimeseries.emptyTextValue', {
  defaultMessage: '(empty)'
});

exports.emptyLabel = emptyLabel;

const getValueOrEmpty = value => {
  if (value === '' || value === null || value === undefined) {
    return emptyLabel;
  }

  return `${value}`;
};

exports.getValueOrEmpty = getValueOrEmpty;