"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSetting = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'ui_setting';

function getType(value) {
  if (value == null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return value.length ? getType(value[0]) : 'unknown';
  }

  if (['boolean', 'number', 'object', 'string'].includes(typeof value)) {
    return typeof value;
  }

  return 'unknown';
}

const uiSetting = {
  name,
  to: {
    boolean({
      value
    }) {
      return Boolean(value);
    },

    number({
      value
    }) {
      return Number(value);
    },

    string({
      value
    }) {
      return String(value !== null && value !== void 0 ? value : '');
    },

    render({
      value
    }) {
      return {
        type: 'render',
        as: 'text',
        value: {
          text: typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value !== null && value !== void 0 ? value : '')
        }
      };
    },

    datatable({
      key,
      value
    }) {
      return {
        type: 'datatable',
        columns: [{
          id: key,
          name: key,
          meta: {
            type: getType(value)
          }
        }],
        rows: (Array.isArray(value) ? value : [value]).map(cell => ({
          [key]: cell
        }))
      };
    }

  }
};
exports.uiSetting = uiSetting;