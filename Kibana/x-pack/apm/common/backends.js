"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kueryBarPlaceholder = exports.getKueryBarBoolFilter = void 0;

var _i18n = require("@kbn/i18n");

var _processor_event = require("./processor_event");

var _elasticsearch_fieldnames = require("./elasticsearch_fieldnames");

var _environment_query = require("./utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const kueryBarPlaceholder = _i18n.i18n.translate('xpack.apm.dependencies.kueryBarPlaceholder', {
  defaultMessage: `Search dependency metrics (e.g. span.destination.service.resource:elasticsearch)`
});

exports.kueryBarPlaceholder = kueryBarPlaceholder;

const getKueryBarBoolFilter = ({
  backendName,
  environment
}) => {
  return [{
    term: {
      [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.metric
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
    }
  }, ...(backendName ? [{
    term: {
      [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: backendName
    }
  }] : []), ...(0, _environment_query.environmentQuery)(environment)];
};

exports.getKueryBarBoolFilter = getKueryBarBoolFilter;