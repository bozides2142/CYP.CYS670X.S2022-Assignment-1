"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStubDataView = void 0;

var _data_view = require("./data_view");

var _mocks = require("../../../field_formats/common/mocks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Create a custom stub index pattern. Use it in your unit tests where an {@link DataView} expected.
 * @param spec - Serialized index pattern object
 * @param opts - Specify index pattern options
 * @param deps - Optionally provide dependencies, you can provide a custom field formats implementation, by default a dummy mock is used
 *
 * @returns - an {@link DataView} instance
 *
 *
 * @example
 *
 * You can provide a custom implementation or assert calls using jest.spyOn:
 *
 * ```ts
 *  const indexPattern = createStubIndexPattern({spec: {title: 'logs-*'}});
 *  const spy = jest.spyOn(indexPattern, 'getFormatterForField');
 *
 *  // use `spy` as a regular jest mock
 *
 * ```
 */
const createStubDataView = ({
  spec,
  opts,
  deps
}) => {
  var _opts$metaFields, _deps$fieldFormats;

  return new _data_view.DataView({
    spec,
    metaFields: (_opts$metaFields = opts === null || opts === void 0 ? void 0 : opts.metaFields) !== null && _opts$metaFields !== void 0 ? _opts$metaFields : ['_id', '_type', '_source'],
    shortDotsEnable: opts === null || opts === void 0 ? void 0 : opts.shortDotsEnable,
    fieldFormats: (_deps$fieldFormats = deps === null || deps === void 0 ? void 0 : deps.fieldFormats) !== null && _deps$fieldFormats !== void 0 ? _deps$fieldFormats : _mocks.fieldFormatsMock
  });
};

exports.createStubDataView = createStubDataView;