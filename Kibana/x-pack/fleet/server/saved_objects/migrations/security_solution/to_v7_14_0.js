"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateEndpointPackagePolicyToV7140 = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migrateEndpointPackagePolicyToV7140 = packagePolicyDoc => {
  var _packagePolicyDoc$att;

  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    const input = updatedPackagePolicyDoc.attributes.inputs[0];

    if (input && input.config) {
      var _policy$windows, _policy$windows$ranso;

      const policy = input.config.policy.value;
      const linuxMalware = (0, _lodash.cloneDeep)(input.config.policy.value.windows.malware);
      const linuxMalwarePopup = {
        malware: (0, _lodash.cloneDeep)(input.config.policy.value.windows.popup.malware)
      };
      policy.linux.malware = linuxMalware;
      policy.linux.popup = linuxMalwarePopup; // This value is based on license.
      // For the migration, we add 'true', our license watcher will correct it, if needed, when the app starts.

      if (policy !== null && policy !== void 0 && (_policy$windows = policy.windows) !== null && _policy$windows !== void 0 && (_policy$windows$ranso = _policy$windows.ransomware) !== null && _policy$windows$ranso !== void 0 && _policy$windows$ranso.mode) {
        policy.windows.ransomware.supported = true;
      } else {
        policy.windows.ransomware = {
          mode: 'off',
          supported: true
        };
      }
    }
  }

  return updatedPackagePolicyDoc;
};

exports.migrateEndpointPackagePolicyToV7140 = migrateEndpointPackagePolicyToV7140;