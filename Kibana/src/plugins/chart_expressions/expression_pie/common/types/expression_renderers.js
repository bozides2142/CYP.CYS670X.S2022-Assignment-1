"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueFormats = exports.LabelPositions = exports.EmptySizeRatios = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let EmptySizeRatios;
exports.EmptySizeRatios = EmptySizeRatios;

(function (EmptySizeRatios) {
  EmptySizeRatios[EmptySizeRatios["SMALL"] = 0.3] = "SMALL";
  EmptySizeRatios[EmptySizeRatios["MEDIUM"] = 0.54] = "MEDIUM";
  EmptySizeRatios[EmptySizeRatios["LARGE"] = 0.7] = "LARGE";
})(EmptySizeRatios || (exports.EmptySizeRatios = EmptySizeRatios = {}));

let LabelPositions;
exports.LabelPositions = LabelPositions;

(function (LabelPositions) {
  LabelPositions["INSIDE"] = "inside";
  LabelPositions["DEFAULT"] = "default";
})(LabelPositions || (exports.LabelPositions = LabelPositions = {}));

let ValueFormats;
exports.ValueFormats = ValueFormats;

(function (ValueFormats) {
  ValueFormats["PERCENT"] = "percent";
  ValueFormats["VALUE"] = "value";
})(ValueFormats || (exports.ValueFormats = ValueFormats = {}));