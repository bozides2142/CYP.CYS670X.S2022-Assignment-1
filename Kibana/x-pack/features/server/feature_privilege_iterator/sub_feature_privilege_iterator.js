"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subFeaturePrivilegeIterator = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Utility for iterating through all sub-feature privileges belonging to a specific feature.
 *
 * @param feature the feature whose sub-feature privileges to iterate through.
 * @param licenseType the current license.
 */

const subFeaturePrivilegeIterator = function* subFeaturePrivilegeIterator(feature, licenseHasAtLeast) {
  for (const subFeature of feature.subFeatures) {
    for (const group of subFeature.privilegeGroups) {
      yield* group.privileges.filter(privilege => !privilege.minimumLicense || licenseHasAtLeast(privilege.minimumLicense));
    }
  }
};

exports.subFeaturePrivilegeIterator = subFeaturePrivilegeIterator;