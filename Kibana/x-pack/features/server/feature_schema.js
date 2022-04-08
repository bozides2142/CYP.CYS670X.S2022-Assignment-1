"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiCapabilitiesRegex = void 0;
exports.validateElasticsearchFeature = validateElasticsearchFeature;
exports.validateKibanaFeature = validateKibanaFeature;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Each feature gets its own property on the UICapabilities object,
// but that object has a few built-in properties which should not be overwritten.


const prohibitedFeatureIds = new Set(['catalogue', 'management', 'navLinks']);
const featurePrivilegePartRegex = /^[a-zA-Z0-9_-]+$/;
const subFeaturePrivilegePartRegex = /^[a-zA-Z0-9_-]+$/;
const managementSectionIdRegex = /^[a-zA-Z0-9_-]+$/;
const reservedFeaturePrrivilegePartRegex = /^(?!reserved_)[a-zA-Z0-9_-]+$/;
const uiCapabilitiesRegex = /^[a-zA-Z0-9:_-]+$/;
exports.uiCapabilitiesRegex = uiCapabilitiesRegex;

const validLicenseSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('basic'), _configSchema.schema.literal('standard'), _configSchema.schema.literal('gold'), _configSchema.schema.literal('platinum'), _configSchema.schema.literal('enterprise'), _configSchema.schema.literal('trial')]); // sub-feature privileges are only available with a `gold` license or better, so restricting sub-feature privileges
// for `gold` or below doesn't make a whole lot of sense.


const validSubFeaturePrivilegeLicensesSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('platinum'), _configSchema.schema.literal('enterprise'), _configSchema.schema.literal('trial')]);

const listOfCapabilitiesSchema = _configSchema.schema.arrayOf(_configSchema.schema.string({
  validate(key) {
    if (!uiCapabilitiesRegex.test(key)) {
      return `Does not satisfy regexp ${uiCapabilitiesRegex.toString()}`;
    }
  }

}));

const managementSchema = _configSchema.schema.recordOf(_configSchema.schema.string({
  validate(key) {
    if (!managementSectionIdRegex.test(key)) {
      return `Does not satisfy regexp ${managementSectionIdRegex.toString()}`;
    }
  }

}), listOfCapabilitiesSchema);

const catalogueSchema = listOfCapabilitiesSchema;

const alertingSchema = _configSchema.schema.arrayOf(_configSchema.schema.string());

const casesSchema = _configSchema.schema.arrayOf(_configSchema.schema.string());

const appCategorySchema = _configSchema.schema.object({
  id: _configSchema.schema.string(),
  label: _configSchema.schema.string(),
  ariaLabel: _configSchema.schema.maybe(_configSchema.schema.string()),
  euiIconType: _configSchema.schema.maybe(_configSchema.schema.string()),
  order: _configSchema.schema.maybe(_configSchema.schema.number())
});

const kibanaPrivilegeSchema = _configSchema.schema.object({
  excludeFromBasePrivileges: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  requireAllSpaces: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  disabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  management: _configSchema.schema.maybe(managementSchema),
  catalogue: _configSchema.schema.maybe(catalogueSchema),
  api: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  app: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  alerting: _configSchema.schema.maybe(_configSchema.schema.object({
    rule: _configSchema.schema.maybe(_configSchema.schema.object({
      all: _configSchema.schema.maybe(alertingSchema),
      read: _configSchema.schema.maybe(alertingSchema)
    })),
    alert: _configSchema.schema.maybe(_configSchema.schema.object({
      all: _configSchema.schema.maybe(alertingSchema),
      read: _configSchema.schema.maybe(alertingSchema)
    }))
  })),
  cases: _configSchema.schema.maybe(_configSchema.schema.object({
    all: _configSchema.schema.maybe(casesSchema),
    read: _configSchema.schema.maybe(casesSchema)
  })),
  savedObject: _configSchema.schema.object({
    all: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    read: _configSchema.schema.arrayOf(_configSchema.schema.string())
  }),
  ui: listOfCapabilitiesSchema
});

const kibanaIndependentSubFeaturePrivilegeSchema = _configSchema.schema.object({
  id: _configSchema.schema.string({
    validate(key) {
      if (!subFeaturePrivilegePartRegex.test(key)) {
        return `Does not satisfy regexp ${subFeaturePrivilegePartRegex.toString()}`;
      }
    }

  }),
  name: _configSchema.schema.string(),
  includeIn: _configSchema.schema.oneOf([_configSchema.schema.literal('all'), _configSchema.schema.literal('read'), _configSchema.schema.literal('none')]),
  minimumLicense: _configSchema.schema.maybe(validSubFeaturePrivilegeLicensesSchema),
  management: _configSchema.schema.maybe(managementSchema),
  catalogue: _configSchema.schema.maybe(catalogueSchema),
  alerting: _configSchema.schema.maybe(_configSchema.schema.object({
    rule: _configSchema.schema.maybe(_configSchema.schema.object({
      all: _configSchema.schema.maybe(alertingSchema),
      read: _configSchema.schema.maybe(alertingSchema)
    })),
    alert: _configSchema.schema.maybe(_configSchema.schema.object({
      all: _configSchema.schema.maybe(alertingSchema),
      read: _configSchema.schema.maybe(alertingSchema)
    }))
  })),
  cases: _configSchema.schema.maybe(_configSchema.schema.object({
    all: _configSchema.schema.maybe(casesSchema),
    read: _configSchema.schema.maybe(casesSchema)
  })),
  api: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  app: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  savedObject: _configSchema.schema.object({
    all: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    read: _configSchema.schema.arrayOf(_configSchema.schema.string())
  }),
  ui: listOfCapabilitiesSchema
});

const kibanaMutuallyExclusiveSubFeaturePrivilegeSchema = kibanaIndependentSubFeaturePrivilegeSchema.extends({
  minimumLicense: _configSchema.schema.never()
});

const kibanaSubFeatureSchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  privilegeGroups: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.object({
    groupType: _configSchema.schema.literal('mutually_exclusive'),
    privileges: _configSchema.schema.maybe(_configSchema.schema.arrayOf(kibanaMutuallyExclusiveSubFeaturePrivilegeSchema, {
      minSize: 1
    }))
  }), _configSchema.schema.object({
    groupType: _configSchema.schema.literal('independent'),
    privileges: _configSchema.schema.maybe(_configSchema.schema.arrayOf(kibanaIndependentSubFeaturePrivilegeSchema, {
      minSize: 1
    }))
  })])))
});

const kibanaFeatureSchema = _configSchema.schema.object({
  id: _configSchema.schema.string({
    validate(value) {
      if (!featurePrivilegePartRegex.test(value)) {
        return `Does not satisfy regexp ${featurePrivilegePartRegex.toString()}`;
      }

      if (prohibitedFeatureIds.has(value)) {
        return `[${value}] is not allowed`;
      }
    }

  }),
  name: _configSchema.schema.string(),
  category: appCategorySchema,
  order: _configSchema.schema.maybe(_configSchema.schema.number()),
  excludeFromBasePrivileges: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  minimumLicense: _configSchema.schema.maybe(validLicenseSchema),
  app: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  management: _configSchema.schema.maybe(managementSchema),
  catalogue: _configSchema.schema.maybe(catalogueSchema),
  alerting: _configSchema.schema.maybe(alertingSchema),
  cases: _configSchema.schema.maybe(casesSchema),
  privileges: _configSchema.schema.oneOf([_configSchema.schema.literal(null), _configSchema.schema.object({
    all: _configSchema.schema.maybe(kibanaPrivilegeSchema),
    read: _configSchema.schema.maybe(kibanaPrivilegeSchema)
  })]),
  subFeatures: _configSchema.schema.maybe(_configSchema.schema.conditional(_configSchema.schema.siblingRef('privileges'), null, // allows an empty array only
  _configSchema.schema.arrayOf(_configSchema.schema.never(), {
    maxSize: 0
  }), _configSchema.schema.arrayOf(kibanaSubFeatureSchema))),
  privilegesTooltip: _configSchema.schema.maybe(_configSchema.schema.string()),
  reserved: _configSchema.schema.maybe(_configSchema.schema.object({
    description: _configSchema.schema.string(),
    privileges: _configSchema.schema.arrayOf(_configSchema.schema.object({
      id: _configSchema.schema.string({
        validate(value) {
          if (!reservedFeaturePrrivilegePartRegex.test(value)) {
            return `Does not satisfy regexp ${reservedFeaturePrrivilegePartRegex.toString()}`;
          }
        }

      }),
      privilege: kibanaPrivilegeSchema
    }))
  }))
});

const elasticsearchPrivilegeSchema = _configSchema.schema.object({
  ui: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  requiredClusterPrivileges: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  requiredIndexPrivileges: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string()))),
  requiredRoles: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

const elasticsearchFeatureSchema = _configSchema.schema.object({
  id: _configSchema.schema.string({
    validate(value) {
      if (!featurePrivilegePartRegex.test(value)) {
        return `Does not satisfy regexp ${featurePrivilegePartRegex.toString()}`;
      }

      if (prohibitedFeatureIds.has(value)) {
        return `[${value}] is not allowed`;
      }
    }

  }),
  management: _configSchema.schema.maybe(managementSchema),
  catalogue: _configSchema.schema.maybe(catalogueSchema),
  privileges: _configSchema.schema.arrayOf(elasticsearchPrivilegeSchema)
});

function validateKibanaFeature(feature) {
  var _feature$subFeatures;

  kibanaFeatureSchema.validate(feature); // the following validation can't be enforced by the Joi schema, since it'd require us looking "up" the object graph for the list of valid value, which they explicitly forbid.

  const {
    app = [],
    management = {},
    catalogue = [],
    alerting = [],
    cases = []
  } = feature;
  const unseenApps = new Set(app);
  const managementSets = Object.entries(management).map(entry => [entry[0], new Set(entry[1])]);
  const unseenManagement = new Map(managementSets);
  const unseenCatalogue = new Set(catalogue);
  const unseenAlertTypes = new Set(alerting);
  const unseenCasesTypes = new Set(cases);

  function validateAppEntry(privilegeId, entry = []) {
    entry.forEach(privilegeApp => unseenApps.delete(privilegeApp));
    const unknownAppEntries = (0, _lodash.difference)(entry, app);

    if (unknownAppEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown app entries: ${unknownAppEntries.join(', ')}`);
    }
  }

  function validateCatalogueEntry(privilegeId, entry = []) {
    entry.forEach(privilegeCatalogue => unseenCatalogue.delete(privilegeCatalogue));
    const unknownCatalogueEntries = (0, _lodash.difference)(entry || [], catalogue);

    if (unknownCatalogueEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown catalogue entries: ${unknownCatalogueEntries.join(', ')}`);
    }
  }

  function validateAlertingEntry(privilegeId, entry) {
    var _entry$rule$all, _entry$rule, _entry$alert$all, _entry$alert, _entry$rule$read, _entry$rule2, _entry$alert$read, _entry$alert2;

    const all = [...((_entry$rule$all = entry === null || entry === void 0 ? void 0 : (_entry$rule = entry.rule) === null || _entry$rule === void 0 ? void 0 : _entry$rule.all) !== null && _entry$rule$all !== void 0 ? _entry$rule$all : []), ...((_entry$alert$all = entry === null || entry === void 0 ? void 0 : (_entry$alert = entry.alert) === null || _entry$alert === void 0 ? void 0 : _entry$alert.all) !== null && _entry$alert$all !== void 0 ? _entry$alert$all : [])];
    const read = [...((_entry$rule$read = entry === null || entry === void 0 ? void 0 : (_entry$rule2 = entry.rule) === null || _entry$rule2 === void 0 ? void 0 : _entry$rule2.read) !== null && _entry$rule$read !== void 0 ? _entry$rule$read : []), ...((_entry$alert$read = entry === null || entry === void 0 ? void 0 : (_entry$alert2 = entry.alert) === null || _entry$alert2 === void 0 ? void 0 : _entry$alert2.read) !== null && _entry$alert$read !== void 0 ? _entry$alert$read : [])];
    all.forEach(privilegeAlertTypes => unseenAlertTypes.delete(privilegeAlertTypes));
    read.forEach(privilegeAlertTypes => unseenAlertTypes.delete(privilegeAlertTypes));
    const unknownAlertingEntries = (0, _lodash.difference)([...all, ...read], alerting);

    if (unknownAlertingEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown alerting entries: ${unknownAlertingEntries.join(', ')}`);
    }
  }

  function validateCasesEntry(privilegeId, entry) {
    var _entry$all, _entry$read;

    const all = (_entry$all = entry === null || entry === void 0 ? void 0 : entry.all) !== null && _entry$all !== void 0 ? _entry$all : [];
    const read = (_entry$read = entry === null || entry === void 0 ? void 0 : entry.read) !== null && _entry$read !== void 0 ? _entry$read : [];
    all.forEach(privilegeCasesTypes => unseenCasesTypes.delete(privilegeCasesTypes));
    read.forEach(privilegeCasesTypes => unseenCasesTypes.delete(privilegeCasesTypes));
    const unknownCasesEntries = (0, _lodash.difference)([...all, ...read], cases);

    if (unknownCasesEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown cases entries: ${unknownCasesEntries.join(', ')}`);
    }
  }

  function validateManagementEntry(privilegeId, managementEntry = {}) {
    Object.entries(managementEntry).forEach(([managementSectionId, managementSectionEntry]) => {
      if (unseenManagement.has(managementSectionId)) {
        managementSectionEntry.forEach(entry => {
          var _unseenManagement$get;

          unseenManagement.get(managementSectionId).delete(entry);

          if (((_unseenManagement$get = unseenManagement.get(managementSectionId)) === null || _unseenManagement$get === void 0 ? void 0 : _unseenManagement$get.size) === 0) {
            unseenManagement.delete(managementSectionId);
          }
        });
      }

      if (!management[managementSectionId]) {
        throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown management section: ${managementSectionId}`);
      }

      const unknownSectionEntries = (0, _lodash.difference)(managementSectionEntry, management[managementSectionId]);

      if (unknownSectionEntries.length > 0) {
        throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown management entries for section ${managementSectionId}: ${unknownSectionEntries.join(', ')}`);
      }
    });
  }

  const privilegeEntries = [];

  if (feature.privileges) {
    privilegeEntries.push(...Object.entries(feature.privileges));
  }

  if (feature.reserved) {
    feature.reserved.privileges.forEach(reservedPrivilege => {
      privilegeEntries.push([reservedPrivilege.id, reservedPrivilege.privilege]);
    });
  }

  if (privilegeEntries.length === 0) {
    return;
  }

  privilegeEntries.forEach(([privilegeId, privilegeDefinition]) => {
    if (!privilegeDefinition) {
      throw new Error('Privilege definition may not be null or undefined');
    }

    validateAppEntry(privilegeId, privilegeDefinition.app);
    validateCatalogueEntry(privilegeId, privilegeDefinition.catalogue);
    validateManagementEntry(privilegeId, privilegeDefinition.management);
    validateAlertingEntry(privilegeId, privilegeDefinition.alerting);
    validateCasesEntry(privilegeId, privilegeDefinition.cases);
  });
  const subFeatureEntries = (_feature$subFeatures = feature.subFeatures) !== null && _feature$subFeatures !== void 0 ? _feature$subFeatures : [];
  subFeatureEntries.forEach(subFeature => {
    subFeature.privilegeGroups.forEach(subFeaturePrivilegeGroup => {
      subFeaturePrivilegeGroup.privileges.forEach(subFeaturePrivilege => {
        validateAppEntry(subFeaturePrivilege.id, subFeaturePrivilege.app);
        validateCatalogueEntry(subFeaturePrivilege.id, subFeaturePrivilege.catalogue);
        validateManagementEntry(subFeaturePrivilege.id, subFeaturePrivilege.management);
        validateAlertingEntry(subFeaturePrivilege.id, subFeaturePrivilege.alerting);
        validateCasesEntry(subFeaturePrivilege.id, subFeaturePrivilege.cases);
      });
    });
  });

  if (unseenApps.size > 0) {
    throw new Error(`Feature ${feature.id} specifies app entries which are not granted to any privileges: ${Array.from(unseenApps.values()).join(',')}`);
  }

  if (unseenCatalogue.size > 0) {
    throw new Error(`Feature ${feature.id} specifies catalogue entries which are not granted to any privileges: ${Array.from(unseenCatalogue.values()).join(',')}`);
  }

  if (unseenManagement.size > 0) {
    const ungrantedManagement = Array.from(unseenManagement.entries()).reduce((acc, entry) => {
      const values = Array.from(entry[1].values()).map(managementPage => `${entry[0]}.${managementPage}`);
      return [...acc, ...values];
    }, []);
    throw new Error(`Feature ${feature.id} specifies management entries which are not granted to any privileges: ${ungrantedManagement.join(',')}`);
  }

  if (unseenAlertTypes.size > 0) {
    throw new Error(`Feature ${feature.id} specifies alerting entries which are not granted to any privileges: ${Array.from(unseenAlertTypes.values()).join(',')}`);
  }

  if (unseenCasesTypes.size > 0) {
    throw new Error(`Feature ${feature.id} specifies cases entries which are not granted to any privileges: ${Array.from(unseenCasesTypes.values()).join(',')}`);
  }
}

function validateElasticsearchFeature(feature) {
  elasticsearchFeatureSchema.validate(feature); // the following validation can't be enforced by the Joi schema without a very convoluted and verbose definition

  const {
    privileges
  } = feature;
  privileges.forEach((privilege, index) => {
    const {
      requiredClusterPrivileges = [],
      requiredIndexPrivileges = [],
      requiredRoles = []
    } = privilege;

    if (requiredClusterPrivileges.length === 0 && requiredIndexPrivileges.length === 0 && requiredRoles.length === 0) {
      throw new Error(`Feature ${feature.id} has a privilege definition at index ${index} without any privileges defined.`);
    }
  });
}