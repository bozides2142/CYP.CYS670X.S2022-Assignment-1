"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConfigSchema", {
  enumerable: true,
  get: function () {
    return _schema.ConfigSchema;
  }
});
Object.defineProperty(exports, "buildConfig", {
  enumerable: true,
  get: function () {
    return _config.buildConfig;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "registerUiSettings", {
  enumerable: true,
  get: function () {
    return _ui_settings.registerUiSettings;
  }
});

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _schema = require("./schema");

var _config = require("./config");

var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {
    poll: true,
    roles: true
  },
  schema: _schema.ConfigSchema,
  deprecations: ({
    unused
  }) => [unused('capture.browser.chromium.maxScreenshotDimension', {
    level: 'warning'
  }), // unused since 7.8
  unused('capture.browser.type', {
    level: 'warning'
  }), unused('poll.jobCompletionNotifier.intervalErrorMultiplier', {
    level: 'warning'
  }), // unused since 7.10
  unused('poll.jobsRefresh.intervalErrorMultiplier', {
    level: 'warning'
  }), // unused since 7.10
  unused('capture.viewport', {
    level: 'warning'
  }), // deprecated as unused since 7.16
  (settings, fromPath, addDeprecation) => {
    var _reporting$roles;

    const reporting = (0, _lodash.get)(settings, fromPath);

    if ((reporting === null || reporting === void 0 ? void 0 : (_reporting$roles = reporting.roles) === null || _reporting$roles === void 0 ? void 0 : _reporting$roles.enabled) !== false) {
      addDeprecation({
        configPath: `${fromPath}.roles.enabled`,
        level: 'warning',
        title: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.title', {
          defaultMessage: `The "{fromPath}.roles" setting is deprecated`,
          values: {
            fromPath
          }
        }),
        // TODO: once scheduled reports is released, restate this to say that we have no access to scheduled reporting.
        // https://github.com/elastic/kibana/issues/79905
        message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.description', {
          defaultMessage: `The default mechanism for Reporting privileges will work differently in future versions,` + ` which will affect the behavior of this cluster. Set "xpack.reporting.roles.enabled" to` + ` "false" to adopt the future behavior before upgrading.`
        }),
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepOne', {
            defaultMessage: `Set "xpack.reporting.roles.enabled" to "false" in kibana.yml.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepTwo', {
            defaultMessage: `Remove "xpack.reporting.roles.allow" in kibana.yml, if present.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepThree', {
            defaultMessage: `Go to Management > Security > Roles to create one or more roles that grant` + ` the Kibana application privilege for Reporting.`
          }), _i18n.i18n.translate('xpack.reporting.deprecations.reportingRoles.manualStepFour', {
            defaultMessage: `Grant Reporting privileges to users by assigning one of the new roles.`
          })]
        }
      });
    }
  }],
  exposeToUsage: {
    capture: {
      maxAttempts: true,
      timeouts: {
        openUrl: true,
        renderComplete: true,
        waitForElements: true
      },
      zoom: true
    },
    csv: {
      maxSizeBytes: true,
      scroll: {
        size: true,
        duration: true
      }
    },
    kibanaServer: false,
    // show as [redacted]
    queue: {
      indexInterval: true,
      pollEnabled: true,
      timeout: true
    },
    roles: {
      enabled: true
    }
  }
};
exports.config = config;