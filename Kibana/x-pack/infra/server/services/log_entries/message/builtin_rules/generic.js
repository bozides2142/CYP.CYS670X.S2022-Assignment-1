"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenericRules = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BUILTIN_GENERIC_MESSAGE_FIELDS = ['message', '@message'];
const BUILTIN_FALLBACK_MESSAGE_FIELDS = ['log.original', 'event.original'];

const getGenericRules = genericMessageFields => [...Array.from(new Set([...genericMessageFields, ...BUILTIN_GENERIC_MESSAGE_FIELDS])).flatMap(createGenericRulesForField), ...BUILTIN_FALLBACK_MESSAGE_FIELDS.filter(fieldName => !genericMessageFields.includes(fieldName)).flatMap(createFallbackRulesForField)];

exports.getGenericRules = getGenericRules;

const createGenericRulesForField = fieldName => [{
  when: {
    exists: ['event.dataset', 'log.level', fieldName, 'error.stack_trace.text']
  },
  format: [{
    constant: '['
  }, {
    field: 'event.dataset'
  }, {
    constant: ']['
  }, {
    field: 'log.level'
  }, {
    constant: '] '
  }, {
    field: fieldName
  }, {
    constant: '\n'
  }, {
    field: 'error.stack_trace.text'
  }]
}, {
  when: {
    exists: ['event.dataset', 'log.level', fieldName]
  },
  format: [{
    constant: '['
  }, {
    field: 'event.dataset'
  }, {
    constant: ']['
  }, {
    field: 'log.level'
  }, {
    constant: '] '
  }, {
    field: fieldName
  }]
}, {
  when: {
    exists: ['log.level', fieldName, 'error.stack_trace.text']
  },
  format: [{
    constant: '['
  }, {
    field: 'log.level'
  }, {
    constant: '] '
  }, {
    field: fieldName
  }, {
    constant: '\n'
  }, {
    field: 'error.stack_trace.text'
  }]
}, {
  when: {
    exists: ['log.level', fieldName]
  },
  format: [{
    constant: '['
  }, {
    field: 'log.level'
  }, {
    constant: '] '
  }, {
    field: fieldName
  }]
}, {
  when: {
    exists: [fieldName, 'error.stack_trace.text']
  },
  format: [{
    field: fieldName
  }, {
    constant: '\n'
  }, {
    field: 'error.stack_trace.text'
  }]
}, {
  when: {
    exists: [fieldName]
  },
  format: [{
    field: fieldName
  }]
}];

const createFallbackRulesForField = fieldName => [{
  when: {
    exists: ['event.dataset', fieldName]
  },
  format: [{
    constant: '['
  }, {
    field: 'event.dataset'
  }, {
    constant: '] '
  }, {
    field: fieldName
  }]
}, {
  when: {
    exists: [fieldName]
  },
  format: [{
    field: fieldName
  }]
}];