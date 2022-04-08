"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertHosts = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostName = 'host.name';
const hostId = 'host.id';

class AlertHosts {
  constructor(uniqueValuesLimit = 10) {
    this.uniqueValuesLimit = uniqueValuesLimit;
  }

  build() {
    const topHits = {
      aggs: {
        top_fields: {
          top_hits: {
            docvalue_fields: [hostName],
            sort: [{
              '@timestamp': {
                order: 'desc'
              }
            }],
            size: 1
          }
        }
      }
    };
    return {
      hosts_frequency: {
        terms: {
          field: hostId,
          size: this.uniqueValuesLimit
        },
        ...topHits
      },
      hosts_total: {
        cardinality: {
          field: hostId
        }
      }
    };
  }

  formatResponse(aggregations) {
    var _aggs$hosts_frequency, _aggs$hosts_total;

    const aggs = aggregations;
    const topFrequentHosts = aggs === null || aggs === void 0 ? void 0 : (_aggs$hosts_frequency = aggs.hosts_frequency) === null || _aggs$hosts_frequency === void 0 ? void 0 : _aggs$hosts_frequency.buckets.map(bucket => ({
      name: AlertHosts.getHostName(bucket),
      id: bucket.key,
      count: bucket.doc_count
    }));
    const totalHosts = aggs === null || aggs === void 0 ? void 0 : (_aggs$hosts_total = aggs.hosts_total) === null || _aggs$hosts_total === void 0 ? void 0 : _aggs$hosts_total.value;
    const hostFields = topFrequentHosts && totalHosts ? {
      total: totalHosts,
      values: topFrequentHosts
    } : {
      total: 0,
      values: []
    };
    return {
      alerts: {
        hosts: hostFields
      }
    };
  }

  static getHostName(bucket) {
    const unsafeHostName = (0, _lodash.get)(bucket.top_fields.hits.hits[0].fields, hostName);

    if (Array.isArray(unsafeHostName) && unsafeHostName.length > 0) {
      return unsafeHostName[0];
    }

    return unsafeHostName;
  }

  getName() {
    return 'hosts';
  }

}

exports.AlertHosts = AlertHosts;