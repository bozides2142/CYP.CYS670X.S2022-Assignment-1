"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = getStats;

var _lodash = require("lodash");

var _get_past_days = require("./get_past_days");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * Parse the response data into telemetry payload
 */
async function getStats(soClient) {
  const finder = await soClient.createPointInTimeFinder({
    type: 'visualization',
    perPage: 1000,
    namespaces: ['*']
  });
  const visSummaries = [];

  for await (const response of finder.find()) {
    (response.saved_objects || []).forEach(so => {
      var _so$attributes;

      if ((_so$attributes = so.attributes) !== null && _so$attributes !== void 0 && _so$attributes.visState) {
        var _visState$type, _so$namespaces$, _so$namespaces;

        const visState = JSON.parse(so.attributes.visState);
        visSummaries.push({
          type: (_visState$type = visState.type) !== null && _visState$type !== void 0 ? _visState$type : '_na_',
          space: (_so$namespaces$ = (_so$namespaces = so.namespaces) === null || _so$namespaces === void 0 ? void 0 : _so$namespaces[0]) !== null && _so$namespaces$ !== void 0 ? _so$namespaces$ : 'default',
          past_days: (0, _get_past_days.getPastDays)(so.updated_at)
        });
      }
    });
  }

  await finder.close();

  if (visSummaries.length) {
    // organize stats per type
    const visTypes = (0, _lodash.groupBy)(visSummaries, 'type'); // get the final result

    return (0, _lodash.mapValues)(visTypes, curr => {
      const total = curr.length;
      const spacesBreakdown = (0, _lodash.countBy)(curr, 'space');
      const spaceCounts = (0, _lodash.values)(spacesBreakdown);
      return {
        total,
        spaces_min: (0, _lodash.min)(spaceCounts),
        spaces_max: (0, _lodash.max)(spaceCounts),
        spaces_avg: total / spaceCounts.length,
        saved_7_days_total: curr.filter(c => c.past_days <= 7).length,
        saved_30_days_total: curr.filter(c => c.past_days <= 30).length,
        saved_90_days_total: curr.filter(c => c.past_days <= 90).length
      };
    });
  }
}