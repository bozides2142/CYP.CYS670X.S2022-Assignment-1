"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_ACTION_OLD_PUSH_ID_REF_NAME = exports.USER_ACTION_OLD_ID_REF_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The name of the saved object reference indicating the action connector ID that was used for
 * adding a connector, or updating the existing connector for a user action's old_value field.
 */

const USER_ACTION_OLD_ID_REF_NAME = 'oldConnectorId';
/**
 * The name of the saved object reference indicating the action connector ID that was used for pushing a case,
 * for a user action's old_value field.
 */

exports.USER_ACTION_OLD_ID_REF_NAME = USER_ACTION_OLD_ID_REF_NAME;
const USER_ACTION_OLD_PUSH_ID_REF_NAME = 'oldPushConnectorId';
exports.USER_ACTION_OLD_PUSH_ID_REF_NAME = USER_ACTION_OLD_PUSH_ID_REF_NAME;