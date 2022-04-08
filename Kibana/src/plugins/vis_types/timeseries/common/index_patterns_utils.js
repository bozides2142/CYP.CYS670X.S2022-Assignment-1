"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStringTypeIndexPattern = exports.getIndexPatternKey = exports.fetchIndexPattern = exports.extractIndexPatternValues = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isStringTypeIndexPattern = indexPatternValue => typeof indexPatternValue === 'string';

exports.isStringTypeIndexPattern = isStringTypeIndexPattern;

const getIndexPatternKey = indexPatternValue => {
  var _indexPatternValue$id;

  return isStringTypeIndexPattern(indexPatternValue) ? indexPatternValue : (_indexPatternValue$id = indexPatternValue === null || indexPatternValue === void 0 ? void 0 : indexPatternValue.id) !== null && _indexPatternValue$id !== void 0 ? _indexPatternValue$id : '';
};

exports.getIndexPatternKey = getIndexPatternKey;

const extractIndexPatternValues = (panel, defaultIndexId) => {
  const patterns = [];

  const addIndex = value => {
    if (value) {
      patterns.push(value);
    } else if (defaultIndexId) {
      patterns.push({
        id: defaultIndexId
      });
    }
  };

  addIndex(panel.index_pattern);
  panel.series.forEach(series => {
    if (series.override_index_pattern) {
      addIndex(series.series_index_pattern);
    }
  });

  if (panel.annotations) {
    panel.annotations.forEach(item => addIndex(item.index_pattern));
  }

  return (0, _lodash.uniq)(patterns).sort();
};

exports.extractIndexPatternValues = extractIndexPatternValues;

const fetchIndexPattern = async (indexPatternValue, indexPatternsService, options = {
  fetchKibanaIndexForStringIndexes: false
}) => {
  var _indexPattern$title, _indexPattern;

  let indexPattern;
  let indexPatternString = '';

  if (!indexPatternValue) {
    indexPattern = await indexPatternsService.getDefault();
  } else {
    if (isStringTypeIndexPattern(indexPatternValue)) {
      if (options.fetchKibanaIndexForStringIndexes) {
        indexPattern = (await indexPatternsService.find(indexPatternValue)).find(index => index.title === indexPatternValue);
      }

      if (!indexPattern) {
        indexPatternString = indexPatternValue;
      }

      indexPatternString = indexPatternValue;
    } else if (indexPatternValue.id) {
      indexPattern = await indexPatternsService.get(indexPatternValue.id);
    }
  }

  return {
    indexPattern,
    indexPatternString: (_indexPattern$title = (_indexPattern = indexPattern) === null || _indexPattern === void 0 ? void 0 : _indexPattern.title) !== null && _indexPattern$title !== void 0 ? _indexPattern$title : indexPatternString
  };
};

exports.fetchIndexPattern = fetchIndexPattern;