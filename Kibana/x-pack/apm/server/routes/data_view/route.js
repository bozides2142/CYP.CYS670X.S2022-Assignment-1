"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataViewRouteRepository = void 0;

var _create_static_data_view = require("./create_static_data_view");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_dynamic_data_view = require("./get_dynamic_data_view");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const staticDataViewRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/data_view/static',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      request,
      core,
      plugins: {
        spaces
      },
      config
    } = resources;
    const setupPromise = (0, _setup_request.setupRequest)(resources);
    const clientPromise = core.start().then(coreStart => coreStart.savedObjects.createInternalRepository());
    const setup = await setupPromise;
    const savedObjectsClient = await clientPromise;
    const spaceId = spaces === null || spaces === void 0 ? void 0 : spaces.setup.spacesService.getSpaceId(request);
    const didCreateDataView = await (0, _create_static_data_view.createStaticDataView)({
      setup,
      config,
      savedObjectsClient,
      spaceId
    });
    return {
      created: didCreateDataView
    };
  }
});
const dynamicDataViewRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/data_view/dynamic',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    config,
    logger
  }) => {
    const dynamicDataView = await (0, _get_dynamic_data_view.getDynamicDataView)({
      context,
      config,
      logger
    });
    return {
      dynamicDataView
    };
  }
});
const dataViewRouteRepository = { ...staticDataViewRoute,
  ...dynamicDataViewRoute
};
exports.dataViewRouteRepository = dataViewRouteRepository;