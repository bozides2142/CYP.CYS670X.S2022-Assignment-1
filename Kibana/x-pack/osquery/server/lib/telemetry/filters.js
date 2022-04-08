"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyAllowlistedFields = copyAllowlistedFields;
exports.savedQueryEventFields = exports.packEventFields = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const savedQueryEventFields = {
  id: true,
  query: true,
  created_at: true,
  updated_at: true,
  platform: true,
  version: true,
  interval: true,
  ecs_mapping: true
};
exports.savedQueryEventFields = savedQueryEventFields;
const packEventFields = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
  enabled: true,
  queries: true
};
/**
 * Filters out information not required for downstream analysis
 *
 * @param allowlist
 * @param event
 * @returns TelemetryEvent with explicitly required fields
 */

exports.packEventFields = packEventFields;

function copyAllowlistedFields(allowlist, event) {
  return Object.entries(allowlist).reduce((newEvent, [allowKey, allowValue]) => {
    const eventValue = event[allowKey];

    if (eventValue !== null && eventValue !== undefined) {
      if (allowValue === true) {
        return { ...newEvent,
          [allowKey]: eventValue
        };
      } else if (typeof allowValue === 'object' && Array.isArray(eventValue)) {
        const subValues = eventValue.filter(v => typeof v === 'object');
        return { ...newEvent,
          [allowKey]: subValues.map(v => copyAllowlistedFields(allowValue, v))
        };
      } else if (typeof allowValue === 'object' && typeof eventValue === 'object') {
        const values = copyAllowlistedFields(allowValue, eventValue);
        return { ...newEvent,
          ...(Object.keys(values).length > 0 ? {
            [allowKey]: values
          } : {})
        };
      }
    }

    return newEvent;
  }, {});
}