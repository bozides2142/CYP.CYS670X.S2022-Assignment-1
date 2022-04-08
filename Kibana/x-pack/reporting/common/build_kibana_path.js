"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildKibanaPath = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildKibanaPath = ({
  basePath,
  appPath,
  spaceId
}) => {
  return spaceId === undefined || spaceId.toLowerCase() === 'default' ? `${basePath}${appPath}` : `${basePath}/s/${spaceId}${appPath}`;
};

exports.buildKibanaPath = buildKibanaPath;