"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameLayerTypes = renameLayerTypes;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// LAYER_TYPE constants renamed in 8.1 to provide more distinguishable names that better refect layer.
// TILED_VECTOR replaced with MVT_VECTOR
// VECTOR_TILE replaced with EMS_VECTOR_TILE
// VECTOR replaced with GEOJSON_VECTOR
// TILE replaced with RASTER_TILE


function renameLayerTypes({
  attributes
}) {
  if (!attributes || !attributes.layerListJSON) {
    return attributes;
  }

  let layerList = [];

  try {
    layerList = JSON.parse(attributes.layerListJSON);
  } catch (e) {
    throw new Error('Unable to parse attribute layerListJSON');
  }

  layerList.forEach(layerDescriptor => {
    if (layerDescriptor.type === 'TILED_VECTOR') {
      layerDescriptor.type = _constants.LAYER_TYPE.MVT_VECTOR;
    } else if (layerDescriptor.type === 'VECTOR_TILE') {
      layerDescriptor.type = _constants.LAYER_TYPE.EMS_VECTOR_TILE;
    } else if (layerDescriptor.type === 'VECTOR') {
      layerDescriptor.type = _constants.LAYER_TYPE.GEOJSON_VECTOR;
    } else if (layerDescriptor.type === 'TILE') {
      layerDescriptor.type = _constants.LAYER_TYPE.RASTER_TILE;
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}