"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functions = void 0;
Object.defineProperty(exports, "tagcloudFunction", {
  enumerable: true,
  get: function () {
    return _tagcloud_function.tagcloudFunction;
  }
});

var _tagcloud_function = require("./tagcloud_function");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const functions = [_tagcloud_function.tagcloudFunction];
exports.functions = functions;