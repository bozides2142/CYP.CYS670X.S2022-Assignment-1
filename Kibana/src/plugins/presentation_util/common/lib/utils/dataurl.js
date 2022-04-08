"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
exports.imageTypes = void 0;
exports.isValidDataUrl = isValidDataUrl;
exports.parseDataUrl = parseDataUrl;

var _base64Js = require("base64-js");

var _lite = _interopRequireDefault(require("mime/lite"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error @types/mime doesn't resolve mime/lite for some reason.
const dataurlRegex = /^data:([a-z]+\/[a-z0-9-+.]+)(;[a-z-]+=[a-z0-9-]+)?(;([a-z0-9]+))?,/;
const imageTypes = ['image/svg+xml', 'image/jpeg', 'image/png', 'image/gif'];
exports.imageTypes = imageTypes;

function parseDataUrl(str, withData = false) {
  if (typeof str !== 'string') {
    return null;
  }

  const matches = str.match(dataurlRegex);

  if (!matches) {
    return null;
  }

  const [, mimetype, charset,, encoding] = matches; // all types except for svg need to be base64 encoded

  const imageTypeIndex = imageTypes.indexOf(matches[1]);

  if (imageTypeIndex > 0 && encoding !== 'base64') {
    return null;
  }

  return {
    mimetype,
    encoding,
    charset: charset && charset.split('=')[1],
    data: !withData ? null : str.split(',')[1],
    isImage: imageTypeIndex >= 0,
    extension: _lite.default.getExtension(mimetype)
  };
}

function isValidDataUrl(str) {
  if (!str) {
    return false;
  }

  return dataurlRegex.test(str);
}

function encode(data, type = 'text/plain') {
  // use FileReader if it's available, like in the browser
  if (FileReader) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);

      reader.onerror = err => reject(err);

      reader.readAsDataURL(data);
    });
  } // otherwise fall back to fromByteArray
  // note: Buffer doesn't seem to correctly base64 encode binary data


  return Promise.resolve(`data:${type};base64,${(0, _base64Js.fromByteArray)(data)}`);
}