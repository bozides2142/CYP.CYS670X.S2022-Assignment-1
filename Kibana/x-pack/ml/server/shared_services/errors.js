"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomErrorClass = exports.MLUISettingsClientUninitialized = exports.MLFieldFormatRegistryUninitialized = exports.MLClusterClientUninitialized = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCustomErrorClass = className => {
  const CustomError = class extends Error {
    constructor(message) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype); // Override the error instance name

      Object.defineProperty(this, 'name', {
        value: className
      });
    }

  }; // set class name dynamically

  Object.defineProperty(CustomError, 'name', {
    value: className
  });
  return CustomError;
};

exports.getCustomErrorClass = getCustomErrorClass;
const MLClusterClientUninitialized = getCustomErrorClass('MLClusterClientUninitialized');
exports.MLClusterClientUninitialized = MLClusterClientUninitialized;
const MLUISettingsClientUninitialized = getCustomErrorClass('MLUISettingsClientUninitialized');
exports.MLUISettingsClientUninitialized = MLUISettingsClientUninitialized;
const MLFieldFormatRegistryUninitialized = getCustomErrorClass('MLFieldFormatRegistryUninitialized');
exports.MLFieldFormatRegistryUninitialized = MLFieldFormatRegistryUninitialized;