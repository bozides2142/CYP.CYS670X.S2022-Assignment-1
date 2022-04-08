"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSessionService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _esQuery = require("@kbn/es-query");

var _server = require("../../../../../../src/core/server");

var _common = require("../../../../../../src/plugins/data/common");

var _server2 = require("../../../../../../src/plugins/data/server");

var _utils = require("./utils");

var _setup_task = require("./setup_task");

var _types = require("./types");

var _check_persisted_sessions = require("./check_persisted_sessions");

var _check_non_persisted_sessions = require("./check_non_persisted_sessions");

var _expire_persisted_sessions = require("./expire_persisted_sessions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEBOUNCE_UPDATE_OR_CREATE_WAIT = 1000;
const DEBOUNCE_UPDATE_OR_CREATE_MAX_WAIT = 5000;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class SearchSessionService {
  constructor(logger, config, version, security) {
    (0, _defineProperty2.default)(this, "sessionConfig", void 0);
    (0, _defineProperty2.default)(this, "updateOrCreateBatchQueue", []);
    (0, _defineProperty2.default)(this, "setupMonitoring", async (core, deps) => {
      const taskDeps = {
        config: this.config,
        taskManager: deps.taskManager,
        logger: this.logger
      };

      if (this.sessionConfig.enabled) {
        (0, _setup_task.scheduleSearchSessionsTask)(taskDeps, _check_persisted_sessions.SEARCH_SESSIONS_TASK_ID, _check_persisted_sessions.SEARCH_SESSIONS_TASK_TYPE, this.sessionConfig.trackingInterval);
        (0, _setup_task.scheduleSearchSessionsTask)(taskDeps, _check_non_persisted_sessions.SEARCH_SESSIONS_CLEANUP_TASK_ID, _check_non_persisted_sessions.SEARCH_SESSIONS_CLEANUP_TASK_TYPE, this.sessionConfig.cleanupInterval);
        (0, _setup_task.scheduleSearchSessionsTask)(taskDeps, _expire_persisted_sessions.SEARCH_SESSIONS_EXPIRE_TASK_ID, _expire_persisted_sessions.SEARCH_SESSIONS_EXPIRE_TASK_TYPE, this.sessionConfig.expireInterval);
      } else {
        (0, _setup_task.unscheduleSearchSessionsTask)(taskDeps, _check_persisted_sessions.SEARCH_SESSIONS_TASK_ID);
        (0, _setup_task.unscheduleSearchSessionsTask)(taskDeps, _check_non_persisted_sessions.SEARCH_SESSIONS_CLEANUP_TASK_ID);
        (0, _setup_task.unscheduleSearchSessionsTask)(taskDeps, _expire_persisted_sessions.SEARCH_SESSIONS_EXPIRE_TASK_ID);
      }
    });
    (0, _defineProperty2.default)(this, "processUpdateOrCreateBatchQueue", (0, _lodash.debounce)(() => {
      const queue = [...this.updateOrCreateBatchQueue];
      if (queue.length === 0) return;
      this.updateOrCreateBatchQueue.length = 0;
      const batchedSessionAttributes = queue.reduce((res, next) => {
        if (!res[next.sessionId]) {
          res[next.sessionId] = next.attributes;
        } else {
          res[next.sessionId] = { ...res[next.sessionId],
            ...next.attributes,
            idMapping: { ...res[next.sessionId].idMapping,
              ...next.attributes.idMapping
            }
          };
        }

        return res;
      }, {});
      Object.keys(batchedSessionAttributes).forEach(sessionId => {
        const thisSession = queue.filter(s => s.sessionId === sessionId);
        this.updateOrCreate(thisSession[0].deps, thisSession[0].user, sessionId, batchedSessionAttributes[sessionId]).then(() => {
          thisSession.forEach(s => s.resolve());
        }).catch(e => {
          thisSession.forEach(s => s.reject(e));
        });
      });
    }, DEBOUNCE_UPDATE_OR_CREATE_WAIT, {
      maxWait: DEBOUNCE_UPDATE_OR_CREATE_MAX_WAIT
    }));
    (0, _defineProperty2.default)(this, "scheduleUpdateOrCreate", (deps, user, sessionId, attributes) => {
      return new Promise((resolve, reject) => {
        this.updateOrCreateBatchQueue.push({
          deps,
          user,
          sessionId,
          attributes,
          resolve,
          reject
        }); // TODO: this would be better if we'd debounce per sessionId

        this.processUpdateOrCreateBatchQueue();
      });
    });
    (0, _defineProperty2.default)(this, "updateOrCreate", async (deps, user, sessionId, attributes, retry = 1) => {
      const retryOnConflict = async e => {
        this.logger.debug(`Conflict error | ${sessionId}`); // Randomize sleep to spread updates out in case of conflicts

        await sleep(100 + Math.random() * 50);
        return await this.updateOrCreate(deps, user, sessionId, attributes, retry + 1);
      };

      this.logger.debug(`updateOrCreate | ${sessionId} | ${retry}`);

      try {
        return await this.update(deps, user, sessionId, attributes);
      } catch (e) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
          try {
            this.logger.debug(`Object not found | ${sessionId}`);
            return await this.create(deps, user, sessionId, attributes);
          } catch (createError) {
            if (_server.SavedObjectsErrorHelpers.isConflictError(createError) && retry < this.sessionConfig.maxUpdateRetries) {
              return await retryOnConflict(createError);
            } else {
              this.logger.error(createError);
            }
          }
        } else if (_server.SavedObjectsErrorHelpers.isConflictError(e) && retry < this.sessionConfig.maxUpdateRetries) {
          return await retryOnConflict(e);
        } else {
          this.logger.error(e);
        }
      }

      return undefined;
    });
    (0, _defineProperty2.default)(this, "save", async (deps, user, sessionId, {
      name,
      appId,
      locatorId,
      initialState = {},
      restoreState = {}
    }) => {
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      if (!name) throw new Error('Name is required');
      if (!appId) throw new Error('AppId is required');
      if (!locatorId) throw new Error('locatorId is required');
      return this.updateOrCreate(deps, user, sessionId, {
        name,
        appId,
        locatorId,
        initialState,
        restoreState,
        persisted: true
      });
    });
    (0, _defineProperty2.default)(this, "create", ({
      savedObjectsClient
    }, user, sessionId, attributes) => {
      this.logger.debug(`create | ${sessionId}`);
      const realmType = user === null || user === void 0 ? void 0 : user.authentication_realm.type;
      const realmName = user === null || user === void 0 ? void 0 : user.authentication_realm.name;
      const username = user === null || user === void 0 ? void 0 : user.username;
      return savedObjectsClient.create(_common.SEARCH_SESSION_TYPE, {
        sessionId,
        status: _common.SearchSessionStatus.IN_PROGRESS,
        expires: new Date(Date.now() + this.sessionConfig.defaultExpiration.asMilliseconds()).toISOString(),
        created: new Date().toISOString(),
        touched: new Date().toISOString(),
        idMapping: {},
        persisted: false,
        version: this.version,
        realmType,
        realmName,
        username,
        ...attributes
      }, {
        id: sessionId
      });
    });
    (0, _defineProperty2.default)(this, "get", async ({
      savedObjectsClient
    }, user, sessionId) => {
      this.logger.debug(`get | ${sessionId}`);
      const session = await savedObjectsClient.get(_common.SEARCH_SESSION_TYPE, sessionId);
      this.throwOnUserConflict(user, session);
      return session;
    });
    (0, _defineProperty2.default)(this, "find", ({
      savedObjectsClient
    }, user, options) => {
      const userFilters = user === null ? [] : [_esQuery.nodeBuilder.is(`${_common.SEARCH_SESSION_TYPE}.attributes.realmType`, `${user.authentication_realm.type}`), _esQuery.nodeBuilder.is(`${_common.SEARCH_SESSION_TYPE}.attributes.realmName`, `${user.authentication_realm.name}`), _esQuery.nodeBuilder.is(`${_common.SEARCH_SESSION_TYPE}.attributes.username`, `${user.username}`)];
      const filterKueryNode = typeof options.filter === 'string' ? (0, _esQuery.fromKueryExpression)(options.filter) : options.filter;

      const filter = _esQuery.nodeBuilder.and(userFilters.concat(filterKueryNode !== null && filterKueryNode !== void 0 ? filterKueryNode : []));

      return savedObjectsClient.find({ ...options,
        filter,
        type: _common.SEARCH_SESSION_TYPE
      });
    });
    (0, _defineProperty2.default)(this, "update", async (deps, user, sessionId, attributes) => {
      this.logger.debug(`update | ${sessionId}`);
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      await this.get(deps, user, sessionId); // Verify correct user

      return deps.savedObjectsClient.update(_common.SEARCH_SESSION_TYPE, sessionId, { ...attributes,
        touched: new Date().toISOString()
      });
    });
    (0, _defineProperty2.default)(this, "cancel", async (deps, user, sessionId) => {
      this.logger.debug(`delete | ${sessionId}`);
      return this.update(deps, user, sessionId, {
        status: _common.SearchSessionStatus.CANCELLED
      });
    });
    (0, _defineProperty2.default)(this, "delete", async (deps, user, sessionId) => {
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      this.logger.debug(`delete | ${sessionId}`);
      await this.get(deps, user, sessionId); // Verify correct user

      return deps.savedObjectsClient.delete(_common.SEARCH_SESSION_TYPE, sessionId);
    });
    (0, _defineProperty2.default)(this, "trackId", async (deps, user, searchRequest, searchId, {
      sessionId,
      strategy = _common.ENHANCED_ES_SEARCH_STRATEGY
    }) => {
      if (!this.sessionConfig.enabled || !sessionId || !searchId) return;
      this.logger.debug(`trackId | ${sessionId} | ${searchId}`);
      let idMapping = {};

      if (searchRequest.params) {
        const requestHash = (0, _utils.createRequestHash)(searchRequest.params);
        const searchInfo = {
          id: searchId,
          strategy,
          status: _types.SearchStatus.IN_PROGRESS
        };
        idMapping = {
          [requestHash]: searchInfo
        };
      }

      await this.scheduleUpdateOrCreate(deps, user, sessionId, {
        idMapping
      });
    });
    (0, _defineProperty2.default)(this, "getId", async (deps, user, searchRequest, {
      sessionId,
      isStored,
      isRestore
    }) => {
      if (!this.sessionConfig.enabled) {
        throw new Error('Search sessions are disabled');
      } else if (!sessionId) {
        throw new Error('Session ID is required');
      } else if (!isStored) {
        throw new Error('Cannot get search ID from a session that is not stored');
      } else if (!isRestore) {
        throw new Error('Get search ID is only supported when restoring a session');
      }

      const session = await this.get(deps, user, sessionId);
      const requestHash = (0, _utils.createRequestHash)(searchRequest.params);

      if (!session.attributes.idMapping.hasOwnProperty(requestHash)) {
        this.logger.error(`getId | ${sessionId} | ${requestHash} not found`);
        throw new _server2.NoSearchIdInSessionError();
      }

      this.logger.debug(`getId | ${sessionId} | ${requestHash}`);
      return session.attributes.idMapping[requestHash].id;
    });
    (0, _defineProperty2.default)(this, "asScopedProvider", ({
      savedObjects
    }) => {
      return request => {
        var _this$security$authc$, _this$security;

        const user = (_this$security$authc$ = (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authc.getCurrentUser(request)) !== null && _this$security$authc$ !== void 0 ? _this$security$authc$ : null;
        const savedObjectsClient = savedObjects.getScopedClient(request, {
          includedHiddenTypes: [_common.SEARCH_SESSION_TYPE]
        });
        const deps = {
          savedObjectsClient
        };
        return {
          getId: this.getId.bind(this, deps, user),
          trackId: this.trackId.bind(this, deps, user),
          getSearchIdMapping: this.getSearchIdMapping.bind(this, deps, user),
          save: this.save.bind(this, deps, user),
          get: this.get.bind(this, deps, user),
          find: this.find.bind(this, deps, user),
          update: this.update.bind(this, deps, user),
          extend: this.extend.bind(this, deps, user),
          cancel: this.cancel.bind(this, deps, user),
          delete: this.delete.bind(this, deps, user),
          getConfig: () => this.config.search.sessions
        };
      };
    });
    (0, _defineProperty2.default)(this, "throwOnUserConflict", (user, session) => {
      if (user === null || !session) return;

      if (user.authentication_realm.type !== session.attributes.realmType || user.authentication_realm.name !== session.attributes.realmName || user.username !== session.attributes.username) {
        this.logger.debug(`User ${user.username} has no access to search session ${session.attributes.sessionId}`);
        throw (0, _boom.notFound)();
      }
    });
    this.logger = logger;
    this.config = config;
    this.version = version;
    this.security = security;
    this.sessionConfig = this.config.search.sessions;
  }

  setup(core, deps) {
    const taskDeps = {
      config: this.config,
      taskManager: deps.taskManager,
      logger: this.logger
    };
    (0, _setup_task.registerSearchSessionsTask)(core, taskDeps, _check_persisted_sessions.SEARCH_SESSIONS_TASK_TYPE, 'persisted session progress', _check_persisted_sessions.checkPersistedSessionsProgress);
    (0, _setup_task.registerSearchSessionsTask)(core, taskDeps, _check_non_persisted_sessions.SEARCH_SESSIONS_CLEANUP_TASK_TYPE, 'non persisted session cleanup', _check_non_persisted_sessions.checkNonPersistedSessions);
    (0, _setup_task.registerSearchSessionsTask)(core, taskDeps, _expire_persisted_sessions.SEARCH_SESSIONS_EXPIRE_TASK_TYPE, 'complete session expiration', _expire_persisted_sessions.checkPersistedCompletedSessionExpiration);
  }

  async start(core, deps) {
    return this.setupMonitoring(core, deps);
  }

  stop() {}

  async extend(deps, user, sessionId, expires) {
    this.logger.debug(`extend | ${sessionId}`);
    return this.update(deps, user, sessionId, {
      expires: expires.toISOString()
    });
  }

  async getSearchIdMapping(deps, user, sessionId) {
    const searchSession = await this.get(deps, user, sessionId);
    const searchIdMapping = new Map();
    Object.values(searchSession.attributes.idMapping).forEach(requestInfo => {
      searchIdMapping.set(requestInfo.id, requestInfo.strategy);
    });
    return searchIdMapping;
  }
  /**
   * Look up an existing search ID that matches the given request in the given session so that the
   * request can continue rather than restart.
   * @internal
   */


}

exports.SearchSessionService = SearchSessionService;