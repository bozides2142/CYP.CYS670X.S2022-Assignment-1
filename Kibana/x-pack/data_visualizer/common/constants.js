"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.featureTitle = exports.featureId = exports.applicationPath = exports.UI_SETTING_MAX_FILE_SIZE = exports.OMIT_FIELDS = exports.NON_AGGREGATABLE_FIELD_TYPES = exports.MB = exports.MAX_FILE_SIZE_BYTES = exports.MAX_FILE_SIZE = exports.JOB_FIELD_TYPES = exports.INDEX_META_DATA_CREATED_BY = exports.FILE_SIZE_DISPLAY_FORMAT = exports.FILE_FORMATS = exports.FILE_DATA_VIS_TAB_ID = exports.ABSOLUTE_MAX_FILE_SIZE_BYTES = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const UI_SETTING_MAX_FILE_SIZE = 'fileUpload:maxFileSize';
exports.UI_SETTING_MAX_FILE_SIZE = UI_SETTING_MAX_FILE_SIZE;
const MB = Math.pow(2, 20);
exports.MB = MB;
const MAX_FILE_SIZE = '100MB';
exports.MAX_FILE_SIZE = MAX_FILE_SIZE;
const MAX_FILE_SIZE_BYTES = 104857600; // 100MB

exports.MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
const ABSOLUTE_MAX_FILE_SIZE_BYTES = 1073741274; // 1GB

exports.ABSOLUTE_MAX_FILE_SIZE_BYTES = ABSOLUTE_MAX_FILE_SIZE_BYTES;
const FILE_SIZE_DISPLAY_FORMAT = '0,0.[0] b'; // Value to use in the Elasticsearch index mapping meta data to identify the
// index as having been created by the File Data Visualizer.

exports.FILE_SIZE_DISPLAY_FORMAT = FILE_SIZE_DISPLAY_FORMAT;
const INDEX_META_DATA_CREATED_BY = 'file-data-visualizer';
exports.INDEX_META_DATA_CREATED_BY = INDEX_META_DATA_CREATED_BY;
const FILE_FORMATS = {
  DELIMITED: 'delimited',
  NDJSON: 'ndjson',
  SEMI_STRUCTURED_TEXT: 'semi_structured_text' // XML: 'xml',

};
exports.FILE_FORMATS = FILE_FORMATS;
const JOB_FIELD_TYPES = {
  BOOLEAN: 'boolean',
  DATE: 'date',
  GEO_POINT: 'geo_point',
  GEO_SHAPE: 'geo_shape',
  IP: 'ip',
  KEYWORD: 'keyword',
  NUMBER: 'number',
  TEXT: 'text',
  HISTOGRAM: 'histogram',
  UNKNOWN: 'unknown'
};
exports.JOB_FIELD_TYPES = JOB_FIELD_TYPES;
const OMIT_FIELDS = ['_source', '_type', '_index', '_id', '_version', '_score'];
exports.OMIT_FIELDS = OMIT_FIELDS;
const NON_AGGREGATABLE_FIELD_TYPES = new Set([_common.KBN_FIELD_TYPES.GEO_SHAPE, _common.KBN_FIELD_TYPES.HISTOGRAM]);
exports.NON_AGGREGATABLE_FIELD_TYPES = NON_AGGREGATABLE_FIELD_TYPES;
const FILE_DATA_VIS_TAB_ID = 'fileDataViz';
exports.FILE_DATA_VIS_TAB_ID = FILE_DATA_VIS_TAB_ID;
const applicationPath = `/app/home#/tutorial_directory/${FILE_DATA_VIS_TAB_ID}`;
exports.applicationPath = applicationPath;

const featureTitle = _i18n.i18n.translate('xpack.dataVisualizer.title', {
  defaultMessage: 'Upload a file'
});

exports.featureTitle = featureTitle;
const featureId = `file_data_visualizer`;
exports.featureId = featureId;