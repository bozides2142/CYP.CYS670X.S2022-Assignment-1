"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functions = void 0;
Object.defineProperty(exports, "repeatImageFunction", {
  enumerable: true,
  get: function () {
    return _repeat_image_function.repeatImageFunction;
  }
});

var _repeat_image_function = require("./repeat_image_function");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const functions = [_repeat_image_function.repeatImageFunction];
exports.functions = functions;