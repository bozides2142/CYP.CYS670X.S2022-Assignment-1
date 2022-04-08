"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryTopNodes = void 0;

var _convert_es_response_to_top_nodes_response = require("./convert_es_response_to_top_nodes_response");

var _create_top_nodes_query = require("./create_top_nodes_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const queryTopNodes = async (options, client, source) => {
  const params = {
    index: source.configuration.metricAlias,
    body: (0, _create_top_nodes_query.createTopNodesQuery)(options, source)
  };
  const response = await client(params);
  return (0, _convert_es_response_to_top_nodes_response.convertESResponseToTopNodesResponse)(response);
};

exports.queryTopNodes = queryTopNodes;