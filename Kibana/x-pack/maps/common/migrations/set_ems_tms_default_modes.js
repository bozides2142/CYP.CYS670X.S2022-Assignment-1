"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEmsTmsDefaultModes = setEmsTmsDefaultModes;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// LightModeDefault added to EMSTMSSourceDescriptor in 8.0.0
// to avoid changing auto selected light mode tiles for maps created < 8.0.0
// < 8.0.0 did not specify defaults and used bright for light mode
// > 8.0.0 changed default light mode from bright to desaturated


function setEmsTmsDefaultModes({
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
    var _layerDescriptor$sour;

    if (((_layerDescriptor$sour = layerDescriptor.sourceDescriptor) === null || _layerDescriptor$sour === void 0 ? void 0 : _layerDescriptor$sour.type) === _constants.SOURCE_TYPES.EMS_TMS) {
      const sourceDescriptor = layerDescriptor.sourceDescriptor; // auto select bright tiles for EMS_TMS layers created before 8.0.0

      if (!sourceDescriptor.lightModeDefault) {
        sourceDescriptor.lightModeDefault = 'road_map';
      }
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}