"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.features = exports.APM_FEATURE = void 0;
exports.notifyFeatureUsage = notifyFeatureUsage;
exports.registerFeaturesUsage = registerFeaturesUsage;

var _i18n = require("@kbn/i18n");

var _alert_types = require("../common/alert_types");

var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const APM_FEATURE = {
  id: _alert_types.APM_SERVER_FEATURE_ID,
  name: _i18n.i18n.translate('xpack.apm.featureRegistry.apmFeatureName', {
    defaultMessage: 'APM and User Experience'
  }),
  order: 900,
  category: _server.DEFAULT_APP_CATEGORIES.observability,
  app: [_alert_types.APM_SERVER_FEATURE_ID, 'ux', 'kibana'],
  catalogue: [_alert_types.APM_SERVER_FEATURE_ID],
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: Object.values(_alert_types.AlertType),
  // see x-pack/plugins/features/common/feature_kibana_privileges.ts
  privileges: {
    all: {
      app: [_alert_types.APM_SERVER_FEATURE_ID, 'ux', 'kibana'],
      api: [_alert_types.APM_SERVER_FEATURE_ID, 'apm_write', 'rac'],
      catalogue: [_alert_types.APM_SERVER_FEATURE_ID],
      savedObject: {
        all: [],
        read: []
      },
      alerting: {
        alert: {
          all: Object.values(_alert_types.AlertType)
        },
        rule: {
          all: Object.values(_alert_types.AlertType)
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'save', 'alerting:show', 'alerting:save']
    },
    read: {
      app: [_alert_types.APM_SERVER_FEATURE_ID, 'ux', 'kibana'],
      api: [_alert_types.APM_SERVER_FEATURE_ID, 'rac'],
      catalogue: [_alert_types.APM_SERVER_FEATURE_ID],
      savedObject: {
        all: [],
        read: []
      },
      alerting: {
        alert: {
          read: Object.values(_alert_types.AlertType)
        },
        rule: {
          read: Object.values(_alert_types.AlertType)
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'alerting:show']
    }
  }
};
exports.APM_FEATURE = APM_FEATURE;
const features = {
  serviceMaps: {
    name: 'APM service maps',
    license: 'platinum'
  },
  ml: {
    name: 'APM machine learning',
    license: 'platinum'
  },
  customLinks: {
    name: 'APM custom links',
    license: 'gold'
  }
};
exports.features = features;

function registerFeaturesUsage({
  licensingPlugin
}) {
  Object.values(features).forEach(({
    name,
    license
  }) => {
    licensingPlugin.featureUsage.register(name, license);
  });
}

function notifyFeatureUsage({
  licensingPlugin,
  featureName
}) {
  const feature = features[featureName];
  licensingPlugin.featureUsage.notifyUsage(feature.name);
}