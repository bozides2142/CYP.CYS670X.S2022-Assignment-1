"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspectableEsQueriesMap = void 0;
exports.registerRoutes = registerRoutes;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _elasticsearch = require("@elastic/elasticsearch");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _lodash = require("lodash");

var _serverRouteRepository = require("@kbn/server-route-repository");

var _ioTsUtils = require("@kbn/io-ts-utils");

var _pick_keys = require("../../../common/utils/pick_keys");

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


const inspectRt = t.exact(t.partial({
  query: t.exact(t.partial({
    _inspect: _ioTsUtils.jsonRt.pipe(t.boolean)
  }))
}));
const CLIENT_CLOSED_REQUEST = {
  statusCode: 499,
  body: {
    message: 'Client closed request'
  }
};
const inspectableEsQueriesMap = new WeakMap();
exports.inspectableEsQueriesMap = inspectableEsQueriesMap;

function registerRoutes({
  core,
  repository,
  plugins,
  logger,
  config,
  ruleDataClient,
  telemetryUsageCounter,
  kibanaVersion
}) {
  const routes = Object.values(repository);
  const router = core.setup.http.createRouter();
  routes.forEach(route => {
    const {
      params,
      endpoint,
      options,
      handler
    } = route;
    const {
      method,
      pathname
    } = (0, _serverRouteRepository.parseEndpoint)(endpoint);
    router[method]({
      path: pathname,
      options,
      validate: _serverRouteRepository.routeValidationObject
    }, async (context, request, response) => {
      if (_elasticApmNode.default.isStarted()) {
        _elasticApmNode.default.addLabels({
          plugin: 'apm'
        });
      } // init debug queries


      inspectableEsQueriesMap.set(request, []);

      try {
        var _validatedParams$quer;

        const runtimeType = params ? (0, _ioTsUtils.mergeRt)(params, inspectRt) : inspectRt;
        const validatedParams = (0, _serverRouteRepository.decodeRequestParams)((0, _pick_keys.pickKeys)(request, 'params', 'body', 'query'), runtimeType);
        const {
          aborted,
          data
        } = await Promise.race([handler({
          request,
          context,
          config,
          logger,
          core,
          plugins,
          telemetryUsageCounter,
          params: (0, _lodash.merge)({
            query: {
              _inspect: false
            }
          }, validatedParams),
          ruleDataClient,
          kibanaVersion
        }).then(value => {
          return {
            aborted: false,
            data: value
          };
        }), request.events.aborted$.toPromise().then(() => {
          return {
            aborted: true,
            data: undefined
          };
        })]);

        if (aborted) {
          return response.custom(CLIENT_CLOSED_REQUEST);
        }

        if (Array.isArray(data)) {
          throw new Error('Return type cannot be an array');
        }

        const body = (_validatedParams$quer = validatedParams.query) !== null && _validatedParams$quer !== void 0 && _validatedParams$quer._inspect ? { ...data,
          _inspect: inspectableEsQueriesMap.get(request)
        } : { ...data
        };

        if (!options.disableTelemetry && telemetryUsageCounter) {
          telemetryUsageCounter.incrementCounter({
            counterName: `${method.toUpperCase()} ${pathname}`,
            counterType: 'success'
          });
        }

        return response.ok({
          body
        });
      } catch (error) {
        logger.error(error);

        if (!options.disableTelemetry && telemetryUsageCounter) {
          telemetryUsageCounter.incrementCounter({
            counterName: `${method.toUpperCase()} ${pathname}`,
            counterType: 'error'
          });
        }

        const opts = {
          statusCode: 500,
          body: {
            message: error.message,
            attributes: {
              _inspect: inspectableEsQueriesMap.get(request)
            }
          }
        };

        if (error instanceof _elasticsearch.errors.RequestAbortedError) {
          return response.custom((0, _lodash.merge)(opts, CLIENT_CLOSED_REQUEST));
        }

        if (_boom.default.isBoom(error)) {
          opts.statusCode = error.output.statusCode;
        }

        return response.custom(opts);
      } finally {
        // cleanup
        inspectableEsQueriesMap.delete(request);
      }
    });
  });
}