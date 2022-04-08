"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexPatternSavedObjects = getIndexPatternSavedObjects;
exports.indexPatternTypes = void 0;
exports.removeUnusedIndexPatterns = removeUnusedIndexPatterns;

var _constants = require("../../../../../common/constants");

var _services = require("../../../../services");

var _get = require("../../packages/get");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const INDEX_PATTERN_SAVED_OBJECT_TYPE = 'index-pattern';
const indexPatternTypes = Object.values(_constants.dataTypes);
exports.indexPatternTypes = indexPatternTypes;

function getIndexPatternSavedObjects() {
  return indexPatternTypes.map(indexPatternType => ({
    id: `${indexPatternType}-*`,
    type: INDEX_PATTERN_SAVED_OBJECT_TYPE,
    attributes: {
      title: `${indexPatternType}-*`,
      timeFieldName: '@timestamp',
      allowNoIndex: true
    }
  }));
}

async function removeUnusedIndexPatterns(savedObjectsClient) {
  const logger = _services.appContextService.getLogger(); // get all user installed packages


  const installedPackagesRes = await (0, _get.getPackageSavedObjects)(savedObjectsClient);
  const installedPackagesSavedObjects = installedPackagesRes.saved_objects.filter(so => so.attributes.install_status === _constants.installationStatuses.Installed);

  if (installedPackagesSavedObjects.length > 0) {
    return [];
  }

  const patternsToDelete = indexPatternTypes.map(indexPatternType => `${indexPatternType}-*`);
  const {
    resolved_objects: resolvedObjects
  } = await savedObjectsClient.bulkResolve(patternsToDelete.map(pattern => ({
    id: pattern,
    type: INDEX_PATTERN_SAVED_OBJECT_TYPE
  }))); // eslint-disable-next-line @typescript-eslint/naming-convention

  const idsToDelete = resolvedObjects.map(({
    saved_object
  }) => saved_object.id);
  return Promise.all(idsToDelete.map(async id => {
    try {
      logger.debug(`deleting index pattern ${id}`);
      await savedObjectsClient.delete(INDEX_PATTERN_SAVED_OBJECT_TYPE, id);
    } catch (err) {
      // index pattern was probably deleted by the user already
      logger.debug(`Non fatal error encountered deleting index pattern ${id} : ${err}`);
    }

    return;
  }));
}