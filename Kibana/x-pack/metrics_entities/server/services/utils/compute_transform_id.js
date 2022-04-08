"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeTransformId = void 0;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const computeTransformId = ({
  prefix,
  id,
  suffix
}) => {
  const prefixExists = prefix.trim() !== '';
  const suffixExists = suffix.trim() !== ''; // TODO: Check for invalid characters on the main route for prefixExists and suffixExists and do an invalidation
  // if either have invalid characters for a job name. Might want to add that same check within the API too at a top level?

  if (prefixExists && suffixExists) {
    return `${_constants.ELASTIC_NAME}_${prefix}_${id}_${suffix}`;
  } else if (prefixExists) {
    return `${_constants.ELASTIC_NAME}_${prefix}_${id}`;
  } else if (suffixExists) {
    return `${_constants.ELASTIC_NAME}_${id}_${suffix}`;
  } else {
    return `${_constants.ELASTIC_NAME}_${id}`;
  }
};

exports.computeTransformId = computeTransformId;