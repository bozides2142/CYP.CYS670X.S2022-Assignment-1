"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getViewBox = getViewBox;
exports.viewBoxToString = viewBoxToString;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function viewBoxToString(viewBox) {
  if (!viewBox) {
    return;
  }

  return `${viewBox === null || viewBox === void 0 ? void 0 : viewBox.minX} ${viewBox === null || viewBox === void 0 ? void 0 : viewBox.minY} ${viewBox === null || viewBox === void 0 ? void 0 : viewBox.width} ${viewBox === null || viewBox === void 0 ? void 0 : viewBox.height}`;
}

function getMinxAndWidth(viewBoxParams, {
  borderOffset,
  width
}) {
  let {
    minX,
    width: shapeWidth
  } = viewBoxParams;

  if (width) {
    const xOffset = shapeWidth / width * borderOffset;
    minX -= xOffset;
    shapeWidth += xOffset * 2;
  } else {
    shapeWidth = 0;
  }

  return [minX, shapeWidth];
}

function getMinyAndHeight(viewBoxParams, {
  borderOffset,
  height
}) {
  let {
    minY,
    height: shapeHeight
  } = viewBoxParams;

  if (height) {
    const yOffset = shapeHeight / height * borderOffset;
    minY -= yOffset;
    shapeHeight += yOffset * 2;
  } else {
    shapeHeight = 0;
  }

  return [minY, shapeHeight];
}

function getViewBox(viewBoxParams, parentNodeParams) {
  const [minX, width] = getMinxAndWidth(viewBoxParams, parentNodeParams);
  const [minY, height] = getMinyAndHeight(viewBoxParams, parentNodeParams);
  return {
    minX,
    minY,
    width,
    height
  };
}