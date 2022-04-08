"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetConfigureFindRequestRt = exports.CasesConfigureRequestRt = exports.CasesConfigurePatchRt = exports.CaseConfigureResponseRt = exports.CaseConfigureRequestParamsRt = exports.CaseConfigureAttributesRt = exports.CaseConfigurationsResponseRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _user = require("../user");

var _connectors = require("../connectors");

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
// TODO: we will need to add this type rt.literal('close-by-third-party')


const ClosureTypeRT = rt.union([rt.literal('close-by-user'), rt.literal('close-by-pushing')]);
const CasesConfigureBasicWithoutOwnerRt = rt.type({
  /**
   * The external connector
   */
  connector: _connectors.CaseConnectorRt,

  /**
   * Whether to close the case after it has been synced with the external system
   */
  closure_type: ClosureTypeRT
});
const CasesConfigureBasicRt = rt.intersection([CasesConfigureBasicWithoutOwnerRt, rt.type({
  /**
   * The plugin owner that manages this configuration
   */
  owner: rt.string
})]);
const CasesConfigureRequestRt = CasesConfigureBasicRt;
exports.CasesConfigureRequestRt = CasesConfigureRequestRt;
const CasesConfigurePatchRt = rt.intersection([rt.partial(CasesConfigureBasicWithoutOwnerRt.props), rt.type({
  version: rt.string
})]);
exports.CasesConfigurePatchRt = CasesConfigurePatchRt;
const CaseConfigureAttributesRt = rt.intersection([CasesConfigureBasicRt, rt.type({
  created_at: rt.string,
  created_by: _user.UserRT,
  updated_at: rt.union([rt.string, rt.null]),
  updated_by: rt.union([_user.UserRT, rt.null])
})]);
exports.CaseConfigureAttributesRt = CaseConfigureAttributesRt;
const CaseConfigureResponseRt = rt.intersection([CaseConfigureAttributesRt, _connectors.ConnectorMappingsRt, rt.type({
  id: rt.string,
  version: rt.string,
  error: rt.union([rt.string, rt.null]),
  owner: rt.string
})]);
exports.CaseConfigureResponseRt = CaseConfigureResponseRt;
const GetConfigureFindRequestRt = rt.partial({
  /**
   * The configuration plugin owner to filter the search by. If this is left empty the results will include all configurations
   * that the user has permissions to access
   */
  owner: rt.union([rt.array(rt.string), rt.string])
});
exports.GetConfigureFindRequestRt = GetConfigureFindRequestRt;
const CaseConfigureRequestParamsRt = rt.type({
  configuration_id: rt.string
});
exports.CaseConfigureRequestParamsRt = CaseConfigureRequestParamsRt;
const CaseConfigurationsResponseRt = rt.array(CaseConfigureResponseRt);
exports.CaseConfigurationsResponseRt = CaseConfigurationsResponseRt;