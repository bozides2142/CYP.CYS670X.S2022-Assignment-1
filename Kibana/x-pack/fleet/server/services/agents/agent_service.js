"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AgentServiceImpl = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _security = require("../../routes/security");

var _errors = require("../../errors");

var _crud = require("./crud");

var _status = require("./status");

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);

  privateMap.set(obj, value);
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

var _runPreflight = /*#__PURE__*/new WeakMap();
/**
 * @internal
 */


class AgentClientImpl {
  constructor(internalEsClient, preflightCheck) {
    _classPrivateFieldInitSpec(this, _runPreflight, {
      writable: true,
      value: async () => {
        if (this.preflightCheck) {
          return this.preflightCheck();
        }
      }
    });

    this.internalEsClient = internalEsClient;
    this.preflightCheck = preflightCheck;
  }

  async listAgents(options) {
    await (0, _classPrivateFieldGet2.default)(this, _runPreflight).call(this);
    return (0, _crud.getAgentsByKuery)(this.internalEsClient, options);
  }

  async getAgent(agentId) {
    await (0, _classPrivateFieldGet2.default)(this, _runPreflight).call(this);
    return (0, _crud.getAgentById)(this.internalEsClient, agentId);
  }

  async getAgentStatusById(agentId) {
    await (0, _classPrivateFieldGet2.default)(this, _runPreflight).call(this);
    return (0, _status.getAgentStatusById)(this.internalEsClient, agentId);
  }

  async getAgentStatusForAgentPolicy(agentPolicyId, filterKuery) {
    await (0, _classPrivateFieldGet2.default)(this, _runPreflight).call(this);
    return (0, _status.getAgentStatusForAgentPolicy)(this.internalEsClient, agentPolicyId, filterKuery);
  }

}
/**
 * @internal
 */


class AgentServiceImpl {
  constructor(internalEsClient) {
    this.internalEsClient = internalEsClient;
  }

  asScoped(req) {
    const preflightCheck = async () => {
      const authz = await (0, _security.getAuthzFromRequest)(req);

      if (!authz.fleet.all) {
        throw new _errors.FleetUnauthorizedError(`User does not have adequate permissions to access Fleet agents.`);
      }
    };

    return new AgentClientImpl(this.internalEsClient, preflightCheck);
  }

  get asInternalUser() {
    return new AgentClientImpl(this.internalEsClient);
  }

}

exports.AgentServiceImpl = AgentServiceImpl;