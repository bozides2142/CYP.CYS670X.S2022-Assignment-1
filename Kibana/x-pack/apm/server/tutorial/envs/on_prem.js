"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onPremInstructions = onPremInstructions;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../../src/plugins/home/server");

var _apm_agent_instructions = require("../../../common/tutorial/instructions/apm_agent_instructions");

var _on_prem_apm_server_instruction_set = require("./on_prem_apm_server_instruction_set");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function onPremInstructions({
  apmConfig,
  isFleetPluginEnabled
}) {
  return {
    instructionSets: [(0, _on_prem_apm_server_instruction_set.getOnPremApmServerInstructionSet)({
      apmConfig,
      isFleetPluginEnabled
    }), {
      title: _i18n.i18n.translate('xpack.apm.tutorial.apmAgents.title', {
        defaultMessage: 'APM Agents'
      }),
      instructionVariants: [{
        id: _server.INSTRUCTION_VARIANT.JAVA,
        instructions: (0, _apm_agent_instructions.createJavaAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.JS,
        instructions: (0, _apm_agent_instructions.createJsAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.NODE,
        instructions: (0, _apm_agent_instructions.createNodeAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.DJANGO,
        instructions: (0, _apm_agent_instructions.createDjangoAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.FLASK,
        instructions: (0, _apm_agent_instructions.createFlaskAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.RAILS,
        instructions: (0, _apm_agent_instructions.createRailsAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.RACK,
        instructions: (0, _apm_agent_instructions.createRackAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.GO,
        instructions: (0, _apm_agent_instructions.createGoAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.DOTNET,
        instructions: (0, _apm_agent_instructions.createDotNetAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.PHP,
        instructions: (0, _apm_agent_instructions.createPhpAgentInstructions)()
      }],
      statusCheck: {
        title: _i18n.i18n.translate('xpack.apm.tutorial.apmAgents.statusCheck.title', {
          defaultMessage: 'Agent status'
        }),
        text: _i18n.i18n.translate('xpack.apm.tutorial.apmAgents.statusCheck.text', {
          defaultMessage: 'Make sure your application is running and the agents are sending data.'
        }),
        btnLabel: _i18n.i18n.translate('xpack.apm.tutorial.apmAgents.statusCheck.btnLabel', {
          defaultMessage: 'Check agent status'
        }),
        success: _i18n.i18n.translate('xpack.apm.tutorial.apmAgents.statusCheck.successMessage', {
          defaultMessage: 'Data successfully received from one or more agents'
        }),
        error: _i18n.i18n.translate('xpack.apm.tutorial.apmAgents.statusCheck.errorMessage', {
          defaultMessage: 'No data has been received from agents yet'
        }),
        esHitsCheck: {
          index: [apmConfig.indices.error, apmConfig.indices.transaction, apmConfig.indices.metric],
          query: {
            bool: {
              filter: [{
                terms: {
                  'processor.event': ['error', 'transaction', 'metric']
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
    }]
  };
}