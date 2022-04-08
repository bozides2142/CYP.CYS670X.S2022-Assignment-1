"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectCompressedFile = selectCompressedFile;

var _path = require("path");

var _accept = _interopRequireDefault(require("@hapi/accept"));

var _fs = require("./fs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function tryToOpenFile(filePath) {
  try {
    return await (0, _fs.open)(filePath, 'r');
  } catch (e) {
    if (e.code === 'ENOENT') {
      return undefined;
    } else {
      throw e;
    }
  }
}

async function selectCompressedFile(acceptEncodingHeader, path) {
  let fd;
  let fileEncoding;
  const ext = (0, _path.extname)(path);

  const supportedEncodings = _accept.default.encodings(acceptEncodingHeader, ['br', 'gzip']); // do not bother trying to look compressed versions for anything else than js or css files


  if (ext === '.js' || ext === '.css') {
    if (supportedEncodings[0] === 'br') {
      fileEncoding = 'br';
      fd = await tryToOpenFile(`${path}.br`);
    }

    if (!fd && supportedEncodings.includes('gzip')) {
      fileEncoding = 'gzip';
      fd = await tryToOpenFile(`${path}.gz`);
    }
  }

  if (!fd) {
    fileEncoding = undefined; // Use raw open to trigger exception if it does not exist

    fd = await (0, _fs.open)(path, 'r');
  }

  return {
    fd,
    fileEncoding
  };
}