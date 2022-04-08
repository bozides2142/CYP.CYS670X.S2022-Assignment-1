"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveAttribution = moveAttribution;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// In 7.14, attribution added to the layer_descriptor. Prior to 7.14, 2 sources, WMS and TMS, had attribution on source descriptor.

function moveAttribution({
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

  layerList.forEach(layer => {
    const sourceDescriptor = layer.sourceDescriptor;

    if (sourceDescriptor.attributionText && sourceDescriptor.attributionUrl) {
      layer.attribution = {
        label: sourceDescriptor.attributionText,
        url: sourceDescriptor.attributionUrl
      };
      delete sourceDescriptor.attributionText;
      delete sourceDescriptor.attributionUrl;
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}