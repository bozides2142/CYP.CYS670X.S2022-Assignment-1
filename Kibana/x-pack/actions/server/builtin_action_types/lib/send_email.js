"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSON_TRANSPORT_SERVICE = exports.GRAPH_API_OAUTH_SCOPE = exports.EXCHANGE_ONLINE_SERVER_HOST = void 0;
exports.sendEmail = sendEmail;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _markdownIt = _interopRequireDefault(require("markdown-it"));

var _get_node_ssl_options = require("./get_node_ssl_options");

var _send_email_graph_api = require("./send_email_graph_api");

var _request_oauth_client_credentials_token = require("./request_oauth_client_credentials_token");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// info on nodemailer: https://nodemailer.com/about/
// an email "service" which doesn't actually send, just returns what it would send


const JSON_TRANSPORT_SERVICE = '__json'; // The value is the resource identifier (Application ID URI) of the resource you want, affixed with the .default suffix. For Microsoft Graph, the value is https://graph.microsoft.com/.default. This value informs the Microsoft identity platform endpoint that of all the application permissions you have configured for your app in the app registration portal, it should issue a token for the ones associated with the resource you want to use.

exports.JSON_TRANSPORT_SERVICE = JSON_TRANSPORT_SERVICE;
const GRAPH_API_OAUTH_SCOPE = 'https://graph.microsoft.com/.default';
exports.GRAPH_API_OAUTH_SCOPE = GRAPH_API_OAUTH_SCOPE;
const EXCHANGE_ONLINE_SERVER_HOST = 'https://login.microsoftonline.com';
exports.EXCHANGE_ONLINE_SERVER_HOST = EXCHANGE_ONLINE_SERVER_HOST;

async function sendEmail(logger, options, connectorTokenClient) {
  const {
    transport,
    content
  } = options;
  const {
    message
  } = content;
  const messageHTML = htmlFromMarkdown(logger, message);

  if (transport.service === _common.AdditionalEmailServices.EXCHANGE) {
    return await sendEmailWithExchange(logger, options, messageHTML, connectorTokenClient);
  } else {
    return await sendEmailWithNodemailer(logger, options, messageHTML);
  }
} // send an email using MS Exchange Graph API


async function sendEmailWithExchange(logger, options, messageHTML, connectorTokenClient) {
  const {
    transport,
    configurationUtilities,
    connectorId
  } = options;
  const {
    clientId,
    clientSecret,
    tenantId,
    oauthTokenUrl
  } = transport;
  let accessToken;
  const {
    connectorToken,
    hasErrors
  } = await connectorTokenClient.get({
    connectorId
  });

  if (connectorToken === null || Date.parse(connectorToken.expiresAt) <= Date.now()) {
    // request new access token for microsoft exchange online server with Graph API scope
    const tokenResult = await (0, _request_oauth_client_credentials_token.requestOAuthClientCredentialsToken)(oauthTokenUrl !== null && oauthTokenUrl !== void 0 ? oauthTokenUrl : `${EXCHANGE_ONLINE_SERVER_HOST}/${tenantId}/oauth2/v2.0/token`, logger, {
      scope: GRAPH_API_OAUTH_SCOPE,
      clientId,
      clientSecret
    }, configurationUtilities);
    accessToken = `${tokenResult.tokenType} ${tokenResult.accessToken}`; // try to update connector_token SO

    try {
      if (connectorToken === null) {
        if (hasErrors) {
          // delete existing access tokens
          await connectorTokenClient.deleteConnectorTokens({
            connectorId,
            tokenType: 'access_token'
          });
        }

        await connectorTokenClient.create({
          connectorId,
          token: accessToken,
          // convert MS Exchange expiresIn from seconds to milliseconds
          expiresAtMillis: new Date(Date.now() + tokenResult.expiresIn * 1000).toISOString(),
          tokenType: 'access_token'
        });
      } else {
        await connectorTokenClient.update({
          id: connectorToken.id.toString(),
          token: accessToken,
          // convert MS Exchange expiresIn from seconds to milliseconds
          expiresAtMillis: new Date(Date.now() + tokenResult.expiresIn * 1000).toISOString(),
          tokenType: 'access_token'
        });
      }
    } catch (err) {
      logger.warn(`Not able to update connector token for connectorId: ${connectorId} due to error: ${err.message}`);
    }
  } else {
    // use existing valid token
    accessToken = connectorToken.token;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  return await (0, _send_email_graph_api.sendEmailGraphApi)({
    options,
    headers,
    messageHTML,
    graphApiUrl: configurationUtilities.getMicrosoftGraphApiUrl()
  }, logger, configurationUtilities);
} // send an email using nodemailer


async function sendEmailWithNodemailer(logger, options, messageHTML) {
  const {
    transport,
    routing,
    content,
    configurationUtilities,
    hasAuth
  } = options;
  const {
    service
  } = transport;
  const {
    from,
    to,
    cc,
    bcc
  } = routing;
  const {
    subject,
    message
  } = content;
  const email = {
    // email routing
    from,
    to,
    cc,
    bcc,
    // email content
    subject,
    html: messageHTML,
    text: message
  }; // The transport options do not seem to be exposed as a type, and we reference
  // some deep properties, so need to use any here.

  const transportConfig = getTransportConfig(configurationUtilities, logger, transport, hasAuth);

  const nodemailerTransport = _nodemailer.default.createTransport(transportConfig);

  const result = await nodemailerTransport.sendMail(email);

  if (service === JSON_TRANSPORT_SERVICE) {
    try {
      result.message = JSON.parse(result.message);
    } catch (err) {// try parsing the message for ease of debugging, on error, ignore
    }
  }

  return result;
} // try rendering markdown to html, return markdown on any kind of error


function htmlFromMarkdown(logger, markdown) {
  try {
    const md = (0, _markdownIt.default)({
      linkify: true
    });
    return md.render(markdown);
  } catch (err) {
    logger.debug(`error rendering markdown to html: ${err.message}`);
    return markdown;
  }
}

function getTransportConfig(configurationUtilities, logger, transport, hasAuth) {
  const {
    service,
    host,
    port,
    secure,
    user,
    password
  } = transport; // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const transportConfig = {};
  const proxySettings = configurationUtilities.getProxySettings();
  const generalSSLSettings = configurationUtilities.getSSLSettings();

  if (hasAuth && user != null && password != null) {
    transportConfig.auth = {
      user,
      pass: password
    };
  }

  const useProxy = getUseProxy(host, proxySettings);
  let customHostSettings;

  if (service === JSON_TRANSPORT_SERVICE) {
    transportConfig.jsonTransport = true;
    delete transportConfig.auth;
  } else if (service != null && service !== _common.AdditionalEmailServices.OTHER) {
    transportConfig.service = service;
  } else {
    transportConfig.host = host;
    transportConfig.port = port;
    transportConfig.secure = !!secure;
    customHostSettings = configurationUtilities.getCustomHostSettings(`smtp://${host}:${port}`);

    if (proxySettings && useProxy) {
      transportConfig.tls = (0, _get_node_ssl_options.getNodeSSLOptions)(logger, proxySettings === null || proxySettings === void 0 ? void 0 : proxySettings.proxySSLSettings.verificationMode);
      transportConfig.proxy = proxySettings.proxyUrl;
      transportConfig.headers = proxySettings.proxyHeaders;
    } else if (!transportConfig.secure && user == null && password == null) {
      // special case - if secure:false && user:null && password:null set
      // rejectUnauthorized false, because simple/test servers that don't even
      // authenticate rarely have valid certs; eg cloud proxy, and npm maildev
      transportConfig.tls = {
        rejectUnauthorized: false
      };
    } else {
      transportConfig.tls = (0, _get_node_ssl_options.getNodeSSLOptions)(logger, generalSSLSettings.verificationMode);
    } // finally, allow customHostSettings to override some of the settings
    // see: https://nodemailer.com/smtp/


    if (customHostSettings) {
      const tlsConfig = {};
      const sslSettings = customHostSettings.ssl;
      const smtpSettings = customHostSettings.smtp;

      if (sslSettings !== null && sslSettings !== void 0 && sslSettings.certificateAuthoritiesData) {
        tlsConfig.ca = sslSettings === null || sslSettings === void 0 ? void 0 : sslSettings.certificateAuthoritiesData;
      }

      const sslSettingsFromConfig = (0, _get_node_ssl_options.getSSLSettingsFromConfig)(sslSettings === null || sslSettings === void 0 ? void 0 : sslSettings.verificationMode, sslSettings === null || sslSettings === void 0 ? void 0 : sslSettings.rejectUnauthorized);
      const nodeTLSOptions = (0, _get_node_ssl_options.getNodeSSLOptions)(logger, sslSettingsFromConfig.verificationMode);

      if (!transportConfig.tls) {
        transportConfig.tls = { ...tlsConfig,
          ...nodeTLSOptions
        };
      } else {
        transportConfig.tls = { ...transportConfig.tls,
          ...tlsConfig,
          ...nodeTLSOptions
        };
      }

      if (smtpSettings !== null && smtpSettings !== void 0 && smtpSettings.ignoreTLS) {
        transportConfig.ignoreTLS = true;
      } else if (smtpSettings !== null && smtpSettings !== void 0 && smtpSettings.requireTLS) {
        transportConfig.requireTLS = true;
      }
    }
  }

  return transportConfig;
}

function getUseProxy(host, proxySettings) {
  if (host) {
    var _proxySettings$proxyB, _proxySettings$proxyO;

    if (proxySettings !== null && proxySettings !== void 0 && proxySettings.proxyBypassHosts && proxySettings !== null && proxySettings !== void 0 && (_proxySettings$proxyB = proxySettings.proxyBypassHosts) !== null && _proxySettings$proxyB !== void 0 && _proxySettings$proxyB.has(host)) {
      return false;
    }

    if (proxySettings !== null && proxySettings !== void 0 && proxySettings.proxyOnlyHosts && !(proxySettings !== null && proxySettings !== void 0 && (_proxySettings$proxyO = proxySettings.proxyOnlyHosts) !== null && _proxySettings$proxyO !== void 0 && _proxySettings$proxyO.has(host))) {
      return false;
    }
  }

  return !!proxySettings;
}