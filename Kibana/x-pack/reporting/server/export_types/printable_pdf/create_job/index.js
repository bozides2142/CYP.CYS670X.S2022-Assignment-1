"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobFnFactory = void 0;

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createJobFnFactory = function createJobFactoryFn() {
  return async function createJobFn({
    relativeUrls,
    ...jobParams
  }) {
    (0, _common.validateUrls)(relativeUrls); // return the payload

    return { ...jobParams,
      isDeprecated: true,
      forceNow: new Date().toISOString(),
      objects: relativeUrls.map(u => ({
        relativeUrl: u
      }))
    };
  };
};

exports.createJobFnFactory = createJobFnFactory;