"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetadataFromNodeBucket = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMetadataFromNodeBucket = node => {
  const metadata = node.metadata.top[0];

  if (!metadata) {
    return {
      name: null,
      provider: null,
      platform: null
    };
  }

  return {
    name: metadata.metrics['host.name'] || null,
    provider: metadata.metrics['cloud.provider'] || null,
    platform: metadata.metrics['host.os.platform'] || null
  };
};

exports.getMetadataFromNodeBucket = getMetadataFromNodeBucket;