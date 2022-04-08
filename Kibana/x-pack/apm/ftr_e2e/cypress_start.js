"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cypressStart = cypressStart;

var _yargs = require("yargs");

var _url = _interopRequireDefault(require("url"));

var _create_apm_users_and_roles = require("../scripts/create_apm_users_and_roles/create_apm_users_and_roles");

var _es_archiver = require("./cypress/tasks/es_archiver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */


async function cypressStart(getService, cypressExecution) {
  const config = getService('config');

  const kibanaUrl = _url.default.format({
    protocol: config.get('servers.kibana.protocol'),
    hostname: config.get('servers.kibana.hostname'),
    port: config.get('servers.kibana.port')
  }); // Creates APM users


  await (0, _create_apm_users_and_roles.createApmAndObsUsersAndRoles)({
    elasticsearch: {
      username: config.get('servers.elasticsearch.username'),
      password: config.get('servers.elasticsearch.password')
    },
    kibana: {
      hostname: kibanaUrl,
      roleSuffix: 'e2e_tests'
    }
  });

  const esNode = _url.default.format({
    protocol: config.get('servers.elasticsearch.protocol'),
    port: config.get('servers.elasticsearch.port'),
    hostname: config.get('servers.elasticsearch.hostname'),
    auth: `${config.get('servers.elasticsearch.username')}:${config.get('servers.elasticsearch.password')}`
  });

  const esRequestTimeout = config.get('timeouts.esRequestTimeout');
  const archiveName = 'apm_mappings_only_8.0.0';
  console.log(`Creating APM mappings`);
  await (0, _es_archiver.esArchiverLoad)(archiveName);
  const spec = _yargs.argv.grep;
  const res = await cypressExecution({ ...(spec ? {
      spec
    } : {}),
    config: {
      baseUrl: kibanaUrl
    },
    env: {
      KIBANA_URL: kibanaUrl,
      ES_NODE: esNode,
      ES_REQUEST_TIMEOUT: esRequestTimeout,
      TEST_CLOUD: process.env.TEST_CLOUD
    }
  });
  console.log('Removing APM mappings');
  await (0, _es_archiver.esArchiverUnload)(archiveName);
  return res;
}