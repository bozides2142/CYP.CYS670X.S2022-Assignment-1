"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geoBoundingBoxToAst = void 0;

var _lodash = require("lodash");

var _common = require("../../../../expressions/common");

var _geo_point_to_ast = require("./geo_point_to_ast");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const GEO_POINTS = ['top_left', 'bottom_right', 'top_right', 'bottom_left'];

const geoBoundingBoxToAst = geoBoundingBox => {
  return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('geoBoundingBox', { ...(0, _lodash.omit)(geoBoundingBox, GEO_POINTS),
    ...(0, _lodash.chain)(geoBoundingBox).pick(GEO_POINTS).omitBy(_lodash.isNil).mapKeys((value, key) => (0, _lodash.camelCase)(key)).mapValues(value => (0, _geo_point_to_ast.geoPointToAst)(value)).value()
  })]).toAst();
};

exports.geoBoundingBoxToAst = geoBoundingBoxToAst;