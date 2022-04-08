"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsdslFn = void 0;

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

var _common = require("../../../../inspector/common");

var _es_query = require("../../es_query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'esdsl';

const getEsdslFn = ({
  getStartDependencies
}) => {
  const esdsl = {
    name,
    type: 'es_raw_response',
    inputTypes: ['kibana_context', 'null'],
    help: _i18n.i18n.translate('data.search.esdsl.help', {
      defaultMessage: 'Run Elasticsearch request'
    }),
    args: {
      dsl: {
        types: ['string'],
        aliases: ['_', 'q', 'query'],
        help: _i18n.i18n.translate('data.search.esdsl.q.help', {
          defaultMessage: 'Query DSL'
        }),
        required: true
      },
      index: {
        types: ['string'],
        help: _i18n.i18n.translate('data.search.esdsl.index.help', {
          defaultMessage: 'ElasticSearch index to query'
        }),
        required: true
      },
      size: {
        types: ['number'],
        help: _i18n.i18n.translate('data.search.esdsl.size.help', {
          defaultMessage: 'ElasticSearch searchAPI size parameter'
        }),
        default: 10
      }
    },

    async fn(input, args, {
      inspectorAdapters,
      abortSignal,
      getKibanaRequest
    }) {
      const {
        search,
        uiSettingsClient
      } = await getStartDependencies(getKibanaRequest);
      const dsl = JSON.parse(args.dsl);

      if (input) {
        const esQueryConfigs = (0, _es_query.getEsQueryConfig)(uiSettingsClient);
        const query = (0, _esQuery.buildEsQuery)(undefined, //        args.index,
        input.query || [], input.filters || [], esQueryConfigs);

        if (dsl.query) {
          query.bool.must.push(dsl.query);
        }

        dsl.query = query;
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
        const {
          rawResponse
        } = await search({
          params: {
            index: args.index,
            size: args.size,
            body: dsl
          }
        }, {
          abortSignal
        }).toPromise();
        const stats = {};

        if (rawResponse !== null && rawResponse !== void 0 && rawResponse.took) {
          stats.queryTime = {
            label: _i18n.i18n.translate('data.search.es_search.queryTimeLabel', {
              defaultMessage: 'Query time'
            }),
            value: _i18n.i18n.translate('data.search.es_search.queryTimeValue', {
              defaultMessage: '{queryTime}ms',
              values: {
                queryTime: rawResponse.took
              }
            }),
            description: _i18n.i18n.translate('data.search.es_search.queryTimeDescription', {
              defaultMessage: 'The time it took to process the query. ' + 'Does not include the time to send the request or parse it in the browser.'
            })
          };
        }

        if (rawResponse !== null && rawResponse !== void 0 && rawResponse.hits) {
          stats.hitsTotal = {
            label: _i18n.i18n.translate('data.search.es_search.hitsTotalLabel', {
              defaultMessage: 'Hits (total)'
            }),
            value: `${rawResponse.hits.total}`,
            description: _i18n.i18n.translate('data.search.es_search.hitsTotalDescription', {
              defaultMessage: 'The number of documents that match the query.'
            })
          };
          stats.hits = {
            label: _i18n.i18n.translate('data.search.es_search.hitsLabel', {
              defaultMessage: 'Hits'
            }),
            value: `${rawResponse.hits.hits.length}`,
            description: _i18n.i18n.translate('data.search.es_search.hitsDescription', {
              defaultMessage: 'The number of documents returned by the query.'
            })
          };
        }

        request.stats(stats).ok({
          json: rawResponse
        });
        request.json(dsl);
        return {
          type: 'es_raw_response',
          body: rawResponse
        };
      } catch (e) {
        request.error({
          json: e
        });
        throw e;
      }
    }

  };
  return esdsl;
};

exports.getEsdslFn = getEsdslFn;