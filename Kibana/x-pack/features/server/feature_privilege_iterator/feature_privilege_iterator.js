"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.featurePrivilegeIterator = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _sub_feature_privilege_iterator = require("./sub_feature_privilege_iterator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const featurePrivilegeIterator = function* featurePrivilegeIterator(feature, options) {
  for (const entry of Object.entries((_feature$privileges = feature.privileges) !== null && _feature$privileges !== void 0 ? _feature$privileges : {})) {
    var _feature$privileges;

    const [privilegeId, privilege] = entry;

    if (options.predicate && !options.predicate(privilegeId, privilege)) {
      continue;
    }

    if (options.augmentWithSubFeaturePrivileges) {
      yield {
        privilegeId,
        privilege: mergeWithSubFeatures(privilegeId, privilege, feature, options.licenseHasAtLeast)
      };
    } else {
      yield {
        privilegeId,
        privilege
      };
    }
  }
};

exports.featurePrivilegeIterator = featurePrivilegeIterator;

function mergeWithSubFeatures(privilegeId, privilege, feature, licenseHasAtLeast) {
  const mergedConfig = _lodash.default.cloneDeep(privilege);

  for (const subFeaturePrivilege of (0, _sub_feature_privilege_iterator.subFeaturePrivilegeIterator)(feature, licenseHasAtLeast)) {
    var _mergedConfig$managem, _subFeaturePrivilege$, _mergedConfig$alertin, _mergedConfig$alertin2, _mergedConfig$alertin3, _subFeaturePrivilege$2, _subFeaturePrivilege$3, _subFeaturePrivilege$4, _mergedConfig$alertin4, _mergedConfig$alertin5, _mergedConfig$alertin6, _subFeaturePrivilege$5, _subFeaturePrivilege$6, _subFeaturePrivilege$7, _mergedConfig$alertin7, _mergedConfig$alertin8, _mergedConfig$alertin9, _subFeaturePrivilege$8, _subFeaturePrivilege$9, _subFeaturePrivilege$10, _mergedConfig$alertin10, _mergedConfig$alertin11, _mergedConfig$alertin12, _subFeaturePrivilege$11, _subFeaturePrivilege$12, _subFeaturePrivilege$13, _mergedConfig$cases$a, _mergedConfig$cases, _subFeaturePrivilege$14, _subFeaturePrivilege$15, _mergedConfig$cases$r, _mergedConfig$cases2, _subFeaturePrivilege$16, _subFeaturePrivilege$17;

    if (subFeaturePrivilege.includeIn !== 'read' && subFeaturePrivilege.includeIn !== privilegeId) {
      continue;
    }

    mergedConfig.api = mergeArrays(mergedConfig.api, subFeaturePrivilege.api);
    mergedConfig.app = mergeArrays(mergedConfig.app, subFeaturePrivilege.app);
    mergedConfig.catalogue = mergeArrays(mergedConfig.catalogue, subFeaturePrivilege.catalogue);
    const managementEntries = Object.entries((_mergedConfig$managem = mergedConfig.management) !== null && _mergedConfig$managem !== void 0 ? _mergedConfig$managem : {});
    const subFeatureManagementEntries = Object.entries((_subFeaturePrivilege$ = subFeaturePrivilege.management) !== null && _subFeaturePrivilege$ !== void 0 ? _subFeaturePrivilege$ : {});
    mergedConfig.management = [managementEntries, subFeatureManagementEntries].flat().reduce((acc, [sectionId, managementApps]) => {
      return { ...acc,
        [sectionId]: mergeArrays(acc[sectionId], managementApps)
      };
    }, {});
    mergedConfig.ui = mergeArrays(mergedConfig.ui, subFeaturePrivilege.ui);
    mergedConfig.savedObject.all = mergeArrays(mergedConfig.savedObject.all, subFeaturePrivilege.savedObject.all);
    mergedConfig.savedObject.read = mergeArrays(mergedConfig.savedObject.read, subFeaturePrivilege.savedObject.read);
    mergedConfig.alerting = {
      rule: {
        all: mergeArrays((_mergedConfig$alertin = (_mergedConfig$alertin2 = mergedConfig.alerting) === null || _mergedConfig$alertin2 === void 0 ? void 0 : (_mergedConfig$alertin3 = _mergedConfig$alertin2.rule) === null || _mergedConfig$alertin3 === void 0 ? void 0 : _mergedConfig$alertin3.all) !== null && _mergedConfig$alertin !== void 0 ? _mergedConfig$alertin : [], (_subFeaturePrivilege$2 = (_subFeaturePrivilege$3 = subFeaturePrivilege.alerting) === null || _subFeaturePrivilege$3 === void 0 ? void 0 : (_subFeaturePrivilege$4 = _subFeaturePrivilege$3.rule) === null || _subFeaturePrivilege$4 === void 0 ? void 0 : _subFeaturePrivilege$4.all) !== null && _subFeaturePrivilege$2 !== void 0 ? _subFeaturePrivilege$2 : []),
        read: mergeArrays((_mergedConfig$alertin4 = (_mergedConfig$alertin5 = mergedConfig.alerting) === null || _mergedConfig$alertin5 === void 0 ? void 0 : (_mergedConfig$alertin6 = _mergedConfig$alertin5.rule) === null || _mergedConfig$alertin6 === void 0 ? void 0 : _mergedConfig$alertin6.read) !== null && _mergedConfig$alertin4 !== void 0 ? _mergedConfig$alertin4 : [], (_subFeaturePrivilege$5 = (_subFeaturePrivilege$6 = subFeaturePrivilege.alerting) === null || _subFeaturePrivilege$6 === void 0 ? void 0 : (_subFeaturePrivilege$7 = _subFeaturePrivilege$6.rule) === null || _subFeaturePrivilege$7 === void 0 ? void 0 : _subFeaturePrivilege$7.read) !== null && _subFeaturePrivilege$5 !== void 0 ? _subFeaturePrivilege$5 : [])
      },
      alert: {
        all: mergeArrays((_mergedConfig$alertin7 = (_mergedConfig$alertin8 = mergedConfig.alerting) === null || _mergedConfig$alertin8 === void 0 ? void 0 : (_mergedConfig$alertin9 = _mergedConfig$alertin8.alert) === null || _mergedConfig$alertin9 === void 0 ? void 0 : _mergedConfig$alertin9.all) !== null && _mergedConfig$alertin7 !== void 0 ? _mergedConfig$alertin7 : [], (_subFeaturePrivilege$8 = (_subFeaturePrivilege$9 = subFeaturePrivilege.alerting) === null || _subFeaturePrivilege$9 === void 0 ? void 0 : (_subFeaturePrivilege$10 = _subFeaturePrivilege$9.alert) === null || _subFeaturePrivilege$10 === void 0 ? void 0 : _subFeaturePrivilege$10.all) !== null && _subFeaturePrivilege$8 !== void 0 ? _subFeaturePrivilege$8 : []),
        read: mergeArrays((_mergedConfig$alertin10 = (_mergedConfig$alertin11 = mergedConfig.alerting) === null || _mergedConfig$alertin11 === void 0 ? void 0 : (_mergedConfig$alertin12 = _mergedConfig$alertin11.alert) === null || _mergedConfig$alertin12 === void 0 ? void 0 : _mergedConfig$alertin12.read) !== null && _mergedConfig$alertin10 !== void 0 ? _mergedConfig$alertin10 : [], (_subFeaturePrivilege$11 = (_subFeaturePrivilege$12 = subFeaturePrivilege.alerting) === null || _subFeaturePrivilege$12 === void 0 ? void 0 : (_subFeaturePrivilege$13 = _subFeaturePrivilege$12.alert) === null || _subFeaturePrivilege$13 === void 0 ? void 0 : _subFeaturePrivilege$13.read) !== null && _subFeaturePrivilege$11 !== void 0 ? _subFeaturePrivilege$11 : [])
      }
    };
    mergedConfig.cases = {
      all: mergeArrays((_mergedConfig$cases$a = (_mergedConfig$cases = mergedConfig.cases) === null || _mergedConfig$cases === void 0 ? void 0 : _mergedConfig$cases.all) !== null && _mergedConfig$cases$a !== void 0 ? _mergedConfig$cases$a : [], (_subFeaturePrivilege$14 = (_subFeaturePrivilege$15 = subFeaturePrivilege.cases) === null || _subFeaturePrivilege$15 === void 0 ? void 0 : _subFeaturePrivilege$15.all) !== null && _subFeaturePrivilege$14 !== void 0 ? _subFeaturePrivilege$14 : []),
      read: mergeArrays((_mergedConfig$cases$r = (_mergedConfig$cases2 = mergedConfig.cases) === null || _mergedConfig$cases2 === void 0 ? void 0 : _mergedConfig$cases2.read) !== null && _mergedConfig$cases$r !== void 0 ? _mergedConfig$cases$r : [], (_subFeaturePrivilege$16 = (_subFeaturePrivilege$17 = subFeaturePrivilege.cases) === null || _subFeaturePrivilege$17 === void 0 ? void 0 : _subFeaturePrivilege$17.read) !== null && _subFeaturePrivilege$16 !== void 0 ? _subFeaturePrivilege$16 : [])
    };
  }

  return mergedConfig;
}

function mergeArrays(input1, input2) {
  const first = input1 !== null && input1 !== void 0 ? input1 : [];
  const second = input2 !== null && input2 !== void 0 ? input2 : [];
  return Array.from(new Set([...first, ...second]));
}