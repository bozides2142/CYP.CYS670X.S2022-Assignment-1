"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddableTypes = void 0;

var _common = require("../../../../plugins/maps/common");

var _constants = require("../../../../../src/plugins/visualizations/common/constants");

var _constants2 = require("../../../../plugins/lens/common/constants");

var _common2 = require("../../../../../src/plugins/discover/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EmbeddableTypes = {
  lens: _constants2.LENS_EMBEDDABLE_TYPE,
  map: _common.MAP_SAVED_OBJECT_TYPE,
  search: _common2.SEARCH_EMBEDDABLE_TYPE,
  visualization: _constants.VISUALIZE_EMBEDDABLE_TYPE
};
exports.EmbeddableTypes = EmbeddableTypes;