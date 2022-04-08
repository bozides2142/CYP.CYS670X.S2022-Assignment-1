"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lifespan = void 0;
exports.getStatusInfo = getStatusInfo;

var _api = require("../../../common/api");

var _authorization = require("../../authorization");

var _error = require("../../common/error");

var _base_handler = require("./base_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Lifespan extends _base_handler.BaseHandler {
  constructor(options) {
    super(options, ['lifespan']);
  }

  async compute() {
    const {
      unsecuredSavedObjectsClient,
      authorization,
      userActionService,
      logger
    } = this.options.clientArgs;
    const {
      caseId,
      casesClient
    } = this.options;

    try {
      const caseInfo = await casesClient.cases.get({
        id: caseId
      });
      const caseOpenTimestamp = new Date(caseInfo.created_at);

      if (!isDateValid(caseOpenTimestamp)) {
        throw new Error(`The case created_at value is not a valid timestamp: ${caseInfo.created_at}`);
      }

      const {
        filter: authorizationFilter
      } = await authorization.getAuthorizationFilter(_authorization.Operations.getUserActionMetrics);
      const statusUserActions = await userActionService.findStatusChanges({
        unsecuredSavedObjectsClient,
        caseId,
        filter: authorizationFilter
      });
      const statusInfo = getStatusInfo(statusUserActions, caseOpenTimestamp);
      return {
        lifespan: {
          creationDate: caseInfo.created_at,
          closeDate: caseInfo.closed_at,
          statusInfo
        }
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve lifespan metrics for case id: ${caseId}: ${error}`,
        error,
        logger
      });
    }
  }

}

exports.Lifespan = Lifespan;

function isDateValid(date) {
  return date.toString() !== 'Invalid Date' && !isNaN(date.getTime());
}

function getStatusInfo(statusUserActions, caseOpenTimestamp) {
  var _accumulatedDurations, _accumulatedDurations2;

  const accStatusInfo = statusUserActions.reduce((acc, userAction) => {
    const newStatusChangeTimestamp = new Date(userAction.attributes.created_at);

    if (!isValidStatusChangeUserAction(userAction.attributes, newStatusChangeTimestamp)) {
      return acc;
    }

    const {
      durations,
      lastStatus,
      lastStatusChangeTimestamp,
      reopenDates
    } = acc;
    const attributes = userAction.attributes;
    const newStatus = attributes.payload.status;
    return {
      durations: updateStatusDuration({
        durations,
        status: lastStatus,
        additionalDuration: datesDiff(newStatusChangeTimestamp, lastStatusChangeTimestamp)
      }),
      lastStatus: newStatus,
      lastStatusChangeTimestamp: newStatusChangeTimestamp,
      reopenDates: isReopen(newStatus, lastStatus) ? [...reopenDates, newStatusChangeTimestamp.toISOString()] : reopenDates
    };
  }, {
    durations: new Map([[_api.CaseStatuses.open, 0], [_api.CaseStatuses['in-progress'], 0]]),
    reopenDates: [],
    lastStatus: _api.CaseStatuses.open,
    lastStatusChangeTimestamp: caseOpenTimestamp
  }); // add in the duration from the current time to the duration of the last known status of the case

  const accumulatedDurations = updateStatusDuration({
    durations: accStatusInfo.durations,
    status: accStatusInfo.lastStatus,
    additionalDuration: datesDiff(new Date(), accStatusInfo.lastStatusChangeTimestamp)
  });
  return {
    openDuration: (_accumulatedDurations = accumulatedDurations.get(_api.CaseStatuses.open)) !== null && _accumulatedDurations !== void 0 ? _accumulatedDurations : 0,
    inProgressDuration: (_accumulatedDurations2 = accumulatedDurations.get(_api.CaseStatuses['in-progress'])) !== null && _accumulatedDurations2 !== void 0 ? _accumulatedDurations2 : 0,
    reopenDates: accStatusInfo.reopenDates
  };
}

function isValidStatusChangeUserAction(attributes, newStatusChangeTimestamp) {
  return _api.StatusUserActionRt.is(attributes) && isDateValid(newStatusChangeTimestamp);
}

function isReopen(newStatus, lastStatus) {
  // if the new status is going from close to anything other than closed then we are reopening the issue
  return newStatus !== _api.CaseStatuses.closed && lastStatus === _api.CaseStatuses.closed;
}

function datesDiff(date1, date2) {
  if (!isDateValid(date1) || !isDateValid(date2)) {
    throw new Error(`Supplied dates were invalid date1: ${date1} date2: ${date2}`);
  }

  return Math.abs(date1.getTime() - date2.getTime());
}

function updateStatusDuration({
  durations,
  status,
  additionalDuration
}) {
  const duration = durations.get(status);

  if (duration === undefined) {
    return durations;
  }

  const updatedDurations = new Map(durations.entries());
  updatedDurations.set(status, duration + additionalDuration);
  return updatedDurations;
}