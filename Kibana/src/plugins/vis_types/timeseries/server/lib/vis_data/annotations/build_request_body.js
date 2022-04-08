"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAnnotationRequest = buildAnnotationRequest;

var _build_processor_function = require("../build_processor_function");

var _annotations = require("../request_processors/annotations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildAnnotationRequest(params) {
  const processor = (0, _build_processor_function.buildProcessorFunction)([_annotations.query, _annotations.dateHistogram, _annotations.topHits], params);
  return processor({});
}