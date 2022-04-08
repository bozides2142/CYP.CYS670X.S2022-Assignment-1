"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PipelineListItem = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PipelineListItem {
  constructor(options) {
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "description", void 0);
    (0, _defineProperty2.default)(this, "last_modified", void 0);
    (0, _defineProperty2.default)(this, "username", void 0);
    this.id = options.id;
    this.description = options.description;
    this.last_modified = options.last_modified;
    this.username = options.username;
  }

  get downstreamJSON() {
    const json = {
      id: this.id,
      description: this.description,
      last_modified: this.last_modified,
      username: this.username
    };
    return json;
  }
  /**
   * Takes the json GET response from ES and constructs a pipeline model to be used
   * in Kibana downstream
   */


  static fromUpstreamJSON(id, pipeline) {
    const opts = {
      id,
      description: (0, _lodash.get)(pipeline, id + '.description'),
      last_modified: (0, _lodash.get)(pipeline, id + '.last_modified'),
      username: (0, _lodash.get)(pipeline, id + '.username')
    };
    return new PipelineListItem(opts);
  }

}

exports.PipelineListItem = PipelineListItem;