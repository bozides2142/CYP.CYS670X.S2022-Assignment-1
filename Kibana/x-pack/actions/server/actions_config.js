"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AllowedHosts", {
  enumerable: true,
  get: function () {
    return _config.AllowedHosts;
  }
});
Object.defineProperty(exports, "EnabledActionTypes", {
  enumerable: true,
  get: function () {
    return _config.EnabledActionTypes;
  }
});
exports.getActionsConfigurationUtilities = getActionsConfigurationUtilities;

var _i18n = require("@kbn/i18n");

var _Option = require("fp-ts/lib/Option");

var _url = _interopRequireDefault(require("url"));

var _lodash = require("lodash");

var _pipeable = require("fp-ts/lib/pipeable");

var _config = require("./config");

var _custom_host_settings = require("./lib/custom_host_settings");

var _lib = require("./lib");

var _get_node_ssl_options = require("./builtin_action_types/lib/get_node_ssl_options");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


var AllowListingField;

(function (AllowListingField) {
  AllowListingField["URL"] = "url";
  AllowListingField["hostname"] = "hostname";
})(AllowListingField || (AllowListingField = {}));

function allowListErrorMessage(field, value) {
  return _i18n.i18n.translate('xpack.actions.urlAllowedHostsConfigurationError', {
    defaultMessage: 'target {field} "{value}" is not added to the Kibana config xpack.actions.allowedHosts',
    values: {
      value,
      field
    }
  });
}

function disabledActionTypeErrorMessage(actionType) {
  return _i18n.i18n.translate('xpack.actions.disabledActionTypeError', {
    defaultMessage: 'action type "{actionType}" is not enabled in the Kibana config xpack.actions.enabledActionTypes',
    values: {
      actionType
    }
  });
}

function isAllowed({
  allowedHosts
}, hostname) {
  const allowed = new Set(allowedHosts);
  if (allowed.has(_config.AllowedHosts.Any)) return true;
  if (hostname && allowed.has(hostname)) return true;
  return false;
}

function isHostnameAllowedInUri(config, uri) {
  return (0, _pipeable.pipe)((0, _Option.tryCatch)(() => _url.default.parse(uri)), (0, _Option.map)(parsedUrl => parsedUrl.hostname), (0, _Option.mapNullable)(hostname => isAllowed(config, hostname)), (0, _Option.getOrElse)(() => false));
}

function isActionTypeEnabledInConfig({
  enabledActionTypes
}, actionType) {
  const enabled = new Set(enabledActionTypes);
  if (enabled.has(_config.EnabledActionTypes.Any)) return true;
  if (enabled.has(actionType)) return true;
  return false;
}

function getProxySettingsFromConfig(config) {
  var _config$ssl;

  if (!config.proxyUrl) {
    return undefined;
  }

  return {
    proxyUrl: config.proxyUrl,
    proxyBypassHosts: arrayAsSet(config.proxyBypassHosts),
    proxyOnlyHosts: arrayAsSet(config.proxyOnlyHosts),
    proxyHeaders: config.proxyHeaders,
    proxySSLSettings: (0, _get_node_ssl_options.getSSLSettingsFromConfig)((_config$ssl = config.ssl) === null || _config$ssl === void 0 ? void 0 : _config$ssl.proxyVerificationMode, config.proxyRejectUnauthorizedCertificates)
  };
}

function getMicrosoftGraphApiUrlFromConfig(config) {
  return config.microsoftGraphApiUrl;
}

function arrayAsSet(arr) {
  if (!arr) return;
  return new Set(arr);
}

function getResponseSettingsFromConfig(config) {
  return {
    maxContentLength: config.maxResponseContentLength.getValueInBytes(),
    timeout: config.responseTimeout.asMilliseconds()
  };
}

function getCustomHostSettings(config, targetUrl) {
  const customHostSettings = config.customHostSettings;

  if (!customHostSettings) {
    return;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(targetUrl);
  } catch (err) {
    // presumably this bad URL is reported elsewhere
    return;
  }

  const canonicalUrl = (0, _custom_host_settings.getCanonicalCustomHostUrl)(parsedUrl);
  return customHostSettings.find(settings => settings.url === canonicalUrl);
}

function getActionsConfigurationUtilities(config) {
  const isHostnameAllowed = (0, _lodash.curry)(isAllowed)(config);
  const isUriAllowed = (0, _lodash.curry)(isHostnameAllowedInUri)(config);
  const isActionTypeEnabled = (0, _lodash.curry)(isActionTypeEnabledInConfig)(config);
  return {
    isHostnameAllowed,
    isUriAllowed,
    isActionTypeEnabled,
    getProxySettings: () => getProxySettingsFromConfig(config),
    getResponseSettings: () => getResponseSettingsFromConfig(config),
    getSSLSettings: () => {
      var _config$ssl2;

      return (0, _get_node_ssl_options.getSSLSettingsFromConfig)((_config$ssl2 = config.ssl) === null || _config$ssl2 === void 0 ? void 0 : _config$ssl2.verificationMode, config.rejectUnauthorized);
    },

    ensureUriAllowed(uri) {
      if (!isUriAllowed(uri)) {
        throw new Error(allowListErrorMessage(AllowListingField.URL, uri));
      }
    },

    ensureHostnameAllowed(hostname) {
      if (!isHostnameAllowed(hostname)) {
        throw new Error(allowListErrorMessage(AllowListingField.hostname, hostname));
      }
    },

    ensureActionTypeEnabled(actionType) {
      if (!isActionTypeEnabled(actionType)) {
        throw new _lib.ActionTypeDisabledError(disabledActionTypeErrorMessage(actionType), 'config');
      }
    },

    getCustomHostSettings: targetUrl => getCustomHostSettings(config, targetUrl),
    getMicrosoftGraphApiUrl: () => getMicrosoftGraphApiUrlFromConfig(config)
  };
}