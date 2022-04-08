"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDocSource = createDocSource;

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_SETTINGS = {
  number_of_shards: 1
};
const DEFAULT_META = {
  _meta: {
    created_by: _constants.MAPS_NEW_VECTOR_LAYER_META_CREATED_BY
  }
};

async function createDocSource(index, mappings, {
  asCurrentUser
}, indexPatternsService) {
  try {
    await createIndex(index, mappings, asCurrentUser);
    const {
      id: indexPatternId
    } = await indexPatternsService.createAndSave({
      title: index
    }, true);
    return {
      indexPatternId,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}

async function createIndex(indexName, mappings, asCurrentUser) {
  const body = {
    mappings: { ...DEFAULT_META,
      ...mappings
    },
    settings: DEFAULT_SETTINGS
  };
  await asCurrentUser.indices.create({
    index: indexName,
    body
  });
}