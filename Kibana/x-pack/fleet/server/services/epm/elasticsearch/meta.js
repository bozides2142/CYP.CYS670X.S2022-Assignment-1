"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendMetadataToIngestPipeline = appendMetadataToIngestPipeline;
exports.getESAssetMetadata = getESAssetMetadata;

var _jsYaml = require("js-yaml");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MANAGED_BY_DEFAULT = 'fleet';
/**
 * Build common metadata object for Elasticsearch assets installed by Fleet. Result should be
 * stored on a `_meta` field on the generated assets.
 */

function getESAssetMetadata({
  packageName
} = {}) {
  const meta = {
    managed_by: MANAGED_BY_DEFAULT,
    managed: true
  };

  if (packageName) {
    meta.package = {
      name: packageName
    };
  }

  return meta;
}

function appendMetadataToIngestPipeline({
  pipeline,
  packageName
}) {
  const meta = getESAssetMetadata({
    packageName
  });

  if (pipeline.extension === 'yml') {
    // Convert the YML content to JSON, append the `_meta` value, then convert it back to
    // YML and return the resulting YML
    const parsedPipelineContent = (0, _jsYaml.safeLoad)(pipeline.contentForInstallation);
    parsedPipelineContent._meta = meta;
    return { ...pipeline,
      contentForInstallation: `---\n${(0, _jsYaml.safeDump)(parsedPipelineContent)}`
    };
  }

  const parsedPipelineContent = JSON.parse(pipeline.contentForInstallation);
  parsedPipelineContent._meta = meta;
  return { ...pipeline,
    contentForInstallation: parsedPipelineContent
  };
}