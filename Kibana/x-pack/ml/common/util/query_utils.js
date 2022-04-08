"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addExcludeFrozenToQuery = void 0;

var _lodash = require("lodash");

var _object_utils = require("./object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addExcludeFrozenToQuery = originalQuery => {
  const FROZEN_TIER_TERM = {
    term: {
      _tier: {
        value: 'data_frozen'
      }
    }
  };

  if (!originalQuery) {
    return {
      bool: {
        must_not: [FROZEN_TIER_TERM]
      }
    };
  }

  const query = (0, _lodash.cloneDeep)(originalQuery);
  delete query.match_all;

  if ((0, _object_utils.isPopulatedObject)(query.bool)) {
    // Must_not can be both arrays or singular object
    if (Array.isArray(query.bool.must_not)) {
      query.bool.must_not.push(FROZEN_TIER_TERM);
    } else {
      // If there's already a must_not condition
      if ((0, _object_utils.isPopulatedObject)(query.bool.must_not)) {
        query.bool.must_not = [query.bool.must_not, FROZEN_TIER_TERM];
      }

      if (query.bool.must_not === undefined) {
        query.bool.must_not = [FROZEN_TIER_TERM];
      }
    }
  } else {
    query.bool = {
      must_not: [FROZEN_TIER_TERM]
    };
  }

  return query;
};

exports.addExcludeFrozenToQuery = addExcludeFrozenToQuery;