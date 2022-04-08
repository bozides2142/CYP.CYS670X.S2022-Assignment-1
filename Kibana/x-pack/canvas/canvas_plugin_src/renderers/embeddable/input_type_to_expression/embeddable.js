"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toExpression = toExpression;

var _embeddable_dataurl = require("../../../../common/lib/embeddable_dataurl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function toExpression(input, embeddableType) {
  return `embeddable config="${(0, _embeddable_dataurl.encode)(input)}" type="${embeddableType}"`;
}