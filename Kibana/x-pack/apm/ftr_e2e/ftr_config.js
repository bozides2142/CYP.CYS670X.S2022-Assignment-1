"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packageRegistryPort = exports.default = void 0;

var _devUtils = require("@kbn/dev-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Used to spin up a docker container with package registry service that will be used by fleet


const packageRegistryPort = 1234;
exports.packageRegistryPort = packageRegistryPort;

async function config({
  readConfigFile
}) {
  const kibanaCommonTestsConfig = await readConfigFile(require.resolve('../../../../test/common/config.js'));
  const xpackFunctionalTestsConfig = await readConfigFile(require.resolve('../../../test/functional/config.js'));
  return { ...kibanaCommonTestsConfig.getAll(),
    esTestCluster: { ...xpackFunctionalTestsConfig.get('esTestCluster'),
      serverArgs: [...xpackFunctionalTestsConfig.get('esTestCluster.serverArgs'), // define custom es server here
      // API Keys is enabled at the top level
      'xpack.security.enabled=true']
    },
    kbnTestServer: { ...xpackFunctionalTestsConfig.get('kbnTestServer'),
      serverArgs: [...xpackFunctionalTestsConfig.get('kbnTestServer.serverArgs'), '--home.disableWelcomeScreen=true', '--csp.strict=false', '--csp.warnLegacyBrowsers=false', // define custom kibana server args here
      `--elasticsearch.ssl.certificateAuthorities=${_devUtils.CA_CERT_PATH}`, // Fleet config
      `--xpack.fleet.packages.0.name=endpoint`, `--xpack.fleet.packages.0.version=latest`, `--xpack.fleet.registryUrl=http://localhost:${packageRegistryPort}`]
    }
  };
} // eslint-disable-next-line import/no-default-export


var _default = config;
exports.default = _default;