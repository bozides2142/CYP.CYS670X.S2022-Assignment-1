"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeExpectationsAndRanges = void 0;

var _constants = require("../../../../common/correlations/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const computeExpectationsAndRanges = (percentiles, step = _constants.PERCENTILES_STEP) => {
  const tempPercentiles = [percentiles[0]];
  const tempFractions = [step / 100]; // Collapse duplicates

  for (let i = 1; i < percentiles.length; i++) {
    if (percentiles[i] !== percentiles[i - 1]) {
      tempPercentiles.push(percentiles[i]);
      tempFractions.push(_constants.PERCENTILES_STEP / 100);
    } else {
      tempFractions[tempFractions.length - 1] = tempFractions[tempFractions.length - 1] + step / 100;
    }
  }

  tempFractions.push(_constants.PERCENTILES_STEP / 100);
  const ranges = tempPercentiles.map(tP => Math.round(tP)).reduce((p, to) => {
    var _p;

    const from = (_p = p[p.length - 1]) === null || _p === void 0 ? void 0 : _p.to;

    if (from !== undefined) {
      p.push({
        from,
        to
      });
    } else {
      p.push({
        to
      });
    }

    return p;
  }, []);

  if (ranges.length > 0) {
    ranges.push({
      from: ranges[ranges.length - 1].to
    });
  }

  const expectations = [tempPercentiles[0]];

  for (let i = 1; i < tempPercentiles.length; i++) {
    expectations.push((tempFractions[i - 1] * tempPercentiles[i - 1] + tempFractions[i] * tempPercentiles[i]) / (tempFractions[i - 1] + tempFractions[i]));
  }

  expectations.push(tempPercentiles[tempPercentiles.length - 1]);
  return {
    expectations,
    ranges
  };
};

exports.computeExpectationsAndRanges = computeExpectationsAndRanges;