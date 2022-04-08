"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadRouteContextMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const workpadRouteContextMock = {
  create: () => ({
    workpad: {
      create: jest.fn(),
      get: jest.fn(),
      import: jest.fn(),
      update: jest.fn(),
      resolve: jest.fn()
    }
  })
};
exports.workpadRouteContextMock = workpadRouteContextMock;