"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WriteOperations = exports.ReadOperations = exports.AlertingAuthorizationEntity = exports.AlertingAuthorization = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _types = require("../types");

var _alerting_authorization_kuery = require("./alerting_authorization_kuery");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let AlertingAuthorizationEntity;
exports.AlertingAuthorizationEntity = AlertingAuthorizationEntity;

(function (AlertingAuthorizationEntity) {
  AlertingAuthorizationEntity["Rule"] = "rule";
  AlertingAuthorizationEntity["Alert"] = "alert";
})(AlertingAuthorizationEntity || (exports.AlertingAuthorizationEntity = AlertingAuthorizationEntity = {}));

let ReadOperations;
exports.ReadOperations = ReadOperations;

(function (ReadOperations) {
  ReadOperations["Get"] = "get";
  ReadOperations["GetRuleState"] = "getRuleState";
  ReadOperations["GetAlertSummary"] = "getAlertSummary";
  ReadOperations["Find"] = "find";
})(ReadOperations || (exports.ReadOperations = ReadOperations = {}));

let WriteOperations;
exports.WriteOperations = WriteOperations;

(function (WriteOperations) {
  WriteOperations["Create"] = "create";
  WriteOperations["Delete"] = "delete";
  WriteOperations["Update"] = "update";
  WriteOperations["UpdateApiKey"] = "updateApiKey";
  WriteOperations["Enable"] = "enable";
  WriteOperations["Disable"] = "disable";
  WriteOperations["MuteAll"] = "muteAll";
  WriteOperations["UnmuteAll"] = "unmuteAll";
  WriteOperations["MuteAlert"] = "muteAlert";
  WriteOperations["UnmuteAlert"] = "unmuteAlert";
})(WriteOperations || (exports.WriteOperations = WriteOperations = {}));

class AlertingAuthorization {
  constructor({
    ruleTypeRegistry,
    request,
    authorization,
    features,
    getSpace,
    getSpaceId
  }) {
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "featuresIds", void 0);
    (0, _defineProperty2.default)(this, "allPossibleConsumers", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    this.request = request;
    this.authorization = authorization;
    this.ruleTypeRegistry = ruleTypeRegistry;
    this.spaceId = getSpaceId(request);
    this.featuresIds = getSpace(request).then(maybeSpace => {
      var _maybeSpace$disabledF;

      return new Set((_maybeSpace$disabledF = maybeSpace === null || maybeSpace === void 0 ? void 0 : maybeSpace.disabledFeatures) !== null && _maybeSpace$disabledF !== void 0 ? _maybeSpace$disabledF : []);
    }).then(disabledFeatures => new Set(features.getKibanaFeatures().filter(({
      id,
      alerting
    }) => {
      var _alerting$length;

      return (// ignore features which are disabled in the user's space
        !disabledFeatures.has(id) && ( // ignore features which don't grant privileges to alerting
        (_alerting$length = alerting === null || alerting === void 0 ? void 0 : alerting.length) !== null && _alerting$length !== void 0 ? _alerting$length : 0 > 0)
      );
    }).map(feature => feature.id))).catch(() => {
      // failing to fetch the space means the user is likely not privileged in the
      // active space at all, which means that their list of features should be empty
      return new Set();
    });
    this.allPossibleConsumers = this.featuresIds.then(featuresIds => {
      return featuresIds.size ? asAuthorizedConsumers([_types.ALERTS_FEATURE_ID, ...featuresIds], {
        read: true,
        all: true
      }) : {};
    });
  }

  shouldCheckAuthorization() {
    var _this$authorization$m, _this$authorization, _this$authorization$m2;

    return (_this$authorization$m = (_this$authorization = this.authorization) === null || _this$authorization === void 0 ? void 0 : (_this$authorization$m2 = _this$authorization.mode) === null || _this$authorization$m2 === void 0 ? void 0 : _this$authorization$m2.useRbacForRequest(this.request)) !== null && _this$authorization$m !== void 0 ? _this$authorization$m : false;
  }

  getSpaceId() {
    return this.spaceId;
  }
  /*
   * This method exposes the private 'augmentRuleTypesWithAuthorization' to be
   * used by the RAC/Alerts client
   */


  async getAugmentedRuleTypesWithAuthorization(featureIds, operations, authorizationEntity) {
    return this.augmentRuleTypesWithAuthorization(this.ruleTypeRegistry.list(), operations, authorizationEntity, new Set(featureIds));
  }

  async ensureAuthorized({
    ruleTypeId,
    consumer,
    operation,
    entity
  }) {
    const {
      authorization
    } = this;
    const isAvailableConsumer = (0, _lodash.has)(await this.allPossibleConsumers, consumer);

    if (authorization && this.shouldCheckAuthorization()) {
      const ruleType = this.ruleTypeRegistry.get(ruleTypeId);
      const requiredPrivilegesByScope = {
        consumer: authorization.actions.alerting.get(ruleTypeId, consumer, entity, operation),
        producer: authorization.actions.alerting.get(ruleTypeId, ruleType.producer, entity, operation)
      }; // Skip authorizing consumer if consumer is the Rules Management consumer (`alerts`)
      // This means that rules and their derivative alerts created in the Rules Management UI
      // will only be subject to checking if user has access to the rule producer.

      const shouldAuthorizeConsumer = consumer !== _types.ALERTS_FEATURE_ID;
      const checkPrivileges = authorization.checkPrivilegesDynamicallyWithRequest(this.request);
      const {
        hasAllRequested,
        privileges
      } = await checkPrivileges({
        kibana: shouldAuthorizeConsumer && consumer !== ruleType.producer ? [// check for access at consumer level
        requiredPrivilegesByScope.consumer, // check for access at producer level
        requiredPrivilegesByScope.producer] : [// skip consumer privilege checks under `alerts` as all rule types can
        // be created under `alerts` if you have producer level privileges
        requiredPrivilegesByScope.producer]
      });

      if (!isAvailableConsumer) {
        /**
         * Under most circumstances this would have been caught by `checkPrivileges` as
         * a user can't have Privileges to an unknown consumer, but super users
         * don't actually get "privilege checked" so the made up consumer *will* return
         * as Privileged.
         * This check will ensure we don't accidentally let these through
         */
        throw _boom.default.forbidden(getUnauthorizedMessage(ruleTypeId, ScopeType.Consumer, consumer, operation, entity));
      }

      if (!hasAllRequested) {
        const authorizedPrivileges = (0, _lodash.map)(privileges.kibana.filter(privilege => privilege.authorized), 'privilege');
        const unauthorizedScopes = (0, _lodash.mapValues)(requiredPrivilegesByScope, privilege => !authorizedPrivileges.includes(privilege));
        const [unauthorizedScopeType, unauthorizedScope] = shouldAuthorizeConsumer && unauthorizedScopes.consumer ? [ScopeType.Consumer, consumer] : [ScopeType.Producer, ruleType.producer];
        throw _boom.default.forbidden(getUnauthorizedMessage(ruleTypeId, unauthorizedScopeType, unauthorizedScope, operation, entity));
      }
    } else if (!isAvailableConsumer) {
      throw _boom.default.forbidden(getUnauthorizedMessage(ruleTypeId, ScopeType.Consumer, consumer, operation, entity));
    }
  }

  async getFindAuthorizationFilter(authorizationEntity, filterOpts) {
    return this.getAuthorizationFilter(authorizationEntity, filterOpts, ReadOperations.Find);
  }

  async getAuthorizationFilter(authorizationEntity, filterOpts, operation) {
    if (this.authorization && this.shouldCheckAuthorization()) {
      const {
        authorizedRuleTypes
      } = await this.augmentRuleTypesWithAuthorization(this.ruleTypeRegistry.list(), [operation], authorizationEntity);

      if (!authorizedRuleTypes.size) {
        throw _boom.default.forbidden(`Unauthorized to find ${authorizationEntity}s for any rule types`);
      }

      const authorizedRuleTypeIdsToConsumers = new Set([...authorizedRuleTypes].reduce((ruleTypeIdConsumerPairs, ruleType) => {
        for (const consumer of Object.keys(ruleType.authorizedConsumers)) {
          ruleTypeIdConsumerPairs.push(`${ruleType.id}/${consumer}/${authorizationEntity}`);
        }

        return ruleTypeIdConsumerPairs;
      }, []));
      const authorizedEntries = new Map();
      return {
        filter: (0, _alerting_authorization_kuery.asFiltersByRuleTypeAndConsumer)(authorizedRuleTypes, filterOpts, this.spaceId),
        ensureRuleTypeIsAuthorized: (ruleTypeId, consumer, authType) => {
          if (!authorizedRuleTypeIdsToConsumers.has(`${ruleTypeId}/${consumer}/${authType}`)) {
            throw _boom.default.forbidden(getUnauthorizedMessage(ruleTypeId, ScopeType.Consumer, consumer, 'find', authorizationEntity));
          } else {
            if (authorizedEntries.has(ruleTypeId)) {
              authorizedEntries.get(ruleTypeId).add(consumer);
            } else {
              authorizedEntries.set(ruleTypeId, new Set([consumer]));
            }
          }
        }
      };
    }

    return {
      filter: (0, _alerting_authorization_kuery.asFiltersBySpaceId)(filterOpts, this.spaceId),
      ensureRuleTypeIsAuthorized: (ruleTypeId, consumer, authType) => {}
    };
  }

  async filterByRuleTypeAuthorization(ruleTypes, operations, authorizationEntity) {
    const {
      authorizedRuleTypes
    } = await this.augmentRuleTypesWithAuthorization(ruleTypes, operations, authorizationEntity);
    return authorizedRuleTypes;
  }

  async augmentRuleTypesWithAuthorization(ruleTypes, operations, authorizationEntity, featuresIds) {
    const fIds = featuresIds !== null && featuresIds !== void 0 ? featuresIds : await this.featuresIds;

    if (this.authorization && this.shouldCheckAuthorization()) {
      const checkPrivileges = this.authorization.checkPrivilegesDynamicallyWithRequest(this.request); // add an empty `authorizedConsumers` array on each ruleType

      const ruleTypesWithAuthorization = this.augmentWithAuthorizedConsumers(ruleTypes, {}); // map from privilege to ruleType which we can refer back to when analyzing the result
      // of checkPrivileges

      const privilegeToRuleType = new Map(); // as we can't ask ES for the user's individual privileges we need to ask for each feature
      // and ruleType in the system whether this user has this privilege

      for (const ruleType of ruleTypesWithAuthorization) {
        for (const feature of fIds) {
          for (const operation of operations) {
            privilegeToRuleType.set(this.authorization.actions.alerting.get(ruleType.id, feature, authorizationEntity, operation), [ruleType, feature, hasPrivilegeByOperation(operation), ruleType.producer === feature]);
          }
        }
      }

      const {
        username,
        hasAllRequested,
        privileges
      } = await checkPrivileges({
        kibana: [...privilegeToRuleType.keys()]
      });
      return {
        username,
        hasAllRequested,
        authorizedRuleTypes: hasAllRequested ? // has access to all features
        this.augmentWithAuthorizedConsumers(ruleTypes, await this.allPossibleConsumers) : // only has some of the required privileges
        privileges.kibana.reduce((authorizedRuleTypes, {
          authorized,
          privilege
        }) => {
          if (authorized && privilegeToRuleType.has(privilege)) {
            const [ruleType, feature, hasPrivileges, isAuthorizedAtProducerLevel] = privilegeToRuleType.get(privilege);
            ruleType.authorizedConsumers[feature] = mergeHasPrivileges(hasPrivileges, ruleType.authorizedConsumers[feature]);

            if (isAuthorizedAtProducerLevel) {
              // granting privileges under the producer automatically authorized the Rules Management UI as well
              ruleType.authorizedConsumers[_types.ALERTS_FEATURE_ID] = mergeHasPrivileges(hasPrivileges, ruleType.authorizedConsumers[_types.ALERTS_FEATURE_ID]);
            }

            authorizedRuleTypes.add(ruleType);
          }

          return authorizedRuleTypes;
        }, new Set())
      };
    } else {
      return {
        hasAllRequested: true,
        authorizedRuleTypes: this.augmentWithAuthorizedConsumers(new Set([...ruleTypes].filter(ruleType => fIds.has(ruleType.producer))), await this.allPossibleConsumers)
      };
    }
  }

  augmentWithAuthorizedConsumers(ruleTypes, authorizedConsumers) {
    return new Set(Array.from(ruleTypes).map(ruleType => ({ ...ruleType,
      authorizedConsumers: { ...authorizedConsumers
      }
    })));
  }

}

exports.AlertingAuthorization = AlertingAuthorization;

function mergeHasPrivileges(left, right) {
  var _ref, _ref2;

  return {
    read: (_ref = left.read || (right === null || right === void 0 ? void 0 : right.read)) !== null && _ref !== void 0 ? _ref : false,
    all: (_ref2 = left.all || (right === null || right === void 0 ? void 0 : right.all)) !== null && _ref2 !== void 0 ? _ref2 : false
  };
}

function hasPrivilegeByOperation(operation) {
  const read = Object.values(ReadOperations).includes(operation);
  const all = Object.values(WriteOperations).includes(operation);
  return {
    read: read || all,
    all
  };
}

function asAuthorizedConsumers(consumers, hasPrivileges) {
  return (0, _lodash.fromPairs)(consumers.map(feature => [feature, hasPrivileges]));
}

var ScopeType;

(function (ScopeType) {
  ScopeType[ScopeType["Consumer"] = 0] = "Consumer";
  ScopeType[ScopeType["Producer"] = 1] = "Producer";
})(ScopeType || (ScopeType = {}));

function getUnauthorizedMessage(alertTypeId, scopeType, scope, operation, entity) {
  return `Unauthorized to ${operation} a "${alertTypeId}" ${entity} ${scopeType === ScopeType.Consumer ? `for "${scope}"` : `by "${scope}"`}`;
}