"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitoringPermissions = getMonitoringPermissions;

var _packages = require("../epm/packages");

var _package_policies_to_agent_permissions = require("../package_policies_to_agent_permissions");

var _constants = require("../../constants");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function buildDefault(enabled, namespace) {
  let names = [];

  if (enabled.logs) {
    names = names.concat(_constants.AGENT_POLICY_DEFAULT_MONITORING_DATASETS.map(dataset => `logs-${dataset}-${namespace}`));
  }

  if (enabled.metrics) {
    names = names.concat(_constants.AGENT_POLICY_DEFAULT_MONITORING_DATASETS.map(dataset => `metrics-${dataset}-${namespace}`));
  }

  if (names.length === 0) {
    return {
      _elastic_agent_monitoring: {
        indices: []
      }
    };
  }

  return {
    _elastic_agent_monitoring: {
      indices: [{
        names,
        privileges: _constants.PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES
      }]
    }
  };
}

async function getMonitoringPermissions(soClient, enabled, namespace) {
  const installation = await (0, _packages.getInstallation)({
    savedObjectsClient: soClient,
    pkgName: _common.FLEET_ELASTIC_AGENT_PACKAGE
  });

  if (!installation) {
    return buildDefault(enabled, namespace);
  }

  const pkg = await (0, _packages.getPackageInfo)({
    savedObjectsClient: soClient,
    pkgName: installation.name,
    pkgVersion: installation.version
  });

  if (!pkg.data_streams || pkg.data_streams.length === 0) {
    return buildDefault(enabled, namespace);
  }

  return {
    _elastic_agent_monitoring: {
      indices: pkg.data_streams.map(ds => {
        if (ds.type === _common.dataTypes.Logs && !enabled.logs) {
          return;
        }

        if (ds.type === _common.dataTypes.Metrics && !enabled.metrics) {
          return;
        }

        return (0, _package_policies_to_agent_permissions.getDataStreamPrivileges)(ds, namespace);
      }).filter(i => typeof i !== 'undefined')
    }
  };
}