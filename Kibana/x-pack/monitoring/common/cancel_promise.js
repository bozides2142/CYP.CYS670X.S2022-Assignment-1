"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Status = exports.PromiseWithCancel = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let Status;
/**
 * Simple [PromiseWithCancel] factory
 */

exports.Status = Status;

(function (Status) {
  Status[Status["Canceled"] = 0] = "Canceled";
  Status[Status["Failed"] = 1] = "Failed";
  Status[Status["Resolved"] = 2] = "Resolved";
  Status[Status["Awaiting"] = 3] = "Awaiting";
  Status[Status["Idle"] = 4] = "Idle";
})(Status || (exports.Status = Status = {}));

class PromiseWithCancel {
  /**
   * @param {Promise} promise  Promise you want to cancel / track
   */
  constructor(promise) {
    (0, _defineProperty2.default)(this, "_promise", void 0);
    (0, _defineProperty2.default)(this, "_status", Status.Idle);
    (0, _defineProperty2.default)(this, "cancel", () => {
      this._status = Status.Canceled;
    });
    (0, _defineProperty2.default)(this, "status", () => {
      return this._status;
    });
    (0, _defineProperty2.default)(this, "promise", () => {
      if (this._status === Status.Canceled) {
        throw Error('Getting a canceled promise is not allowed');
      } else if (this._status !== Status.Idle) {
        return this._promise;
      }

      return new Promise((resolve, reject) => {
        this._status = Status.Awaiting;
        return this._promise.then(response => {
          if (this._status !== Status.Canceled) {
            this._status = Status.Resolved;
            return resolve(response);
          }
        }).catch(error => {
          if (this._status !== Status.Canceled) {
            this._status = Status.Failed;
            return reject(error);
          }
        });
      });
    });
    this._promise = promise;
  }
  /**
   * Cancel the promise in any state
   */


}

exports.PromiseWithCancel = PromiseWithCancel;