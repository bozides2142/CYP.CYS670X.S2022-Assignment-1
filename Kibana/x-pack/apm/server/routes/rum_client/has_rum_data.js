"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasRumData = hasRumData;

var _moment = _interopRequireDefault(require("moment"));

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _server = require("../../../../observability/server");

var _transaction_types = require("../../../common/transaction_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function hasRumData({
  setup,
  start = (0, _moment.default)().subtract(24, 'h').valueOf(),
  end = (0, _moment.default)().valueOf()
}) {
  try {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5;

    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_TYPE]: _transaction_types.TRANSACTION_PAGE_LOAD
              }
            }]
          }
        },
        aggs: {
          services: {
            filter: (0, _server.rangeQuery)(start, end)[0],
            aggs: {
              mostTraffic: {
                terms: {
                  field: _elasticsearch_fieldnames.SERVICE_NAME,
                  size: 1
                }
              }
            }
          }
        }
      }
    };
    const {
      apmEventClient
    } = setup;
    const response = await apmEventClient.search('has_rum_data', params);
    return {
      indices: setup.indices.transaction,
      hasData: response.hits.total.value > 0,
      serviceName: (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.services) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.mostTraffic) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.buckets) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4[0]) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.key
    };
  } catch (e) {
    return {
      hasData: false,
      serviceName: undefined,
      indices: setup.indices.transaction
    };
  }
}