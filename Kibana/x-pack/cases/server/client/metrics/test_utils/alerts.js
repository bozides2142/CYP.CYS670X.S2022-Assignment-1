"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockAlertsService = mockAlertsService;

var _mocks = require("../../../services/mocks");

var _aggregations = require("../alerts/aggregations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mockAlertsService() {
  const alertsService = (0, _mocks.createAlertServiceMock)();
  alertsService.executeAggregations.mockImplementation(async ({
    aggregationBuilders
  }) => {
    let result = {};

    for (const builder of aggregationBuilders) {
      switch (builder.constructor) {
        case _aggregations.AlertHosts:
          result = { ...result,
            ...createHostsAggsResponse()
          };
          break;

        case _aggregations.AlertUsers:
          result = { ...result,
            ...createUsersAggsResponse()
          };
          break;
      }
    }

    return result;
  });
  return alertsService;
}

function createHostsAggsResponse() {
  return {
    hosts_total: {
      value: 2
    },
    hosts_frequency: {
      buckets: [{
        key: '1',
        doc_count: 1,
        top_fields: {
          hits: {
            hits: [{
              fields: {
                'host.name': ['host1']
              }
            }]
          }
        }
      }]
    }
  };
}

function createUsersAggsResponse() {
  return {
    users_total: {
      value: 2
    },
    users_frequency: {
      buckets: [{
        key: 'user1',
        doc_count: 1
      }]
    }
  };
}