"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLegacyUrlAliases = findLegacyUrlAliases;

var esKuery = _interopRequireWildcard(require("@kbn/es-query"));

var _object_types = require("../../../object_types");

var _internal_utils = require("../internal_utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Fetches all legacy URL aliases that match the given objects, returning a map of the matching aliases and what space(s) they exist in.
 *
 * @internal
 */
async function findLegacyUrlAliases(createPointInTimeFinder, objects, perPage) {
  if (!objects.length) {
    return new Map();
  }

  const filter = createAliasKueryFilter(objects);
  const finder = createPointInTimeFinder({
    type: _object_types.LEGACY_URL_ALIAS_TYPE,
    perPage,
    filter
  });
  const aliasesMap = new Map();
  let error;

  try {
    for await (const {
      saved_objects: savedObjects
    } of finder.find()) {
      for (const alias of savedObjects) {
        var _aliasesMap$get;

        const {
          sourceId,
          targetType,
          targetNamespace
        } = alias.attributes;
        const key = (0, _internal_utils.getObjectKey)({
          type: targetType,
          id: sourceId
        });
        const val = (_aliasesMap$get = aliasesMap.get(key)) !== null && _aliasesMap$get !== void 0 ? _aliasesMap$get : new Set();
        val.add(targetNamespace);
        aliasesMap.set(key, val);
      }
    }
  } catch (e) {
    error = e;
  }

  try {
    await finder.close();
  } catch (e) {
    if (!error) {
      error = e;
    }
  }

  if (error) {
    throw new Error(`Failed to retrieve legacy URL aliases: ${error.message}`);
  }

  return aliasesMap;
}

function createAliasKueryFilter(objects) {
  const {
    buildNode
  } = esKuery.nodeTypes.function; // Note: these nodes include '.attributes' for type-level fields because these are eventually passed to `validateConvertFilterToKueryNode`, which requires it

  const kueryNodes = objects.reduce((acc, {
    type,
    id
  }) => {
    const match1 = buildNode('is', `${_object_types.LEGACY_URL_ALIAS_TYPE}.attributes.targetType`, type);
    const match2 = buildNode('is', `${_object_types.LEGACY_URL_ALIAS_TYPE}.attributes.sourceId`, id);
    acc.push(buildNode('and', [match1, match2]));
    return acc;
  }, []);
  return buildNode('and', [buildNode('not', buildNode('is', `${_object_types.LEGACY_URL_ALIAS_TYPE}.attributes.disabled`, true)), // ignore aliases that have been disabled
  buildNode('or', kueryNodes)]);
}