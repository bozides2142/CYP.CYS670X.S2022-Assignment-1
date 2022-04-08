"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeFieldRange = getTimeFieldRange;

var _utils = require("../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTimeFieldRange(client, index, timeFieldName, query, runtimeMappings) {
  const obj = {
    success: true,
    start: {
      epoch: 0,
      string: ''
    },
    end: {
      epoch: 0,
      string: ''
    }
  };
  const {
    body: {
      aggregations
    }
  } = await client.asCurrentUser.search({
    index,
    size: 0,
    body: { ...(query ? {
        query
      } : {}),
      aggs: {
        earliest: {
          min: {
            field: timeFieldName
          }
        },
        latest: {
          max: {
            field: timeFieldName
          }
        }
      },
      ...((0, _utils.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    }
  });

  if (aggregations && aggregations.earliest && aggregations.latest) {
    // @ts-expect-error fix search aggregation response
    obj.start.epoch = aggregations.earliest.value; // @ts-expect-error fix search aggregation response

    obj.start.string = aggregations.earliest.value_as_string; // @ts-expect-error fix search aggregation response

    obj.end.epoch = aggregations.latest.value; // @ts-expect-error fix search aggregation response

    obj.end.string = aggregations.latest.value_as_string;
  }

  return obj;
}