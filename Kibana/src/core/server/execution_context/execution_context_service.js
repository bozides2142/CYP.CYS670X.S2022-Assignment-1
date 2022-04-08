"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutionContextService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _async_hooks = require("async_hooks");

var _lodash = require("lodash");

var _execution_context_container = require("./execution_context_container");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExecutionContextService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "contextStore", void 0);
    (0, _defineProperty2.default)(this, "requestIdStore", void 0);
    (0, _defineProperty2.default)(this, "enabled", false);
    (0, _defineProperty2.default)(this, "configSubscription", void 0);
    this.coreContext = coreContext;
    this.log = coreContext.logger.get('execution_context');
    this.contextStore = new _async_hooks.AsyncLocalStorage();
    this.requestIdStore = new _async_hooks.AsyncLocalStorage();
  }

  setup() {
    this.configSubscription = this.coreContext.configService.atPath('execution_context').subscribe(config => {
      this.enabled = config.enabled;
    });
    return {
      getParentContextFrom: _execution_context_container.getParentContextFrom,
      set: this.set.bind(this),
      withContext: this.withContext.bind(this),
      setRequestId: this.setRequestId.bind(this),
      get: this.get.bind(this),
      getAsHeader: this.getAsHeader.bind(this),
      getAsLabels: this.getAsLabels.bind(this)
    };
  }

  start() {
    return {
      getParentContextFrom: _execution_context_container.getParentContextFrom,
      set: this.set.bind(this),
      setRequestId: this.setRequestId.bind(this),
      withContext: this.withContext.bind(this),
      get: this.get.bind(this),
      getAsHeader: this.getAsHeader.bind(this),
      getAsLabels: this.getAsLabels.bind(this)
    };
  }

  stop() {
    this.enabled = false;

    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
      this.configSubscription = undefined;
    }
  }

  set(context) {
    if (!this.enabled) return;
    const contextContainer = new _execution_context_container.ExecutionContextContainer(context); // we have to use enterWith since Hapi lifecycle model is built on event emitters.
    // therefore if we wrapped request handler in asyncLocalStorage.run(), we would lose context in other lifecycles.

    this.contextStore.enterWith(contextContainer);
    this.log.debug(JSON.stringify(contextContainer));
  }

  withContext(context, fn) {
    if (!this.enabled || !context) {
      return fn();
    }

    const parent = this.contextStore.getStore();
    const contextContainer = new _execution_context_container.ExecutionContextContainer(context, parent);
    this.log.debug(JSON.stringify(contextContainer));
    return this.contextStore.run(contextContainer, fn);
  }

  setRequestId(requestId) {
    if (!this.enabled) return;
    this.requestIdStore.enterWith({
      requestId
    });
  }

  get() {
    if (!this.enabled) return;
    return this.contextStore.getStore();
  }

  getAsHeader() {
    var _this$requestIdStore$, _this$requestIdStore$2, _this$contextStore$ge;

    if (!this.enabled) return; // requestId may not be present in the case of FakeRequest

    const requestId = (_this$requestIdStore$ = (_this$requestIdStore$2 = this.requestIdStore.getStore()) === null || _this$requestIdStore$2 === void 0 ? void 0 : _this$requestIdStore$2.requestId) !== null && _this$requestIdStore$ !== void 0 ? _this$requestIdStore$ : 'unknownId';
    const executionContext = (_this$contextStore$ge = this.contextStore.getStore()) === null || _this$contextStore$ge === void 0 ? void 0 : _this$contextStore$ge.toString();
    const executionContextStr = executionContext ? `;kibana:${executionContext}` : '';
    return `${requestId}${executionContextStr}`;
  }

  getAsLabels() {
    var _this$contextStore$ge2;

    if (!this.enabled) return {};
    const executionContext = (_this$contextStore$ge2 = this.contextStore.getStore()) === null || _this$contextStore$ge2 === void 0 ? void 0 : _this$contextStore$ge2.toJSON();
    return (0, _lodash.omitBy)({
      name: executionContext === null || executionContext === void 0 ? void 0 : executionContext.name,
      id: executionContext === null || executionContext === void 0 ? void 0 : executionContext.id,
      page: executionContext === null || executionContext === void 0 ? void 0 : executionContext.page
    }, _lodash.isUndefined);
  }

}

exports.ExecutionContextService = ExecutionContextService;