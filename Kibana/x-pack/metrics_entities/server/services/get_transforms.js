"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransforms = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: Type the Promise<unknown> to a stronger type

const getTransforms = async ({
  esClient
}) => {
  const {
    body
  } = await esClient.transform.getTransform({
    size: 1000,
    transform_id: '*'
  });
  return body;
};

exports.getTransforms = getTransforms;