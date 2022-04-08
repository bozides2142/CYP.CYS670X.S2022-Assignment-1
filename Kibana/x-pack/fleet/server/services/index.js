"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  settingsService: true,
  ESIndexPatternSavedObjectService: true,
  getRegistryUrl: true,
  AgentServiceImpl: true,
  agentPolicyService: true,
  packagePolicyService: true,
  outputService: true,
  appContextService: true,
  licenseService: true,
  ensurePreconfiguredPackagesAndPolicies: true,
  PackageServiceImpl: true
};
Object.defineProperty(exports, "AgentServiceImpl", {
  enumerable: true,
  get: function () {
    return _agents.AgentServiceImpl;
  }
});
Object.defineProperty(exports, "ESIndexPatternSavedObjectService", {
  enumerable: true,
  get: function () {
    return _es_index_pattern.ESIndexPatternSavedObjectService;
  }
});
Object.defineProperty(exports, "PackageServiceImpl", {
  enumerable: true,
  get: function () {
    return _epm.PackageServiceImpl;
  }
});
Object.defineProperty(exports, "agentPolicyService", {
  enumerable: true,
  get: function () {
    return _agent_policy.agentPolicyService;
  }
});
Object.defineProperty(exports, "appContextService", {
  enumerable: true,
  get: function () {
    return _app_context.appContextService;
  }
});
Object.defineProperty(exports, "ensurePreconfiguredPackagesAndPolicies", {
  enumerable: true,
  get: function () {
    return _preconfiguration.ensurePreconfiguredPackagesAndPolicies;
  }
});
Object.defineProperty(exports, "getRegistryUrl", {
  enumerable: true,
  get: function () {
    return _registry_url.getRegistryUrl;
  }
});
Object.defineProperty(exports, "licenseService", {
  enumerable: true,
  get: function () {
    return _license.licenseService;
  }
});
Object.defineProperty(exports, "outputService", {
  enumerable: true,
  get: function () {
    return _output.outputService;
  }
});
Object.defineProperty(exports, "packagePolicyService", {
  enumerable: true,
  get: function () {
    return _package_policy.packagePolicyService;
  }
});
exports.settingsService = void 0;

var settingsService = _interopRequireWildcard(require("./settings"));

exports.settingsService = settingsService;

var _es_index_pattern = require("./es_index_pattern");

var _registry_url = require("./epm/registry/registry_url");

var _agents = require("./agents");

var _agent_policy = require("./agent_policy");

var _package_policy = require("./package_policy");

var _output = require("./output");

var _app_context = require("./app_context");

var _license = require("./license");

var _artifacts = require("./artifacts");

Object.keys(_artifacts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _artifacts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _artifacts[key];
    }
  });
});

var _preconfiguration = require("./preconfiguration");

var _epm = require("./epm");

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