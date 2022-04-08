"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TablesAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = require("events");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class TablesAdapter extends _events.EventEmitter {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "_tables", {});
  }

  logDatatable(name, datatable) {
    this._tables[name] = datatable;
    this.emit('change', this.tables);
  }

  get tables() {
    return this._tables;
  }

}

exports.TablesAdapter = TablesAdapter;