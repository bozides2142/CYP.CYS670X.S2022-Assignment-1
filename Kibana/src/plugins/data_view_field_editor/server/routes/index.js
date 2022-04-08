"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiRoutes = void 0;

var _field_preview = require("./field_preview");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ApiRoutes {
  setup(dependencies) {
    (0, _field_preview.registerFieldPreviewRoute)(dependencies);
  }

}

exports.ApiRoutes = ApiRoutes;