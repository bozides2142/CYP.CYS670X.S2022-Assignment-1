"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsqueryTelemetryTask = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class OsqueryTelemetryTask {
  constructor(config, logger, sender, receiver) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "sender", void 0);
    (0, _defineProperty2.default)(this, "receiver", void 0);
    (0, _defineProperty2.default)(this, "getLastExecutionTime", (taskExecutionTime, taskInstance) => {
      var _taskInstance$state;

      return this.config.getLastExecutionTime ? this.config.getLastExecutionTime(taskExecutionTime, (_taskInstance$state = taskInstance.state) === null || _taskInstance$state === void 0 ? void 0 : _taskInstance$state.lastExecutionTimestamp) : undefined;
    });
    (0, _defineProperty2.default)(this, "getTaskId", () => `${this.config.type}:${this.config.version}`);
    (0, _defineProperty2.default)(this, "register", taskManager => {
      taskManager.registerTaskDefinitions({
        [this.config.type]: {
          title: this.config.title,
          timeout: this.config.timeout,
          createTaskRunner: ({
            taskInstance
          }) => {
            const {
              state
            } = taskInstance;
            return {
              run: async () => {
                const taskExecutionTime = (0, _moment.default)().utc().toISOString();
                const executionPeriod = {
                  last: this.getLastExecutionTime(taskExecutionTime, taskInstance),
                  current: taskExecutionTime
                };
                const hits = await this.runTask(taskInstance.id, executionPeriod);
                return {
                  state: {
                    lastExecutionTimestamp: taskExecutionTime,
                    runs: (state.runs || 0) + 1,
                    hits
                  }
                };
              },
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              cancel: async () => {}
            };
          }
        }
      });
    });
    (0, _defineProperty2.default)(this, "start", async taskManager => {
      const taskId = this.getTaskId();
      this.logger.debug(`[task ${taskId}]: attempting to schedule`);

      try {
        await taskManager.ensureScheduled({
          id: taskId,
          taskType: this.config.type,
          scope: ['osquery'],
          schedule: {
            interval: this.config.interval
          },
          state: {
            runs: 0
          },
          params: {
            version: this.config.version
          }
        });
      } catch (e) {
        this.logger.error(`[task ${taskId}]: error scheduling task, received ${e.message}`);
      }
    });
    (0, _defineProperty2.default)(this, "runTask", async (taskId, executionPeriod) => {
      this.logger.debug(`[task ${taskId}]: attempting to run`);

      if (taskId !== this.getTaskId()) {
        this.logger.debug(`[task ${taskId}]: outdated task`);
        return 0;
      }

      const isOptedIn = await this.sender.isTelemetryOptedIn();

      if (!isOptedIn) {
        this.logger.debug(`[task ${taskId}]: telemetry is not opted-in`);
        return 0;
      }

      this.logger.debug(`[task ${taskId}]: running task`);
      return this.config.runTask(taskId, this.logger, this.receiver, this.sender, executionPeriod);
    });
    this.config = config;
    this.logger = logger;
    this.sender = sender;
    this.receiver = receiver;
  }

}

exports.OsqueryTelemetryTask = OsqueryTelemetryTask;