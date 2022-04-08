"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollupServiceProvider = rollupServiceProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function rollupServiceProvider(indexPattern, {
  asCurrentUser
}, dataViewsService) {
  const rollupIndexPatternObject = await loadRollupIndexPattern(indexPattern, dataViewsService);
  let jobIndexPatterns = [indexPattern];

  async function getRollupJobs() {
    var _rollupIndexPatternOb;

    if (rollupIndexPatternObject !== null && ((_rollupIndexPatternOb = rollupIndexPatternObject.typeMeta) === null || _rollupIndexPatternOb === void 0 ? void 0 : _rollupIndexPatternOb.params) !== undefined) {
      const rollUpIndex = rollupIndexPatternObject.typeMeta.params.rollup_index;
      const {
        body: rollupCaps
      } = await asCurrentUser.rollup.getRollupIndexCaps({
        index: rollUpIndex
      });
      const indexRollupCaps = rollupCaps[rollUpIndex];

      if (indexRollupCaps && indexRollupCaps.rollup_jobs) {
        jobIndexPatterns = indexRollupCaps.rollup_jobs.map(j => j.index_pattern);
        return indexRollupCaps.rollup_jobs;
      }
    }

    return null;
  }

  function getIndexPattern() {
    return jobIndexPatterns.join(',');
  }

  return {
    getRollupJobs,
    getIndexPattern
  };
}

async function loadRollupIndexPattern(indexPattern, dataViewsService) {
  const resp = await dataViewsService.find('*', 10000);
  const obj = resp.find(dv => dv.type === 'rollup' && dv.title === indexPattern && dv.typeMeta !== undefined);
  return obj !== null && obj !== void 0 ? obj : null;
}