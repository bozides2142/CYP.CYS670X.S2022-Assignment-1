"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customLinkRouteRepository = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _license_check = require("../../../../common/license_check");

var _custom_link = require("../../../../common/custom_link");

var _custom_link_filter_options = require("../../../../common/custom_link/custom_link_filter_options");

var _feature = require("../../../feature");

var _setup_request = require("../../../lib/helpers/setup_request");

var _create_or_update_custom_link = require("./create_or_update_custom_link");

var _custom_link_types = require("./custom_link_types");

var _delete_custom_link = require("./delete_custom_link");

var _get_transaction = require("./get_transaction");

var _list_custom_links = require("./list_custom_links");

var _create_apm_server_route = require("../../apm_routes/create_apm_server_route");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const customLinkTransactionRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/custom_links/transaction',
  options: {
    tags: ['access:apm']
  },
  params: t.partial({
    query: _custom_link_types.filterOptionsRt
  }),
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      params
    } = resources;
    const {
      query
    } = params; // picks only the items listed in FILTER_OPTIONS

    const filters = (0, _lodash.pick)(query, _custom_link_filter_options.FILTER_OPTIONS);
    return await (0, _get_transaction.getTransaction)({
      setup,
      filters
    });
  }
});
const listCustomLinksRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/custom_links',
  options: {
    tags: ['access:apm']
  },
  params: t.partial({
    query: _custom_link_types.filterOptionsRt
  }),
  handler: async resources => {
    const {
      context,
      params
    } = resources;

    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      query
    } = params; // picks only the items listed in FILTER_OPTIONS

    const filters = (0, _lodash.pick)(query, _custom_link_filter_options.FILTER_OPTIONS);
    const customLinks = await (0, _list_custom_links.listCustomLinks)({
      setup,
      filters
    });
    return {
      customLinks
    };
  }
});
const createCustomLinkRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/settings/custom_links',
  params: t.type({
    body: _custom_link_types.payloadRt
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    const {
      context,
      params
    } = resources;

    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const customLink = params.body;
    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: context.licensing,
      featureName: 'customLinks'
    });
    await (0, _create_or_update_custom_link.createOrUpdateCustomLink)({
      customLink,
      setup
    });
  }
});
const updateCustomLinkRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'PUT /internal/apm/settings/custom_links/{id}',
  params: t.type({
    path: t.type({
      id: t.string
    }),
    body: _custom_link_types.payloadRt
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    const {
      params,
      context
    } = resources;

    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      id
    } = params.path;
    const customLink = params.body;
    await (0, _create_or_update_custom_link.createOrUpdateCustomLink)({
      customLinkId: id,
      customLink,
      setup
    });
  }
});
const deleteCustomLinkRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'DELETE /internal/apm/settings/custom_links/{id}',
  params: t.type({
    path: t.type({
      id: t.string
    })
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    const {
      context,
      params
    } = resources;

    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      id
    } = params.path;
    const res = await (0, _delete_custom_link.deleteCustomLink)({
      customLinkId: id,
      setup
    });
    return res;
  }
});
const customLinkRouteRepository = { ...customLinkTransactionRoute,
  ...listCustomLinksRoute,
  ...createCustomLinkRoute,
  ...updateCustomLinkRoute,
  ...deleteCustomLinkRoute
};
exports.customLinkRouteRepository = customLinkRouteRepository;