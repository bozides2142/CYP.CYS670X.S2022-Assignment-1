"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertESResponseToTopNodesResponse = void 0;

var _get_matadata_from_node_bucket = require("./get_matadata_from_node_bucket");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const convertESResponseToTopNodesResponse = response => {
  if (!response.aggregations) {
    return {
      series: []
    };
  }

  return {
    series: response.aggregations.nodes.buckets.map(node => {
      return {
        id: node.key,
        ...(0, _get_matadata_from_node_bucket.getMetadataFromNodeBucket)(node),
        timeseries: node.timeseries.buckets.map(bucket => {
          return {
            timestamp: bucket.key,
            cpu: bucket.cpu.value,
            iowait: bucket.iowait.value,
            load: bucket.load.value,
            rx: bucket.rx.value,
            tx: bucket.tx.value
          };
        }),
        cpu: node.cpu.value,
        iowait: node.iowait.value,
        load: node.load.value,
        uptime: node.uptime.value,
        rx: node.rx.value,
        tx: node.tx.value
      };
    })
  };
};

exports.convertESResponseToTopNodesResponse = convertESResponseToTopNodesResponse;