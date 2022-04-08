"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ActionType;
exports.ActionType = ActionType;

(function (ActionType) {
  ActionType["SCHEDULE_TASK"] = "schedule-task";
  ActionType["CLAIM_TASK"] = "claim-task";
  ActionType["EXECUTE_START"] = "execute-start";
  ActionType["EXECUTE_COMPLETE"] = "execute-complete";
  ActionType["SAVE_REPORT"] = "save-report";
  ActionType["RETRY"] = "retry";
  ActionType["FAIL_REPORT"] = "fail-report";
  ActionType["EXECUTE_ERROR"] = "execute-error";
})(ActionType || (exports.ActionType = ActionType = {}));