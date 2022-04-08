"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cumulativeSumFn = void 0;

var _series_calculation_helpers = require("../series_calculation_helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const cumulativeSumFn = (input, {
  by,
  inputColumnId,
  outputColumnId,
  outputColumnName
}) => {
  const resultColumns = (0, _series_calculation_helpers.buildResultColumns)(input, outputColumnId, inputColumnId, outputColumnName);

  if (!resultColumns) {
    return input;
  }

  const accumulators = {};
  return { ...input,
    columns: resultColumns,
    rows: input.rows.map(row => {
      var _accumulators$bucketI;

      const newRow = { ...row
      };
      const bucketIdentifier = (0, _series_calculation_helpers.getBucketIdentifier)(row, by);
      const accumulatorValue = (_accumulators$bucketI = accumulators[bucketIdentifier]) !== null && _accumulators$bucketI !== void 0 ? _accumulators$bucketI : 0;
      const currentValue = newRow[inputColumnId];

      if (currentValue != null) {
        newRow[outputColumnId] = Number(currentValue) + accumulatorValue;
        accumulators[bucketIdentifier] = newRow[outputColumnId];
      } else {
        newRow[outputColumnId] = accumulatorValue;
      }

      return newRow;
    })
  };
};

exports.cumulativeSumFn = cumulativeSumFn;