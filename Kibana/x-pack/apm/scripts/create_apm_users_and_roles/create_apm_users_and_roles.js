"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmAndObsUsersAndRoles = createApmAndObsUsersAndRoles;

var _call_kibana = require("./helpers/call_kibana");

var _create_role = require("./helpers/create_role");

var _power_user_role = require("./roles/power_user_role");

var _read_only_user_role = require("./roles/read_only_user_role");

var _create_or_update_user = require("./helpers/create_or_update_user");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createApmAndObsUsersAndRoles({
  kibana,
  elasticsearch
}) {
  const isCredentialsValid = await getIsCredentialsValid({
    elasticsearch,
    kibana
  });

  if (!isCredentialsValid) {
    throw new _call_kibana.AbortError('Invalid username/password');
  }

  const isSecurityEnabled = await getIsSecurityEnabled({
    elasticsearch,
    kibana
  });

  if (!isSecurityEnabled) {
    throw new _call_kibana.AbortError('Security must be enabled!');
  }

  const KIBANA_READ_ROLE = `kibana_read_${kibana.roleSuffix}`;
  const KIBANA_POWER_ROLE = `kibana_power_${kibana.roleSuffix}`; // roles definition

  const roles = [{
    roleName: KIBANA_READ_ROLE,
    role: _read_only_user_role.readOnlyUserRole
  }, {
    roleName: KIBANA_POWER_ROLE,
    role: _power_user_role.powerUserRole
  }]; // create roles

  await Promise.all(roles.map(async role => (0, _create_role.createRole)({
    elasticsearch,
    kibana,
    ...role
  }))); // user definitions

  const users = [{
    username: 'apm_read_user',
    roles: [KIBANA_READ_ROLE]
  }, {
    username: 'apm_power_user',
    roles: [KIBANA_POWER_ROLE]
  }, {
    username: 'obs_read_user',
    roles: [KIBANA_READ_ROLE]
  }, {
    username: 'obs_admin_user',
    roles: [KIBANA_POWER_ROLE]
  }]; // create users

  await Promise.all(users.map(async user => (0, _create_or_update_user.createOrUpdateUser)({
    elasticsearch,
    kibana,
    user
  })));
  return users;
}

async function getIsSecurityEnabled({
  elasticsearch,
  kibana
}) {
  try {
    await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        url: `/internal/security/me`
      }
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function getIsCredentialsValid({
  elasticsearch,
  kibana
}) {
  try {
    await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        validateStatus: status => status >= 200 && status < 400,
        url: `/`
      }
    });
    return true;
  } catch (err) {
    return false;
  }
}