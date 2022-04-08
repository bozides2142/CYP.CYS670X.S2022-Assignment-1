"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageCounter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Details about the counter to be incremented
 */

/**
 * Usage Counter allows to keep track of any events that occur.
 * By calling {@link IUsageCounter.incrementCounter} devs can notify this
 * API whenever the event happens.
 */
class UsageCounter {
  constructor({
    domainId,
    counter$
  }) {
    (0, _defineProperty2.default)(this, "domainId", void 0);
    (0, _defineProperty2.default)(this, "counter$", void 0);
    (0, _defineProperty2.default)(this, "incrementCounter", params => {
      const {
        counterName,
        counterType = 'count',
        incrementBy = 1
      } = params;
      this.counter$.next({
        counterName,
        domainId: this.domainId,
        counterType,
        incrementBy
      });
    });
    this.domainId = domainId;
    this.counter$ = counter$;
  }

}

exports.UsageCounter = UsageCounter;