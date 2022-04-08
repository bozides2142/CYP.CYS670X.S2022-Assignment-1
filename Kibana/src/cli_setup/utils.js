"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeEnrollmentToken = decodeEnrollmentToken;
exports.elasticsearch = void 0;
exports.getCommand = getCommand;
exports.kibanaConfigWriter = void 0;
exports.promptToken = promptToken;

var _utils = require("@kbn/utils");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _moment = require("moment");

var _lodash = require("lodash");

var _client = require("../core/server/elasticsearch/client");

var _elasticsearch = require("../core/server/elasticsearch");

var _elasticsearch_service = require("../plugins/interactive_setup/server/elasticsearch_service");

var _kibana_config_writer = require("../plugins/interactive_setup/server/kibana_config_writer");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const noop = () => {};

const logger = {
  debug: noop,
  error: noop,
  warn: noop,
  trace: noop,
  info: noop,
  fatal: noop,
  log: noop,
  get: () => logger
};
const kibanaConfigWriter = new _kibana_config_writer.KibanaConfigWriter((0, _utils.getConfigPath)(), (0, _utils.getDataPath)(), logger);
exports.kibanaConfigWriter = kibanaConfigWriter;
const elasticsearch = new _elasticsearch_service.ElasticsearchService(logger, _utils.kibanaPackageJson.version).setup({
  connectionCheckInterval: (0, _moment.duration)(Infinity),
  elasticsearch: {
    createClient: (type, config) => {
      const defaults = _elasticsearch.configSchema.validate({});

      return new _client.ClusterClient({
        config: (0, _lodash.merge)(defaults, {
          hosts: Array.isArray(defaults.hosts) ? defaults.hosts : [defaults.hosts]
        }, config),
        logger,
        type
      });
    }
  }
});
exports.elasticsearch = elasticsearch;

async function promptToken() {
  const answers = await _inquirer.default.prompt({
    type: 'input',
    name: 'token',
    message: 'Enter enrollment token:',
    validate: (value = '') => decodeEnrollmentToken(value) ? true : 'Invalid enrollment token'
  });
  return answers.token;
}

function decodeEnrollmentToken(enrollmentToken) {
  try {
    const json = JSON.parse(atob(enrollmentToken));

    if (!Array.isArray(json.adr) || json.adr.some(adr => typeof adr !== 'string') || typeof json.fgr !== 'string' || typeof json.key !== 'string' || typeof json.ver !== 'string') {
      return;
    }

    return { ...json,
      adr: json.adr.map(adr => `https://${adr}`),
      key: btoa(json.key)
    };
  } catch (error) {} // eslint-disable-line no-empty

}

function btoa(str) {
  return Buffer.from(str, 'binary').toString('base64');
}

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

function getCommand(command, args) {
  const isWindows = process.platform === 'win32';
  return `${isWindows ? `bin\\${command}.bat` : `bin/${command}`}${args ? ` ${args}` : ''}`;
}