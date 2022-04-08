"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWriteBlockException = exports.isIndexNotFoundException = exports.isIncompatibleMappingException = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isWriteBlockException = ({
  type,
  reason
}) => {
  return type === 'cluster_block_exception' && reason.match(/index \[.+] blocked by: \[FORBIDDEN\/8\/.+ \(api\)\]/) !== null;
};

exports.isWriteBlockException = isWriteBlockException;

const isIncompatibleMappingException = ({
  type
}) => {
  return type === 'strict_dynamic_mapping_exception' || type === 'mapper_parsing_exception';
};

exports.isIncompatibleMappingException = isIncompatibleMappingException;

const isIndexNotFoundException = ({
  type
}) => {
  return type === 'index_not_found_exception';
};

exports.isIndexNotFoundException = isIndexNotFoundException;