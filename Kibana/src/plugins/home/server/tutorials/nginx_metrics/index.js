"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nginxMetricsSpecProvider = nginxMetricsSpecProvider;

var _i18n = require("@kbn/i18n");

var _tutorials = require("../../services/tutorials");

var _metricbeat_instructions = require("../instructions/metricbeat_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function nginxMetricsSpecProvider(context) {
  const moduleName = 'nginx';
  return {
    id: 'nginxMetrics',
    name: _i18n.i18n.translate('home.tutorials.nginxMetrics.nameTitle', {
      defaultMessage: 'Nginx Metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.nginxMetrics.shortDescription', {
      defaultMessage: 'Collect metrics from Nginx HTTP servers with Metricbeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.nginxMetrics.longDescription', {
      defaultMessage: 'The `nginx` Metricbeat module fetches metrics from Nginx HTTP server. \
The module scrapes the server status data from the web page generated by the \
{statusModuleLink}, \
which must be enabled in your Nginx installation. \
[Learn more]({learnMoreLink}).',
      values: {
        statusModuleLink: '[ngx_http_stub_status_module](http://nginx.org/en/docs/http/ngx_http_stub_status_module.html)',
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-nginx.html'
      }
    }),
    euiIconType: 'logoNginx',
    artifacts: {
      dashboards: [{
        id: '023d2930-f1a5-11e7-a9ef-93c69af7b129-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.nginxMetrics.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Nginx metrics dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-nginx.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/nginx_metrics/screenshot.png',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName, context),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName, context),
    integrationBrowserCategories: ['web', 'security']
  };
}