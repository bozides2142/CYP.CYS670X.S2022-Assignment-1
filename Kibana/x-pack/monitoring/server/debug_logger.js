"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateDebugServer = decorateDebugServer;

var _fs = _interopRequireDefault(require("fs"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function decorateDebugServer(_server, config, logger) {
  // bail if the proper config value is not set (extra protection)
  if (!config.ui.debug_mode) {
    return _server;
  } // create a debug logger that will either write to file (if debug_log_path exists) or log out via logger


  const debugLog = createDebugLogger({
    path: config.ui.debug_log_path,
    logger
  });
  return { // maintain the rest of _server untouched
    ..._server,
    // TODO: replace any
    route: options => {
      const apiPath = options.path;
      return _server.route({ ...options,
        // TODO: replace any
        handler: async req => {
          const {
            elasticsearch: cached
          } = req.server.plugins;
          const apiRequestHeaders = req.headers;
          req.server.plugins.elasticsearch = { ...req.server.plugins.elasticsearch,
            getCluster: name => {
              const cluster = cached.getCluster(name);
              return { ...cluster,
                // TODO: better types?
                callWithRequest: async (_req, type, params) => {
                  const result = await cluster.callWithRequest(_req, type, params); // log everything about this request -> query -> result

                  debugLog({
                    api_path: apiPath,
                    referer_url: apiRequestHeaders.referer,
                    query: {
                      params,
                      result
                    }
                  });
                  return result;
                }
              };
            }
          };
          return options.handler(req);
        }
      });
    }
  };
}

function createDebugLogger({
  path,
  logger
}) {
  if (path.length > 0) {
    const stream = _fs.default.createWriteStream('./stack_monitoring_debug_log.ndjson', {
      flags: 'a'
    });

    return function logToFile(line) {
      stream.write(JSON.stringify(line));
    };
  } else {
    return function logToStdOut(line) {
      logger.info(JSON.stringify(line));
    };
  }
}