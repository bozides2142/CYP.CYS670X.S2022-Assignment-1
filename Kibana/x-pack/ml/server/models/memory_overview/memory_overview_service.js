"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NATIVE_EXECUTABLE_CODE_OVERHEAD = void 0;
exports.memoryOverviewServiceProvider = memoryOverviewServiceProvider;

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MB = Math.pow(2, 20);
const AD_PROCESS_MEMORY_OVERHEAD = 10 * MB;
const DFA_PROCESS_MEMORY_OVERHEAD = 5 * MB;
const NATIVE_EXECUTABLE_CODE_OVERHEAD = 30 * MB;
/**
 * Provides a service for memory overview across ML.
 * @param mlClient
 */

exports.NATIVE_EXECUTABLE_CODE_OVERHEAD = NATIVE_EXECUTABLE_CODE_OVERHEAD;

function memoryOverviewServiceProvider(mlClient) {
  return {
    /**
     * Retrieves memory consumed my started DFA jobs.
     */
    async getDFAMemoryOverview() {
      const {
        body: {
          data_frame_analytics: dfaStats
        }
      } = await mlClient.getDataFrameAnalyticsStats();
      const dfaMemoryReport = dfaStats.filter(dfa => dfa.state === 'started').map(dfa => {
        var _dfa$node;

        return {
          node_id: (_dfa$node = dfa.node) === null || _dfa$node === void 0 ? void 0 : _dfa$node.id,
          job_id: dfa.id
        };
      });

      if (dfaMemoryReport.length === 0) {
        return [];
      }

      const dfaMemoryKeyByJobId = (0, _lodash.keyBy)(dfaMemoryReport, 'job_id');
      const {
        body: {
          data_frame_analytics: startedDfaJobs
        }
      } = await mlClient.getDataFrameAnalytics({
        id: dfaMemoryReport.map(v => v.job_id).join(',')
      });
      startedDfaJobs.forEach(dfa => {
        var _dfa$model_memory_lim;

        dfaMemoryKeyByJobId[dfa.id].model_size = (0, _numeral.default)((_dfa$model_memory_lim = dfa.model_memory_limit) === null || _dfa$model_memory_lim === void 0 ? void 0 : _dfa$model_memory_lim.toUpperCase() // @ts-ignore
        ).value() + DFA_PROCESS_MEMORY_OVERHEAD;
      });
      return dfaMemoryReport;
    },

    /**
     * Retrieves memory consumed by opened Anomaly Detection jobs.
     */
    async getAnomalyDetectionMemoryOverview() {
      const {
        body: {
          jobs: jobsStats
        }
      } = await mlClient.getJobStats();
      return jobsStats.filter(v => v.state === 'opened').map(jobStats => {
        return {
          node_id: jobStats.node.id,
          // @ts-expect-error model_bytes can be string | number, cannot sum it with AD_PROCESS_MEMORY_OVERHEAD
          model_size: jobStats.model_size_stats.model_bytes + AD_PROCESS_MEMORY_OVERHEAD,
          job_id: jobStats.job_id
        };
      });
    }

  };
}