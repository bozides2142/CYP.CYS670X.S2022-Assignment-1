"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergePipelineVersions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mergePipelineVersions = versions => {
  const versionsByHash = versions.reduce((acc, pipeline) => {
    const existing = acc[pipeline.hash];

    if (!existing) {
      return { ...acc,
        [pipeline.hash]: pipeline
      };
    }

    existing.firstSeen = Math.min(existing.firstSeen, pipeline.firstSeen);
    existing.lastSeen = Math.max(existing.lastSeen, pipeline.lastSeen);
    return acc;
  }, {});
  return Object.values(versionsByHash);
};

exports.mergePipelineVersions = mergePipelineVersions;