"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockLicense = exports.mockError = void 0;
exports.mockRouteContext = mockRouteContext;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function mockRouteContext(mockedFunctions) {
  const routeContextMock = {
    core: {
      elasticsearch: {
        client: {
          asCurrentUser: mockedFunctions
        }
      }
    }
  };
  return routeContextMock;
}

const mockLicense = {
  guardApiRoute: route => route
};
exports.mockLicense = mockLicense;
const mockError = {
  name: 'ResponseError',
  statusCode: 400
};
exports.mockError = mockError;