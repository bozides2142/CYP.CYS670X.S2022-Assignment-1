"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSOQueriesToPack = exports.convertPackQueriesToSO = void 0;

var _lodash = require("lodash");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error update types


const convertPackQueriesToSO = queries => (0, _lodash.reduce)(queries, (acc, value, key) => {
  const ecsMapping = value.ecs_mapping && (0, _utils.convertECSMappingToArray)(value.ecs_mapping);
  acc.push({
    id: key,
    ...(0, _lodash.pick)(value, ['query', 'interval', 'platform', 'version']),
    ...(ecsMapping ? {
      ecs_mapping: ecsMapping
    } : {})
  });
  return acc;
}, // eslint-disable-next-line @typescript-eslint/no-explicit-any
[]); // @ts-expect-error update types


exports.convertPackQueriesToSO = convertPackQueriesToSO;

const convertSOQueriesToPack = queries => (0, _lodash.reduce)(queries, // eslint-disable-next-line @typescript-eslint/naming-convention
(acc, {
  id: queryId,
  ecs_mapping,
  ...query
}) => {
  acc[queryId] = { ...query,
    ecs_mapping: (0, _utils.convertECSMappingToObject)(ecs_mapping)
  };
  return acc;
}, // eslint-disable-next-line @typescript-eslint/no-explicit-any
{});

exports.convertSOQueriesToPack = convertSOQueriesToPack;