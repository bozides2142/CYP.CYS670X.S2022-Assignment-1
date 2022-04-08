"use strict";

var _yargs = require("yargs");

var _call_kibana = require("./helpers/call_kibana");

var _create_apm_users_and_roles = require("./create_apm_users_and_roles");

var _get_version = require("./helpers/get_version");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */


async function init() {
  const esUserName = _yargs.argv.username || 'elastic';
  const esPassword = _yargs.argv.password;
  const kibanaBaseUrl = _yargs.argv.kibanaUrl;
  const kibanaRoleSuffix = _yargs.argv.roleSuffix;

  if (!esPassword) {
    console.error('Please specify credentials for elasticsearch: `--username elastic --password abcd` ');
    process.exit();
  }

  if (!kibanaBaseUrl) {
    console.error('Please specify the url for Kibana: `--kibana-url http://localhost:5601` ');
    process.exit();
  }

  if (!kibanaBaseUrl.startsWith('https://') && !kibanaBaseUrl.startsWith('http://')) {
    console.error('Kibana url must be prefixed with http(s):// `--kibana-url http://localhost:5601`');
    process.exit();
  }

  if (!kibanaRoleSuffix) {
    console.error('Please specify a unique suffix that will be added to your roles with `--role-suffix <suffix>` ');
    process.exit();
  }

  const kibana = {
    roleSuffix: kibanaRoleSuffix,
    hostname: kibanaBaseUrl
  };
  const elasticsearch = {
    username: esUserName,
    password: esPassword
  };
  console.log({
    kibana,
    elasticsearch
  });
  const version = await (0, _get_version.getKibanaVersion)({
    elasticsearch,
    kibana
  });
  console.log(`Connected to Kibana ${version}`);
  const users = await (0, _create_apm_users_and_roles.createApmAndObsUsersAndRoles)({
    elasticsearch,
    kibana
  });
  const credentials = users.map(u => ` - ${u.username} / ${esPassword}`).join('\n');
  console.log(`\nYou can now login to ${kibana.hostname} with:\n${credentials}`);
}

init().catch(e => {
  if (e instanceof _call_kibana.AbortError) {
    console.error(e.message);
  } else if ((0, _call_kibana.isAxiosError)(e)) {
    var _e$config$method, _e$response;

    console.error(`${((_e$config$method = e.config.method) === null || _e$config$method === void 0 ? void 0 : _e$config$method.toUpperCase()) || 'GET'} ${e.config.url} (Code: ${(_e$response = e.response) === null || _e$response === void 0 ? void 0 : _e$response.status})`);

    if (e.response) {
      console.error(JSON.stringify({
        request: e.config,
        response: e.response.data
      }, null, 2));
    }
  } else {
    console.error(e);
  }
});