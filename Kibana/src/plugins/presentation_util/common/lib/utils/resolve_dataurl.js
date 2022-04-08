"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveWithMissingImage = exports.resolveFromArgs = void 0;

var _lodash = require("lodash");

var _url = require("./url");

var _missing_asset = require("./missing_asset");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * NOTE: args.dataurl can come as an expression here.
 * For example:
 *   [{"type":"expression","chain":[{"type":"function","function":"asset","arguments":{"_":["..."]}}]}]
 */
const resolveFromArgs = (args, defaultDataurl = null) => {
  const dataurl = (0, _lodash.get)(args, 'dataurl.0', null);
  return (0, _url.isValidUrl)(dataurl) ? dataurl : defaultDataurl;
};

exports.resolveFromArgs = resolveFromArgs;

const resolveWithMissingImage = (img, alt = null) => {
  if (img !== null && (0, _url.isValidUrl)(img)) {
    return img;
  }

  if (img === null) {
    return alt;
  }

  return _missing_asset.missingImage;
};

exports.resolveWithMissingImage = resolveWithMissingImage;