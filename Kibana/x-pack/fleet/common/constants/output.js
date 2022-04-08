"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputType = exports.OUTPUT_SAVED_OBJECT_TYPE = exports.DEFAULT_OUTPUT_ID = exports.DEFAULT_OUTPUT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const OUTPUT_SAVED_OBJECT_TYPE = 'ingest-outputs';
exports.OUTPUT_SAVED_OBJECT_TYPE = OUTPUT_SAVED_OBJECT_TYPE;
const outputType = {
  Elasticsearch: 'elasticsearch'
};
exports.outputType = outputType;
const DEFAULT_OUTPUT_ID = 'fleet-default-output';
exports.DEFAULT_OUTPUT_ID = DEFAULT_OUTPUT_ID;
const DEFAULT_OUTPUT = {
  name: 'default',
  is_default: true,
  is_default_monitoring: true,
  type: outputType.Elasticsearch,
  hosts: ['']
};
exports.DEFAULT_OUTPUT = DEFAULT_OUTPUT;