"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogRateAggs = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLogRateAggs = (timerange, id) => {
  const intervalInSeconds = (timerange.to - timerange.from) / 1000;
  return {
    [id]: {
      bucket_script: {
        buckets_path: {
          count: `_count`
        },
        script: `params.count > 0.0 ? params.count / ${intervalInSeconds}: null`
      }
    }
  };
};

exports.createLogRateAggs = createLogRateAggs;