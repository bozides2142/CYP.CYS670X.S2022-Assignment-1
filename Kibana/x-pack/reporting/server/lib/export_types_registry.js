"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportTypesRegistry = void 0;
exports.getExportTypesRegistry = getExportTypesRegistry;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _csv_searchsource_immediate = require("../export_types/csv_searchsource_immediate");

var _csv_searchsource = require("../export_types/csv_searchsource");

var _png = require("../export_types/png");

var _png_v = require("../export_types/png_v2");

var _printable_pdf = require("../export_types/printable_pdf");

var _printable_pdf_v = require("../export_types/printable_pdf_v2");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ExportTypesRegistry {
  constructor() {
    (0, _defineProperty2.default)(this, "_map", new Map());
  }

  register(item) {
    if (!(0, _lodash.isString)(item.id)) {
      throw new Error(`'item' must have a String 'id' property `);
    }

    if (this._map.has(item.id)) {
      throw new Error(`'item' with id ${item.id} has already been registered`);
    }

    this._map.set(item.id, item);
  }

  getAll() {
    return Array.from(this._map.values());
  }

  getSize() {
    return this._map.size;
  }

  getById(id) {
    if (!this._map.has(id)) {
      throw new Error(`Unknown id ${id}`);
    }

    return this._map.get(id);
  }

  get(findType) {
    let result;

    for (const value of this._map.values()) {
      if (!findType(value)) {
        continue; // try next value
      }

      const foundResult = value;

      if (result) {
        throw new Error('Found multiple items matching predicate.');
      }

      result = foundResult;
    }

    if (!result) {
      throw new Error('Found no items matching predicate');
    }

    return result;
  }

} // TODO: Define a 2nd ExportTypeRegistry instance for "immediate execute" report job types only.
// It should not require a `CreateJobFn` for its ExportTypeDefinitions, which only makes sense for async.
// Once that is done, the `any` types below can be removed.

/*
 * @return ExportTypeRegistry: the ExportTypeRegistry instance that should be
 * used to register async export type definitions
 */


exports.ExportTypesRegistry = ExportTypesRegistry;

function getExportTypesRegistry() {
  const registry = new ExportTypesRegistry(); // can not specify because ImmediateExecuteFn is not assignable to RunTaskFn

  const getTypeFns = [_csv_searchsource.getExportType, _csv_searchsource_immediate.getExportType, _png.getExportType, _png_v.getExportType, _printable_pdf.getExportType, _printable_pdf_v.getExportType];
  getTypeFns.forEach(getType => {
    registry.register(getType());
  });
  return registry;
}