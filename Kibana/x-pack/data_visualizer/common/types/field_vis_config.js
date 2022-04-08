"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFileBasedFieldVisConfig = isFileBasedFieldVisConfig;
exports.isIndexBasedFieldVisConfig = isIndexBasedFieldVisConfig;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// The internal representation of the configuration used to build the visuals
// which display the field information.

function isFileBasedFieldVisConfig(field) {
  return !field.hasOwnProperty('existsInDocs');
}

function isIndexBasedFieldVisConfig(field) {
  return field.hasOwnProperty('existsInDocs');
}