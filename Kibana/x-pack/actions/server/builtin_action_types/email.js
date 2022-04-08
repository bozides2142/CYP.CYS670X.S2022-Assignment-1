"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ELASTIC_CLOUD_SERVICE = exports.CUSTOM_HOST_PORT_SERVICES = exports.ActionTypeId = void 0;
exports.getActionType = getActionType;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _wellKnown = _interopRequireDefault(require("nodemailer/lib/well-known"));

var _send_email = require("./lib/send_email");

var _schemas = require("./lib/schemas");

var _mustache_renderer = require("../lib/mustache_renderer");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// these values for `service` require users to fill in host/port/secure


const CUSTOM_HOST_PORT_SERVICES = [_common.AdditionalEmailServices.OTHER];
exports.CUSTOM_HOST_PORT_SERVICES = CUSTOM_HOST_PORT_SERVICES;
const ELASTIC_CLOUD_SERVICE = {
  host: 'dockerhost',
  port: 10025,
  secure: false
};
exports.ELASTIC_CLOUD_SERVICE = ELASTIC_CLOUD_SERVICE;
const EMAIL_FOOTER_DIVIDER = '\n\n--\n\n';
const ConfigSchemaProps = {
  service: _configSchema.schema.string({
    defaultValue: 'other'
  }),
  host: _configSchema.schema.nullable(_configSchema.schema.string()),
  port: _configSchema.schema.nullable((0, _schemas.portSchema)()),
  secure: _configSchema.schema.nullable(_configSchema.schema.boolean()),
  from: _configSchema.schema.string(),
  hasAuth: _configSchema.schema.boolean({
    defaultValue: true
  }),
  tenantId: _configSchema.schema.nullable(_configSchema.schema.string()),
  clientId: _configSchema.schema.nullable(_configSchema.schema.string()),
  oauthTokenUrl: _configSchema.schema.nullable(_configSchema.schema.string())
};

const ConfigSchema = _configSchema.schema.object(ConfigSchemaProps);

function validateConfig(configurationUtilities, configObject) {
  const config = configObject; // If service is set as JSON_TRANSPORT_SERVICE or EXCHANGE, host/port are ignored, when the email is sent.
  // Note, not currently making these message translated, as will be
  // emitted alongside messages from @kbn/config-schema, which does not
  // translate messages.

  if (config.service === _send_email.JSON_TRANSPORT_SERVICE) {
    return;
  } else if (config.service === _common.AdditionalEmailServices.EXCHANGE) {
    if (config.clientId == null && config.tenantId == null) {
      return '[clientId]/[tenantId] is required';
    }

    if (config.clientId == null) {
      return '[clientId] is required';
    }

    if (config.tenantId == null) {
      return '[tenantId] is required';
    }
  } else if (CUSTOM_HOST_PORT_SERVICES.indexOf(config.service) >= 0) {
    // If configured `service` requires custom host/port/secure settings, validate that they are set
    if (config.host == null && config.port == null) {
      return '[host]/[port] is required';
    }

    if (config.host == null) {
      return '[host] is required';
    }

    if (config.port == null) {
      return '[port] is required';
    }

    if (!configurationUtilities.isHostnameAllowed(config.host)) {
      return `[host] value '${config.host}' is not in the allowedHosts configuration`;
    }
  } else {
    // Check configured `service` against nodemailer list of well known services + any custom ones allowed by Kibana
    const host = getServiceNameHost(config.service);

    if (host == null) {
      return `[service] value '${config.service}' is not valid`;
    }

    if (!configurationUtilities.isHostnameAllowed(host)) {
      return `[service] value '${config.service}' resolves to host '${host}' which is not in the allowedHosts configuration`;
    }
  }
} // secrets definition


const SecretsSchemaProps = {
  user: _configSchema.schema.nullable(_configSchema.schema.string()),
  password: _configSchema.schema.nullable(_configSchema.schema.string()),
  clientSecret: _configSchema.schema.nullable(_configSchema.schema.string())
};

const SecretsSchema = _configSchema.schema.object(SecretsSchemaProps); // params definition


const ParamsSchema = _configSchema.schema.object({
  to: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  cc: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  bcc: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  subject: _configSchema.schema.string(),
  message: _configSchema.schema.string(),
  // kibanaFooterLink isn't inteded for users to set, this is here to be able to programatically
  // provide a more contextual URL in the footer (ex: URL to the alert details page)
  kibanaFooterLink: _configSchema.schema.object({
    path: _configSchema.schema.string({
      defaultValue: '/'
    }),
    text: _configSchema.schema.string({
      defaultValue: _i18n.i18n.translate('xpack.actions.builtin.email.kibanaFooterLinkText', {
        defaultMessage: 'Go to Kibana'
      })
    })
  })
}, {
  validate: validateParams
});

function validateParams(paramsObject) {
  // avoids circular reference ...
  const params = paramsObject;
  const {
    to,
    cc,
    bcc
  } = params;
  const addrs = to.length + cc.length + bcc.length;

  if (addrs === 0) {
    return 'no [to], [cc], or [bcc] entries';
  }
}

function validateConnector(config, secrets) {
  if (config.service === _common.AdditionalEmailServices.EXCHANGE) {
    if (secrets.clientSecret == null) {
      return '[clientSecret] is required';
    }
  } else if (config.hasAuth && (secrets.password == null || secrets.user == null)) {
    if (secrets.user == null) {
      return '[user] is required';
    }

    if (secrets.password == null) {
      return '[password] is required';
    }
  }

  return null;
} // action type definition


const ActionTypeId = '.email';
exports.ActionTypeId = ActionTypeId;

function getActionType(params) {
  const {
    logger,
    publicBaseUrl,
    configurationUtilities
  } = params;
  return {
    id: ActionTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.actions.builtin.emailTitle', {
      defaultMessage: 'Email'
    }),
    validate: {
      config: _configSchema.schema.object(ConfigSchemaProps, {
        validate: (0, _lodash.curry)(validateConfig)(configurationUtilities)
      }),
      secrets: SecretsSchema,
      params: ParamsSchema,
      connector: validateConnector
    },
    renderParameterTemplates,
    executor: (0, _lodash.curry)(executor)({
      logger,
      publicBaseUrl,
      configurationUtilities
    })
  };
}

function renderParameterTemplates(params, variables) {
  return { // most of the params need no escaping
    ...(0, _mustache_renderer.renderMustacheObject)(params, variables),
    // message however, needs to escaped as markdown
    message: (0, _mustache_renderer.renderMustacheString)(params.message, variables, 'markdown')
  };
} // action executor


async function executor({
  logger,
  publicBaseUrl,
  configurationUtilities
}, execOptions) {
  const actionId = execOptions.actionId;
  const config = execOptions.config;
  const secrets = execOptions.secrets;
  const params = execOptions.params;
  const connectorTokenClient = execOptions.services.connectorTokenClient;
  const transport = {};

  if (secrets.user != null) {
    transport.user = secrets.user;
  }

  if (secrets.password != null) {
    transport.password = secrets.password;
  }

  if (secrets.clientSecret != null) {
    transport.clientSecret = secrets.clientSecret;
  }

  if (config.service === _common.AdditionalEmailServices.EXCHANGE) {
    transport.clientId = config.clientId;
    transport.tenantId = config.tenantId;
    transport.service = config.service;

    if (config.oauthTokenUrl !== null) {
      transport.oauthTokenUrl = config.oauthTokenUrl;
    }
  } else if (CUSTOM_HOST_PORT_SERVICES.indexOf(config.service) >= 0) {
    // use configured host/port/secure values
    // already validated service or host/port is not null ...
    transport.host = config.host;
    transport.port = config.port;
    transport.secure = getSecureValue(config.secure, config.port);
  } else if (config.service === _common.AdditionalEmailServices.ELASTIC_CLOUD) {
    // use custom elastic cloud settings
    transport.host = ELASTIC_CLOUD_SERVICE.host;
    transport.port = ELASTIC_CLOUD_SERVICE.port;
    transport.secure = ELASTIC_CLOUD_SERVICE.secure;
  } else {
    // use nodemailer's well known service config
    transport.service = config.service;
  }

  const footerMessage = getFooterMessage({
    publicBaseUrl,
    kibanaFooterLink: params.kibanaFooterLink
  });
  const sendEmailOptions = {
    connectorId: actionId,
    transport,
    routing: {
      from: config.from,
      to: params.to,
      cc: params.cc,
      bcc: params.bcc
    },
    content: {
      subject: params.subject,
      message: `${params.message}${EMAIL_FOOTER_DIVIDER}${footerMessage}`
    },
    hasAuth: config.hasAuth,
    configurationUtilities
  };
  let result;

  try {
    result = await (0, _send_email.sendEmail)(logger, sendEmailOptions, connectorTokenClient);
  } catch (err) {
    const message = _i18n.i18n.translate('xpack.actions.builtin.email.errorSendingErrorMessage', {
      defaultMessage: 'error sending email'
    });

    return {
      status: 'error',
      actionId,
      message,
      serviceMessage: err.message
    };
  }

  return {
    status: 'ok',
    data: result,
    actionId
  };
} // utilities


function getServiceNameHost(service) {
  if (service === _common.AdditionalEmailServices.ELASTIC_CLOUD) {
    return ELASTIC_CLOUD_SERVICE.host;
  }

  const serviceEntry = (0, _wellKnown.default)(service);
  if (serviceEntry === false) return null; // in theory this won't happen, but it's JS, so just to be safe ...

  if (serviceEntry == null) return null;
  return serviceEntry.host || null;
} // Returns the secure value - whether to use TLS or not.
// Respect value if not null | undefined.
// Otherwise, if the port is 465, return true, otherwise return false.
// Based on data here:
// - https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json


function getSecureValue(secure, port) {
  if (secure != null) return secure;
  if (port === 465) return true;
  return false;
}

function getFooterMessage({
  publicBaseUrl,
  kibanaFooterLink
}) {
  if (!publicBaseUrl) {
    return _i18n.i18n.translate('xpack.actions.builtin.email.sentByKibanaMessage', {
      defaultMessage: 'This message was sent by Kibana.'
    });
  }

  return _i18n.i18n.translate('xpack.actions.builtin.email.customViewInKibanaMessage', {
    defaultMessage: 'This message was sent by Kibana. [{kibanaFooterLinkText}]({link}).',
    values: {
      kibanaFooterLinkText: kibanaFooterLink.text,
      link: `${publicBaseUrl}${kibanaFooterLink.path === '/' ? '' : kibanaFooterLink.path}`
    }
  });
}