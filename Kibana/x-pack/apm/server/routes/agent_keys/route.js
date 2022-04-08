"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentKeysRouteRepository = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var t = _interopRequireWildcard(require("io-ts"));

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _get_agent_keys = require("./get_agent_keys");

var _get_agent_keys_privileges = require("./get_agent_keys_privileges");

var _invalidate_agent_key = require("./invalidate_agent_key");

var _create_agent_key = require("./create_agent_key");

var _privilege_type = require("../../../common/privilege_type");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const agentKeysRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/agent_keys',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;
    const agentKeys = await (0, _get_agent_keys.getAgentKeys)({
      context
    });
    return agentKeys;
  }
});
const agentKeysPrivilegesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/agent_keys/privileges',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      plugins: {
        security
      },
      context
    } = resources;

    if (!security) {
      throw _boom.default.internal(SECURITY_REQUIRED_MESSAGE);
    }

    const securityPluginStart = await security.start();
    const agentKeysPrivileges = await (0, _get_agent_keys_privileges.getAgentKeysPrivileges)({
      context,
      securityPluginStart
    });
    return agentKeysPrivileges;
  }
});
const invalidateAgentKeyRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/api_key/invalidate',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    body: t.type({
      id: t.string
    })
  }),
  handler: async resources => {
    const {
      context,
      params
    } = resources;
    const {
      body: {
        id
      }
    } = params;
    const invalidatedKeys = await (0, _invalidate_agent_key.invalidateAgentKey)({
      context,
      id
    });
    return invalidatedKeys;
  }
});
const createAgentKeyRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /api/apm/agent_keys',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    body: t.type({
      name: t.string,
      privileges: _privilege_type.privilegesTypeRt
    })
  }),
  handler: async resources => {
    const {
      context,
      params
    } = resources;
    const {
      body: requestBody
    } = params;
    const agentKey = await (0, _create_agent_key.createAgentKey)({
      context,
      requestBody
    });
    return agentKey;
  }
});
const agentKeysRouteRepository = { ...agentKeysRoute,
  ...agentKeysPrivilegesRoute,
  ...invalidateAgentKeyRoute,
  ...createAgentKeyRoute
};
exports.agentKeysRouteRepository = agentKeysRouteRepository;

const SECURITY_REQUIRED_MESSAGE = _i18n.i18n.translate('xpack.apm.api.apiKeys.securityRequired', {
  defaultMessage: 'Security plugin is required'
});