"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RUM_AGENT_NAMES = exports.OPEN_TELEMETRY_AGENT_NAMES = exports.JAVA_AGENT_NAMES = exports.AGENT_NAMES = void 0;
exports.isIosAgentName = isIosAgentName;
exports.isJRubyAgent = isJRubyAgent;
exports.isJavaAgentName = isJavaAgentName;
exports.isRumAgentName = isRumAgentName;
exports.isServerlessAgent = isServerlessAgent;
exports.normalizeAgentName = normalizeAgentName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Agent names can be any string. This list only defines the official agents
 * that we might want to target specifically eg. linking to their documentation
 * & telemetry reporting. Support additional agent types by appending
 * definitions in mappings.json (for telemetry), the AgentName type, and the
 * AGENT_NAMES array.
 */

const OPEN_TELEMETRY_AGENT_NAMES = ['otlp', 'opentelemetry/cpp', 'opentelemetry/dotnet', 'opentelemetry/erlang', 'opentelemetry/go', 'opentelemetry/java', 'opentelemetry/nodejs', 'opentelemetry/php', 'opentelemetry/python', 'opentelemetry/ruby', 'opentelemetry/swift', 'opentelemetry/webjs'];
exports.OPEN_TELEMETRY_AGENT_NAMES = OPEN_TELEMETRY_AGENT_NAMES;
const AGENT_NAMES = ['dotnet', 'go', 'iOS/swift', 'java', 'js-base', 'nodejs', 'php', 'python', 'ruby', 'rum-js', ...OPEN_TELEMETRY_AGENT_NAMES];
exports.AGENT_NAMES = AGENT_NAMES;
const JAVA_AGENT_NAMES = ['java', 'opentelemetry/java'];
exports.JAVA_AGENT_NAMES = JAVA_AGENT_NAMES;

function isJavaAgentName(agentName) {
  return JAVA_AGENT_NAMES.includes(agentName);
}

const RUM_AGENT_NAMES = ['js-base', 'rum-js', 'opentelemetry/webjs'];
exports.RUM_AGENT_NAMES = RUM_AGENT_NAMES;

function isRumAgentName(agentName) {
  return RUM_AGENT_NAMES.includes(agentName);
}

function normalizeAgentName(agentName) {
  if (isRumAgentName(agentName)) {
    return 'rum-js';
  }

  if (isJavaAgentName(agentName)) {
    return 'java';
  }

  if (isIosAgentName(agentName)) {
    return 'ios';
  }

  return agentName;
}

function isIosAgentName(agentName) {
  const lowercased = agentName && agentName.toLowerCase();
  return lowercased === 'ios/swift' || lowercased === 'opentelemetry/swift';
}

function isJRubyAgent(agentName, runtimeName) {
  return agentName === 'ruby' && (runtimeName === null || runtimeName === void 0 ? void 0 : runtimeName.toLowerCase()) === 'jruby';
}

function isServerlessAgent(runtimeName) {
  return runtimeName === null || runtimeName === void 0 ? void 0 : runtimeName.toLowerCase().startsWith('aws_lambda');
}