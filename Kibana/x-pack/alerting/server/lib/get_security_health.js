"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecurityHealth = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSecurityHealth = async (isEsSecurityEnabled, isAbleToEncrypt, areApiKeysEnabled) => {
  const esSecurityIsEnabled = await isEsSecurityEnabled();
  const apiKeysAreEnabled = await areApiKeysEnabled();
  const ableToEncrypt = await isAbleToEncrypt();
  let isSufficientlySecure;

  if (esSecurityIsEnabled === null) {
    isSufficientlySecure = false;
  } else {
    // if esSecurityIsEnabled = true, then areApiKeysEnabled must be true to enable alerting
    // if esSecurityIsEnabled = false, then it does not matter what areApiKeysEnabled is
    isSufficientlySecure = !esSecurityIsEnabled || esSecurityIsEnabled && apiKeysAreEnabled;
  }

  const securityHealth = {
    isSufficientlySecure,
    hasPermanentEncryptionKey: ableToEncrypt
  };
  return securityHealth;
};

exports.getSecurityHealth = getSecurityHealth;