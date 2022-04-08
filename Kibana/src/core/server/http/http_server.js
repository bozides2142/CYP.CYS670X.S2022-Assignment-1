"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpServer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _inert = _interopRequireDefault(require("@hapi/inert"));

var _url = _interopRequireDefault(require("url"));

var _uuid = _interopRequireDefault(require("uuid"));

var _serverHttpTools = require("@kbn/server-http-tools");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _operators = require("rxjs/operators");

var _auth = require("./lifecycle/auth");

var _on_pre_auth = require("./lifecycle/on_pre_auth");

var _on_post_auth = require("./lifecycle/on_post_auth");

var _on_pre_routing = require("./lifecycle/on_pre_routing");

var _on_pre_response = require("./lifecycle/on_pre_response");

var _router = require("./router");

var _cookie_session_storage = require("./cookie_session_storage");

var _auth_state_storage = require("./auth_state_storage");

var _auth_headers_storage = require("./auth_headers_storage");

var _base_path_service = require("./base_path_service");

var _logging = require("./logging");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class HttpServer {
  constructor(logger, name, shutdownTimeout$) {
    (0, _defineProperty2.default)(this, "server", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "registeredRouters", new Set());
    (0, _defineProperty2.default)(this, "authRegistered", false);
    (0, _defineProperty2.default)(this, "cookieSessionStorageCreated", false);
    (0, _defineProperty2.default)(this, "handleServerResponseEvent", void 0);
    (0, _defineProperty2.default)(this, "stopping", false);
    (0, _defineProperty2.default)(this, "stopped", false);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "authState", void 0);
    (0, _defineProperty2.default)(this, "authRequestHeaders", void 0);
    (0, _defineProperty2.default)(this, "authResponseHeaders", void 0);
    this.logger = logger;
    this.name = name;
    this.shutdownTimeout$ = shutdownTimeout$;
    this.authState = new _auth_state_storage.AuthStateStorage(() => this.authRegistered);
    this.authRequestHeaders = new _auth_headers_storage.AuthHeadersStorage();
    this.authResponseHeaders = new _auth_headers_storage.AuthHeadersStorage();
    this.log = logger.get('http', 'server', name);
  }

  isListening() {
    return this.server !== undefined && this.server.listener.listening;
  }

  registerRouter(router) {
    if (this.isListening()) {
      throw new Error('Routers can be registered only when HTTP server is stopped.');
    }

    this.registeredRouters.add(router);
  }

  registerRouterAfterListening(router) {
    if (this.isListening()) {
      for (const route of router.getRoutes()) {
        this.configureRoute(route);
      }
    } else {
      // Not listening yet, add to set of registeredRouters so that it can be added after listening has started.
      this.registeredRouters.add(router);
    }
  }

  async setup(config, executionContext) {
    const serverOptions = (0, _serverHttpTools.getServerOptions)(config);
    const listenerOptions = (0, _serverHttpTools.getListenerOptions)(config);
    this.server = (0, _serverHttpTools.createServer)(serverOptions, listenerOptions);
    await this.server.register([_inert.default]);
    this.config = config; // It's important to have setupRequestStateAssignment call the very first, otherwise context passing will be broken.
    // That's the only reason why context initialization exists in this method.

    this.setupRequestStateAssignment(config, executionContext);
    const basePathService = new _base_path_service.BasePath(config.basePath, config.publicBaseUrl);
    this.setupBasePathRewrite(config, basePathService);
    this.setupConditionalCompression(config);
    this.setupResponseLogging();
    this.setupGracefulShutdownHandlers();
    return {
      registerRouter: this.registerRouter.bind(this),
      registerRouterAfterListening: this.registerRouterAfterListening.bind(this),
      registerStaticDir: this.registerStaticDir.bind(this),
      registerOnPreRouting: this.registerOnPreRouting.bind(this),
      registerOnPreAuth: this.registerOnPreAuth.bind(this),
      registerAuth: this.registerAuth.bind(this),
      registerOnPostAuth: this.registerOnPostAuth.bind(this),
      registerOnPreResponse: this.registerOnPreResponse.bind(this),
      createCookieSessionStorageFactory: cookieOptions => this.createCookieSessionStorageFactory(cookieOptions, config.basePath),
      basePath: basePathService,
      csp: config.csp,
      auth: {
        get: this.authState.get,
        isAuthenticated: this.authState.isAuthenticated
      },
      authRequestHeaders: this.authRequestHeaders,
      getServerInfo: () => ({
        name: config.name,
        hostname: config.host,
        port: config.port,
        protocol: this.server.info.protocol
      }),
      // Return server instance with the connection options so that we can properly
      // bridge core and the "legacy" Kibana internally. Once this bridge isn't
      // needed anymore we shouldn't return the instance from this method.
      server: this.server
    };
  }

  async start() {
    if (this.server === undefined) {
      throw new Error('Http server is not setup up yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`start called after stop`);
      return;
    }

    this.log.debug('starting http server');

    for (const router of this.registeredRouters) {
      for (const route of router.getRoutes()) {
        this.configureRoute(route);
      }
    }

    await this.server.start();
    const serverPath = this.config && this.config.rewriteBasePath && this.config.basePath !== undefined ? this.config.basePath : '';
    this.log.info(`http server running at ${this.server.info.uri}${serverPath}`);
  }

  async stop() {
    this.stopping = true;

    if (this.server === undefined) {
      this.stopping = false;
      this.stopped = true;
      return;
    }

    const hasStarted = this.server.info.started > 0;

    if (hasStarted) {
      this.log.debug('stopping http server');
      const shutdownTimeout = await this.shutdownTimeout$.pipe((0, _operators.take)(1)).toPromise();
      await this.server.stop({
        timeout: shutdownTimeout.asMilliseconds()
      });
      this.log.debug(`http server stopped`); // Removing the listener after stopping so we don't leave any pending requests unhandled

      if (this.handleServerResponseEvent) {
        this.server.events.removeListener('response', this.handleServerResponseEvent);
      }
    }

    this.stopping = false;
    this.stopped = true;
  }

  getAuthOption(authRequired = true) {
    if (this.authRegistered === false) return undefined;

    if (authRequired === true) {
      return {
        mode: 'required'
      };
    }

    if (authRequired === 'optional') {
      // we want to use HAPI `try` mode and not `optional` to not throw unauthorized errors when the user
      // has invalid or expired credentials
      return {
        mode: 'try'
      };
    }

    if (authRequired === false) {
      return false;
    }
  }

  setupGracefulShutdownHandlers() {
    this.registerOnPreRouting((request, response, toolkit) => {
      if (this.stopping || this.stopped) {
        return response.customError({
          statusCode: 503,
          body: {
            message: 'Kibana is shutting down and not accepting new incoming requests'
          }
        });
      }

      return toolkit.next();
    });
  }

  setupBasePathRewrite(config, basePathService) {
    if (config.basePath === undefined || !config.rewriteBasePath) {
      return;
    }

    this.registerOnPreRouting((request, response, toolkit) => {
      const oldUrl = request.url.pathname + request.url.search;
      const newURL = basePathService.remove(oldUrl);
      const shouldRedirect = newURL !== oldUrl;

      if (shouldRedirect) {
        return toolkit.rewriteUrl(newURL);
      }

      return response.notFound();
    });
  }

  setupConditionalCompression(config) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`setupConditionalCompression called after stop`);
    }

    const {
      enabled,
      referrerWhitelist: list
    } = config.compression;

    if (!enabled) {
      this.log.debug('HTTP compression is disabled');
      this.server.ext('onRequest', (request, h) => {
        request.info.acceptEncoding = '';
        return h.continue;
      });
    } else if (list) {
      this.log.debug(`HTTP compression is only enabled for any referrer in the following: ${list}`);
      this.server.ext('onRequest', (request, h) => {
        const {
          referrer
        } = request.info;

        if (referrer !== '') {
          const {
            hostname
          } = _url.default.parse(referrer);

          if (!hostname || !list.includes(hostname)) {
            request.info.acceptEncoding = '';
          }
        }

        return h.continue;
      });
    }
  }

  setupResponseLogging() {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`setupResponseLogging called after stop`);
    }

    const log = this.logger.get('http', 'server', 'response');

    this.handleServerResponseEvent = request => {
      const {
        message,
        meta
      } = (0, _logging.getEcsResponseLog)(request, this.log);
      log.debug(message, meta);
    };

    this.server.events.on('response', this.handleServerResponseEvent);
  }

  setupRequestStateAssignment(config, executionContext) {
    this.server.ext('onRequest', (request, responseToolkit) => {
      var _request$app;

      const requestId = (0, _serverHttpTools.getRequestId)(request, config.requestId);
      const parentContext = executionContext === null || executionContext === void 0 ? void 0 : executionContext.getParentContextFrom(request.headers);

      if (executionContext && parentContext) {
        executionContext.set(parentContext);

        _elasticApmNode.default.addLabels(executionContext.getAsLabels());
      }

      executionContext === null || executionContext === void 0 ? void 0 : executionContext.setRequestId(requestId);
      request.app = { ...((_request$app = request.app) !== null && _request$app !== void 0 ? _request$app : {}),
        requestId,
        requestUuid: _uuid.default.v4(),
        // Kibana stores trace.id until https://github.com/elastic/apm-agent-nodejs/issues/2353 is resolved
        // The current implementation of the APM agent ends a request transaction before "response" log is emitted.
        traceId: _elasticApmNode.default.currentTraceIds['trace.id']
      };
      return responseToolkit.continue;
    });
  }

  registerOnPreAuth(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`registerOnPreAuth called after stop`);
    }

    this.server.ext('onPreAuth', (0, _on_pre_auth.adoptToHapiOnPreAuth)(fn, this.log));
  }

  registerOnPostAuth(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`registerOnPostAuth called after stop`);
    }

    this.server.ext('onPostAuth', (0, _on_post_auth.adoptToHapiOnPostAuthFormat)(fn, this.log));
  }

  registerOnPreRouting(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`registerOnPreRouting called after stop`);
    }

    this.server.ext('onRequest', (0, _on_pre_routing.adoptToHapiOnRequest)(fn, this.log));
  }

  registerOnPreResponse(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`registerOnPreResponse called after stop`);
    }

    this.server.ext('onPreResponse', (0, _on_pre_response.adoptToHapiOnPreResponseFormat)(fn, this.log));
  }

  async createCookieSessionStorageFactory(cookieOptions, basePath) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`createCookieSessionStorageFactory called after stop`);
    }

    if (this.cookieSessionStorageCreated) {
      throw new Error('A cookieSessionStorageFactory was already created');
    }

    this.cookieSessionStorageCreated = true;
    const sessionStorageFactory = await (0, _cookie_session_storage.createCookieSessionStorageFactory)(this.logger.get('http', 'server', this.name, 'cookie-session-storage'), this.server, cookieOptions, basePath);
    return sessionStorageFactory;
  }

  registerAuth(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`registerAuth called after stop`);
    }

    if (this.authRegistered) {
      throw new Error('Auth interceptor was already registered');
    }

    this.authRegistered = true;
    this.server.auth.scheme('login', () => ({
      authenticate: (0, _auth.adoptToHapiAuthFormat)(fn, this.log, (req, {
        state,
        requestHeaders,
        responseHeaders
      }) => {
        this.authState.set(req, state);

        if (responseHeaders) {
          this.authResponseHeaders.set(req, responseHeaders);
        }

        if (requestHeaders) {
          this.authRequestHeaders.set(req, requestHeaders); // we mutate headers only for the backward compatibility with the legacy platform.
          // where some plugin read directly from headers to identify whether a user is authenticated.

          Object.assign(req.headers, requestHeaders);
        }
      })
    }));
    this.server.auth.strategy('session', 'login'); // The default means that the `session` strategy that is based on `login` schema defined above will be
    // automatically assigned to all routes that don't contain an auth config.
    // should be applied for all routes if they don't specify auth strategy in route declaration
    // https://github.com/hapijs/hapi/blob/master/API.md#-serverauthdefaultoptions

    this.server.auth.default('session');
    this.registerOnPreResponse((request, preResponseInfo, t) => {
      const authResponseHeaders = this.authResponseHeaders.get(request);
      return t.next({
        headers: authResponseHeaders
      });
    });
  }

  registerStaticDir(path, dirPath) {
    if (this.server === undefined) {
      throw new Error('Http server is not setup up yet');
    }

    if (this.stopping || this.stopped) {
      this.log.warn(`registerStaticDir called after stop`);
    }

    this.server.route({
      path,
      method: 'GET',
      handler: {
        directory: {
          path: dirPath,
          listing: false,
          lookupCompressed: true
        }
      },
      options: {
        auth: false,
        cache: {
          privacy: 'public',
          otherwise: 'must-revalidate'
        }
      }
    });
  }

  configureRoute(route) {
    var _route$options$xsrfRe, _timeout$idleSocket;

    this.log.debug(`registering route handler for [${route.path}]`); // Hapi does not allow payload validation to be specified for 'head' or 'get' requests

    const validate = (0, _router.isSafeMethod)(route.method) ? undefined : {
      payload: true
    };
    const {
      authRequired,
      tags,
      body = {},
      timeout
    } = route.options;
    const {
      accepts: allow,
      maxBytes,
      output,
      parse
    } = body;
    const kibanaRouteOptions = {
      xsrfRequired: (_route$options$xsrfRe = route.options.xsrfRequired) !== null && _route$options$xsrfRe !== void 0 ? _route$options$xsrfRe : !(0, _router.isSafeMethod)(route.method)
    };
    this.server.route({
      handler: route.handler,
      method: route.method,
      path: route.path,
      options: {
        auth: this.getAuthOption(authRequired),
        app: kibanaRouteOptions,
        tags: tags ? Array.from(tags) : undefined,
        // TODO: This 'validate' section can be removed once the legacy platform is completely removed.
        // We are telling Hapi that NP routes can accept any payload, so that it can bypass the default
        // validation applied in ./http_tools#getServerOptions
        // (All NP routes are already required to specify their own validation in order to access the payload)
        validate,
        // @ts-expect-error Types are outdated and doesn't allow `payload.multipart` to be `true`
        payload: [allow, maxBytes, output, parse, timeout === null || timeout === void 0 ? void 0 : timeout.payload].some(x => x !== undefined) ? {
          allow,
          maxBytes,
          output,
          parse,
          timeout: timeout === null || timeout === void 0 ? void 0 : timeout.payload,
          multipart: true
        } : undefined,
        timeout: {
          socket: (_timeout$idleSocket = timeout === null || timeout === void 0 ? void 0 : timeout.idleSocket) !== null && _timeout$idleSocket !== void 0 ? _timeout$idleSocket : this.config.socketTimeout
        }
      }
    });
  }

}

exports.HttpServer = HttpServer;