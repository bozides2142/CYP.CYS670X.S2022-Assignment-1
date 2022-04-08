"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internalBulkResolve = internalBulkResolve;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _core_usage_data = require("../../../core_usage_data");

var _elasticsearch = require("../../../elasticsearch");

var _object_types = require("../../object_types");

var _errors = require("./errors");

var _internal_utils = require("./internal_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function internalBulkResolve(params) {
  const {
    registry,
    allowedTypes,
    client,
    serializer,
    getIndexForType,
    incrementCounterInternal,
    objects,
    options = {}
  } = params;

  if (objects.length === 0) {
    return {
      resolved_objects: []
    };
  }

  const allObjects = validateObjectTypes(objects, allowedTypes);
  const validObjects = allObjects.filter(_internal_utils.isRight);
  const namespace = (0, _internal_utils.normalizeNamespace)(options.namespace);
  const requiresAliasCheck = namespace !== undefined;
  const aliasDocs = requiresAliasCheck ? await fetchAndUpdateAliases(validObjects, client, serializer, getIndexForType, namespace) : [];
  const docsToBulkGet = [];
  const aliasTargetIds = [];
  validObjects.forEach(({
    value: {
      type,
      id
    }
  }, i) => {
    const objectIndex = getIndexForType(type);
    docsToBulkGet.push({
      // attempt to find an exact match for the given ID
      _id: serializer.generateRawId(namespace, type, id),
      _index: objectIndex
    });

    if (requiresAliasCheck) {
      const aliasDoc = aliasDocs[i];

      if (aliasDoc !== null && aliasDoc !== void 0 && aliasDoc.found) {
        const legacyUrlAlias = aliasDoc._source[_object_types.LEGACY_URL_ALIAS_TYPE];

        if (!legacyUrlAlias.disabled) {
          docsToBulkGet.push({
            // also attempt to find a match for the legacy URL alias target ID
            _id: serializer.generateRawId(namespace, type, legacyUrlAlias.targetId),
            _index: objectIndex
          });
          aliasTargetIds.push(legacyUrlAlias.targetId);
          return;
        }
      }
    }

    aliasTargetIds.push(undefined);
  });
  const bulkGetResponse = docsToBulkGet.length ? await client.mget({
    body: {
      docs: docsToBulkGet
    }
  }, {
    ignore: [404]
  }) : undefined; // exit early if a 404 isn't from elasticsearch

  if (bulkGetResponse && (0, _elasticsearch.isNotFoundFromUnsupportedServer)({
    statusCode: bulkGetResponse.statusCode,
    headers: bulkGetResponse.headers
  })) {
    throw _errors.SavedObjectsErrorHelpers.createGenericNotFoundEsUnavailableError();
  }

  let getResponseIndex = 0;
  let aliasTargetIndex = 0;
  const resolveCounter = new ResolveCounter();
  const resolvedObjects = allObjects.map(either => {
    var _aliasMatchDoc;

    if ((0, _internal_utils.isLeft)(either)) {
      return either.value;
    }

    const exactMatchDoc = bulkGetResponse === null || bulkGetResponse === void 0 ? void 0 : bulkGetResponse.body.docs[getResponseIndex++];
    let aliasMatchDoc;
    const aliasTargetId = aliasTargetIds[aliasTargetIndex++];

    if (aliasTargetId !== undefined) {
      aliasMatchDoc = bulkGetResponse === null || bulkGetResponse === void 0 ? void 0 : bulkGetResponse.body.docs[getResponseIndex++];
    }

    const foundExactMatch = // @ts-expect-error MultiGetHit._source is optional
    exactMatchDoc.found && (0, _internal_utils.rawDocExistsInNamespace)(registry, exactMatchDoc, namespace);
    const foundAliasMatch = // @ts-expect-error MultiGetHit._source is optional
    ((_aliasMatchDoc = aliasMatchDoc) === null || _aliasMatchDoc === void 0 ? void 0 : _aliasMatchDoc.found) && (0, _internal_utils.rawDocExistsInNamespace)(registry, aliasMatchDoc, namespace);
    const {
      type,
      id
    } = either.value;
    let result = null;

    if (foundExactMatch && foundAliasMatch) {
      result = {
        // @ts-expect-error MultiGetHit._source is optional
        saved_object: (0, _internal_utils.getSavedObjectFromSource)(registry, type, id, exactMatchDoc),
        outcome: 'conflict',
        alias_target_id: aliasTargetId
      };
      resolveCounter.recordOutcome(_core_usage_data.REPOSITORY_RESOLVE_OUTCOME_STATS.CONFLICT);
    } else if (foundExactMatch) {
      result = {
        // @ts-expect-error MultiGetHit._source is optional
        saved_object: (0, _internal_utils.getSavedObjectFromSource)(registry, type, id, exactMatchDoc),
        outcome: 'exactMatch'
      };
      resolveCounter.recordOutcome(_core_usage_data.REPOSITORY_RESOLVE_OUTCOME_STATS.EXACT_MATCH);
    } else if (foundAliasMatch) {
      result = {
        // @ts-expect-error MultiGetHit._source is optional
        saved_object: (0, _internal_utils.getSavedObjectFromSource)(registry, type, aliasTargetId, aliasMatchDoc),
        outcome: 'aliasMatch',
        alias_target_id: aliasTargetId
      };
      resolveCounter.recordOutcome(_core_usage_data.REPOSITORY_RESOLVE_OUTCOME_STATS.ALIAS_MATCH);
    }

    if (result !== null) {
      return result;
    }

    resolveCounter.recordOutcome(_core_usage_data.REPOSITORY_RESOLVE_OUTCOME_STATS.NOT_FOUND);
    return {
      type,
      id,
      error: _errors.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id)
    };
  });
  incrementCounterInternal(_core_usage_data.CORE_USAGE_STATS_TYPE, _core_usage_data.CORE_USAGE_STATS_ID, resolveCounter.getCounterFields(), {
    refresh: false
  }).catch(() => {}); // if the call fails for some reason, intentionally swallow the error

  return {
    resolved_objects: resolvedObjects
  };
}
/** Separates valid and invalid object types */


function validateObjectTypes(objects, allowedTypes) {
  return objects.map(object => {
    const {
      type,
      id
    } = object;

    if (!allowedTypes.includes(type)) {
      return {
        tag: 'Left',
        value: {
          type,
          id,
          error: _errors.SavedObjectsErrorHelpers.createUnsupportedTypeError(type)
        }
      };
    }

    return {
      tag: 'Right',
      value: object
    };
  });
}

async function fetchAndUpdateAliases(validObjects, client, serializer, getIndexForType, namespace) {
  if (validObjects.length === 0) {
    return [];
  }

  const time = (0, _internal_utils.getCurrentTime)();
  const bulkUpdateDocs = validObjects.map(({
    value: {
      type,
      id
    }
  }) => [{
    update: {
      _id: serializer.generateRawLegacyUrlAliasId(namespace, type, id),
      _index: getIndexForType(_object_types.LEGACY_URL_ALIAS_TYPE),
      _source: true
    }
  }, {
    script: {
      source: `
            if (ctx._source[params.type].disabled != true) {
              if (ctx._source[params.type].resolveCounter == null) {
                ctx._source[params.type].resolveCounter = 1;
              }
              else {
                ctx._source[params.type].resolveCounter += 1;
              }
              ctx._source[params.type].lastResolved = params.time;
              ctx._source.updated_at = params.time;
            }
          `,
      lang: 'painless',
      params: {
        type: _object_types.LEGACY_URL_ALIAS_TYPE,
        time
      }
    }
  }]).flat();
  const bulkUpdateResponse = await client.bulk({
    refresh: false,
    require_alias: true,
    body: bulkUpdateDocs
  });
  return bulkUpdateResponse.body.items.map(item => {
    var _item$update;

    // Map the bulk update response to the `_source` fields that were returned for each document
    return (_item$update = item.update) === null || _item$update === void 0 ? void 0 : _item$update.get;
  });
}

class ResolveCounter {
  constructor() {
    (0, _defineProperty2.default)(this, "record", new Map());
  }

  recordOutcome(outcome) {
    var _this$record$get;

    const val = (_this$record$get = this.record.get(outcome)) !== null && _this$record$get !== void 0 ? _this$record$get : 0;
    this.record.set(outcome, val + 1);
  }

  getCounterFields() {
    const counterFields = [];
    let total = 0;

    for (const [fieldName, incrementBy] of this.record.entries()) {
      total += incrementBy;
      counterFields.push({
        fieldName,
        incrementBy
      });
    }

    if (total > 0) {
      counterFields.push({
        fieldName: _core_usage_data.REPOSITORY_RESOLVE_OUTCOME_STATS.TOTAL,
        incrementBy: total
      });
    }

    return counterFields;
  }

}