"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEqlFn = void 0;

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

var _common = require("../../../../inspector/common");

var _ = require("..");

var _es_query = require("../../es_query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'eql';

const getEqlFn = ({
  getStartDependencies
}) => {
  const eql = {
    name,
    type: 'eql_raw_response',
    inputTypes: ['kibana_context', 'null'],
    help: _i18n.i18n.translate('data.search.eql.help', {
      defaultMessage: 'Run Elasticsearch request'
    }),
    args: {
      query: {
        types: ['string'],
        aliases: ['_', 'q', 'query'],
        help: _i18n.i18n.translate('data.search.eql.q.help', {
          defaultMessage: 'Query DSL'
        }),
        required: true
      },
      index: {
        types: ['string'],
        help: _i18n.i18n.translate('data.search.eql.index.help', {
          defaultMessage: 'ElasticSearch index to query'
        }),
        required: true
      },
      size: {
        types: ['number'],
        help: _i18n.i18n.translate('data.search.eql.size.help', {
          defaultMessage: 'ElasticSearch searchAPI size parameter'
        }),
        default: 10
      },
      field: {
        types: ['string'],
        help: _i18n.i18n.translate('data.search.eql.field.help', {
          defaultMessage: 'List of fields to retrieve'
        }),
        multi: true,
        required: false
      }
    },

    async fn(input, args, {
      inspectorAdapters,
      abortSignal,
      getKibanaRequest
    }) {
      const {
        search,
        uiSettingsClient,
        dataViews
      } = await getStartDependencies(getKibanaRequest);
      const dsl = {
        query: args.query,
        size: args.size,
        fields: args.field
      };

      if (input) {
        const dataview = args.index ? await dataViews.create({
          title: args.index
        }) : undefined;
        const esQueryConfigs = (0, _es_query.getEsQueryConfig)(uiSettingsClient);
        const query = (0, _esQuery.buildEsQuery)(dataview, input.query || [], input.filters || [], esQueryConfigs);
        dsl.filter = query;
      }

      if (!inspectorAdapters.requests) {
        inspectorAdapters.requests = new _common.RequestAdapter();
      }

      const request = inspectorAdapters.requests.start(_i18n.i18n.translate('data.search.dataRequest.title', {
        defaultMessage: 'Data'
      }), {
        description: _i18n.i18n.translate('data.search.es_search.dataRequest.description', {
          defaultMessage: 'This request queries Elasticsearch to fetch the data for the visualization.'
        })
      });
      request.stats({
        indexPattern: {
          label: _i18n.i18n.translate('data.search.es_search.dataViewLabel', {
            defaultMessage: 'Data view'
          }),
          value: args.index,
          description: _i18n.i18n.translate('data.search.es_search.indexPatternDescription', {
            defaultMessage: 'The data view that connected to the Elasticsearch indices.'
          })
        }
      });

      try {
        const response = await search({
          params: {
            index: args.index,
            body: dsl
          }
        }, {
          abortSignal,
          strategy: _.EQL_SEARCH_STRATEGY
        }).toPromise();
        const stats = {};
        request.stats(stats).ok({
          json: response
        });
        request.json(dsl);
        return {
          type: 'eql_raw_response',
          body: response.rawResponse.body
        };
      } catch (e) {
        request.error({
          json: e
        });
        throw e;
      }
    }

  };
  return eql;
};

exports.getEqlFn = getEqlFn;