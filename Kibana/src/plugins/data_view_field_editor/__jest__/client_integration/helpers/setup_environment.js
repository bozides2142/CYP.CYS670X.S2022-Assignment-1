"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spySearchQueryResponse = exports.spySearchQuery = exports.spyIndexPatternGetAllFields = exports.setupEnvironment = exports.setSearchResponseLatency = exports.indexPatternNameForTest = exports.fieldFormatsOptions = exports.WithFieldEditorDependencies = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

require("./jest.mocks");

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _lodash = require("lodash");

var _mocks = require("../../../../../core/public/mocks");

var _mocks2 = require("../../../../data/public/mocks");

var _field_editor_context = require("../../../public/components/field_editor_context");

var _preview = require("../../../public/components/preview");

var _lib = require("../../../public/lib");

var _http_requests = require("./http_requests");

var _mocks3 = require("../../../../field_formats/common/mocks");

var _common = require("../../../../field_formats/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line max-classes-per-file
const mockHttpClient = _axios.default.create({
  adapter: _xhr.default
});

const dataStart = _mocks2.dataPluginMock.createStartContract();

const {
  search
} = dataStart;
const spySearchQuery = jest.fn();
exports.spySearchQuery = spySearchQuery;
const spySearchQueryResponse = jest.fn(() => Promise.resolve({}));
exports.spySearchQueryResponse = spySearchQueryResponse;
const spyIndexPatternGetAllFields = jest.fn().mockImplementation(() => []);
exports.spyIndexPatternGetAllFields = spyIndexPatternGetAllFields;
let searchResponseDelay = 0; // Add latency to the search request

const setSearchResponseLatency = ms => {
  searchResponseDelay = ms;
};

exports.setSearchResponseLatency = setSearchResponseLatency;
spySearchQuery.mockImplementation(() => {
  return {
    toPromise: () => {
      if (searchResponseDelay === 0) {
        // no delay, it is synchronous
        return spySearchQueryResponse();
      }

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, searchResponseDelay);
      }).then(() => {
        return spySearchQueryResponse();
      });
    }
  };
});
search.search = spySearchQuery;
let apiService;

const setupEnvironment = () => {
  // @ts-expect-error Axios does not fullfill HttpSetupn from core but enough for our tests
  apiService = (0, _lib.initApi)(mockHttpClient);
  const {
    server,
    httpRequestsMockHelpers
  } = (0, _http_requests.init)();
  return {
    server,
    httpRequestsMockHelpers
  };
};

exports.setupEnvironment = setupEnvironment;

class MockDefaultFieldFormat extends _common.FieldFormat {}

(0, _defineProperty2.default)(MockDefaultFieldFormat, "id", 'testDefaultFormat');
(0, _defineProperty2.default)(MockDefaultFieldFormat, "title", 'TestDefaultFormat');

class MockCustomFieldFormat extends _common.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "htmlConvert", value => `<span>${value.toUpperCase()}</span>`);
  }

} // The format options available in the dropdown select for our tests.


(0, _defineProperty2.default)(MockCustomFieldFormat, "id", 'upper');
(0, _defineProperty2.default)(MockCustomFieldFormat, "title", 'UpperCaseString');
const fieldFormatsOptions = [MockCustomFieldFormat];
exports.fieldFormatsOptions = fieldFormatsOptions;
const indexPatternNameForTest = 'testIndexPattern';
exports.indexPatternNameForTest = indexPatternNameForTest;

const WithFieldEditorDependencies = (Comp, overridingDependencies) => props => {
  // Setup mocks
  _mocks3.fieldFormatsMock.getByFieldType.mockReturnValue(fieldFormatsOptions);

  _mocks3.fieldFormatsMock.getDefaultType.mockReturnValue(MockDefaultFieldFormat);

  _mocks3.fieldFormatsMock.getInstance.mockImplementation(id => {
    if (id === MockCustomFieldFormat.id) {
      return new MockCustomFieldFormat();
    } else {
      return new MockDefaultFieldFormat();
    }
  });

  _mocks3.fieldFormatsMock.getDefaultInstance.mockImplementation(() => {
    return new MockDefaultFieldFormat();
  });

  const dependencies = {
    dataView: {
      title: indexPatternNameForTest,
      fields: {
        getAll: spyIndexPatternGetAllFields
      }
    },
    uiSettings: _mocks.uiSettingsServiceMock.createStartContract(),
    fieldTypeToProcess: 'runtime',
    existingConcreteFields: [],
    namesNotAllowed: [],
    links: {
      runtimePainless: 'https://elastic.co'
    },
    services: {
      notifications: _mocks.notificationServiceMock.createStartContract(),
      search,
      api: apiService
    },
    fieldFormatEditors: {
      getAll: () => [],
      getById: () => undefined
    },
    fieldFormats: _mocks3.fieldFormatsMock
  };
  const mergedDependencies = (0, _lodash.merge)({}, dependencies, overridingDependencies);
  return /*#__PURE__*/_react.default.createElement(_field_editor_context.FieldEditorProvider, mergedDependencies, /*#__PURE__*/_react.default.createElement(_preview.FieldPreviewProvider, null, /*#__PURE__*/_react.default.createElement(Comp, props)));
};

exports.WithFieldEditorDependencies = WithFieldEditorDependencies;