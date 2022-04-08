"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listArtifacts = exports.getArtifact = exports.generateArtifactContentHash = exports.encodeArtifactContent = exports.deleteArtifact = exports.createArtifact = void 0;

var _zlib = require("zlib");

var _util = require("util");

var _crypto = require("crypto");

var _common = require("../../../common");

var _errors = require("../../errors");

var _utils = require("../../errors/utils");

var _utils2 = require("./utils");

var _mappings = require("./mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deflateAsync = (0, _util.promisify)(_zlib.deflate);

const getArtifact = async (esClient, id) => {
  try {
    const esData = await esClient.get({
      index: _common.FLEET_SERVER_ARTIFACTS_INDEX,
      id
    }); // @ts-expect-error @elastic/elasticsearch _source is optional

    return (0, _mappings.esSearchHitToArtifact)(esData.body);
  } catch (e) {
    if ((0, _utils2.isElasticsearchItemNotFoundError)(e)) {
      return;
    }

    throw new _errors.ArtifactsElasticsearchError(e);
  }
};

exports.getArtifact = getArtifact;

const createArtifact = async (esClient, artifact) => {
  const id = (0, _mappings.uniqueIdFromArtifact)(artifact);
  const newArtifactData = (0, _mappings.newArtifactToElasticsearchProperties)(artifact);

  try {
    await esClient.create({
      index: _common.FLEET_SERVER_ARTIFACTS_INDEX,
      id,
      body: newArtifactData,
      refresh: 'wait_for'
    });
  } catch (e) {
    // we ignore 409 errors from the create (document already exists)
    if (!(0, _utils.isElasticsearchVersionConflictError)(e)) {
      throw new _errors.ArtifactsElasticsearchError(e);
    }
  }

  return (0, _mappings.esSearchHitToArtifact)({
    _id: id,
    _source: newArtifactData
  });
};

exports.createArtifact = createArtifact;

const deleteArtifact = async (esClient, id) => {
  try {
    await esClient.delete({
      index: _common.FLEET_SERVER_ARTIFACTS_INDEX,
      id,
      refresh: 'wait_for'
    });
  } catch (e) {
    throw new _errors.ArtifactsElasticsearchError(e);
  }
};

exports.deleteArtifact = deleteArtifact;

const listArtifacts = async (esClient, options = {}) => {
  const {
    perPage = 20,
    page = 1,
    kuery = '',
    sortField = 'created',
    sortOrder = 'asc'
  } = options;

  try {
    const searchResult = await esClient.search({
      index: _common.FLEET_SERVER_ARTIFACTS_INDEX,
      q: kuery,
      from: (page - 1) * perPage,
      ignore_unavailable: true,
      size: perPage,
      body: {
        sort: [{
          [sortField]: {
            order: sortOrder
          }
        }]
      }
    });
    return {
      // @ts-expect-error @elastic/elasticsearch _source is optional
      items: searchResult.body.hits.hits.map(hit => (0, _mappings.esSearchHitToArtifact)(hit)),
      page,
      perPage,
      // @ts-expect-error doesn't handle total as number
      total: searchResult.body.hits.total.value
    };
  } catch (e) {
    throw new _errors.ArtifactsElasticsearchError(e);
  }
};

exports.listArtifacts = listArtifacts;

const generateArtifactContentHash = content => {
  return (0, _crypto.createHash)('sha256').update(content).digest('hex');
};

exports.generateArtifactContentHash = generateArtifactContentHash;

const encodeArtifactContent = async content => {
  const decodedContentBuffer = Buffer.from(content);
  const encodedContentBuffer = await deflateAsync(decodedContentBuffer);
  const encodedArtifact = {
    compressionAlgorithm: 'zlib',
    decodedSha256: generateArtifactContentHash(decodedContentBuffer.toString()),
    decodedSize: decodedContentBuffer.byteLength,
    encodedSha256: generateArtifactContentHash(encodedContentBuffer),
    encodedSize: encodedContentBuffer.byteLength,
    body: encodedContentBuffer.toString('base64')
  };
  return encodedArtifact;
};

exports.encodeArtifactContent = encodeArtifactContent;