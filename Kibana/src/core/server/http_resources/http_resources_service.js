"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpResourcesService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _get_apm_config = require("./get_apm_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class HttpResourcesService {
  constructor(core) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = core.logger.get('http-resources');
  }

  preboot(deps) {
    this.logger.debug('prebooting HttpResourcesService');
    return {
      createRegistrar: this.createRegistrar.bind(this, deps)
    };
  }

  setup(deps) {
    this.logger.debug('setting up HttpResourcesService');
    return {
      createRegistrar: this.createRegistrar.bind(this, deps)
    };
  }

  start() {}

  stop() {}

  createRegistrar(deps, router) {
    return {
      register: (route, handler) => {
        return router.get(route, (context, request, response) => {
          return handler(context, request, { ...response,
            ...this.createResponseToolkit(deps, context, request, response)
          });
        });
      }
    };
  }

  createResponseToolkit(deps, context, request, response) {
    const cspHeader = deps.http.csp.header;
    return {
      async renderCoreApp(options = {}) {
        const apmConfig = (0, _get_apm_config.getApmConfig)(request.url.pathname);
        const body = await deps.rendering.render(request, context.core.uiSettings.client, {
          includeUserSettings: true,
          vars: {
            apmConfig
          }
        });
        return response.ok({
          body,
          headers: { ...options.headers,
            'content-security-policy': cspHeader
          }
        });
      },

      async renderAnonymousCoreApp(options = {}) {
        const apmConfig = (0, _get_apm_config.getApmConfig)(request.url.pathname);
        const body = await deps.rendering.render(request, context.core.uiSettings.client, {
          includeUserSettings: false,
          vars: {
            apmConfig
          }
        });
        return response.ok({
          body,
          headers: { ...options.headers,
            'content-security-policy': cspHeader
          }
        });
      },

      renderHtml(options) {
        return response.ok({
          body: options.body,
          headers: { ...options.headers,
            'content-type': 'text/html',
            'content-security-policy': cspHeader
          }
        });
      },

      renderJs(options) {
        return response.ok({
          body: options.body,
          headers: { ...options.headers,
            'content-type': 'text/javascript',
            'content-security-policy': cspHeader
          }
        });
      }

    };
  }

}

exports.HttpResourcesService = HttpResourcesService;