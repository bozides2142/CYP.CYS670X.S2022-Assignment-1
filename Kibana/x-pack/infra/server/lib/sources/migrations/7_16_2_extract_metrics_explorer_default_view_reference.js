"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractMetricsExplorerDefaultViewReference = void 0;

var _saved_object_references = require("../saved_object_references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extractMetricsExplorerDefaultViewReference = sourceConfigurationDocument => {
  var _sourceConfigurationD;

  const {
    attributes,
    references
  } = (0, _saved_object_references.extractMetricsExplorerSavedViewReferences)(sourceConfigurationDocument.attributes);
  return { ...sourceConfigurationDocument,
    attributes,
    references: [...((_sourceConfigurationD = sourceConfigurationDocument.references) !== null && _sourceConfigurationD !== void 0 ? _sourceConfigurationD : []), ...references]
  };
};

exports.extractMetricsExplorerDefaultViewReference = extractMetricsExplorerDefaultViewReference;