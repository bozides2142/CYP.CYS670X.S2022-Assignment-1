"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeMappingId = void 0;

var _compute_transform_id = require("./compute_transform_id");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const computeMappingId = ({
  prefix,
  id,
  suffix
}) => {
  // TODO: This causes issues if above 65 character limit. We should limit the prefix
  // and anything else on the incoming routes to avoid this causing an issue. We should still
  // throw here in case I change the prefix or other names and cause issues.
  const computedId = (0, _compute_transform_id.computeTransformId)({
    id,
    prefix,
    suffix
  });
  return `.${computedId}`;
};

exports.computeMappingId = computeMappingId;