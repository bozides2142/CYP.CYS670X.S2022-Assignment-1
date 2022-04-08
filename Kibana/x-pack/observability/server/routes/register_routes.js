"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var t = _interopRequireWildcard(require("io-ts"));

var _serverRouteRepository = require("@kbn/server-route-repository");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _elasticsearch = require("@elastic/elasticsearch");

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


function registerRoutes({
  repository,
  core,
  logger,
  ruleDataService
}) {
  const routes = Object.values(repository);
  const router = core.setup.http.createRouter();
  routes.forEach(route => {
    const {
      endpoint,
      options,
      handler,
      params
    } = route;
    const {
      pathname,
      method
    } = (0, _serverRouteRepository.parseEndpoint)(endpoint);
    router[method]({
      path: pathname,
      validate: _serverRouteRepository.routeValidationObject,
      options
    }, async (context, request, response) => {
      try {
        const decodedParams = (0, _serverRouteRepository.decodeRequestParams)({
          params: request.params,
          body: request.body,
          query: request.query
        }, params !== null && params !== void 0 ? params : t.strict({}));
        const data = await handler({
          context,
          request,
          core,
          logger,
          params: decodedParams,
          ruleDataService
        });
        return response.ok({
          body: data
        });
      } catch (error) {
        logger.error(error);
        const opts = {
          statusCode: 500,
          body: {
            message: error.message
          }
        };

        if (_boom.default.isBoom(error)) {
          opts.statusCode = error.output.statusCode;
        }

        if (error instanceof _elasticsearch.errors.RequestAbortedError) {
          opts.statusCode = 499;
          opts.body.message = 'Client closed request';
        }

        return response.custom(opts);
      }
    });
  });
}