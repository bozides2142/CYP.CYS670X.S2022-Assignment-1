"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logSourceFieldColumnConfigurationRT = exports.logSourceConfigurationRT = exports.logSourceConfigurationPropertiesRT = exports.logSourceConfigurationOriginRT = exports.logSourceColumnConfigurationRT = exports.logIndexReferenceRT = exports.logIndexPatternReferenceRT = exports.logIndexNameReferenceRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const logSourceConfigurationOriginRT = rt.keyof({
  fallback: null,
  internal: null,
  stored: null
});
exports.logSourceConfigurationOriginRT = logSourceConfigurationOriginRT;
const logSourceFieldsConfigurationRT = rt.strict({
  message: rt.array(rt.string)
});
const logSourceCommonColumnConfigurationRT = rt.strict({
  id: rt.string
});
const logSourceTimestampColumnConfigurationRT = rt.strict({
  timestampColumn: logSourceCommonColumnConfigurationRT
});
const logSourceMessageColumnConfigurationRT = rt.strict({
  messageColumn: logSourceCommonColumnConfigurationRT
});
const logSourceFieldColumnConfigurationRT = rt.strict({
  fieldColumn: rt.intersection([logSourceCommonColumnConfigurationRT, rt.strict({
    field: rt.string
  })])
});
exports.logSourceFieldColumnConfigurationRT = logSourceFieldColumnConfigurationRT;
const logSourceColumnConfigurationRT = rt.union([logSourceTimestampColumnConfigurationRT, logSourceMessageColumnConfigurationRT, logSourceFieldColumnConfigurationRT]);
exports.logSourceColumnConfigurationRT = logSourceColumnConfigurationRT; // Kibana index pattern

const logIndexPatternReferenceRT = rt.type({
  type: rt.literal('index_pattern'),
  indexPatternId: rt.string
});
exports.logIndexPatternReferenceRT = logIndexPatternReferenceRT; // Legacy support

const logIndexNameReferenceRT = rt.type({
  type: rt.literal('index_name'),
  indexName: rt.string
});
exports.logIndexNameReferenceRT = logIndexNameReferenceRT;
const logIndexReferenceRT = rt.union([logIndexPatternReferenceRT, logIndexNameReferenceRT]);
exports.logIndexReferenceRT = logIndexReferenceRT;
const logSourceConfigurationPropertiesRT = rt.strict({
  name: rt.string,
  description: rt.string,
  logIndices: logIndexReferenceRT,
  fields: logSourceFieldsConfigurationRT,
  logColumns: rt.array(logSourceColumnConfigurationRT)
});
exports.logSourceConfigurationPropertiesRT = logSourceConfigurationPropertiesRT;
const logSourceConfigurationRT = rt.exact(rt.intersection([rt.type({
  id: rt.string,
  origin: logSourceConfigurationOriginRT,
  configuration: logSourceConfigurationPropertiesRT
}), rt.partial({
  updatedAt: rt.number,
  version: rt.string
})]));
exports.logSourceConfigurationRT = logSourceConfigurationRT;