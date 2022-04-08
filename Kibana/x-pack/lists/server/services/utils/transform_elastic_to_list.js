"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformElasticToList = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformElasticToList = ({
  response
}) => {
  // @ts-expect-error created_at is incompatible
  return response.hits.hits.map(hit => {
    return {
      _version: (0, _securitysolutionEsUtils.encodeHitVersion)(hit),
      id: hit._id,
      ...hit._source
    };
  });
};

exports.transformElasticToList = transformElasticToList;