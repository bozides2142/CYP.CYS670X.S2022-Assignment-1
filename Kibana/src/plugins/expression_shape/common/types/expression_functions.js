"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shape = exports.Progress = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let Shape;
exports.Shape = Shape;

(function (Shape) {
  Shape["ARROW"] = "arrow";
  Shape["ARROW_MULTI"] = "arrowMulti";
  Shape["BOOKMARK"] = "bookmark";
  Shape["CIRCLE"] = "circle";
  Shape["CROSS"] = "cross";
  Shape["HEXAGON"] = "hexagon";
  Shape["KITE"] = "kite";
  Shape["PENTAGON"] = "pentagon";
  Shape["RHOMBUS"] = "rhombus";
  Shape["SEMICIRCLE"] = "semicircle";
  Shape["SPEECH_BUBBLE"] = "speechBubble";
  Shape["SQUARE"] = "square";
  Shape["STAR"] = "star";
  Shape["TAG"] = "tag";
  Shape["TRIANGLE"] = "triangle";
  Shape["TRIANGLE_RIGHT"] = "triangleRight";
})(Shape || (exports.Shape = Shape = {}));

let Progress;
exports.Progress = Progress;

(function (Progress) {
  Progress["GAUGE"] = "gauge";
  Progress["HORIZONTAL_BAR"] = "horizontalBar";
  Progress["HORIZONTAL_PILL"] = "horizontalPill";
  Progress["SEMICIRCLE"] = "semicircle";
  Progress["UNICORN"] = "unicorn";
  Progress["VERTICAL_BAR"] = "verticalBar";
  Progress["VERTICAL_PILL"] = "verticalPill";
  Progress["WHEEL"] = "wheel";
})(Progress || (exports.Progress = Progress = {}));