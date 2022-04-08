"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.includeFieldsRequiredForAuthentication = exports.getOwnersFilter = exports.ensureFieldIsSafeForQuery = exports.combineFilterWithAuthorizationFilter = void 0;

var _lodash = require("lodash");

var _esQuery = require("@kbn/es-query");

var _api = require("../../common/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getOwnersFilter = (savedObjectType, owners) => {
  if (owners.length <= 0) {
    return;
  }

  return _esQuery.nodeBuilder.or(owners.reduce((query, owner) => {
    ensureFieldIsSafeForQuery(_api.OWNER_FIELD, owner);
    query.push(_esQuery.nodeBuilder.is(`${savedObjectType}.attributes.${_api.OWNER_FIELD}`, owner));
    return query;
  }, []));
};

exports.getOwnersFilter = getOwnersFilter;

const combineFilterWithAuthorizationFilter = (filter, authorizationFilter) => {
  if (!filter && !authorizationFilter) {
    return;
  }

  const kueries = [...(filter !== undefined ? [filter] : []), ...(authorizationFilter !== undefined ? [authorizationFilter] : [])];
  return _esQuery.nodeBuilder.and(kueries);
};

exports.combineFilterWithAuthorizationFilter = combineFilterWithAuthorizationFilter;

const ensureFieldIsSafeForQuery = (field, value) => {
  const invalid = value.match(/([>=<\*:()]+|\s+)/g);

  if (invalid) {
    const whitespace = (0, _lodash.remove)(invalid, chars => chars.trim().length === 0);
    const errors = [];

    if (whitespace.length) {
      errors.push(`whitespace`);
    }

    if (invalid.length) {
      errors.push(`invalid character${invalid.length > 1 ? `s` : ``}: ${invalid === null || invalid === void 0 ? void 0 : invalid.join(`, `)}`);
    }

    throw new Error(`expected ${field} not to include ${errors.join(' and ')}`);
  }

  return true;
};

exports.ensureFieldIsSafeForQuery = ensureFieldIsSafeForQuery;

const includeFieldsRequiredForAuthentication = fields => {
  if (fields === undefined) {
    return;
  }

  return (0, _lodash.uniq)([...fields, _api.OWNER_FIELD]);
};

exports.includeFieldsRequiredForAuthentication = includeFieldsRequiredForAuthentication;