"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.essqlSearchStrategyProvider = void 0;

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _server = require("../../../../../src/plugins/kibana_utils/server");

var _build_bool_array = require("../../common/lib/request/build_bool_array");

var _sanitize_name = require("../../common/lib/request/sanitize_name");

var _normalize_type = require("../../common/lib/request/normalize_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const essqlSearchStrategyProvider = () => {
  return {
    search: (request, options, {
      esClient
    }) => {
      const {
        count,
        query,
        filter,
        timezone,
        params
      } = request;

      const searchUntilEnd = async () => {
        try {
          let response = await esClient.asCurrentUser.sql.query({
            format: 'json',
            body: {
              query,
              // @ts-expect-error `params` missing from `QuerySqlRequest` type
              params,
              field_multi_value_leniency: true,
              time_zone: timezone,
              fetch_size: count,
              client_id: 'canvas',
              filter: {
                bool: {
                  must: [{
                    match_all: {}
                  }, ...(0, _build_bool_array.buildBoolArray)(filter)]
                }
              }
            }
          });
          let body = response.body;
          const columns = body.columns.map(({
            name,
            type
          }) => {
            return {
              id: (0, _sanitize_name.sanitizeName)(name),
              name: (0, _sanitize_name.sanitizeName)(name),
              meta: {
                type: (0, _normalize_type.normalizeType)(type)
              }
            };
          });
          const columnNames = (0, _lodash.map)(columns, 'name');
          let rows = body.rows.map(row => (0, _lodash.zipObject)(columnNames, row)); // If we still have rows to retrieve, continue requesting data
          // using the cursor until we have everything

          while (rows.length < count && body.cursor !== undefined) {
            response = await esClient.asCurrentUser.sql.query({
              format: 'json',
              body: {
                cursor: body.cursor
              }
            });
            body = response.body;
            rows = [...rows, ...body.rows.map(row => (0, _lodash.zipObject)(columnNames, row))];
          } // If we used a cursor, clean it up


          if (body.cursor !== undefined) {
            await esClient.asCurrentUser.sql.clearCursor({
              body: {
                cursor: body.cursor
              }
            });
          }

          return {
            columns,
            rows,
            rawResponse: response
          };
        } catch (e) {
          throw (0, _server.getKbnServerError)(e);
        }
      };

      return (0, _rxjs.from)(searchUntilEnd());
    }
  };
};

exports.essqlSearchStrategyProvider = essqlSearchStrategyProvider;