"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestIndexStats = exports.createTestIndexState = exports.createTestIndexResponse = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// fixtures return minimal index properties needed for API tests

const createTestIndexState = index => {
  return {
    aliases: {},
    settings: {
      index: {
        number_of_shards: 1,
        number_of_replicas: 1
      }
    },
    ...index
  };
};

exports.createTestIndexState = createTestIndexState;

const createTestIndexStats = index => {
  return {
    health: 'green',
    status: 'open',
    uuid: 'test_index',
    total: {
      docs: {
        count: 1,
        deleted: 0
      },
      store: {
        size_in_bytes: 100
      }
    },
    primaries: {
      store: {
        size_in_bytes: 100
      }
    },
    ...index
  };
};

exports.createTestIndexStats = createTestIndexStats;

const createTestIndexResponse = index => {
  return {
    aliases: 'none',
    data_stream: undefined,
    documents: 1,
    documents_deleted: 0,
    health: 'green',
    hidden: false,
    isFrozen: false,
    name: 'test_index',
    primary: 1,
    replica: 1,
    size: '100b',
    primary_size: '100b',
    status: 'open',
    uuid: 'test_index',
    ...index
  };
};

exports.createTestIndexResponse = createTestIndexResponse;