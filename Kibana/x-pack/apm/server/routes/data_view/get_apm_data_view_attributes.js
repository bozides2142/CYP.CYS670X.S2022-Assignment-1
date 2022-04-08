"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmDataViewAttributes = getApmDataViewAttributes;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getApmDataViewAttributes(title) {
  return {
    // required fields (even if empty)
    title,
    fieldAttrs: '{}',
    fields: '[]',
    runtimeFieldMap: '{}',
    timeFieldName: '@timestamp',
    typeMeta: '{}',
    // link to APM from Discover
    fieldFormatMap: JSON.stringify({
      [_elasticsearch_fieldnames.TRACE_ID]: {
        id: 'url',
        params: {
          urlTemplate: 'apm/link-to/trace/{{value}}',
          labelTemplate: '{{value}}'
        }
      },
      [_elasticsearch_fieldnames.TRANSACTION_ID]: {
        id: 'url',
        params: {
          urlTemplate: 'apm/link-to/transaction/{{value}}',
          labelTemplate: '{{value}}'
        }
      }
    })
  };
}