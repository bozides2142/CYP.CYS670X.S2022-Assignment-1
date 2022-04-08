"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldCapabilities = getFieldCapabilities;

var _lodash = require("lodash");

var _es_api = require("../es_api");

var _field_caps_response = require("./field_caps_response");

var _overrides = require("./overrides");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Get the field capabilities for field in `indices`, excluding
 *  all internal/underscore-prefixed fields that are not in `metaFields`
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array}  [indices=[]]  the list of indexes to check
 *  @param  {Array}  [metaFields=[]] the list of internal fields to include
 *  @param  {Object} fieldCapsOptions
 *  @return {Promise<Array<FieldDescriptor>>}
 */
async function getFieldCapabilities(params) {
  const {
    callCluster,
    indices = [],
    fieldCapsOptions,
    filter,
    metaFields = []
  } = params;
  const esFieldCaps = await (0, _es_api.callFieldCapsApi)({
    callCluster,
    indices,
    fieldCapsOptions,
    filter
  });
  const fieldsFromFieldCapsByName = (0, _lodash.keyBy)((0, _field_caps_response.readFieldCapsResponse)(esFieldCaps.body), 'name');
  const allFieldsUnsorted = Object.keys(fieldsFromFieldCapsByName) // not all meta fields are provided, so remove and manually add
  .filter(name => !fieldsFromFieldCapsByName[name].metadata_field).concat(metaFields).reduce((agg, value) => {
    // This is intentionally using a Map to be highly optimized with very large indexes AND be safe for user provided data
    if (agg.map.get(value) != null) {
      return agg;
    } else {
      agg.map.set(value, value);
      agg.names.push(value);
      return agg;
    }
  }, {
    names: [],
    map: new Map()
  }).names.map(name => (0, _lodash.defaults)({}, fieldsFromFieldCapsByName[name], {
    name,
    type: 'string',
    searchable: false,
    aggregatable: false,
    readFromDocValues: false,
    metadata_field: metaFields.includes(name)
  })).map(_overrides.mergeOverrides);
  return (0, _lodash.sortBy)(allFieldsUnsorted, 'name');
}