"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createStubDataView", {
  enumerable: true,
  get: function () {
    return _data_view.createStubDataView;
  }
});
Object.defineProperty(exports, "createStubIndexPattern", {
  enumerable: true,
  get: function () {
    return _data_view.createStubDataView;
  }
});
exports.stubLogstashIndexPattern = exports.stubLogstashDataView = exports.stubIndexPatternWithoutTimeField = exports.stubIndexPattern = exports.stubDataViewWithoutTimeField = exports.stubDataView = void 0;
exports.stubbedSavedObjectDataView = stubbedSavedObjectDataView;
exports.stubbedSavedObjectIndexPattern = void 0;

var _field = require("./field.stub");

var _data_view = require("./data_views/data_view.stub");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stubDataView = (0, _data_view.createStubDataView)({
  spec: {
    id: 'logstash-*',
    fields: _field.stubFieldSpecMap,
    title: 'logstash-*',
    timeFieldName: '@timestamp'
  }
});
exports.stubDataView = stubDataView;
const stubIndexPattern = stubDataView;
exports.stubIndexPattern = stubIndexPattern;
const stubDataViewWithoutTimeField = (0, _data_view.createStubDataView)({
  spec: {
    id: 'logstash-*',
    fields: _field.stubFieldSpecMap,
    title: 'logstash-*'
  }
});
exports.stubDataViewWithoutTimeField = stubDataViewWithoutTimeField;
const stubIndexPatternWithoutTimeField = stubDataViewWithoutTimeField;
exports.stubIndexPatternWithoutTimeField = stubIndexPatternWithoutTimeField;
const stubLogstashDataView = (0, _data_view.createStubDataView)({
  spec: {
    id: 'logstash-*',
    title: 'logstash-*',
    timeFieldName: 'time',
    fields: _field.stubLogstashFieldSpecMap
  }
});
exports.stubLogstashDataView = stubLogstashDataView;
const stubLogstashIndexPattern = stubLogstashDataView;
exports.stubLogstashIndexPattern = stubLogstashIndexPattern;

function stubbedSavedObjectDataView(id = null) {
  return {
    id: id !== null && id !== void 0 ? id : '',
    type: 'index-pattern',
    attributes: {
      timeFieldName: 'time',
      fields: JSON.stringify(_field.stubLogstashFieldSpecMap),
      title: 'title'
    },
    version: '2',
    references: []
  };
}

const stubbedSavedObjectIndexPattern = stubbedSavedObjectDataView;
exports.stubbedSavedObjectIndexPattern = stubbedSavedObjectIndexPattern;