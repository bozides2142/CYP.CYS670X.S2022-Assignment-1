"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitAllSettledPromises = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const splitAllSettledPromises = promises => promises.reduce((result, current) => {
  if (current.status === 'fulfilled') {
    result.fulfilled.push(current.value);
  } else if (current.status === 'rejected') {
    result.rejected.push(current.reason);
  }

  return result;
}, {
  fulfilled: [],
  rejected: []
});

exports.splitAllSettledPromises = splitAllSettledPromises;