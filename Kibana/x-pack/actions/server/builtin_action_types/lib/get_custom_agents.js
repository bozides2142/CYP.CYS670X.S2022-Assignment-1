"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomAgents = getCustomAgents;

var _https = require("https");

var _httpProxyAgent = _interopRequireDefault(require("http-proxy-agent"));

var _httpsProxyAgent = require("https-proxy-agent");

var _get_node_ssl_options = require("./get_node_ssl_options");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getCustomAgents(configurationUtilities, logger, url) {
  const generalSSLSettings = configurationUtilities.getSSLSettings();
  const agentSSLOptions = (0, _get_node_ssl_options.getNodeSSLOptions)(logger, generalSSLSettings.verificationMode); // the default for rejectUnauthorized is the global setting, which can
  // be overridden (below) with a custom host setting

  const defaultAgents = {
    httpAgent: undefined,
    httpsAgent: new _https.Agent({ ...agentSSLOptions
    })
  }; // Get the current proxy settings, and custom host settings for this URL.
  // If there are neither of these, return the default agents

  const proxySettings = configurationUtilities.getProxySettings();
  const customHostSettings = configurationUtilities.getCustomHostSettings(url);

  if (!proxySettings && !customHostSettings) {
    return defaultAgents;
  } // update the defaultAgents.httpsAgent if configured


  const sslSettings = customHostSettings === null || customHostSettings === void 0 ? void 0 : customHostSettings.ssl;
  let agentOptions;

  if (sslSettings) {
    logger.debug(`Creating customized connection settings for: ${url}`);
    agentOptions = defaultAgents.httpsAgent.options;

    if (sslSettings.certificateAuthoritiesData) {
      agentOptions.ca = sslSettings.certificateAuthoritiesData;
    }

    const sslSettingsFromConfig = (0, _get_node_ssl_options.getSSLSettingsFromConfig)(sslSettings.verificationMode, sslSettings.rejectUnauthorized); // see: src/core/server/elasticsearch/legacy/elasticsearch_client_config.ts
    // This is where the global rejectUnauthorized is overridden by a custom host

    const customHostNodeSSLOptions = (0, _get_node_ssl_options.getNodeSSLOptions)(logger, sslSettingsFromConfig.verificationMode);

    if (customHostNodeSSLOptions.rejectUnauthorized !== undefined) {
      agentOptions.rejectUnauthorized = customHostNodeSSLOptions.rejectUnauthorized;
    }
  } // if there weren't any proxy settings, return the currently calculated agents


  if (!proxySettings) {
    return defaultAgents;
  } // there is a proxy in use, but it's possible we won't use it via custom host
  // proxyOnlyHosts and proxyBypassHosts


  let targetUrl;

  try {
    targetUrl = new URL(url);
  } catch (err) {
    logger.warn(`error determining proxy state for invalid url "${url}", using default agents`);
    return defaultAgents;
  } // filter out hostnames in the proxy bypass or only lists


  const {
    hostname
  } = targetUrl;

  if (proxySettings.proxyBypassHosts) {
    if (proxySettings.proxyBypassHosts.has(hostname)) {
      return defaultAgents;
    }
  }

  if (proxySettings.proxyOnlyHosts) {
    if (!proxySettings.proxyOnlyHosts.has(hostname)) {
      return defaultAgents;
    }
  }

  logger.debug(`Creating proxy agents for proxy: ${proxySettings.proxyUrl}`);
  let proxyUrl;

  try {
    proxyUrl = new URL(proxySettings.proxyUrl);
  } catch (err) {
    logger.warn(`invalid proxy URL "${proxySettings.proxyUrl}" ignored`);
    return defaultAgents;
  }

  const proxyNodeSSLOptions = (0, _get_node_ssl_options.getNodeSSLOptions)(logger, proxySettings.proxySSLSettings.verificationMode); // At this point, we are going to use a proxy, so we need new agents.
  // We will though, copy over the calculated ssl options from above, into
  // the https agent.

  const httpAgent = new _httpProxyAgent.default(proxySettings.proxyUrl);
  const httpsAgent = new _httpsProxyAgent.HttpsProxyAgent({
    host: proxyUrl.hostname,
    port: Number(proxyUrl.port),
    protocol: proxyUrl.protocol,
    headers: proxySettings.proxyHeaders,
    // do not fail on invalid certs if value is false
    ...proxyNodeSSLOptions
  }); // vsCode wasn't convinced HttpsProxyAgent is an https.Agent, so we convinced it

  if (agentOptions) {
    httpsAgent.options = { ...httpsAgent.options,
      ...agentOptions
    };
  }

  return {
    httpAgent,
    httpsAgent
  };
}