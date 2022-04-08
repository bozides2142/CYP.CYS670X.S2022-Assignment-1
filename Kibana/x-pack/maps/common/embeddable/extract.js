"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = void 0;

var _references = require("../migrations/references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extract = state => {
  const typedState = state; // by-reference embeddable

  if (!('attributes' in typedState) || typedState.attributes === undefined) {
    // No references to extract for by-reference embeddable since all references are stored with by-reference saved object
    return {
      state,
      references: []
    };
  } // by-value embeddable


  const {
    attributes,
    references
  } = (0, _references.extractReferences)({
    attributes: typedState.attributes
  });
  return {
    state: { ...state,
      attributes
    },
    references
  };
};

exports.extract = extract;