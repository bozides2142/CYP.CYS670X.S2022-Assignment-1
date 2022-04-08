"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultSettings = createDefaultSettings;
exports.getCloudFleetServersHosts = getCloudFleetServersHosts;
exports.getSettings = getSettings;
exports.saveSettings = saveSettings;
exports.settingsSetup = settingsSetup;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../common");

var _app_context = require("./app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getSettings(soClient) {
  const res = await soClient.find({
    type: _common.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE
  });

  if (res.total === 0) {
    throw _boom.default.notFound('Global settings not found');
  }

  const settingsSo = res.saved_objects[0];
  return {
    id: settingsSo.id,
    ...settingsSo.attributes,
    fleet_server_hosts: settingsSo.attributes.fleet_server_hosts || []
  };
}

async function settingsSetup(soClient) {
  try {
    const settings = await getSettings(soClient); // Migration for < 7.13 Kibana

    if (!settings.fleet_server_hosts || settings.fleet_server_hosts.length === 0) {
      const defaultSettings = createDefaultSettings();

      if (defaultSettings.fleet_server_hosts.length > 0) {
        return saveSettings(soClient, {
          fleet_server_hosts: defaultSettings.fleet_server_hosts
        });
      }
    }
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      const defaultSettings = createDefaultSettings();
      return saveSettings(soClient, defaultSettings);
    }

    throw e;
  }
}

async function saveSettings(soClient, newData) {
  const data = { ...newData
  };

  if (data.fleet_server_hosts) {
    data.fleet_server_hosts = data.fleet_server_hosts.map(_common.normalizeHostsForAgents);
  }

  try {
    const settings = await getSettings(soClient);
    const res = await soClient.update(_common.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE, settings.id, data);
    return {
      id: settings.id,
      ...res.attributes
    };
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      const defaultSettings = createDefaultSettings();
      const res = await soClient.create(_common.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE, { ...defaultSettings,
        ...data
      }, {
        id: _common.GLOBAL_SETTINGS_ID,
        overwrite: true
      });
      return {
        id: res.id,
        ...res.attributes
      };
    }

    throw e;
  }
}

function createDefaultSettings() {
  var _appContextService$ge, _appContextService$ge2, _appContextService$ge3, _ref;

  const configFleetServerHosts = (_appContextService$ge = _app_context.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : (_appContextService$ge2 = _appContextService$ge.agents) === null || _appContextService$ge2 === void 0 ? void 0 : (_appContextService$ge3 = _appContextService$ge2.fleet_server) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.hosts;
  const cloudFleetServerHosts = getCloudFleetServersHosts();
  const fleetServerHosts = (_ref = configFleetServerHosts !== null && configFleetServerHosts !== void 0 ? configFleetServerHosts : cloudFleetServerHosts) !== null && _ref !== void 0 ? _ref : [];
  return {
    fleet_server_hosts: fleetServerHosts
  };
}

function getCloudFleetServersHosts() {
  const cloudSetup = _app_context.appContextService.getCloud();

  if (cloudSetup && cloudSetup.isCloudEnabled && cloudSetup.cloudId && cloudSetup.deploymentId) {
    const res = (0, _common.decodeCloudId)(cloudSetup.cloudId);

    if (!res) {
      return;
    } // Fleet Server url are formed like this `https://<deploymentId>.fleet.<host>


    return [`https://${cloudSetup.deploymentId}.fleet.${res.host}${res.defaultPort !== '443' ? `:${res.defaultPort}` : ''}`];
  }
}