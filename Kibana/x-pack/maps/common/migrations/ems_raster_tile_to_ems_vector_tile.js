"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emsRasterTileToEmsVectorTile = emsRasterTileToEmsVectorTile;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isEmsTileSource(layerDescriptor) {
  const sourceType = _lodash.default.get(layerDescriptor, 'sourceDescriptor.type');

  return sourceType === _constants.SOURCE_TYPES.EMS_TMS;
}

function isTileLayer(layerDescriptor) {
  const layerType = _lodash.default.get(layerDescriptor, 'type'); // can not use LAYER_TYPE because LAYER_TYPE.TILE does not exist >8.1


  return layerType === 'TILE';
}

function emsRasterTileToEmsVectorTile({
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

  layerList.forEach(layer => {
    if (isTileLayer(layer) && isEmsTileSource(layer)) {
      // Just need to switch layer type to migrate TILE layer to VECTOR_TILE layer
      // can not use LAYER_TYPE because LAYER_TYPE.VECTOR_TILE does not exist >8.1
      layer.type = 'VECTOR_TILE';
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}