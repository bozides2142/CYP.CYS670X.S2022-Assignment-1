"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateUser = createOrUpdateUser;

var _lodash = require("lodash");

var _call_kibana = require("./call_kibana");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */


async function createOrUpdateUser({
  elasticsearch,
  kibana,
  user
}) {
  const existingUser = await getUser({
    elasticsearch,
    kibana,
    username: user.username
  });

  if (!existingUser) {
    return createUser({
      elasticsearch,
      kibana,
      newUser: user
    });
  }

  return updateUser({
    elasticsearch,
    kibana,
    existingUser,
    newUser: user
  });
}

async function createUser({
  elasticsearch,
  kibana,
  newUser
}) {
  const user = await (0, _call_kibana.callKibana)({
    elasticsearch,
    kibana,
    options: {
      method: 'POST',
      url: `/internal/security/users/${newUser.username}`,
      data: { ...newUser,
        enabled: true,
        password: elasticsearch.password
      }
    }
  });
  console.log(`User "${newUser.username}" was created`);
  return user;
}

async function updateUser({
  elasticsearch,
  kibana,
  existingUser,
  newUser
}) {
  const {
    username
  } = newUser;
  const allRoles = (0, _lodash.union)(existingUser.roles, newUser.roles);
  const hasAllRoles = (0, _lodash.difference)(allRoles, existingUser.roles).length === 0;

  if (hasAllRoles) {
    console.log(`Skipping: User "${username}" already has neccesarry roles: "${newUser.roles}"`);
    return;
  } // assign role to user


  await (0, _call_kibana.callKibana)({
    elasticsearch,
    kibana,
    options: {
      method: 'POST',
      url: `/internal/security/users/${username}`,
      data: { ...existingUser,
        roles: allRoles
      }
    }
  });
  console.log(`User "${username}" was updated`);
}

async function getUser({
  elasticsearch,
  kibana,
  username
}) {
  try {
    return await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        url: `/internal/security/users/${username}`
      }
    });
  } catch (e) {
    var _e$response; // return empty if user doesn't exist


    if ((0, _call_kibana.isAxiosError)(e) && ((_e$response = e.response) === null || _e$response === void 0 ? void 0 : _e$response.status) === 404) {
      return null;
    }

    throw e;
  }
}