"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaContextFn = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

var _common = require("../../../../expressions/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getParsedValue = (data, defaultValue) => typeof data === 'string' && data.length ? JSON.parse(data) || defaultValue : defaultValue;

const mergeQueries = (first = [], second) => (0, _lodash.uniqBy)([...(Array.isArray(first) ? first : [first]), ...(Array.isArray(second) ? second : [second])], n => JSON.stringify(n.query));

const getKibanaContextFn = getStartDependencies => {
  const kibanaContextFunction = {
    name: 'kibana_context',
    type: 'kibana_context',
    inputTypes: ['kibana_context', 'null'],
    help: _i18n.i18n.translate('data.search.functions.kibana_context.help', {
      defaultMessage: 'Updates kibana global context'
    }),
    args: {
      q: {
        types: ['kibana_query', 'null'],
        aliases: ['query', '_'],
        default: null,
        help: _i18n.i18n.translate('data.search.functions.kibana_context.q.help', {
          defaultMessage: 'Specify Kibana free form text query'
        })
      },
      filters: {
        types: ['kibana_filter', 'null'],
        multi: true,
        help: _i18n.i18n.translate('data.search.functions.kibana_context.filters.help', {
          defaultMessage: 'Specify Kibana generic filters'
        })
      },
      timeRange: {
        types: ['timerange', 'null'],
        default: null,
        help: _i18n.i18n.translate('data.search.functions.kibana_context.timeRange.help', {
          defaultMessage: 'Specify Kibana time range filter'
        })
      },
      savedSearchId: {
        types: ['string', 'null'],
        default: null,
        help: _i18n.i18n.translate('data.search.functions.kibana_context.savedSearchId.help', {
          defaultMessage: 'Specify saved search ID to be used for queries and filters'
        })
      }
    },

    extract(state) {
      const references = [];

      if (state.savedSearchId.length && typeof state.savedSearchId[0] === 'string') {
        const refName = 'kibana_context.savedSearchId';
        references.push({
          name: refName,
          type: 'search',
          id: state.savedSearchId[0]
        });
        return {
          state: { ...state,
            savedSearchId: [refName]
          },
          references
        };
      }

      return {
        state,
        references
      };
    },

    inject(state, references) {
      const reference = references.find(r => r.name === 'kibana_context.savedSearchId');

      if (reference) {
        state.savedSearchId[0] = reference.id;
      }

      return state;
    },

    async fn(input, args, {
      getKibanaRequest
    }) {
      var _args$filters;

      const {
        savedObjectsClient
      } = await getStartDependencies(getKibanaRequest);
      const timeRange = args.timeRange || (input === null || input === void 0 ? void 0 : input.timeRange);
      let queries = mergeQueries(input === null || input === void 0 ? void 0 : input.query, (args === null || args === void 0 ? void 0 : args.q) || []);
      let filters = [...((input === null || input === void 0 ? void 0 : input.filters) || []), ...((args === null || args === void 0 ? void 0 : (_args$filters = args.filters) === null || _args$filters === void 0 ? void 0 : _args$filters.map(_common.unboxExpressionValue)) || [])];

      if (args.savedSearchId) {
        const obj = await savedObjectsClient.get('search', args.savedSearchId);
        const search = obj.attributes.kibanaSavedObjectMeta.searchSourceJSON;
        const {
          query,
          filter
        } = getParsedValue(search, {});

        if (query) {
          queries = mergeQueries(queries, query);
        }

        if (filter) {
          filters = [...filters, ...(Array.isArray(filter) ? filter : [filter])];
        }
      }

      return {
        type: 'kibana_context',
        query: queries,
        filters: (0, _esQuery.uniqFilters)(filters.filter(f => {
          var _f$meta;

          return !((_f$meta = f.meta) !== null && _f$meta !== void 0 && _f$meta.disabled);
        })),
        timeRange
      };
    }

  };
  return kibanaContextFunction;
};

exports.getKibanaContextFn = getKibanaContextFn;