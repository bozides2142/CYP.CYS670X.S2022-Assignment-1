"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildRequest;

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _agg_body = require("./agg_body");

var _create_date_agg = _interopRequireDefault(require("./create_date_agg"));

var _server = require("../../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildRequest(config, tlConfig, scriptFields, runtimeFields, timeout) {
  const bool = {
    must: []
  };
  const timeFilter = {
    range: {
      [config.timefield]: {
        gte: (0, _moment.default)(tlConfig.time.from).toISOString(),
        lte: (0, _moment.default)(tlConfig.time.to).toISOString(),
        format: 'strict_date_optional_time'
      }
    }
  };
  bool.must.push(timeFilter); // Use the kibana filter bar filters

  if (config.kibana) {
    bool.filter = _lodash.default.get(tlConfig, 'request.body.extended.es.filter');
  }

  const aggs = {
    q: {
      meta: {
        type: 'split'
      },
      filters: {
        filters: _lodash.default.chain(config.q).map(function (q) {
          return [q, {
            query_string: {
              query: q
            }
          }];
        }).fromPairs().value()
      },
      aggs: {}
    }
  };
  let aggCursor = aggs.q.aggs;
  (config.split || []).forEach(clause => {
    const [field, arg] = clause.split(/:(\d+$)/);

    if (field && arg) {
      const termsAgg = (0, _agg_body.buildAggBody)(field, scriptFields);
      termsAgg.size = parseInt(arg, 10);
      aggCursor[field] = {
        meta: {
          type: 'split'
        },
        terms: termsAgg,
        aggs: {}
      };
      aggCursor = aggCursor[field].aggs;
    } else {
      throw new Error('`split` requires field:limit');
    }
  });

  _lodash.default.assign(aggCursor, (0, _create_date_agg.default)(config, tlConfig, scriptFields));

  const includeFrozen = Boolean(tlConfig.settings[_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN]);
  const request = {
    index: config.index,
    ...(includeFrozen ? {
      ignore_throttled: false
    } : {}),
    body: {
      query: {
        bool: bool
      },
      aggs: aggs,
      size: 0,
      runtime_mappings: runtimeFields
    }
  };

  if (timeout) {
    request.timeout = `${timeout}ms`;
  }

  return {
    params: request
  };
}

module.exports = exports.default;