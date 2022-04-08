"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStream = createStream;

var _create_compressed_stream = require("./create_compressed_stream");

var _create_ndjson_stream = require("./create_ndjson_stream");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createStream(response$, logger, compress) {
  return compress ? (0, _create_compressed_stream.createCompressedStream)(response$, logger) : (0, _create_ndjson_stream.createNDJSONStream)(response$, logger);
}