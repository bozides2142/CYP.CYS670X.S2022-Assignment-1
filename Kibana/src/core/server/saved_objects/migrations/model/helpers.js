"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAliases = getAliases;
exports.indexBelongsToLaterVersion = indexBelongsToLaterVersion;
exports.indexVersion = indexVersion;
exports.mergeMigrationMappingPropertyHashes = mergeMigrationMappingPropertyHashes;
exports.throwBadControlState = throwBadControlState;
exports.throwBadResponse = throwBadResponse;

var _semver = require("semver");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function throwBadControlState(controlState) {
  throw new Error('Unexpected control state: ' + controlState);
}
/**
 * A helper function/type for ensuring that all response types are handled.
 */


function throwBadResponse(state, res) {
  throw new Error(`${state.controlState} received unexpected action response: ` + JSON.stringify(res));
}
/**
 * Merge the _meta.migrationMappingPropertyHashes mappings of an index with
 * the given target mappings.
 *
 * @remarks When another instance already completed a migration, the existing
 * target index might contain documents and mappings created by a plugin that
 * is disabled in the current Kibana instance performing this migration.
 * Mapping updates are commutative (deeply merged) by Elasticsearch, except
 * for the `_meta` key. By merging the `_meta.migrationMappingPropertyHashes`
 * mappings from the existing target index index into the targetMappings we
 * ensure that any `migrationPropertyHashes` for disabled plugins aren't lost.
 *
 * Right now we don't use these `migrationPropertyHashes` but it could be used
 * in the future to detect if mappings were changed. If mappings weren't
 * changed we don't need to reindex but can clone the index to save disk space.
 *
 * @param targetMappings
 * @param indexMappings
 */


function mergeMigrationMappingPropertyHashes(targetMappings, indexMappings) {
  var _indexMappings$_meta, _targetMappings$_meta;

  return { ...targetMappings,
    _meta: {
      migrationMappingPropertyHashes: { ...((_indexMappings$_meta = indexMappings._meta) === null || _indexMappings$_meta === void 0 ? void 0 : _indexMappings$_meta.migrationMappingPropertyHashes),
        ...((_targetMappings$_meta = targetMappings._meta) === null || _targetMappings$_meta === void 0 ? void 0 : _targetMappings$_meta.migrationMappingPropertyHashes)
      }
    }
  };
}

function indexBelongsToLaterVersion(indexName, kibanaVersion) {
  const version = (0, _semver.valid)(indexVersion(indexName));
  return version != null ? (0, _semver.gt)(version, kibanaVersion) : false;
}
/**
 * Extracts the version number from a >= 7.11 index
 * @param indexName A >= v7.11 index name
 */


function indexVersion(indexName) {
  return ((indexName === null || indexName === void 0 ? void 0 : indexName.match(/.+_(\d+\.\d+\.\d+)_\d+/)) || [])[1];
}
/**
 * Creates a record of alias -> index name pairs
 */


function getAliases(indices) {
  return Object.keys(indices).reduce((acc, index) => {
    Object.keys(indices[index].aliases || {}).forEach(alias => {
      // TODO throw if multiple .kibana aliases point to the same index?
      acc[alias] = index;
    });
    return acc;
  }, {});
}