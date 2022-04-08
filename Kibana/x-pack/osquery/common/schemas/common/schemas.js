"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.versionOrUndefined = exports.version = exports.savedQueryIdOrUndefined = exports.savedQueryId = exports.queryOrUndefined = exports.query = exports.platformOrUndefined = exports.platform = exports.intervalOrUndefined = exports.interval = exports.idOrUndefined = exports.id = exports.ecsMappingOrUndefined = exports.ecsMapping = exports.descriptionOrUndefined = exports.description = exports.agentSelectionOrUndefined = exports.agentSelection = void 0;

var t = _interopRequireWildcard(require("io-ts"));

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


const id = t.string;
exports.id = id;
const idOrUndefined = t.union([id, t.undefined]);
exports.idOrUndefined = idOrUndefined;
const agentSelection = t.type({
  agents: t.array(t.string),
  allAgentsSelected: t.boolean,
  platformsSelected: t.array(t.string),
  policiesSelected: t.array(t.string)
});
exports.agentSelection = agentSelection;
const agentSelectionOrUndefined = t.union([agentSelection, t.undefined]);
exports.agentSelectionOrUndefined = agentSelectionOrUndefined;
const description = t.string;
exports.description = description;
const descriptionOrUndefined = t.union([description, t.undefined]);
exports.descriptionOrUndefined = descriptionOrUndefined;
const platform = t.string;
exports.platform = platform;
const platformOrUndefined = t.union([platform, t.undefined]);
exports.platformOrUndefined = platformOrUndefined;
const query = t.string;
exports.query = query;
const queryOrUndefined = t.union([query, t.undefined]);
exports.queryOrUndefined = queryOrUndefined;
const version = t.string;
exports.version = version;
const versionOrUndefined = t.union([version, t.undefined]);
exports.versionOrUndefined = versionOrUndefined;
const interval = t.string;
exports.interval = interval;
const intervalOrUndefined = t.union([interval, t.undefined]);
exports.intervalOrUndefined = intervalOrUndefined;
const savedQueryId = t.string;
exports.savedQueryId = savedQueryId;
const savedQueryIdOrUndefined = t.union([savedQueryId, t.undefined]);
exports.savedQueryIdOrUndefined = savedQueryIdOrUndefined;
const ecsMapping = t.record(t.string, t.partial({
  field: t.string,
  value: t.union([t.string, t.array(t.string)])
}));
exports.ecsMapping = ecsMapping;
const ecsMappingOrUndefined = t.union([ecsMapping, t.undefined]);
exports.ecsMappingOrUndefined = ecsMappingOrUndefined;