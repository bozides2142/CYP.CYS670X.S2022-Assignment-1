"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertUsers = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AlertUsers {
  constructor(uniqueValuesLimit = 10) {
    this.uniqueValuesLimit = uniqueValuesLimit;
  }

  build() {
    return {
      users_frequency: {
        terms: {
          field: userName,
          size: this.uniqueValuesLimit
        }
      },
      users_total: {
        cardinality: {
          field: userName
        }
      }
    };
  }

  formatResponse(aggregations) {
    var _aggs$users_frequency, _aggs$users_total;

    const aggs = aggregations;
    const topFrequentUsers = aggs === null || aggs === void 0 ? void 0 : (_aggs$users_frequency = aggs.users_frequency) === null || _aggs$users_frequency === void 0 ? void 0 : _aggs$users_frequency.buckets.map(bucket => ({
      name: bucket.key,
      count: bucket.doc_count
    }));
    const totalUsers = aggs === null || aggs === void 0 ? void 0 : (_aggs$users_total = aggs.users_total) === null || _aggs$users_total === void 0 ? void 0 : _aggs$users_total.value;
    const usersFields = topFrequentUsers && totalUsers ? {
      total: totalUsers,
      values: topFrequentUsers
    } : {
      total: 0,
      values: []
    };
    return {
      alerts: {
        users: usersFields
      }
    };
  }

  getName() {
    return 'users';
  }

}

exports.AlertUsers = AlertUsers;
const userName = 'user.name';