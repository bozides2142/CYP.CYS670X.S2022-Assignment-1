"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IsolateHostActions = void 0;

var _api = require("../../../../../common/api");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class IsolateHostActions {
  // uniqueValuesLimit should not be lower than the number of actions.type values (currently 2) or some information could be lost
  constructor(uniqueValuesLimit = 10) {
    this.uniqueValuesLimit = uniqueValuesLimit;
  }

  build() {
    return {
      actions: {
        terms: {
          field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.actions.type`,
          size: this.uniqueValuesLimit
        }
      }
    };
  }

  formatResponse(aggregationsResponse) {
    var _aggs$actions, _actionsCounters$Isol, _actionsCounters$Isol2;

    const aggs = aggregationsResponse;
    const actionsCounters = aggs === null || aggs === void 0 ? void 0 : (_aggs$actions = aggs.actions) === null || _aggs$actions === void 0 ? void 0 : _aggs$actions.buckets.reduce((result, {
      key,
      doc_count: total
    }) => ({ ...result,
      [key]: total
    }), {});
    return {
      actions: {
        isolateHost: {
          [_api.IsolateHostActionType.isolate]: {
            total: (_actionsCounters$Isol = actionsCounters === null || actionsCounters === void 0 ? void 0 : actionsCounters[_api.IsolateHostActionType.isolate]) !== null && _actionsCounters$Isol !== void 0 ? _actionsCounters$Isol : 0
          },
          [_api.IsolateHostActionType.unisolate]: {
            total: (_actionsCounters$Isol2 = actionsCounters === null || actionsCounters === void 0 ? void 0 : actionsCounters[_api.IsolateHostActionType.unisolate]) !== null && _actionsCounters$Isol2 !== void 0 ? _actionsCounters$Isol2 : 0
          }
        }
      }
    };
  }

  getName() {
    return 'isolateHost';
  }

}

exports.IsolateHostActions = IsolateHostActions;