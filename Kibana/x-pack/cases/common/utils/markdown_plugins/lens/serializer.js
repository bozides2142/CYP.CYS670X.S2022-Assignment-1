"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LensSerializer = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const serializeLens = ({
  timeRange,
  attributes
}) => `!{${_constants.LENS_ID}${JSON.stringify({
  timeRange,
  attributes
})}}`;

const LensSerializer = function () {
  const Compiler = this.Compiler;
  Compiler.prototype.visitors.lens = serializeLens;
};

exports.LensSerializer = LensSerializer;