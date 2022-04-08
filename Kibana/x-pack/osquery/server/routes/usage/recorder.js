"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCount = getCount;
exports.getOrCreateMetricObject = getOrCreateMetricObject;
exports.getRouteMetric = getRouteMetric;
exports.incrementCount = incrementCount;
exports.routeStrings = void 0;

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const routeStrings = ['live_query'];
exports.routeStrings = routeStrings;

async function getOrCreateMetricObject(soClient, route) {
  try {
    return await soClient.get(_types.usageMetricSavedObjectType, route);
  } catch (e) {
    return await soClient.create(_types.usageMetricSavedObjectType, {
      errors: 0,
      count: 0
    }, {
      id: route
    });
  }
}

async function getCount(soClient, route) {
  return await getOrCreateMetricObject(soClient, route);
}

async function incrementCount(soClient, route, key = 'count', increment = 1) {
  const metric = await getOrCreateMetricObject(soClient, route);
  metric.attributes[key] += increment;
  await soClient.update(_types.usageMetricSavedObjectType, route, metric.attributes);
}

async function getRouteMetric(soClient, route) {
  return (await getCount(soClient, route)).attributes;
}