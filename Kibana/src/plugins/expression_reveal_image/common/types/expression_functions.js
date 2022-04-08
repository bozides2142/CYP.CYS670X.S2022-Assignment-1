"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Position = exports.Origin = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let Origin;
exports.Origin = Origin;

(function (Origin) {
  Origin["TOP"] = "top";
  Origin["LEFT"] = "left";
  Origin["BOTTOM"] = "bottom";
  Origin["RIGHT"] = "right";
})(Origin || (exports.Origin = Origin = {}));

let Position;
exports.Position = Position;

(function (Position) {
  Position["TOP"] = "top";
  Position["BOTTOM"] = "bottom";
  Position["LEFT"] = "left";
  Position["RIGHT"] = "right";
})(Position || (exports.Position = Position = {}));