"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldList = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _data_view_field = require("./data_view_field");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// extending the array class and using a constructor doesn't work well
// when calling filter and similar so wrapping in a callback.
// to be removed in the future
const fieldList = (specs = [], shortDotsEnable = false) => {
  class FldList extends Array {
    constructor() {
      super();
      (0, _defineProperty2.default)(this, "byName", new Map());
      (0, _defineProperty2.default)(this, "groups", new Map());
      (0, _defineProperty2.default)(this, "setByName", field => this.byName.set(field.name, field));
      (0, _defineProperty2.default)(this, "setByGroup", field => {
        if (typeof this.groups.get(field.type) === 'undefined') {
          this.groups.set(field.type, new Map());
        }

        this.groups.get(field.type).set(field.name, field);
      });
      (0, _defineProperty2.default)(this, "removeByGroup", field => this.groups.get(field.type).delete(field.name));
      (0, _defineProperty2.default)(this, "getAll", () => [...this.byName.values()]);
      (0, _defineProperty2.default)(this, "getByName", name => this.byName.get(name));
      (0, _defineProperty2.default)(this, "getByType", type => [...(this.groups.get(type) || new Map()).values()]);
      (0, _defineProperty2.default)(this, "add", field => {
        const newField = new _data_view_field.DataViewField({ ...field,
          shortDotsEnable
        });
        this.push(newField);
        this.setByName(newField);
        this.setByGroup(newField);
      });
      (0, _defineProperty2.default)(this, "remove", field => {
        this.removeByGroup(field);
        this.byName.delete(field.name);
        const fieldIndex = (0, _lodash.findIndex)(this, {
          name: field.name
        });
        this.splice(fieldIndex, 1);
      });
      (0, _defineProperty2.default)(this, "update", field => {
        const newField = new _data_view_field.DataViewField(field);
        const index = this.findIndex(f => f.name === newField.name);
        this.splice(index, 1, newField);
        this.setByName(newField);
        this.removeByGroup(newField);
        this.setByGroup(newField);
      });
      (0, _defineProperty2.default)(this, "removeAll", () => {
        this.length = 0;
        this.byName.clear();
        this.groups.clear();
      });
      (0, _defineProperty2.default)(this, "replaceAll", (spcs = []) => {
        this.removeAll();
        spcs.forEach(this.add);
      });
      specs.map(field => this.add(field));
    }

    toSpec({
      getFormatterForField
    } = {}) {
      return { ...this.reduce((collector, field) => {
          collector[field.name] = field.toSpec({
            getFormatterForField
          });
          return collector;
        }, {})
      };
    }

  }

  return new FldList();
};

exports.fieldList = fieldList;