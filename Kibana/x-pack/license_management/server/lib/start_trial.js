"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canStartTrial = canStartTrial;
exports.startTrial = startTrial;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function canStartTrial(client) {
  try {
    const {
      body: response
    } = await client.asCurrentUser.license.getTrialStatus();
    return response.eligible_to_start_trial;
  } catch (error) {
    return error.body;
  }
}

async function startTrial({
  client,
  licensing
}) {
  try {
    const {
      body: response
    } = await client.asCurrentUser.license.postStartTrial({
      acknowledge: true
    });
    const {
      trial_was_started: trialWasStarted
    } = response;

    if (trialWasStarted) {
      await licensing.refresh();
    }

    return response;
  } catch (error) {
    return error.body;
  }
}