"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _esQuery = require("@kbn/es-query");

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _utils = require("../utils");

var _error = require("../../common/error");

var _utils2 = require("../../common/utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Throws an error if any of the requests attempt to update the owner of a case.
 */


function throwIfUpdateOwner(requests) {
  const requestsUpdatingOwner = requests.filter(({
    updateReq
  }) => updateReq.owner !== undefined);

  if (requestsUpdatingOwner.length > 0) {
    const ids = requestsUpdatingOwner.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`Updating the owner of a case  is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests updates a title and the length is over MAX_TITLE_LENGTH.
 */


function throwIfTitleIsInvalid(requests) {
  const requestsInvalidTitle = requests.filter(({
    updateReq
  }) => updateReq.title !== undefined && updateReq.title.length > _constants.MAX_TITLE_LENGTH);

  if (requestsInvalidTitle.length > 0) {
    const ids = requestsInvalidTitle.map(({
      updateReq
    }) => updateReq.id);
    throw _boom.default.badRequest(`The length of the title is too long. The maximum length is ${_constants.MAX_TITLE_LENGTH}, ids: [${ids.join(', ')}]`);
  }
}
/**
 * Get the id from a reference in a comment for a specific type.
 */


function getID(comment, type) {
  var _comment$references$f;

  return (_comment$references$f = comment.references.find(ref => ref.type === type)) === null || _comment$references$f === void 0 ? void 0 : _comment$references$f.id;
}
/**
 * Gets all the alert comments (generated or user alerts) for the requested cases.
 */


async function getAlertComments({
  casesToSync,
  caseService,
  unsecuredSavedObjectsClient
}) {
  const idsOfCasesToSync = casesToSync.map(({
    updateReq
  }) => updateReq.id); // getAllCaseComments will by default get all the comments, unless page or perPage fields are set

  return caseService.getAllCaseComments({
    unsecuredSavedObjectsClient,
    id: idsOfCasesToSync,
    options: {
      filter: _esQuery.nodeBuilder.is(`${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _api.CommentType.alert)
    }
  });
}
/**
 * Returns what status the alert comment should have based on whether it is associated to a case.
 */


function getSyncStatusForComment({
  alertComment,
  casesToSyncToStatus
}) {
  var _casesToSyncToStatus$;

  const id = getID(alertComment, _constants.CASE_SAVED_OBJECT);

  if (!id) {
    return _api.CaseStatuses.open;
  }

  return (_casesToSyncToStatus$ = casesToSyncToStatus.get(id)) !== null && _casesToSyncToStatus$ !== void 0 ? _casesToSyncToStatus$ : _api.CaseStatuses.open;
}
/**
 * Updates the alert ID's status field based on the patch requests
 */


async function updateAlerts({
  casesWithSyncSettingChangedToOn,
  casesWithStatusChangedAndSynced,
  caseService,
  unsecuredSavedObjectsClient,
  alertsService
}) {
  /**
   * It's possible that a case ID can appear multiple times in each array. I'm intentionally placing the status changes
   * last so when the map is built we will use the last status change as the source of truth.
   */
  const casesToSync = [...casesWithSyncSettingChangedToOn, ...casesWithStatusChangedAndSynced]; // build a map of case id to the status it has

  const casesToSyncToStatus = casesToSync.reduce((acc, {
    updateReq,
    originalCase
  }) => {
    var _ref, _updateReq$status;

    acc.set(updateReq.id, (_ref = (_updateReq$status = updateReq.status) !== null && _updateReq$status !== void 0 ? _updateReq$status : originalCase.attributes.status) !== null && _ref !== void 0 ? _ref : _api.CaseStatuses.open);
    return acc;
  }, new Map()); // get all the alerts for all the alert comments for all cases

  const totalAlerts = await getAlertComments({
    casesToSync,
    caseService,
    unsecuredSavedObjectsClient
  }); // create an array of requests that indicate the id, index, and status to update an alert

  const alertsToUpdate = totalAlerts.saved_objects.reduce((acc, alertComment) => {
    if ((0, _utils2.isCommentRequestTypeAlert)(alertComment.attributes)) {
      const status = getSyncStatusForComment({
        alertComment,
        casesToSyncToStatus
      });
      acc.push(...(0, _utils2.createAlertUpdateRequest)({
        comment: alertComment.attributes,
        status
      }));
    }

    return acc;
  }, []);
  await alertsService.updateAlertsStatus(alertsToUpdate);
}

function partitionPatchRequest(casesMap, patchReqCases) {
  const nonExistingCases = [];
  const conflictedCases = [];
  const casesToAuthorize = new Map();

  for (const reqCase of patchReqCases) {
    const foundCase = casesMap.get(reqCase.id);

    if (!foundCase || foundCase.error) {
      nonExistingCases.push(reqCase);
    } else if (foundCase.version !== reqCase.version) {
      conflictedCases.push(reqCase); // let's try to authorize the conflicted case even though we'll fail after afterwards just in case

      casesToAuthorize.set(foundCase.id, {
        id: foundCase.id,
        owner: foundCase.attributes.owner
      });
    } else {
      casesToAuthorize.set(foundCase.id, {
        id: foundCase.id,
        owner: foundCase.attributes.owner
      });
    }
  }

  return {
    nonExistingCases,
    conflictedCases,
    casesToAuthorize: Array.from(casesToAuthorize.values())
  };
}
/**
 * Updates the specified cases with new values
 *
 * @ignore
 */


const update = async (cases, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    userActionService,
    user,
    logger,
    authorization,
    alertsService
  } = clientArgs;
  const query = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesPatchRequestRt).decode(cases), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));

  try {
    const myCases = await caseService.getCases({
      unsecuredSavedObjectsClient,
      caseIds: query.cases.map(q => q.id)
    });
    const casesMap = myCases.saved_objects.reduce((acc, so) => {
      acc.set(so.id, so);
      return acc;
    }, new Map());
    const {
      nonExistingCases,
      conflictedCases,
      casesToAuthorize
    } = partitionPatchRequest(casesMap, query.cases);
    await authorization.ensureAuthorized({
      entities: casesToAuthorize,
      operation: _authorization.Operations.updateCase
    });

    if (nonExistingCases.length > 0) {
      throw _boom.default.notFound(`These cases ${nonExistingCases.map(c => c.id).join(', ')} do not exist. Please check you have the correct ids.`);
    }

    if (conflictedCases.length > 0) {
      throw _boom.default.conflict(`These cases ${conflictedCases.map(c => c.id).join(', ')} has been updated. Please refresh before saving additional updates.`);
    }

    const updateCases = query.cases.reduce((acc, updateCase) => {
      const originalCase = casesMap.get(updateCase.id);

      if (!originalCase) {
        return acc;
      }

      const fieldsToUpdate = (0, _utils.getCaseToUpdate)(originalCase.attributes, updateCase);
      const {
        id,
        version,
        ...restFields
      } = fieldsToUpdate;

      if (Object.keys(restFields).length > 0) {
        acc.push({
          originalCase,
          updateReq: fieldsToUpdate
        });
      }

      return acc;
    }, []);

    if (updateCases.length <= 0) {
      throw _boom.default.notAcceptable('All update fields are identical to current version.');
    }

    throwIfUpdateOwner(updateCases);
    throwIfTitleIsInvalid(updateCases); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const updatedDt = new Date().toISOString();
    const updatedCases = await caseService.patchCases({
      unsecuredSavedObjectsClient,
      cases: updateCases.map(({
        updateReq,
        originalCase
      }) => {
        // intentionally removing owner from the case so that we don't accidentally allow it to be updated
        const {
          id: caseId,
          version,
          owner,
          ...updateCaseAttributes
        } = updateReq;
        let closedInfo = {};

        if (updateCaseAttributes.status && updateCaseAttributes.status === _api.CaseStatuses.closed) {
          closedInfo = {
            closed_at: updatedDt,
            closed_by: {
              email,
              full_name,
              username
            }
          };
        } else if (updateCaseAttributes.status && (updateCaseAttributes.status === _api.CaseStatuses.open || updateCaseAttributes.status === _api.CaseStatuses['in-progress'])) {
          closedInfo = {
            closed_at: null,
            closed_by: null
          };
        }

        return {
          caseId,
          originalCase,
          updatedAttributes: { ...updateCaseAttributes,
            ...closedInfo,
            updated_at: updatedDt,
            updated_by: {
              email,
              full_name,
              username
            }
          },
          version
        };
      })
    }); // If a status update occurred and the case is synced then we need to update all alerts' status
    // attached to the case to the new status.

    const casesWithStatusChangedAndSynced = updateCases.filter(({
      updateReq,
      originalCase
    }) => {
      return originalCase != null && updateReq.status != null && originalCase.attributes.status !== updateReq.status && originalCase.attributes.settings.syncAlerts;
    }); // If syncAlerts setting turned on we need to update all alerts' status
    // attached to the case to the current status.

    const casesWithSyncSettingChangedToOn = updateCases.filter(({
      updateReq,
      originalCase
    }) => {
      var _updateReq$settings;

      return originalCase != null && ((_updateReq$settings = updateReq.settings) === null || _updateReq$settings === void 0 ? void 0 : _updateReq$settings.syncAlerts) != null && originalCase.attributes.settings.syncAlerts !== updateReq.settings.syncAlerts && updateReq.settings.syncAlerts;
    }); // Update the alert's status to match any case status or sync settings changes

    await updateAlerts({
      casesWithStatusChangedAndSynced,
      casesWithSyncSettingChangedToOn,
      caseService,
      unsecuredSavedObjectsClient,
      alertsService
    });
    const returnUpdatedCase = myCases.saved_objects.filter(myCase => updatedCases.saved_objects.some(updatedCase => updatedCase.id === myCase.id)).map(myCase => {
      var _updatedCase$version;

      const updatedCase = updatedCases.saved_objects.find(c => c.id === myCase.id);
      return (0, _utils2.flattenCaseSavedObject)({
        savedObject: { ...myCase,
          ...updatedCase,
          attributes: { ...myCase.attributes,
            ...(updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.attributes)
          },
          references: myCase.references,
          version: (_updatedCase$version = updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : myCase.version
        }
      });
    });
    await userActionService.bulkCreateUpdateCase({
      unsecuredSavedObjectsClient,
      originalCases: myCases.saved_objects,
      updatedCases: updatedCases.saved_objects,
      user
    });
    return _api.CasesResponseRt.encode(returnUpdatedCase);
  } catch (error) {
    const idVersions = cases.cases.map(caseInfo => ({
      id: caseInfo.id,
      version: caseInfo.version
    }));
    throw (0, _error.createCaseError)({
      message: `Failed to update case, ids: ${JSON.stringify(idVersions)}: ${error}`,
      error,
      logger
    });
  }
};

exports.update = update;