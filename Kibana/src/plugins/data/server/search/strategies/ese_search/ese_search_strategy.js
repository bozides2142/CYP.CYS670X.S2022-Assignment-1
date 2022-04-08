"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhancedEsSearchStrategyProvider = void 0;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _common = require("../../../../common");

var _request_utils = require("./request_utils");

var _response_utils = require("./response_utils");

var _server = require("../../../../../kibana_utils/server");

var _collectors = require("../../collectors");

var _es_search = require("../es_search");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const enhancedEsSearchStrategyProvider = (legacyConfig$, logger, usage, useInternalUser = false) => {
  async function cancelAsyncSearch(id, esClient) {
    try {
      const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;
      await client.asyncSearch.delete({
        id
      });
    } catch (e) {
      throw (0, _server.getKbnServerError)(e);
    }
  }

  function asyncSearch({
    id,
    ...request
  }, options, {
    esClient,
    uiSettingsClient,
    searchSessionsClient
  }) {
    const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;

    const search = async () => {
      const params = id ? (0, _request_utils.getDefaultAsyncGetParams)(searchSessionsClient.getConfig(), options) : { ...(await (0, _request_utils.getDefaultAsyncSubmitParams)(uiSettingsClient, searchSessionsClient.getConfig(), options)),
        ...request.params
      };
      const {
        body,
        headers
      } = id ? await client.asyncSearch.get({ ...params,
        id
      }, {
        signal: options.abortSignal
      }) : await client.asyncSearch.submit(params, {
        signal: options.abortSignal
      });
      const response = (0, _es_search.shimHitsTotal)(body.response, options);
      return (0, _response_utils.toAsyncKibanaSearchResponse)( // @ts-expect-error @elastic/elasticsearch start_time_in_millis expected to be number
      { ...body,
        response
      }, headers === null || headers === void 0 ? void 0 : headers.warning);
    };

    const cancel = async () => {
      if (id) {
        await cancelAsyncSearch(id, esClient);
      }
    };

    return (0, _common.pollSearch)(search, cancel, options).pipe((0, _operators.tap)(response => id = response.id), (0, _operators.tap)((0, _collectors.searchUsageObserver)(logger, usage)), (0, _operators.catchError)(e => {
      throw (0, _server.getKbnServerError)(e);
    }));
  }

  async function rollupSearch(request, options, {
    esClient,
    uiSettingsClient
  }) {
    const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;
    const legacyConfig = await legacyConfig$.pipe((0, _operators.first)()).toPromise();
    const {
      body,
      index,
      ...params
    } = request.params;
    const method = 'POST';
    const path = encodeURI(`/${index}/_rollup_search`);
    const querystring = { ...(0, _es_search.getShardTimeout)(legacyConfig),
      ...(await (0, _request_utils.getIgnoreThrottled)(uiSettingsClient)),
      ...(await (0, _es_search.getDefaultSearchParams)(uiSettingsClient)),
      ...params
    };

    try {
      const esResponse = await client.transport.request({
        method,
        path,
        body,
        querystring
      }, {
        signal: options === null || options === void 0 ? void 0 : options.abortSignal
      });
      const response = esResponse.body;
      return {
        rawResponse: (0, _es_search.shimHitsTotal)(response, options),
        ...(0, _es_search.getTotalLoaded)(response)
      };
    } catch (e) {
      throw (0, _server.getKbnServerError)(e);
    }
  }

  return {
    /**
     * @param request
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Observable<IEsSearchResponse<any>>`
     * @throws `KbnServerError`
     */
    search: (request, options, deps) => {
      logger.debug(`search ${JSON.stringify(request.params) || request.id}`);

      if (request.indexType && request.indexType !== 'rollup') {
        throw new _server.KbnServerError('Unknown indexType', 400);
      }

      if (request.indexType === undefined) {
        return asyncSearch(request, options, deps);
      } else {
        return (0, _rxjs.from)(rollupSearch(request, options, deps));
      }
    },

    /**
     * @param id async search ID to cancel, as returned from _async_search API
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Promise<void>`
     * @throws `KbnServerError`
     */
    cancel: async (id, options, {
      esClient
    }) => {
      logger.debug(`cancel ${id}`);
      await cancelAsyncSearch(id, esClient);
    },

    /**
     *
     * @param id async search ID to extend, as returned from _async_search API
     * @param keepAlive
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Promise<void>`
     * @throws `KbnServerError`
     */
    extend: async (id, keepAlive, options, {
      esClient
    }) => {
      logger.debug(`extend ${id} by ${keepAlive}`);

      try {
        const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;
        await client.asyncSearch.get({
          id,
          keep_alive: keepAlive
        });
      } catch (e) {
        throw (0, _server.getKbnServerError)(e);
      }
    }
  };
};

exports.enhancedEsSearchStrategyProvider = enhancedEsSearchStrategyProvider;