"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetArtifactsClient = void 0;

var _errors = require("../../errors");

var _mappings = require("./mappings");

var _artifacts = require("./artifacts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Exposes an interface for access artifacts from within the context of a single integration (`packageName`)
 */


class FleetArtifactsClient {
  constructor(esClient, packageName) {
    this.esClient = esClient;
    this.packageName = packageName;

    if (!packageName) {
      throw new _errors.ArtifactsClientError('packageName is required');
    }
  }

  validate(artifact) {
    if (artifact.packageName !== this.packageName) {
      throw new _errors.ArtifactsClientAccessDeniedError(artifact.packageName, this.packageName);
    }

    return artifact;
  }

  async getArtifact(id) {
    const artifact = await (0, _artifacts.getArtifact)(this.esClient, id);
    return artifact ? this.validate(artifact) : undefined;
  }
  /**
   * Creates a new artifact. Content will be compress and stored in binary form.
   */


  async createArtifact({
    content,
    type = '',
    identifier = this.packageName
  }) {
    const encodedMetaData = await this.encodeContent(content);
    const newArtifactData = {
      type,
      identifier,
      packageName: this.packageName,
      encryptionAlgorithm: 'none',
      relative_url: (0, _mappings.relativeDownloadUrlFromArtifact)({
        identifier,
        decodedSha256: encodedMetaData.decodedSha256
      }),
      ...encodedMetaData
    };
    return (0, _artifacts.createArtifact)(this.esClient, newArtifactData);
  }

  async deleteArtifact(id) {
    // get the artifact first, which will also ensure its validated
    const artifact = await this.getArtifact(id);

    if (artifact) {
      await (0, _artifacts.deleteArtifact)(this.esClient, id);
    }
  }
  /**
   * Get a list of artifacts.
   * NOTE that when using the `kuery` filtering param, that all filters property names should
   * match the internal attribute names of the index
   */


  async listArtifacts({
    kuery,
    ...options
  } = {}) {
    // All filtering for artifacts should be bound to the `packageName`, so we insert
    // that into the KQL value and use `AND` to add the defined `kuery` (if any) to it.
    const filter = `(package_name: "${this.packageName}")${kuery ? ` AND ${kuery}` : ''}`;
    return (0, _artifacts.listArtifacts)(this.esClient, { ...options,
      kuery: filter
    });
  }

  generateHash(content) {
    return (0, _artifacts.generateArtifactContentHash)(content);
  }

  async encodeContent(content) {
    return (0, _artifacts.encodeArtifactContent)(content);
  }

}

exports.FleetArtifactsClient = FleetArtifactsClient;