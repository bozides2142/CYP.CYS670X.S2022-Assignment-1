"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultInspectorAdapters = void 0;

var _common = require("../../../inspector/common");

var _tables_adapter = require("./tables_adapter");

var _expressions_inspector_adapter = require("./expressions_inspector_adapter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createDefaultInspectorAdapters = () => ({
  requests: new _common.RequestAdapter(),
  tables: new _tables_adapter.TablesAdapter(),
  expression: new _expressions_inspector_adapter.ExpressionsInspectorAdapter()
});

exports.createDefaultInspectorAdapters = createDefaultInspectorAdapters;