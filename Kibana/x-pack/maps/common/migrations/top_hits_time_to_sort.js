"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topHitsTimeToSort = topHitsTimeToSort;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

var _search = require("../../../../../src/plugins/data/common/search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isEsDocumentSource(layerDescriptor) {
  const sourceType = _lodash.default.get(layerDescriptor, 'sourceDescriptor.type');

  return sourceType === _constants.SOURCE_TYPES.ES_SEARCH;
}

function topHitsTimeToSort({
  attributes
}) {
  if (!attributes.layerListJSON) {
    return attributes;
  }

  let layerList = [];

  try {
    layerList = JSON.parse(attributes.layerListJSON);
  } catch (e) {
    throw new Error('Unable to parse attribute layerListJSON');
  }

  layerList.forEach(layerDescriptor => {
    if (isEsDocumentSource(layerDescriptor)) {
      if (_lodash.default.has(layerDescriptor, 'sourceDescriptor.topHitsTimeField')) {
        layerDescriptor.sourceDescriptor.sortField = layerDescriptor.sourceDescriptor.topHitsTimeField;
        layerDescriptor.sourceDescriptor.sortOrder = _search.SortDirection.desc;
        delete layerDescriptor.sourceDescriptor.topHitsTimeField;
      }
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}