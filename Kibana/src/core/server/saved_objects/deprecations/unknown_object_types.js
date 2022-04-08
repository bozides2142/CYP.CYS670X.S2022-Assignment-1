"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnknownTypesDeprecations = exports.deleteUnknownTypeObjects = void 0;

var _i18n = require("@kbn/i18n");

var _lib = require("../service/lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getKnownTypes = typeRegistry => typeRegistry.getAllTypes().map(type => type.name);

const getTargetIndices = ({
  types,
  typeRegistry,
  kibanaVersion,
  kibanaIndex
}) => {
  return [...new Set(types.map(type => (0, _lib.getIndexForType)({
    type,
    typeRegistry,
    kibanaVersion,
    defaultIndex: kibanaIndex
  })))];
};

const getUnknownTypesQuery = knownTypes => {
  return {
    bool: {
      must_not: knownTypes.map(type => ({
        term: {
          type
        }
      }))
    }
  };
};

const getUnknownSavedObjects = async ({
  typeRegistry,
  esClient,
  kibanaIndex,
  kibanaVersion
}) => {
  const knownTypes = getKnownTypes(typeRegistry);
  const targetIndices = getTargetIndices({
    types: knownTypes,
    typeRegistry,
    kibanaIndex,
    kibanaVersion
  });
  const query = getUnknownTypesQuery(knownTypes);
  const {
    body
  } = await esClient.asInternalUser.search({
    index: targetIndices,
    body: {
      size: 10000,
      query
    }
  });
  const {
    hits: unknownDocs
  } = body.hits;
  return unknownDocs.map(doc => {
    var _doc$_source$type, _doc$_source;

    return {
      id: doc._id,
      type: (_doc$_source$type = (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : _doc$_source.type) !== null && _doc$_source$type !== void 0 ? _doc$_source$type : 'unknown'
    };
  });
};

const getUnknownTypesDeprecations = async options => {
  const deprecations = [];
  const unknownDocs = await getUnknownSavedObjects(options);

  if (unknownDocs.length) {
    deprecations.push({
      title: _i18n.i18n.translate('core.savedObjects.deprecations.unknownTypes.title', {
        defaultMessage: 'Saved objects with unknown types are present in Kibana system indices'
      }),
      message: _i18n.i18n.translate('core.savedObjects.deprecations.unknownTypes.message', {
        defaultMessage: '{objectCount, plural, one {# object} other {# objects}} with unknown types {objectCount, plural, one {was} other {were}} found in Kibana system indices. ' + 'Upgrading with unknown savedObject types is no longer supported. ' + `To ensure that upgrades will succeed in the future, either re-enable plugins or delete these documents from the Kibana indices`,
        values: {
          objectCount: unknownDocs.length
        }
      }),
      level: 'critical',
      requireRestart: false,
      deprecationType: undefined,
      // not config nor feature...
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('core.savedObjects.deprecations.unknownTypes.manualSteps.1', {
          defaultMessage: 'Enable disabled plugins then restart Kibana.'
        }), _i18n.i18n.translate('core.savedObjects.deprecations.unknownTypes.manualSteps.2', {
          defaultMessage: 'If no plugins are disabled, or if enabling them does not fix the issue, delete the documents.'
        })],
        api: {
          path: '/internal/saved_objects/deprecations/_delete_unknown_types',
          method: 'POST',
          body: {}
        }
      }
    });
  }

  return deprecations;
};

exports.getUnknownTypesDeprecations = getUnknownTypesDeprecations;

const deleteUnknownTypeObjects = async ({
  esClient,
  typeRegistry,
  kibanaIndex,
  kibanaVersion
}) => {
  const knownTypes = getKnownTypes(typeRegistry);
  const targetIndices = getTargetIndices({
    types: knownTypes,
    typeRegistry,
    kibanaIndex,
    kibanaVersion
  });
  const query = getUnknownTypesQuery(knownTypes);
  await esClient.asInternalUser.deleteByQuery({
    index: targetIndices,
    wait_for_completion: false,
    body: {
      query
    }
  });
};

exports.deleteUnknownTypeObjects = deleteUnknownTypeObjects;