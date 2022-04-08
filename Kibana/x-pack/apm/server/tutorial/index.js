"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tutorialProvider = void 0;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../src/plugins/home/server");

var _index_pattern_constants = require("../../common/index_pattern_constants");

var _get_apm_data_view_attributes = require("../routes/data_view/get_apm_data_view_attributes");

var _get_apm_data_view_title = require("../routes/data_view/get_apm_data_view_title");

var _elastic_cloud = require("./envs/elastic_cloud");

var _on_prem = require("./envs/on_prem");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const apmIntro = _i18n.i18n.translate('xpack.apm.tutorial.introduction', {
  defaultMessage: 'Collect performance metrics from your applications with Elastic APM.'
});

const moduleName = 'apm';

const tutorialProvider = ({
  apmConfig,
  apmIndices,
  cloud,
  isFleetPluginEnabled
}) => () => {
  const dataViewTitle = (0, _get_apm_data_view_title.getApmDataViewTitle)(apmIndices);
  const savedObjects = [{
    id: _index_pattern_constants.APM_STATIC_INDEX_PATTERN_ID,
    attributes: (0, _get_apm_data_view_attributes.getApmDataViewAttributes)(dataViewTitle),
    type: 'index-pattern'
  }];
  const artifacts = {
    dashboards: [{
      id: '8d3ed660-7828-11e7-8c47-65b845b5cfb3',
      linkLabel: _i18n.i18n.translate('xpack.apm.tutorial.specProvider.artifacts.dashboards.linkLabel', {
        defaultMessage: 'APM dashboard'
      }),
      isOverview: true
    }]
  };

  if (apmConfig.ui.enabled) {
    // @ts-expect-error artifacts.application is readonly
    artifacts.application = {
      path: '/app/apm',
      label: _i18n.i18n.translate('xpack.apm.tutorial.specProvider.artifacts.application.label', {
        defaultMessage: 'Launch APM'
      })
    };
  }

  return {
    id: 'apm',
    name: _i18n.i18n.translate('xpack.apm.tutorial.specProvider.name', {
      defaultMessage: 'APM'
    }),
    moduleName,
    category: _server.TutorialsCategory.OTHER,
    shortDescription: apmIntro,
    longDescription: _i18n.i18n.translate('xpack.apm.tutorial.specProvider.longDescription', {
      defaultMessage: 'Application Performance Monitoring (APM) collects in-depth \
performance metrics and errors from inside your application. \
It allows you to monitor the performance of thousands of applications in real time. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.base_url}guide/en/apm/get-started/{config.docs.version}/index.html'
      }
    }),
    euiIconType: 'apmApp',
    integrationBrowserCategories: ['web'],
    artifacts,
    customStatusCheckName: 'apm_fleet_server_status_check',
    onPrem: (0, _on_prem.onPremInstructions)({
      apmConfig,
      isFleetPluginEnabled
    }),
    elasticCloud: (0, _elastic_cloud.createElasticCloudInstructions)({
      apmConfig,
      isFleetPluginEnabled,
      cloudSetup: cloud
    }),
    previewImagePath: '/plugins/apm/assets/apm.png',
    savedObjects,
    savedObjectsInstallMsg: _i18n.i18n.translate('xpack.apm.tutorial.specProvider.savedObjectsInstallMsg', {
      defaultMessage: 'An APM data view is required for some features in the APM UI.'
    })
  };
};

exports.tutorialProvider = tutorialProvider;