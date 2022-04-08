"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAPIRoutes = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var AgentService = _interopRequireWildcard(require("../../services/agents"));

var _handlers = require("./handlers");

var _actions_handlers = require("./actions_handlers");

var _unenroll_handler = require("./unenroll_handler");

var _upgrade_handler = require("./upgrade_handler");

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


const registerAPIRoutes = (router, config) => {
  // Get one
  router.get({
    path: _constants.AGENT_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneAgentRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentHandler); // Update

  router.put({
    path: _constants.AGENT_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdateAgentRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.updateAgentHandler); // Delete

  router.delete({
    path: _constants.AGENT_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteAgentRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.deleteAgentHandler); // List

  router.get({
    path: _constants.AGENT_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAgentsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentsHandler); // Agent actions

  router.post({
    path: _constants.AGENT_API_ROUTES.ACTIONS_PATTERN,
    validate: _types.PostNewAgentActionRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, (0, _actions_handlers.postNewAgentActionHandlerBuilder)({
    getAgent: AgentService.getAgentById,
    createAgentAction: AgentService.createAgentAction
  }));
  router.post({
    path: _constants.AGENT_API_ROUTES.UNENROLL_PATTERN,
    validate: _types.PostAgentUnenrollRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _unenroll_handler.postAgentUnenrollHandler);
  router.put({
    path: _constants.AGENT_API_ROUTES.REASSIGN_PATTERN,
    validate: _types.PutAgentReassignRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.putAgentsReassignHandler); // Get agent status for policy

  router.get({
    path: _constants.AGENT_API_ROUTES.STATUS_PATTERN,
    validate: _types.GetAgentStatusRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentStatusForAgentPolicyHandler);
  router.get({
    path: _constants.AGENT_API_ROUTES.STATUS_PATTERN_DEPRECATED,
    validate: _types.GetAgentStatusRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentStatusForAgentPolicyHandler); // upgrade agent

  router.post({
    path: _constants.AGENT_API_ROUTES.UPGRADE_PATTERN,
    validate: _types.PostAgentUpgradeRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _upgrade_handler.postAgentUpgradeHandler); // bulk upgrade

  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UPGRADE_PATTERN,
    validate: _types.PostBulkAgentUpgradeRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _upgrade_handler.postBulkAgentsUpgradeHandler); // Bulk reassign

  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_REASSIGN_PATTERN,
    validate: _types.PostBulkAgentReassignRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.postBulkAgentsReassignHandler); // Bulk unenroll

  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UNENROLL_PATTERN,
    validate: _types.PostBulkAgentUnenrollRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _unenroll_handler.postBulkAgentsUnenrollHandler);
};

exports.registerAPIRoutes = registerAPIRoutes;