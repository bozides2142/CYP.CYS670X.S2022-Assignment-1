"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FrameworkFieldsAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FrameworkFieldsAdapter {
  constructor(framework) {
    (0, _defineProperty2.default)(this, "framework", void 0);
    this.framework = framework;
  }

  async getIndexFields(requestContext, indices) {
    const indexPatternsService = await this.framework.getIndexPatternsServiceWithRequestContext(requestContext); // NOTE: Unfortunately getFieldsForWildcard is typed to "any" here in the data plugin, FieldSpec is used below in the map.

    const response = await indexPatternsService.getFieldsForWildcard({
      pattern: indices,
      allowNoIndex: true
    });
    return response.map(field => ({ ...field,
      displayable: true
    }));
  }

}

exports.FrameworkFieldsAdapter = FrameworkFieldsAdapter;