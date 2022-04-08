"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByTerms = void 0;

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const splitByTerms = ({
  panel
}) => {
  return next => doc => {
    panel.series.filter(c => c.aggregate_by && c.aggregate_function).forEach(column => {
      (0, _helpers.overwrite)(doc, `aggs.pivot.aggs.${column.id}.terms.field`, column.aggregate_by);
      (0, _helpers.overwrite)(doc, `aggs.pivot.aggs.${column.id}.terms.size`, 100);
    });
    return next(doc);
  };
};

exports.splitByTerms = splitByTerms;