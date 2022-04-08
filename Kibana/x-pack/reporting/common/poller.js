"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Poller = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Poller {
  constructor(options) {
    (0, _defineProperty2.default)(this, "functionToPoll", void 0);
    (0, _defineProperty2.default)(this, "successFunction", void 0);
    (0, _defineProperty2.default)(this, "errorFunction", void 0);
    (0, _defineProperty2.default)(this, "_isRunning", void 0);
    (0, _defineProperty2.default)(this, "_timeoutId", void 0);
    (0, _defineProperty2.default)(this, "pollFrequencyInMillis", void 0);
    (0, _defineProperty2.default)(this, "trailing", void 0);
    (0, _defineProperty2.default)(this, "continuePollingOnError", void 0);
    (0, _defineProperty2.default)(this, "pollFrequencyErrorMultiplier", void 0);
    this.functionToPoll = options.functionToPoll; // Must return a Promise

    this.successFunction = options.successFunction || _lodash.default.noop;
    this.errorFunction = options.errorFunction || _lodash.default.noop;
    this.pollFrequencyInMillis = options.pollFrequencyInMillis;
    this.trailing = options.trailing || false;
    this.continuePollingOnError = options.continuePollingOnError || false;
    this.pollFrequencyErrorMultiplier = options.pollFrequencyErrorMultiplier || 1;
    this._timeoutId = null;
    this._isRunning = false;
  }

  getPollFrequency() {
    return this.pollFrequencyInMillis;
  }

  _poll() {
    return this.functionToPoll().then(this.successFunction).then(() => {
      if (!this._isRunning) {
        return;
      }

      this._timeoutId = setTimeout(this._poll.bind(this), this.pollFrequencyInMillis);
    }).catch(e => {
      this.errorFunction(e);

      if (!this._isRunning) {
        return;
      }

      if (this.continuePollingOnError) {
        this._timeoutId = setTimeout(this._poll.bind(this), this.pollFrequencyInMillis * this.pollFrequencyErrorMultiplier);
      } else {
        this.stop();
      }
    });
  }

  start() {
    if (this._isRunning) {
      return;
    }

    this._isRunning = true;

    if (this.trailing) {
      this._timeoutId = setTimeout(this._poll.bind(this), this.pollFrequencyInMillis);
    } else {
      this._poll();
    }
  }

  stop() {
    if (!this._isRunning) {
      return;
    }

    this._isRunning = false;

    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    this._timeoutId = null;
  }

  isRunning() {
    return this._isRunning;
  }

}

exports.Poller = Poller;