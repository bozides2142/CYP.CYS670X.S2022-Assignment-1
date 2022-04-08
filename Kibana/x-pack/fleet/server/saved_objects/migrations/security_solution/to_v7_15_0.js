"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7150 = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migratePackagePolicyToV7150 = packagePolicyDoc => {
  var _packagePolicyDoc$att;

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) !== 'endpoint') {
    return packagePolicyDoc;
  }

  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);
  const input = updatedPackagePolicyDoc.attributes.inputs[0];
  const memory = {
    mode: 'off',
    // This value is based on license.
    // For the migration, we add 'true', our license watcher will correct it, if needed, when the app starts.
    supported: true
  };
  const memoryPopup = {
    message: '',
    enabled: false
  };
  const behavior = {
    mode: 'off',
    // This value is based on license.
    // For the migration, we add 'true', our license watcher will correct it, if needed, when the app starts.
    supported: true
  };
  const behaviorPopup = {
    message: '',
    enabled: false
  };

  if (input && input.config) {
    const policy = input.config.policy.value;
    policy.windows.memory_protection = memory;
    policy.windows.popup.memory_protection = memoryPopup;
    policy.windows.behavior_protection = behavior;
    policy.windows.popup.behavior_protection = behaviorPopup;
    policy.mac.behavior_protection = behavior;
    policy.mac.popup.behavior_protection = behaviorPopup;
    policy.linux.behavior_protection = behavior;
    policy.linux.popup.behavior_protection = behaviorPopup;
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7150 = migratePackagePolicyToV7150;