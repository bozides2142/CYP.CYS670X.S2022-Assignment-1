"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskRunner = taskRunner;

var _server = require("../../../task_manager/server");

var _find_and_cleanup_tasks = require("./find_and_cleanup_tasks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function taskRunner(opts) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;
    return {
      async run() {
        const cleanupResult = await (0, _find_and_cleanup_tasks.findAndCleanupTasks)(opts);
        return {
          state: {
            runs: state.runs + 1,
            total_cleaned_up: state.total_cleaned_up + cleanupResult.successCount
          },
          schedule: {
            interval: cleanupResult.remaining > 0 ? (0, _server.asInterval)(opts.config.cleanupInterval.asMilliseconds()) : (0, _server.asInterval)(opts.config.idleInterval.asMilliseconds())
          }
        };
      }

    };
  };
}