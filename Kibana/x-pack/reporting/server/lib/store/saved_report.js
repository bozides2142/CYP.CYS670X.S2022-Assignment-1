"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedReport = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require("./");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Class for a report document that is saved in Elasticsearch
 */


class SavedReport extends _.Report {
  constructor(opts) {
    super(opts);
    (0, _defineProperty2.default)(this, "_index", void 0);
    (0, _defineProperty2.default)(this, "_id", void 0);
    (0, _defineProperty2.default)(this, "_primary_term", void 0);
    (0, _defineProperty2.default)(this, "_seq_no", void 0);

    if (opts._id == null || opts._index == null) {
      throw new Error(`Report is not editable: Job [${opts._id}/${opts._index}] is not synced with ES!`);
    }

    if (opts._seq_no == null || opts._primary_term == null) {
      throw new Error(`Report is not editable: Job [${opts._id}] is missing _seq_no and _primary_term fields!`);
    }

    const {
      _id,
      _index,
      _seq_no,
      _primary_term
    } = opts;
    this._id = _id;
    this._index = _index;
    this._primary_term = _primary_term;
    this._seq_no = _seq_no;
  }

}

exports.SavedReport = SavedReport;