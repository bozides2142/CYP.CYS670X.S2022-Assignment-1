"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCorrelationsFilters = getCorrelationsFilters;

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getCorrelationsFilters({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  start,
  end
}) {
  const correlationsFilters = [{
    term: {
      [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
    }
  }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];

  if (serviceName) {
    correlationsFilters.push({
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    });
  }

  if (transactionType) {
    correlationsFilters.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
      }
    });
  }

  if (transactionName) {
    correlationsFilters.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    });
  }

  return correlationsFilters;
}