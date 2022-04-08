"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInspectResponse = getInspectResponse;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get statistics to show on inspector tab.
 *
 * If you're using searchSource (which we're not), this gets populated from
 * https://github.com/elastic/kibana/blob/c7d742cb8b8935f3812707a747a139806e4be203/src/plugins/data/common/search/search_source/inspect/inspector_stats.ts
 *
 * We do most of the same here, but not using searchSource.
 */


function getStats({
  esRequestParams,
  esResponse,
  kibanaRequest
}) {
  var _esResponse$hits;

  const stats = { ...(kibanaRequest.query ? {
      kibanaApiQueryParameters: {
        label: _i18n.i18n.translate('xpack.observability.inspector.stats.kibanaApiQueryParametersLabel', {
          defaultMessage: 'Kibana API query parameters'
        }),
        description: _i18n.i18n.translate('xpack.observability.inspector.stats.kibanaApiQueryParametersDescription', {
          defaultMessage: 'The query parameters used in the Kibana API request that initiated the Elasticsearch request.'
        }),
        value: JSON.stringify(kibanaRequest.query, null, 2)
      }
    } : {}),
    kibanaApiRoute: {
      label: _i18n.i18n.translate('xpack.observability.inspector.stats.kibanaApiRouteLabel', {
        defaultMessage: 'Kibana API route'
      }),
      description: _i18n.i18n.translate('xpack.observability.inspector.stats.kibanaApiRouteDescription', {
        defaultMessage: 'The route of the Kibana API request that initiated the Elasticsearch request.'
      }),
      value: `${kibanaRequest.route.method.toUpperCase()} ${kibanaRequest.route.path}`
    },
    indexPattern: {
      label: _i18n.i18n.translate('xpack.observability.inspector.stats.dataViewLabel', {
        defaultMessage: 'Data view'
      }),
      value: esRequestParams.index,
      description: _i18n.i18n.translate('xpack.observability.inspector.stats.dataViewDescription', {
        defaultMessage: 'The data view that connected to the Elasticsearch indices.'
      })
    }
  };

  if (esResponse !== null && esResponse !== void 0 && esResponse.hits) {
    stats.hits = {
      label: _i18n.i18n.translate('xpack.observability.inspector.stats.hitsLabel', {
        defaultMessage: 'Hits'
      }),
      value: `${esResponse.hits.hits.length}`,
      description: _i18n.i18n.translate('xpack.observability.inspector.stats.hitsDescription', {
        defaultMessage: 'The number of documents returned by the query.'
      })
    };
  }

  if (esResponse !== null && esResponse !== void 0 && esResponse.took) {
    stats.queryTime = {
      label: _i18n.i18n.translate('xpack.observability.inspector.stats.queryTimeLabel', {
        defaultMessage: 'Query time'
      }),
      value: _i18n.i18n.translate('xpack.observability.inspector.stats.queryTimeValue', {
        defaultMessage: '{queryTime}ms',
        values: {
          queryTime: esResponse.took
        }
      }),
      description: _i18n.i18n.translate('xpack.observability.inspector.stats.queryTimeDescription', {
        defaultMessage: 'The time it took to process the query. ' + 'Does not include the time to send the request or parse it in the browser.'
      })
    };
  }

  if ((esResponse === null || esResponse === void 0 ? void 0 : (_esResponse$hits = esResponse.hits) === null || _esResponse$hits === void 0 ? void 0 : _esResponse$hits.total) !== undefined) {
    let hitsTotalValue;

    if (typeof esResponse.hits.total === 'number') {
      hitsTotalValue = esResponse.hits.total;
    } else {
      const total = esResponse.hits.total;
      hitsTotalValue = total.relation === 'eq' ? `${total.value}` : `> ${total.value}`;
    }

    stats.hitsTotal = {
      label: _i18n.i18n.translate('xpack.observability.inspector.stats.hitsTotalLabel', {
        defaultMessage: 'Hits (total)'
      }),
      value: hitsTotalValue,
      description: _i18n.i18n.translate('xpack.observability.inspector.stats.hitsTotalDescription', {
        defaultMessage: 'The number of documents that match the query.'
      })
    };
  }

  return stats;
}
/**
 * Create a formatted response to be sent in the _inspect key for use in the
 * inspector.
 */


function getInspectResponse({
  esError,
  esRequestParams,
  esRequestStatus,
  esResponse,
  kibanaRequest,
  operationName,
  startTime
}) {
  const id = `${operationName} (${kibanaRequest.route.path})`;
  return {
    id,
    json: esRequestParams.body,
    name: id,
    response: {
      json: esError ? esError.originalError : esResponse
    },
    startTime,
    stats: getStats({
      esRequestParams,
      esResponse,
      kibanaRequest
    }),
    status: esRequestStatus
  };
}