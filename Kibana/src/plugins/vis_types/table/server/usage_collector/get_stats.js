"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = getStats;

var _common = require("../../common");

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
  const stats = {
    total: 0,
    total_split: 0,
    split_columns: {
      total: 0,
      enabled: 0
    },
    split_rows: {
      total: 0,
      enabled: 0
    }
  };

  const doTelemetry = ({
    aggs,
    params
  }) => {
    stats.total += 1;
    const hasSplitAgg = aggs.find(agg => agg.schema === 'split');

    if (hasSplitAgg) {
      stats.total_split += 1;
      const isSplitRow = params.row;
      const isSplitEnabled = hasSplitAgg.enabled;
      const container = isSplitRow ? stats.split_rows : stats.split_columns;
      container.total += 1;
      container.enabled = isSplitEnabled ? container.enabled + 1 : container.enabled;
    }
  };

  for await (const response of finder.find()) {
    (response.saved_objects || []).forEach(({
      attributes
    }) => {
      if (attributes !== null && attributes !== void 0 && attributes.visState) {
        try {
          const visState = JSON.parse(attributes.visState);

          if (visState.type === _common.VIS_TYPE_TABLE) {
            doTelemetry(visState);
          }
        } catch {// nothing to be here, "so" not valid
        }
      }
    });
  }

  await finder.close();
  return stats;
}