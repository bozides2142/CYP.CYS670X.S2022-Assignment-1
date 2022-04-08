"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOverallStatusChanges = void 0;

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getOverallStatusChanges = (overall$, stop$) => {
  return overall$.pipe((0, _operators.takeUntil)(stop$), (0, _operators.distinctUntilChanged)((previous, next) => {
    return previous.level.toString() === next.level.toString();
  }), (0, _operators.startWith)(undefined), (0, _operators.pairwise)(), (0, _operators.map)(([oldStatus, newStatus]) => {
    if (oldStatus) {
      return `Kibana is now ${newStatus.level.toString()} (was ${oldStatus.level.toString()})`;
    }

    return `Kibana is now ${newStatus.level.toString()}`;
  }));
};

exports.getOverallStatusChanges = getOverallStatusChanges;