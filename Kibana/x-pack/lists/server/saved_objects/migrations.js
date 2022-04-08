"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const entryType = t.union([_securitysolutionIoTsListTypes.entry, _securitysolutionIoTsListTypes.entriesNested]);

const migrateEntry = entryToMigrate => {
  const newEntry = entryToMigrate;

  if (_securitysolutionIoTsListTypes.entriesNested.is(entryToMigrate) && _securitysolutionIoTsListTypes.entriesNested.is(newEntry)) {
    newEntry.entries = entryToMigrate.entries.map(nestedEntry => migrateEntry(nestedEntry));
  }

  newEntry.field = entryToMigrate.field.replace('.text', '.caseless');
  return newEntry;
};

const reduceOsTypes = (acc, tag) => {
  if (tag.startsWith('os:')) {
    // TODO: check OS against type
    return [...acc, tag.replace('os:', '')];
  }

  return [...acc];
};

const containsPolicyTags = tags => tags.some(tag => tag.startsWith('policy:'));

const migrations = {
  '7.10.0': doc => ({ ...doc,
    ...{
      attributes: { ...doc.attributes,
        ...(doc.attributes.entries && [_securitysolutionListConstants.ENDPOINT_LIST_ID, _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID].includes(doc.attributes.list_id) && {
          entries: doc.attributes.entries.map(migrateEntry)
        }),
        ...(doc.attributes._tags && doc.attributes._tags.reduce(reduceOsTypes, []).length > 0 && {
          os_types: doc.attributes._tags.reduce(reduceOsTypes, [])
        })
      }
    },
    references: doc.references || []
  }),
  '7.12.0': doc => {
    if (doc.attributes.list_id === _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID) {
      return { ...doc,
        ...{
          attributes: { ...doc.attributes,
            tags: [...(doc.attributes.tags || []), ...(containsPolicyTags(doc.attributes.tags) ? [] : ['policy:all'])]
          }
        },
        references: doc.references || []
      };
    } else {
      return { ...doc,
        references: doc.references || []
      };
    }
  }
};
exports.migrations = migrations;