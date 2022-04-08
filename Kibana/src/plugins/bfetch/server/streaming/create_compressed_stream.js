"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCompressedStream = void 0;

var _util = require("util");

var _operators = require("rxjs/operators");

var _stream = require("stream");

var _zlib = require("zlib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const delimiter = '\n';
const pDeflate = (0, _util.promisify)(_zlib.deflate);

async function zipMessageToStream(output, message) {
  return new Promise(async (resolve, reject) => {
    try {
      const gzipped = await pDeflate(message, {
        flush: _zlib.constants.Z_SYNC_FLUSH
      });
      output.write(gzipped.toString('base64'));
      output.write(delimiter);
      resolve(undefined);
    } catch (err) {
      reject(err);
    }
  });
}

const createCompressedStream = (results, logger) => {
  const output = new _stream.PassThrough();
  const sub = results.pipe((0, _operators.concatMap)(message => {
    const strMessage = JSON.stringify(message);
    return zipMessageToStream(output, strMessage);
  }), (0, _operators.catchError)(e => {
    logger.error('Could not serialize or stream a message.');
    logger.error(e);
    throw e;
  }), (0, _operators.finalize)(() => {
    output.end();
    sub.unsubscribe();
  })).subscribe();
  return output;
};

exports.createCompressedStream = createCompressedStream;