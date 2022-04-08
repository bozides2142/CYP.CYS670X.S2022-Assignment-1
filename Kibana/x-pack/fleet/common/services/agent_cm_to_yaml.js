"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fullAgentConfigMapToYaml = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CM_KEYS_ORDER = ['apiVersion', 'kind', 'metadata', 'data'];

const fullAgentConfigMapToYaml = (policy, toYaml) => {
  return toYaml(policy, {
    skipInvalid: true,
    sortKeys: (keyA, keyB) => {
      const indexA = CM_KEYS_ORDER.indexOf(keyA);
      const indexB = CM_KEYS_ORDER.indexOf(keyB);

      if (indexA >= 0 && indexB < 0) {
        return -1;
      }

      if (indexA < 0 && indexB >= 0) {
        return 1;
      }

      return indexA - indexB;
    }
  });
};

exports.fullAgentConfigMapToYaml = fullAgentConfigMapToYaml;