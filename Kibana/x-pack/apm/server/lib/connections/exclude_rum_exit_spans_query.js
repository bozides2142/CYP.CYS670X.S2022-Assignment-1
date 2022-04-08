"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excludeRumExitSpansQuery = excludeRumExitSpansQuery;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _agent_name = require("../../../common/agent_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// exclude RUM exit spans, as they're high cardinality and don't usually
// talk to databases directly


function excludeRumExitSpansQuery() {
  return [{
    bool: {
      must_not: [{
        terms: {
          [_elasticsearch_fieldnames.AGENT_NAME]: _agent_name.RUM_AGENT_NAMES
        }
      }]
    }
  }];
}