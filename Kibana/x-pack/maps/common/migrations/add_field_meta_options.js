"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFieldMetaOptions = addFieldMetaOptions;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isVectorLayer(layerDescriptor) {
  const layerType = _lodash.default.get(layerDescriptor, 'type'); // can not use LAYER_TYPE because LAYER_TYPE.VECTOR does not exist >8.1


  return layerType === 'VECTOR';
}

function addFieldMetaOptions({
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
    if (isVectorLayer(layerDescriptor) && _lodash.default.has(layerDescriptor, 'style.properties')) {
      Object.values(layerDescriptor.style.properties).forEach(stylePropertyDescriptor => {
        if (stylePropertyDescriptor.type === _constants.STYLE_TYPE.DYNAMIC) {
          stylePropertyDescriptor.options.fieldMetaOptions = {
            isEnabled: false,
            // turn off field metadata to avoid changing behavior of existing saved objects
            sigma: 3
          };
        }
      });
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}