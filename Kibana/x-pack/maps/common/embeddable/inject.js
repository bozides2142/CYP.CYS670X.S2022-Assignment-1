"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = void 0;

var _references = require("../migrations/references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const inject = (state, references) => {
  const typedState = state; // by-reference embeddable

  if (!('attributes' in typedState) || typedState.attributes === undefined) {
    return typedState;
  } // by-value embeddable


  try {
    // run embeddable state through extract logic to ensure any state with hard coded ids is replace with refNames
    // refName generation will produce consistent values allowing inject logic to then replace refNames with current ids.
    const {
      attributes: attributesWithNoHardCodedIds
    } = (0, _references.extractReferences)({
      attributes: typedState.attributes
    });
    const {
      attributes: attributesWithInjectedIds
    } = (0, _references.injectReferences)({
      attributes: attributesWithNoHardCodedIds,
      references
    });
    return { ...typedState,
      attributes: attributesWithInjectedIds
    };
  } catch (error) {
    // inject exception prevents entire dashboard from display
    // Instead of throwing, swallow error and let dashboard display
    // Errors will surface in map panel. Any layer that failed injection will surface the error in the legend
    // Users can then manually edit map to resolve any problems.
    return typedState;
  }
};

exports.inject = inject;