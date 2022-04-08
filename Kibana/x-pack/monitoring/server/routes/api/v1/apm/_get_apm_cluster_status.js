"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmClusterStatus = void 0;

var _get_apms_for_clusters = require("../../../../lib/apm/get_apms_for_clusters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getApmClusterStatus = (req, {
  clusterUuid
}) => {
  const clusters = [{
    cluster_uuid: clusterUuid
  }];
  return (0, _get_apms_for_clusters.getApmsForClusters)(req, clusters).then(apms => {
    const [{
      stats,
      config
    }] = apms;
    return { ...stats,
      config
    };
  });
};

exports.getApmClusterStatus = getApmClusterStatus;