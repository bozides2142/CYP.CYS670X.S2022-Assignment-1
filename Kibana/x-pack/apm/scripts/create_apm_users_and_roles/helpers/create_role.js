"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRole = createRole;

var _call_kibana = require("./call_kibana");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */


async function createRole({
  elasticsearch,
  kibana,
  roleName,
  role
}) {
  const roleFound = await getRole({
    elasticsearch,
    kibana,
    roleName
  });

  if (roleFound) {
    console.log(`Skipping: Role "${roleName}" already exists`);
    return Promise.resolve();
  }

  await (0, _call_kibana.callKibana)({
    elasticsearch,
    kibana,
    options: {
      method: 'PUT',
      url: `/api/security/role/${roleName}`,
      data: {
        metadata: {
          version: 1
        },
        ...role
      }
    }
  });
  console.log(`Created role "${roleName}"`);
}

async function getRole({
  elasticsearch,
  kibana,
  roleName
}) {
  try {
    return await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        method: 'GET',
        url: `/api/security/role/${roleName}`
      }
    });
  } catch (e) {
    var _e$response; // return empty if role doesn't exist


    if ((0, _call_kibana.isAxiosError)(e) && ((_e$response = e.response) === null || _e$response === void 0 ? void 0 : _e$response.status) === 404) {
      return null;
    }

    throw e;
  }
}