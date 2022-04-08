"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializePipelines = deserializePipelines;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function deserializePipelines(pipelinesByName) {
  const pipelineNames = Object.keys(pipelinesByName);
  const deserializedPipelines = pipelineNames.map(name => {
    var _ref, _pipelinesByName$name, _pipelinesByName$name2;

    return { ...pipelinesByName[name],
      processors: (_ref = (_pipelinesByName$name = pipelinesByName[name]) === null || _pipelinesByName$name === void 0 ? void 0 : _pipelinesByName$name.processors) !== null && _ref !== void 0 ? _ref : [],
      on_failure: (_pipelinesByName$name2 = pipelinesByName[name]) === null || _pipelinesByName$name2 === void 0 ? void 0 : _pipelinesByName$name2.on_failure,
      name
    };
  });
  return deserializedPipelines;
}