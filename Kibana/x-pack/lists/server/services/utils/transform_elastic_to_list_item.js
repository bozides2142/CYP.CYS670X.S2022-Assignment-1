"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformElasticToListItem = exports.transformElasticHitsToListItem = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _error_with_status_code = require("../../error_with_status_code");

var _find_source_value = require("./find_source_value");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformElasticToListItem = ({
  response,
  type
}) => {
  return transformElasticHitsToListItem({
    hits: response.hits.hits,
    type
  });
};

exports.transformElasticToListItem = transformElasticToListItem;

const transformElasticHitsToListItem = ({
  hits,
  type
}) => {
  return hits.map(hit => {
    const {
      _id,
      _source
    } = hit;
    const {
      /* eslint-disable @typescript-eslint/naming-convention */
      created_at,
      deserializer,
      serializer,
      updated_at,
      updated_by,
      created_by,
      list_id,
      tie_breaker_id,
      meta
      /* eslint-enable @typescript-eslint/naming-convention */

    } = _source; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    // @ts-expect-error _source is optional

    const value = (0, _find_source_value.findSourceValue)(hit._source);

    if (value == null) {
      throw new _error_with_status_code.ErrorWithStatusCode(`Was expected ${type} to not be null/undefined`, 400);
    } else {
      return {
        _version: (0, _securitysolutionEsUtils.encodeHitVersion)(hit),
        created_at,
        created_by,
        deserializer,
        id: _id,
        list_id,
        meta,
        serializer,
        tie_breaker_id,
        type,
        updated_at,
        updated_by,
        value
      };
    }
  });
};

exports.transformElasticHitsToListItem = transformElasticHitsToListItem;