"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnPremApmServerInstructionSet = getOnPremApmServerInstructionSet;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../../src/plugins/home/server");

var _apm_server_instructions = require("../../../common/tutorial/instructions/apm_server_instructions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EDIT_CONFIG = (0, _apm_server_instructions.createEditConfig)();
const START_SERVER_UNIX = (0, _apm_server_instructions.createStartServerUnix)();
const START_SERVER_UNIX_SYSV = (0, _apm_server_instructions.createStartServerUnixSysv)();

function getOnPremApmServerInstructionSet({
  apmConfig,
  isFleetPluginEnabled
}) {
  return {
    title: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.title', {
      defaultMessage: 'APM Server'
    }),
    callOut: {
      title: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.callOut.title', {
        defaultMessage: 'Important: Updating to 7.0 or higher'
      }),
      message: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.callOut.message', {
        defaultMessage: `Please make sure your APM Server is updated to 7.0 or higher. \
            You can also migrate your 6.x data with the migration assistant found in Kibana's management section.`
      }),
      iconType: 'alert'
    },
    instructionVariants: [{
      id: _server.INSTRUCTION_VARIANT.DEB,
      instructions: [(0, _apm_server_instructions.createDownloadServerDeb)(), EDIT_CONFIG, START_SERVER_UNIX_SYSV]
    }, {
      id: _server.INSTRUCTION_VARIANT.RPM,
      instructions: [(0, _apm_server_instructions.createDownloadServerRpm)(), EDIT_CONFIG, START_SERVER_UNIX_SYSV]
    }, {
      id: _server.INSTRUCTION_VARIANT.OSX,
      instructions: [(0, _apm_server_instructions.createDownloadServerOsx)(), EDIT_CONFIG, START_SERVER_UNIX]
    }, {
      id: _server.INSTRUCTION_VARIANT.WINDOWS,
      instructions: (0, _apm_server_instructions.createWindowsServerInstructions)()
    }, // hides fleet section when plugin is disabled
    ...(isFleetPluginEnabled ? [{
      id: _server.INSTRUCTION_VARIANT.FLEET,
      instructions: [{
        title: _i18n.i18n.translate('xpack.apm.tutorial.fleet.title', {
          defaultMessage: 'Fleet'
        }),
        customComponentName: 'TutorialFleetInstructions'
      }],
      initialSelected: true
    }] : [])],
    statusCheck: {
      title: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.statusCheck.title', {
        defaultMessage: 'APM Server status'
      }),
      text: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.statusCheck.text', {
        defaultMessage: 'Make sure APM Server is running before you start implementing the APM agents.'
      }),
      btnLabel: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.statusCheck.btnLabel', {
        defaultMessage: 'Check APM Server status'
      }),
      success: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.statusCheck.successMessage', {
        defaultMessage: 'You have correctly setup APM Server'
      }),
      error: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.statusCheck.errorMessage', {
        defaultMessage: 'No APM Server detected. Please make sure it is running and you have updated to 7.0 or higher.'
      }),
      esHitsCheck: {
        index: apmConfig.indices.onboarding,
        query: {
          bool: {
            filter: [{
              term: {
                'processor.event': 'onboarding'
              }
            }, {
              range: {
                'observer.version_major': {
                  gte: 7
                }
              }
            }]
          }
        }
      }
    }
  };
}