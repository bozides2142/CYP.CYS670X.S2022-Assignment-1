"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionTaskParamsMigrations = getActionTaskParamsMigrations;
exports.isPreconfiguredAction = isPreconfiguredAction;
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

function getActionTaskParamsMigrations(encryptedSavedObjects, preconfiguredActions) {
  const migrationActionTaskParamsSixteen = createEsoMigration(encryptedSavedObjects, doc => true, pipeMigrations(getUseSavedObjectReferencesFn(preconfiguredActions)));
  const migrationActionsTaskParams800 = createEsoMigration(encryptedSavedObjects, doc => true, doc => doc // no-op
  );
  return {
    '7.16.0': executeMigrationWithErrorHandling(migrationActionTaskParamsSixteen, '7.16.0'),
    '8.0.0': executeMigrationWithErrorHandling(migrationActionsTaskParams800, '8.0.0')
  };
}

function executeMigrationWithErrorHandling(migrationFunc, version) {
  return (doc, context) => {
    try {
      return migrationFunc(doc, context);
    } catch (ex) {
      context.log.error(`encryptedSavedObject ${version} migration failed for action task param ${doc.id} with error: ${ex.message}`, {
        migrations: {
          actionTaskParamDocument: doc
        }
      });
      throw ex;
    }
  };
}

function isPreconfiguredAction(doc, preconfiguredActions) {
  return !!preconfiguredActions.find(action => action.id === doc.attributes.actionId);
}

function getUseSavedObjectReferencesFn(preconfiguredActions) {
  return doc => {
    return useSavedObjectReferences(doc, preconfiguredActions);
  };
}

function useSavedObjectReferences(doc, preconfiguredActions) {
  var _ref;

  const {
    attributes: {
      actionId,
      relatedSavedObjects
    },
    references
  } = doc;
  const newReferences = [];
  const relatedSavedObjectRefs = [];

  if (!isPreconfiguredAction(doc, preconfiguredActions)) {
    newReferences.push({
      id: actionId,
      name: 'actionRef',
      type: 'action'
    });
  } // Add related saved objects, if any


  ((_ref = relatedSavedObjects) !== null && _ref !== void 0 ? _ref : []).forEach((relatedSavedObject, index) => {
    relatedSavedObjectRefs.push({ ...relatedSavedObject,
      id: `related_${relatedSavedObject.type}_${index}`
    });
    newReferences.push({
      id: relatedSavedObject.id,
      name: `related_${relatedSavedObject.type}_${index}`,
      type: relatedSavedObject.type
    });
  });
  return { ...doc,
    attributes: { ...doc.attributes,
      ...(relatedSavedObjects ? {
        relatedSavedObjects: relatedSavedObjectRefs
      } : {})
    },
    references: [...(references !== null && references !== void 0 ? references : []), ...(newReferences !== null && newReferences !== void 0 ? newReferences : [])]
  };
}

function pipeMigrations(...migrations) {
  return doc => migrations.reduce((migratedDoc, nextMigration) => nextMigration(migratedDoc), doc);
}