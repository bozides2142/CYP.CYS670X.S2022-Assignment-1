"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqueIdFromArtifact = exports.relativeDownloadUrlFromArtifact = exports.newArtifactToElasticsearchProperties = exports.esSearchHitToArtifact = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const esSearchHitToArtifact = ({
  _id: id,
  _source: {
    compression_algorithm: compressionAlgorithm,
    decoded_sha256: decodedSha256,
    decoded_size: decodedSize,
    encoded_sha256: encodedSha256,
    encoded_size: encodedSize,
    encryption_algorithm: encryptionAlgorithm,
    package_name: packageName,
    ...attributesNotNeedingRename
  }
}) => {
  return { ...attributesNotNeedingRename,
    id,
    compressionAlgorithm,
    decodedSha256,
    decodedSize,
    encodedSha256,
    encodedSize,
    encryptionAlgorithm,
    packageName
  };
};

exports.esSearchHitToArtifact = esSearchHitToArtifact;

const newArtifactToElasticsearchProperties = ({
  encryptionAlgorithm,
  packageName,
  encodedSize,
  encodedSha256,
  decodedSize,
  decodedSha256,
  compressionAlgorithm,
  ...attributesNotNeedingRename
}) => {
  return { ...attributesNotNeedingRename,
    encryption_algorithm: encryptionAlgorithm,
    package_name: packageName,
    encoded_size: encodedSize,
    encoded_sha256: encodedSha256,
    decoded_size: decodedSize,
    decoded_sha256: decodedSha256,
    compression_algorithm: compressionAlgorithm,
    created: new Date().toISOString()
  };
};

exports.newArtifactToElasticsearchProperties = newArtifactToElasticsearchProperties;

const relativeDownloadUrlFromArtifact = ({
  identifier,
  decodedSha256
}) => {
  return _constants.ARTIFACT_DOWNLOAD_RELATIVE_PATH.replace('{identifier}', identifier).replace('{decodedSha256}', decodedSha256);
};

exports.relativeDownloadUrlFromArtifact = relativeDownloadUrlFromArtifact;

const uniqueIdFromArtifact = ({
  identifier,
  decodedSha256,
  packageName
}) => {
  return `${packageName}:${identifier}-${decodedSha256}`;
};

exports.uniqueIdFromArtifact = uniqueIdFromArtifact;