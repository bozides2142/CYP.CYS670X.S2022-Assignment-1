"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElasticCloudInstructions = createElasticCloudInstructions;

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


function createElasticCloudInstructions({
  cloudSetup,
  apmConfig,
  isFleetPluginEnabled
}) {
  const apmServerUrl = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.url;
  const instructionSets = [];

  if (!apmServerUrl) {
    instructionSets.push(getApmServerInstructionSet(cloudSetup));
  }

  instructionSets.push((0, _on_prem_apm_server_instruction_set.getOnPremApmServerInstructionSet)({
    apmConfig,
    isFleetPluginEnabled
  }));
  instructionSets.push(getApmAgentInstructionSet(cloudSetup));
  return {
    instructionSets
  };
}

function getApmServerInstructionSet(cloudSetup) {
  const deploymentId = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.deploymentId;
  return {
    title: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.title', {
      defaultMessage: 'APM Server'
    }),
    instructionVariants: [{
      id: _server.INSTRUCTION_VARIANT.ESC,
      instructions: [{
        title: 'Enable the APM Server in the Elastic Cloud user console',
        textPre: _i18n.i18n.translate('xpack.apm.tutorial.elasticCloud.textPre', {
          defaultMessage: 'To enable the APM Server go to [the Elastic Cloud console](https://cloud.elastic.co/deployments/{deploymentId}/edit) and enable APM and Fleet in the deployment edit page by clicking on add capacity, and then click on save. Once enabled, refresh this page.',
          values: {
            deploymentId
          }
        })
      }]
    }]
  };
}

function getApmAgentInstructionSet(cloudSetup) {
  const apmServerUrl = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.url;
  const secretToken = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.secretToken;
  return {
    title: _i18n.i18n.translate('xpack.apm.tutorial.elasticCloudInstructions.title', {
      defaultMessage: 'APM Agents'
    }),
    instructionVariants: [{
      id: _server.INSTRUCTION_VARIANT.NODE,
      instructions: (0, _apm_agent_instructions.createNodeAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.DJANGO,
      instructions: (0, _apm_agent_instructions.createDjangoAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.FLASK,
      instructions: (0, _apm_agent_instructions.createFlaskAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.RAILS,
      instructions: (0, _apm_agent_instructions.createRailsAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.RACK,
      instructions: (0, _apm_agent_instructions.createRackAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.JS,
      instructions: (0, _apm_agent_instructions.createJsAgentInstructions)(apmServerUrl)
    }, {
      id: _server.INSTRUCTION_VARIANT.GO,
      instructions: (0, _apm_agent_instructions.createGoAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.JAVA,
      instructions: (0, _apm_agent_instructions.createJavaAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.DOTNET,
      instructions: (0, _apm_agent_instructions.createDotNetAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.PHP,
      instructions: (0, _apm_agent_instructions.createPhpAgentInstructions)(apmServerUrl, secretToken)
    }]
  };
}