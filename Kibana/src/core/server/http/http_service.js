"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _csp = require("../csp");

var _router = require("./router");

var _http_config = require("./http_config");

var _http_server = require("./http_server");

var _https_redirect_server = require("./https_redirect_server");

var _lifecycle_handlers = require("./lifecycle_handlers");

var _external_url = require("../external_url");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class HttpService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "prebootServer", void 0);
    (0, _defineProperty2.default)(this, "isPrebootServerStopped", false);
    (0, _defineProperty2.default)(this, "httpServer", void 0);
    (0, _defineProperty2.default)(this, "httpsRedirectServer", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "configSubscription", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "env", void 0);
    (0, _defineProperty2.default)(this, "internalPreboot", void 0);
    (0, _defineProperty2.default)(this, "internalSetup", void 0);
    (0, _defineProperty2.default)(this, "requestHandlerContext", void 0);
    this.coreContext = coreContext;
    const {
      logger,
      configService,
      env
    } = coreContext;
    this.env = env;
    this.log = logger.get('http');
    this.config$ = (0, _rxjs.combineLatest)([configService.atPath(_http_config.config.path), configService.atPath(_csp.config.path), configService.atPath(_external_url.config.path)]).pipe((0, _operators.map)(([http, csp, externalUrl]) => new _http_config.HttpConfig(http, csp, externalUrl)));
    const shutdownTimeout$ = this.config$.pipe((0, _operators.map)(({
      shutdownTimeout
    }) => shutdownTimeout));
    this.prebootServer = new _http_server.HttpServer(logger, 'Preboot', shutdownTimeout$);
    this.httpServer = new _http_server.HttpServer(logger, 'Kibana', shutdownTimeout$);
    this.httpsRedirectServer = new _https_redirect_server.HttpsRedirectServer(logger.get('http', 'redirect', 'server'));
  }

  async preboot(deps) {
    this.log.debug('setting up preboot server');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    const prebootSetup = await this.prebootServer.setup(config);
    prebootSetup.server.route({
      path: '/{p*}',
      method: '*',
      handler: (req, responseToolkit) => {
        this.log.debug(`Kibana server is not ready yet ${req.method}:${req.url.href}.`); // If server is not ready yet, because plugins or core can perform
        // long running tasks (build assets, saved objects migrations etc.)
        // we should let client know that and ask to retry after 30 seconds.

        return responseToolkit.response('Kibana server is not ready yet').code(503).header('Retry-After', '30');
      }
    });

    if (this.shouldListen(config)) {
      this.log.debug('starting preboot server');
      await this.prebootServer.start();
    }

    const prebootServerRequestHandlerContext = deps.context.createContextContainer();
    this.internalPreboot = {
      externalUrl: new _external_url.ExternalUrlConfig(config.externalUrl),
      csp: prebootSetup.csp,
      basePath: prebootSetup.basePath,
      registerStaticDir: prebootSetup.registerStaticDir.bind(prebootSetup),
      auth: prebootSetup.auth,
      server: prebootSetup.server,
      registerRouteHandlerContext: (pluginOpaqueId, contextName, provider) => prebootServerRequestHandlerContext.registerContext(pluginOpaqueId, contextName, provider),
      registerRoutes: (path, registerCallback) => {
        const router = new _router.Router(path, this.log, prebootServerRequestHandlerContext.createHandler.bind(null, this.coreContext.coreId));
        registerCallback(router);
        prebootSetup.registerRouterAfterListening(router);
      },
      getServerInfo: prebootSetup.getServerInfo
    };
    return this.internalPreboot;
  }

  async setup(deps) {
    this.requestHandlerContext = deps.context.createContextContainer();
    this.configSubscription = this.config$.subscribe(() => {
      if (this.httpServer.isListening()) {
        // If the server is already running we can't make any config changes
        // to it, so we warn and don't allow the config to pass through.
        this.log.warn('Received new HTTP config after server was started. Config will **not** be applied.');
      }
    });
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    const {
      registerRouter,
      ...serverContract
    } = await this.httpServer.setup(config, deps.executionContext);
    (0, _lifecycle_handlers.registerCoreHandlers)(serverContract, config, this.env);
    this.internalSetup = { ...serverContract,
      externalUrl: new _external_url.ExternalUrlConfig(config.externalUrl),
      createRouter: (path, pluginId = this.coreContext.coreId) => {
        const enhanceHandler = this.requestHandlerContext.createHandler.bind(null, pluginId);
        const router = new _router.Router(path, this.log, enhanceHandler);
        registerRouter(router);
        return router;
      },
      registerRouteHandlerContext: (pluginOpaqueId, contextName, provider) => this.requestHandlerContext.registerContext(pluginOpaqueId, contextName, provider),
      registerPrebootRoutes: this.internalPreboot.registerRoutes
    };
    return this.internalSetup;
  } // this method exists because we need the start contract to create the `CoreStart` used to start
  // the `plugin` and `legacy` services.


  getStartContract() {
    return { ...(0, _std.pick)(this.internalSetup, ['auth', 'basePath', 'getServerInfo']),
      isListening: () => this.httpServer.isListening()
    };
  }

  async start() {
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();

    if (this.shouldListen(config)) {
      this.log.debug('stopping preboot server');
      await this.prebootServer.stop();
      this.isPrebootServerStopped = true; // If a redirect port is specified, we start an HTTP server at this port and
      // redirect all requests to the SSL port.

      if (config.ssl.enabled && config.ssl.redirectHttpFromPort !== undefined) {
        await this.httpsRedirectServer.start(config);
      }

      await this.httpServer.start();
    }

    return this.getStartContract();
  }
  /**
   * Indicates if http server is configured to start listening on a configured port.
   * (if `server.autoListen` is not explicitly set to `false`.)
   *
   * @internal
   * */


  shouldListen(config) {
    return config.autoListen;
  }

  async stop() {
    var _this$configSubscript;

    (_this$configSubscript = this.configSubscription) === null || _this$configSubscript === void 0 ? void 0 : _this$configSubscript.unsubscribe();
    this.configSubscription = undefined;

    if (!this.isPrebootServerStopped) {
      this.isPrebootServerStopped = false;
      await this.prebootServer.stop();
    }

    await this.httpServer.stop();
    await this.httpsRedirectServer.stop();
  }

}

exports.HttpService = HttpService;