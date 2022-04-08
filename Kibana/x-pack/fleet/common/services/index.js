"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  AgentStatusKueryHelper: true,
  packageToPackagePolicyInputs: true,
  packageToPackagePolicy: true,
  getStreamsForInputType: true,
  fullAgentPolicyToYaml: true,
  isPackageLimited: true,
  doesAgentPolicyAlreadyIncludePackage: true,
  decodeCloudId: true,
  isValidNamespace: true,
  isDiffPathProtocol: true,
  LicenseService: true,
  isAgentUpgradeable: true,
  doesPackageHaveIntegrations: true,
  validatePackagePolicy: true,
  validatePackagePolicyConfig: true,
  validationHasErrors: true,
  countValidationErrors: true,
  normalizeHostsForAgents: true,
  splitPkgKey: true,
  getMaxPackageName: true
};
exports.AgentStatusKueryHelper = void 0;
Object.defineProperty(exports, "LicenseService", {
  enumerable: true,
  get: function () {
    return _license.LicenseService;
  }
});
Object.defineProperty(exports, "countValidationErrors", {
  enumerable: true,
  get: function () {
    return _validate_package_policy.countValidationErrors;
  }
});
Object.defineProperty(exports, "decodeCloudId", {
  enumerable: true,
  get: function () {
    return _decode_cloud_id.decodeCloudId;
  }
});
Object.defineProperty(exports, "doesAgentPolicyAlreadyIncludePackage", {
  enumerable: true,
  get: function () {
    return _limited_package.doesAgentPolicyAlreadyIncludePackage;
  }
});
Object.defineProperty(exports, "doesPackageHaveIntegrations", {
  enumerable: true,
  get: function () {
    return _packages_with_integrations.doesPackageHaveIntegrations;
  }
});
Object.defineProperty(exports, "fullAgentPolicyToYaml", {
  enumerable: true,
  get: function () {
    return _full_agent_policy_to_yaml.fullAgentPolicyToYaml;
  }
});
Object.defineProperty(exports, "getMaxPackageName", {
  enumerable: true,
  get: function () {
    return _max_package_name.getMaxPackageName;
  }
});
Object.defineProperty(exports, "getStreamsForInputType", {
  enumerable: true,
  get: function () {
    return _package_to_package_policy.getStreamsForInputType;
  }
});
Object.defineProperty(exports, "isAgentUpgradeable", {
  enumerable: true,
  get: function () {
    return _is_agent_upgradeable.isAgentUpgradeable;
  }
});
Object.defineProperty(exports, "isDiffPathProtocol", {
  enumerable: true,
  get: function () {
    return _is_diff_path_protocol.isDiffPathProtocol;
  }
});
Object.defineProperty(exports, "isPackageLimited", {
  enumerable: true,
  get: function () {
    return _limited_package.isPackageLimited;
  }
});
Object.defineProperty(exports, "isValidNamespace", {
  enumerable: true,
  get: function () {
    return _is_valid_namespace.isValidNamespace;
  }
});
Object.defineProperty(exports, "normalizeHostsForAgents", {
  enumerable: true,
  get: function () {
    return _hosts_utils.normalizeHostsForAgents;
  }
});
Object.defineProperty(exports, "packageToPackagePolicy", {
  enumerable: true,
  get: function () {
    return _package_to_package_policy.packageToPackagePolicy;
  }
});
Object.defineProperty(exports, "packageToPackagePolicyInputs", {
  enumerable: true,
  get: function () {
    return _package_to_package_policy.packageToPackagePolicyInputs;
  }
});
Object.defineProperty(exports, "splitPkgKey", {
  enumerable: true,
  get: function () {
    return _split_pkg_key.splitPkgKey;
  }
});
Object.defineProperty(exports, "validatePackagePolicy", {
  enumerable: true,
  get: function () {
    return _validate_package_policy.validatePackagePolicy;
  }
});
Object.defineProperty(exports, "validatePackagePolicyConfig", {
  enumerable: true,
  get: function () {
    return _validate_package_policy.validatePackagePolicyConfig;
  }
});
Object.defineProperty(exports, "validationHasErrors", {
  enumerable: true,
  get: function () {
    return _validate_package_policy.validationHasErrors;
  }
});

var _routes = require("./routes");

Object.keys(_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _routes[key];
    }
  });
});

var _AgentStatusKueryHelper = _interopRequireWildcard(require("./agent_status"));

exports.AgentStatusKueryHelper = _AgentStatusKueryHelper;

var _package_to_package_policy = require("./package_to_package_policy");

var _full_agent_policy_to_yaml = require("./full_agent_policy_to_yaml");

var _limited_package = require("./limited_package");

var _decode_cloud_id = require("./decode_cloud_id");

var _is_valid_namespace = require("./is_valid_namespace");

var _is_diff_path_protocol = require("./is_diff_path_protocol");

var _license = require("./license");

var _is_agent_upgradeable = require("./is_agent_upgradeable");

var _packages_with_integrations = require("./packages_with_integrations");

var _validate_package_policy = require("./validate_package_policy");

var _hosts_utils = require("./hosts_utils");

var _split_pkg_key = require("./split_pkg_key");

var _max_package_name = require("./max_package_name");

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