"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateEventType = exports.MAX_ERROR_SIZE = exports.FLEET_UPGRADES_CHANNEL_NAME = void 0;
exports.capErrorSize = capErrorSize;
exports.sendTelemetryEvents = sendTelemetryEvents;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let UpdateEventType;
exports.UpdateEventType = UpdateEventType;

(function (UpdateEventType) {
  UpdateEventType["PACKAGE_POLICY_UPGRADE"] = "package-policy-upgrade";
  UpdateEventType["PACKAGE_INSTALL"] = "package-install";
})(UpdateEventType || (exports.UpdateEventType = UpdateEventType = {}));

const MAX_ERROR_SIZE = 100;
exports.MAX_ERROR_SIZE = MAX_ERROR_SIZE;
const FLEET_UPGRADES_CHANNEL_NAME = 'fleet-upgrades';
exports.FLEET_UPGRADES_CHANNEL_NAME = FLEET_UPGRADES_CHANNEL_NAME;

function sendTelemetryEvents(logger, eventsTelemetry, upgradeEvent) {
  if (eventsTelemetry === undefined) {
    return;
  }

  try {
    const cappedErrors = capErrorSize(upgradeEvent.error || [], MAX_ERROR_SIZE);
    eventsTelemetry.queueTelemetryEvents(FLEET_UPGRADES_CHANNEL_NAME, [{ ...upgradeEvent,
      error: upgradeEvent.error ? cappedErrors : undefined,
      errorMessage: upgradeEvent.errorMessage || makeErrorGeneric(cappedErrors)
    }]);
  } catch (exc) {
    logger.error(`queing telemetry events failed ${exc}`);
  }
}

function capErrorSize(errors, maxSize) {
  return errors.length > maxSize ? errors === null || errors === void 0 ? void 0 : errors.slice(0, maxSize) : errors;
}

function makeErrorGeneric(errors) {
  return errors.map(error => {
    if (Array.isArray(error.message)) {
      const firstMessage = error.message[0];
      return (firstMessage === null || firstMessage === void 0 ? void 0 : firstMessage.indexOf('is required')) > -1 ? 'Field is required' : firstMessage;
    }

    return error.message;
  });
}