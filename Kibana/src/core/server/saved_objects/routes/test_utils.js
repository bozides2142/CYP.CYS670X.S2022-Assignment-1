"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupServer = exports.createExportableType = void 0;

var _context = require("../../context");

var _test_utils = require("../../http/test_utils");

var _mocks = require("../../mocks");

var _execution_context_service = require("../../execution_context/execution_context_service.mock");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultCoreId = Symbol('core');

const setupServer = async (coreId = defaultCoreId) => {
  const coreContext = (0, _test_utils.createCoreContext)({
    coreId
  });
  const contextService = new _context.ContextService(coreContext);
  const server = (0, _test_utils.createHttpServer)(coreContext);
  await server.preboot({
    context: _mocks.contextServiceMock.createPrebootContract()
  });
  const httpSetup = await server.setup({
    context: contextService.setup({
      pluginDependencies: new Map()
    }),
    executionContext: _execution_context_service.executionContextServiceMock.createInternalSetupContract()
  });

  const handlerContext = _mocks.coreMock.createRequestHandlerContext();

  httpSetup.registerRouteHandlerContext(coreId, 'core', async (ctx, req, res) => {
    return handlerContext;
  });
  return {
    server,
    httpSetup,
    handlerContext
  };
};

exports.setupServer = setupServer;

const createExportableType = name => {
  return {
    name,
    hidden: false,
    namespaceType: 'single',
    mappings: {
      properties: {}
    },
    management: {
      importableAndExportable: true
    }
  };
};

exports.createExportableType = createExportableType;