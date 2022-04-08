"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionsMigrations = getActionsMigrations;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createEsoMigration(encryptedSavedObjects, isMigrationNeededPredicate, migrationFunc) {
  return encryptedSavedObjects.createMigration({
    isMigrationNeededPredicate,
    migration: migrationFunc,
    shouldMigrateIfDecryptionFails: true // shouldMigrateIfDecryptionFails flag that applies the migration to undecrypted document if decryption fails

  });
}

function getActionsMigrations(encryptedSavedObjects) {
  const migrationActionsTen = createEsoMigration(encryptedSavedObjects, doc => {
    var _doc$attributes$confi;

    return ((_doc$attributes$confi = doc.attributes.config) === null || _doc$attributes$confi === void 0 ? void 0 : _doc$attributes$confi.hasOwnProperty('casesConfiguration')) || doc.attributes.actionTypeId === '.email';
  }, pipeMigrations(renameCasesConfigurationObject, addHasAuthConfigurationObject));
  const migrationActionsEleven = createEsoMigration(encryptedSavedObjects, doc => {
    var _doc$attributes$confi2, _doc$attributes$confi3;

    return ((_doc$attributes$confi2 = doc.attributes.config) === null || _doc$attributes$confi2 === void 0 ? void 0 : _doc$attributes$confi2.hasOwnProperty('isCaseOwned')) || ((_doc$attributes$confi3 = doc.attributes.config) === null || _doc$attributes$confi3 === void 0 ? void 0 : _doc$attributes$confi3.hasOwnProperty('incidentConfiguration')) || doc.attributes.actionTypeId === '.webhook';
  }, pipeMigrations(removeCasesFieldMappings, addHasAuthConfigurationObject));
  const migrationActionsFourteen = createEsoMigration(encryptedSavedObjects, doc => true, pipeMigrations(addIsMissingSecretsField));
  const migrationActionsSixteen = createEsoMigration(encryptedSavedObjects, doc => doc.attributes.actionTypeId === '.servicenow' || doc.attributes.actionTypeId === '.servicenow-sir' || doc.attributes.actionTypeId === '.email', pipeMigrations(addUsesTableApiToServiceNowConnectors, setServiceConfigIfNotSet));
  const migrationActions800 = createEsoMigration(encryptedSavedObjects, doc => true, doc => doc // no-op
  );
  return {
    '7.10.0': executeMigrationWithErrorHandling(migrationActionsTen, '7.10.0'),
    '7.11.0': executeMigrationWithErrorHandling(migrationActionsEleven, '7.11.0'),
    '7.14.0': executeMigrationWithErrorHandling(migrationActionsFourteen, '7.14.0'),
    '7.16.0': executeMigrationWithErrorHandling(migrationActionsSixteen, '7.16.0'),
    '8.0.0': executeMigrationWithErrorHandling(migrationActions800, '8.0.0')
  };
}

function executeMigrationWithErrorHandling(migrationFunc, version) {
  return (doc, context) => {
    try {
      return migrationFunc(doc, context);
    } catch (ex) {
      context.log.error(`encryptedSavedObject ${version} migration failed for action ${doc.id} with error: ${ex.message}`, {
        migrations: {
          actionDocument: doc
        }
      });
      throw ex;
    }
  };
}

function renameCasesConfigurationObject(doc) {
  var _doc$attributes$confi4;

  if (!((_doc$attributes$confi4 = doc.attributes.config) !== null && _doc$attributes$confi4 !== void 0 && _doc$attributes$confi4.casesConfiguration)) {
    return doc;
  }

  const {
    casesConfiguration,
    ...restConfiguration
  } = doc.attributes.config;
  return { ...doc,
    attributes: { ...doc.attributes,
      config: { ...restConfiguration,
        incidentConfiguration: casesConfiguration
      }
    }
  };
}

function removeCasesFieldMappings(doc) {
  var _doc$attributes$confi5, _doc$attributes$confi6;

  if (!((_doc$attributes$confi5 = doc.attributes.config) !== null && _doc$attributes$confi5 !== void 0 && _doc$attributes$confi5.hasOwnProperty('isCaseOwned')) && !((_doc$attributes$confi6 = doc.attributes.config) !== null && _doc$attributes$confi6 !== void 0 && _doc$attributes$confi6.hasOwnProperty('incidentConfiguration'))) {
    return doc;
  }

  const {
    incidentConfiguration,
    isCaseOwned,
    ...restConfiguration
  } = doc.attributes.config;
  return { ...doc,
    attributes: { ...doc.attributes,
      config: restConfiguration
    }
  };
}

const addHasAuthConfigurationObject = doc => {
  var _doc$attributes$secre, _doc$attributes$secre2;

  if (doc.attributes.actionTypeId !== '.email' && doc.attributes.actionTypeId !== '.webhook') {
    return doc;
  }

  const hasAuth = !!((_doc$attributes$secre = doc.attributes.secrets) !== null && _doc$attributes$secre !== void 0 && _doc$attributes$secre.user) || !!((_doc$attributes$secre2 = doc.attributes.secrets) !== null && _doc$attributes$secre2 !== void 0 && _doc$attributes$secre2.password);
  return { ...doc,
    attributes: { ...doc.attributes,
      config: { ...doc.attributes.config,
        hasAuth
      }
    }
  };
};

const setServiceConfigIfNotSet = doc => {
  if (doc.attributes.actionTypeId !== '.email' || null != doc.attributes.config.service) {
    return doc;
  }

  return { ...doc,
    attributes: { ...doc.attributes,
      config: { ...doc.attributes.config,
        service: 'other'
      }
    }
  };
};

const addIsMissingSecretsField = doc => {
  return { ...doc,
    attributes: { ...doc.attributes,
      isMissingSecrets: false
    }
  };
};

const addUsesTableApiToServiceNowConnectors = doc => {
  if (doc.attributes.actionTypeId !== '.servicenow' && doc.attributes.actionTypeId !== '.servicenow-sir') {
    return doc;
  }

  return { ...doc,
    attributes: { ...doc.attributes,
      config: { ...doc.attributes.config,
        usesTableApi: true
      }
    }
  };
};

function pipeMigrations(...migrations) {
  return doc => migrations.reduce((migratedDoc, nextMigration) => nextMigration(migratedDoc), doc);
}