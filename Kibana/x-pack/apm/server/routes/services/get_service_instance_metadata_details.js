"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstanceMetadataDetails = getServiceInstanceMetadataDetails;

var _lodash = require("lodash");

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");

var _maybe = require("../../../common/utils/maybe");

var _transactions = require("../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceInstanceMetadataDetails({
  serviceName,
  serviceNodeName,
  setup,
  start,
  end
}) {
  const {
    apmEventClient
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, {
    term: {
      [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: serviceNodeName
    }
  }, ...(0, _server.rangeQuery)(start, end)];

  async function getApplicationMetricSample() {
    var _response$hits$hits$;

    const response = await apmEventClient.search('get_service_instance_metadata_details_application_metric', {
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        terminate_after: 1,
        size: 1,
        query: {
          bool: {
            filter: filter.concat({
              term: {
                [_elasticsearch_fieldnames.METRICSET_NAME]: 'app'
              }
            })
          }
        }
      }
    });
    return (0, _maybe.maybe)((_response$hits$hits$ = response.hits.hits[0]) === null || _response$hits$hits$ === void 0 ? void 0 : _response$hits$hits$._source);
  }

  async function getTransactionEventSample() {
    var _response$hits$hits$2;

    const response = await apmEventClient.search('get_service_instance_metadata_details_application_transaction_event', {
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        terminate_after: 1,
        size: 1,
        query: {
          bool: {
            filter
          }
        }
      }
    });
    return (0, _maybe.maybe)((_response$hits$hits$2 = response.hits.hits[0]) === null || _response$hits$hits$2 === void 0 ? void 0 : _response$hits$hits$2._source);
  }

  async function getTransactionMetricSample() {
    var _response$hits$hits$3;

    const response = await apmEventClient.search('get_service_instance_metadata_details_application_transaction_metric', {
      apm: {
        events: [(0, _transactions.getProcessorEventForTransactions)(true)]
      },
      body: {
        terminate_after: 1,
        size: 1,
        query: {
          bool: {
            filter: filter.concat((0, _transactions.getDocumentTypeFilterForTransactions)(true))
          }
        }
      }
    });
    return (0, _maybe.maybe)((_response$hits$hits$3 = response.hits.hits[0]) === null || _response$hits$hits$3 === void 0 ? void 0 : _response$hits$hits$3._source);
  } // we can expect the most detail of application metrics,
  // followed by transaction events, and then finally transaction metrics


  const [applicationMetricSample, transactionEventSample, transactionMetricSample] = await Promise.all([getApplicationMetricSample(), getTransactionEventSample(), getTransactionMetricSample()]);
  const sample = (0, _lodash.merge)({}, transactionMetricSample, transactionEventSample, applicationMetricSample);
  const {
    agent,
    service,
    container,
    kubernetes,
    host,
    cloud
  } = sample;
  return {
    '@timestamp': sample['@timestamp'],
    agent,
    service,
    container,
    kubernetes,
    host,
    cloud
  };
}