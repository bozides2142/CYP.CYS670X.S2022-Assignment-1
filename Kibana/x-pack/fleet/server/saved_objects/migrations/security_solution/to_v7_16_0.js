"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7160 = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migratePackagePolicyToV7160 = packagePolicyDoc => {
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

  if (input && input.config) {
    const policy = input.config.policy.value;
    policy.mac.memory_protection = memory;
    policy.mac.popup.memory_protection = memoryPopup;
    policy.linux.memory_protection = memory;
    policy.linux.popup.memory_protection = memoryPopup;
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7160 = migratePackagePolicyToV7160;