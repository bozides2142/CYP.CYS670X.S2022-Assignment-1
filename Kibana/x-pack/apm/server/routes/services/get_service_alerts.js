"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAlerts = getServiceAlerts;

var _ruleDataUtils = require("@kbn/rule-data-utils");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");

var _environment_query = require("../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceAlerts({
  ruleDataClient,
  start,
  end,
  serviceName,
  environment,
  transactionType
}) {
  const response = await ruleDataClient.getReader().search({
    body: {
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), {
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, {
            term: {
              [_ruleDataUtils.EVENT_KIND]: 'signal'
            }
          }],
          should: [{
            bool: {
              filter: [{
                term: {
                  [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
                }
              }]
            }
          }, {
            bool: {
              must_not: {
                exists: {
                  field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                }
              }
            }
          }],
          minimum_should_match: 1
        }
      },
      size: 100,
      fields: ['*'],
      sort: {
        '@timestamp': 'desc'
      }
    },
    allow_no_indices: true
  });
  return response.hits.hits.map(hit => hit.fields);
}