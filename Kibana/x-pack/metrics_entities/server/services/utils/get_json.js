"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJSON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: Move indent to configuration part or flip to default false

const getJSON = (body, indent = true) => indent ? JSON.stringify(body, null, 2) : JSON.stringify(body);

exports.getJSON = getJSON;