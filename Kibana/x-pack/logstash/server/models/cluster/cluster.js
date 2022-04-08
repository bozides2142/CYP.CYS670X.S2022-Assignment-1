"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cluster = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This model deals with a cluster object from ES and converts it to Kibana downstream
 */


class Cluster {
  constructor({
    uuid
  }) {
    (0, _defineProperty2.default)(this, "uuid", void 0);
    this.uuid = uuid;
  }

  get downstreamJSON() {
    return {
      uuid: this.uuid
    };
  } // generate Pipeline object from elasticsearch response


  static fromUpstreamJSON(upstreamCluster) {
    const uuid = upstreamCluster.cluster_uuid;
    return new Cluster({
      uuid
    });
  }

}

exports.Cluster = Cluster;