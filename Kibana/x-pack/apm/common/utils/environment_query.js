"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environmentQuery = environmentQuery;
exports.serviceNodeNameQuery = serviceNodeNameQuery;

var _elasticsearch_fieldnames = require("../elasticsearch_fieldnames");

var _environment_filter_values = require("../environment_filter_values");

var _service_nodes = require("../service_nodes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function environmentQuery(environment) {
  if (!environment || environment === _environment_filter_values.ENVIRONMENT_ALL.value) {
    return [];
  }

  if (environment === _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value) {
    return [{
      bool: {
        must_not: {
          exists: {
            field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
          }
        }
      }
    }];
  }

  return [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: environment
    }
  }];
}

function serviceNodeNameQuery(serviceNodeName) {
  if (!serviceNodeName) {
    return [];
  }

  if (serviceNodeName === _service_nodes.SERVICE_NODE_NAME_MISSING) {
    return [{
      bool: {
        must_not: [{
          exists: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          }
        }]
      }
    }];
  }

  return [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: serviceNodeName
    }
  }];
}