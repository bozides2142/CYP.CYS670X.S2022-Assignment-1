"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransformExists = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTransformExists = async (esClient, id) => {
  try {
    const {
      body: {
        count
      }
    } = await esClient.transform.getTransform({
      size: 1000,
      transform_id: id
    });
    return count > 0;
  } catch (err) {
    var _err$body;

    if (((_err$body = err.body) === null || _err$body === void 0 ? void 0 : _err$body.status) === 404) {
      return false;
    } else {
      throw err.body ? err.body : err;
    }
  }
};

exports.getTransformExists = getTransformExists;