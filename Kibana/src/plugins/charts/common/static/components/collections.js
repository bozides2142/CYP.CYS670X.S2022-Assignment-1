"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultCountLabel = exports.LabelRotation = exports.ColorMode = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ColorMode = Object.freeze({
  Background: 'Background',
  Labels: 'Labels',
  None: 'None'
});
exports.ColorMode = ColorMode;
const LabelRotation = Object.freeze({
  Horizontal: 0,
  Vertical: 90,
  Angled: 75
});
exports.LabelRotation = LabelRotation;

const defaultCountLabel = _i18n.i18n.translate('charts.countText', {
  defaultMessage: 'Count'
});

exports.defaultCountLabel = defaultCountLabel;