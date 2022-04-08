"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEsClientMethodResponseToError = exports.generateEsRequestErrorApiResponseMock = exports.generateEsApiResponseMock = exports.generateArtifactMock = exports.generateArtifactEsSearchResultHitsMock = exports.generateArtifactEsGetSingleHitMock = exports.createArtifactsClientMock = void 0;

var _url = require("url");

var _elasticsearch = require("@elastic/elasticsearch");

var _mocks = require("../../../../../../src/core/server/mocks");

var _mappings = require("./mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createArtifactsClientMock = () => {
  return {
    getArtifact: jest.fn().mockResolvedValue(generateArtifactMock()),
    createArtifact: jest.fn().mockResolvedValue(generateArtifactMock()),
    deleteArtifact: jest.fn(),
    listArtifacts: jest.fn().mockResolvedValue({
      items: [generateArtifactMock()],
      total: 1,
      perPage: 20,
      page: 1
    }),
    generateHash: jest.fn().mockResolvedValue('e40a028b3dab7e567135b80ed69934a52be5b4c2d901faa8e0997b256c222473'),
    encodeContent: jest.fn().mockResolvedValue({
      body: 'eJyrVspOrVSyUlAqS8wpTVWqBQArrwVB',
      compressionAlgorithm: 'zlib',
      decodedSha256: '9724c1e20e6e3e4d7f57ed25f9d4efb006e508590d528c90da597f6a775c13e5',
      decodedSize: 16,
      encodedSha256: '446086d1609189c3ad93a943976e4b7474c028612e5ec4810a81cc01a631f0f9',
      encodedSize: 24
    })
  };
};

exports.createArtifactsClientMock = createArtifactsClientMock;

const generateArtifactMock = () => {
  return {
    id: '123',
    type: 'trustlist',
    identifier: 'trustlist-v1',
    packageName: 'endpoint',
    encryptionAlgorithm: 'none',
    relative_url: '/api/fleet/artifacts/trustlist-v1/d801aa1fb',
    compressionAlgorithm: 'zlib',
    decodedSha256: 'd801aa1fb',
    decodedSize: 14,
    encodedSha256: 'd29238d40',
    encodedSize: 22,
    body: 'eJyrVkrNKynKTC1WsoqOrQUAJxkFKQ==',
    created: '2021-03-08T14:47:13.714Z'
  };
};

exports.generateArtifactMock = generateArtifactMock;

const generateEsRequestErrorApiResponseMock = ({
  statusCode = 500
} = {
  statusCode: 500
}) => {
  return generateEsApiResponseMock({
    _index: '.fleet-artifacts_1',
    _id: '123',
    found: false
  }, {
    statusCode
  });
};

exports.generateEsRequestErrorApiResponseMock = generateEsRequestErrorApiResponseMock;

const generateArtifactEsGetSingleHitMock = artifact => {
  const {
    id,
    created,
    ...newArtifact
  } = generateArtifactMock();
  const _source = { ...(0, _mappings.newArtifactToElasticsearchProperties)(artifact !== null && artifact !== void 0 ? artifact : newArtifact),
    created
  };
  return {
    _index: '.fleet-artifacts_1',
    _id: id,
    _version: 1,
    _score: 1,
    _source
  };
};

exports.generateArtifactEsGetSingleHitMock = generateArtifactEsGetSingleHitMock;

const generateArtifactEsSearchResultHitsMock = () => {
  return {
    took: 0,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: {
        value: 1,
        relation: 'eq'
      },
      max_score: 2,
      hits: [generateArtifactEsGetSingleHitMock()]
    }
  };
};

exports.generateArtifactEsSearchResultHitsMock = generateArtifactEsSearchResultHitsMock;

const generateEsApiResponseMock = (body, otherProps = {}) => {
  return _mocks.elasticsearchServiceMock.createApiResponse({
    body,
    headers: {
      'content-type': 'application/json',
      'content-length': '697'
    },
    meta: {
      context: null,
      request: {
        params: {
          method: 'GET',
          path: '/.fleet-artifacts/_doc/02d38f4b-24cf-486e-b17e-9f727cfde23c',
          body: undefined,
          querystring: ''
        },
        options: {},
        id: 7160
      },
      name: 'elasticsearch-js',
      connection: {
        url: new _url.URL('http://localhost:9200/'),
        id: 'http://localhost:9200/',
        headers: {},
        deadCount: 0,
        resurrectTimeout: 0,
        _openRequests: 0,
        status: 'alive',
        // There are some properties missing below which is not important for this mock
        // @ts-expect-error
        roles: {
          master: true,
          data: true,
          ingest: true,
          ml: false
        }
      },
      attempts: 0,
      aborted: false
    },
    ...otherProps
  });
};

exports.generateEsApiResponseMock = generateEsApiResponseMock;

const setEsClientMethodResponseToError = (esClientMock, method, options) => {
  esClientMock[method].mockImplementation(() => {
    return _mocks.elasticsearchServiceMock.createErrorTransportRequestPromise(new _elasticsearch.errors.ResponseError(generateEsRequestErrorApiResponseMock(options)));
  });
};

exports.setEsClientMethodResponseToError = setEsClientMethodResponseToError;