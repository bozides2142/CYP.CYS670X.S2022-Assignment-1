"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnterpriseSearchMetric = void 0;

var _classes = require("../classes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


class EnterpriseSearchMetric extends _classes.Metric {
  // @ts-ignore
  constructor(opts) {
    super({ ...opts,
      app: 'enterprise_search',
      ...EnterpriseSearchMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'enterprisesearch.cluster_uuid',
      timestampField: '@timestamp'
    };
  }

}

exports.EnterpriseSearchMetric = EnterpriseSearchMetric;