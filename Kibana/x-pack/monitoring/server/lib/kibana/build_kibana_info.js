"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildKibanaInfo = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildKibanaInfo = hit => {
  var _source$kibana, _source$kibana$stats, _source$kibana2, _source$kibana2$stats, _source$kibana2$stats2, _source$kibana3, _source$kibana3$stats, _source$kibana4, _source$kibana4$stats, _source$service, _source$kibana5, _source$kibana5$stats, _source$kibana6, _source$kibana6$stats, _source$service2;

  const source = hit._source;
  if (source.kibana_stats) return source.kibana_stats.kibana;
  return {
    name: (_source$kibana = source.kibana) === null || _source$kibana === void 0 ? void 0 : (_source$kibana$stats = _source$kibana.stats) === null || _source$kibana$stats === void 0 ? void 0 : _source$kibana$stats.name,
    host: (_source$kibana2 = source.kibana) === null || _source$kibana2 === void 0 ? void 0 : (_source$kibana2$stats = _source$kibana2.stats) === null || _source$kibana2$stats === void 0 ? void 0 : (_source$kibana2$stats2 = _source$kibana2$stats.host) === null || _source$kibana2$stats2 === void 0 ? void 0 : _source$kibana2$stats2.name,
    status: (_source$kibana3 = source.kibana) === null || _source$kibana3 === void 0 ? void 0 : (_source$kibana3$stats = _source$kibana3.stats) === null || _source$kibana3$stats === void 0 ? void 0 : _source$kibana3$stats.status,
    transport_address: (_source$kibana4 = source.kibana) === null || _source$kibana4 === void 0 ? void 0 : (_source$kibana4$stats = _source$kibana4.stats) === null || _source$kibana4$stats === void 0 ? void 0 : _source$kibana4$stats.transport_address,
    uuid: (_source$service = source.service) === null || _source$service === void 0 ? void 0 : _source$service.id,
    snapshot: (_source$kibana5 = source.kibana) === null || _source$kibana5 === void 0 ? void 0 : (_source$kibana5$stats = _source$kibana5.stats) === null || _source$kibana5$stats === void 0 ? void 0 : _source$kibana5$stats.snapshot,
    index: (_source$kibana6 = source.kibana) === null || _source$kibana6 === void 0 ? void 0 : (_source$kibana6$stats = _source$kibana6.stats) === null || _source$kibana6$stats === void 0 ? void 0 : _source$kibana6$stats.index,
    version: (_source$service2 = source.service) === null || _source$service2 === void 0 ? void 0 : _source$service2.version
  };
};

exports.buildKibanaInfo = buildKibanaInfo;