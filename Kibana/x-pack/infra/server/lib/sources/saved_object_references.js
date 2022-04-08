"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveSavedObjectReferences = exports.metricsExplorerDefaultViewReferenceName = exports.logIndexPatternReferenceName = exports.inventoryDefaultViewReferenceName = exports.extractSavedObjectReferences = exports.extractMetricsExplorerSavedViewReferences = exports.extractInventorySavedViewReferences = void 0;

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const logIndexPatternReferenceName = 'log_index_pattern_0';
exports.logIndexPatternReferenceName = logIndexPatternReferenceName;
const inventoryDefaultViewReferenceName = 'inventory-saved-view-0';
exports.inventoryDefaultViewReferenceName = inventoryDefaultViewReferenceName;
const metricsExplorerDefaultViewReferenceName = 'metrics-explorer-saved-view-0';
exports.metricsExplorerDefaultViewReferenceName = metricsExplorerDefaultViewReferenceName;
/**
 * Rewrites a source configuration such that well-known saved object references
 * are extracted in the `references` array and replaced by the appropriate
 * name. This is the inverse operation to `resolveSavedObjectReferences`.
 */

const extractSavedObjectReferences = sourceConfiguration => [extractLogIndicesSavedObjectReferences, extractInventorySavedViewReferences, extractMetricsExplorerSavedViewReferences].reduce(({
  attributes: accumulatedAttributes,
  references: accumulatedReferences
}, extract) => {
  const {
    attributes,
    references
  } = extract(accumulatedAttributes);
  return {
    attributes,
    references: [...accumulatedReferences, ...references]
  };
}, {
  attributes: sourceConfiguration,
  references: []
});
/**
 * Rewrites a source configuration such that well-known saved object references
 * are resolved from the `references` argument and replaced by the real saved
 * object ids. This is the inverse operation to `extractSavedObjectReferences`.
 */


exports.extractSavedObjectReferences = extractSavedObjectReferences;

const resolveSavedObjectReferences = (attributes, references) => [resolveLogIndicesSavedObjectReferences, resolveInventoryViewSavedObjectReferences, resolveMetricsExplorerSavedObjectReferences].reduce((accumulatedAttributes, resolve) => resolve(accumulatedAttributes, references), attributes);

exports.resolveSavedObjectReferences = resolveSavedObjectReferences;

const extractLogIndicesSavedObjectReferences = sourceConfiguration => {
  if (sourceConfiguration.logIndices.type === 'index_pattern') {
    const logIndexPatternReference = {
      id: sourceConfiguration.logIndices.indexPatternId,
      type: 'index-pattern',
      name: logIndexPatternReferenceName
    };
    const attributes = { ...sourceConfiguration,
      logIndices: { ...sourceConfiguration.logIndices,
        indexPatternId: logIndexPatternReference.name
      }
    };
    return {
      attributes,
      references: [logIndexPatternReference]
    };
  } else {
    return {
      attributes: sourceConfiguration,
      references: []
    };
  }
};

const extractInventorySavedViewReferences = sourceConfiguration => {
  const {
    inventoryDefaultView
  } = sourceConfiguration;

  if (inventoryDefaultView && inventoryDefaultView !== '0' && inventoryDefaultView !== inventoryDefaultViewReferenceName) {
    const inventoryDefaultViewReference = {
      id: inventoryDefaultView,
      type: 'inventory-view',
      name: inventoryDefaultViewReferenceName
    };
    const attributes = { ...sourceConfiguration,
      inventoryDefaultView: inventoryDefaultViewReference.name
    };
    return {
      attributes,
      references: [inventoryDefaultViewReference]
    };
  } else {
    return {
      attributes: sourceConfiguration,
      references: []
    };
  }
};

exports.extractInventorySavedViewReferences = extractInventorySavedViewReferences;

const extractMetricsExplorerSavedViewReferences = sourceConfiguration => {
  const {
    metricsExplorerDefaultView
  } = sourceConfiguration;

  if (metricsExplorerDefaultView && metricsExplorerDefaultView !== '0' && metricsExplorerDefaultView !== metricsExplorerDefaultViewReferenceName) {
    const metricsExplorerDefaultViewReference = {
      id: metricsExplorerDefaultView,
      type: 'metrics-explorer-view',
      name: metricsExplorerDefaultViewReferenceName
    };
    const attributes = { ...sourceConfiguration,
      metricsExplorerDefaultView: metricsExplorerDefaultViewReference.name
    };
    return {
      attributes,
      references: [metricsExplorerDefaultViewReference]
    };
  } else {
    return {
      attributes: sourceConfiguration,
      references: []
    };
  }
};

exports.extractMetricsExplorerSavedViewReferences = extractMetricsExplorerSavedViewReferences;

const resolveLogIndicesSavedObjectReferences = (attributes, references) => {
  var _attributes$logIndice;

  if (((_attributes$logIndice = attributes.logIndices) === null || _attributes$logIndice === void 0 ? void 0 : _attributes$logIndice.type) === 'index_pattern') {
    const logIndexPatternReference = references.find(reference => reference.name === logIndexPatternReferenceName);

    if (logIndexPatternReference == null) {
      throw new _errors.SavedObjectReferenceResolutionError(`Failed to resolve log index pattern reference "${logIndexPatternReferenceName}".`);
    }

    return { ...attributes,
      logIndices: { ...attributes.logIndices,
        indexPatternId: logIndexPatternReference.id
      }
    };
  } else {
    return attributes;
  }
};

const resolveInventoryViewSavedObjectReferences = (attributes, references) => {
  if (attributes.inventoryDefaultView && attributes.inventoryDefaultView !== '0') {
    const inventoryViewReference = references.find(reference => reference.name === inventoryDefaultViewReferenceName);

    if (inventoryViewReference == null) {
      throw new _errors.SavedObjectReferenceResolutionError(`Failed to resolve Inventory default view "${inventoryDefaultViewReferenceName}".`);
    }

    return { ...attributes,
      inventoryDefaultView: inventoryViewReference.id
    };
  } else {
    return attributes;
  }
};

const resolveMetricsExplorerSavedObjectReferences = (attributes, references) => {
  if (attributes.metricsExplorerDefaultView && attributes.metricsExplorerDefaultView !== '0') {
    const metricsExplorerViewReference = references.find(reference => reference.name === metricsExplorerDefaultViewReferenceName);

    if (metricsExplorerViewReference == null) {
      throw new _errors.SavedObjectReferenceResolutionError(`Failed to resolve Metrics Explorer default view "${metricsExplorerDefaultViewReferenceName}".`);
    }

    return { ...attributes,
      metricsExplorerDefaultView: metricsExplorerViewReference.id
    };
  } else {
    return attributes;
  }
};