"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pMap = _interopRequireDefault(require("p-map"));

var _esQuery = require("@kbn/es-query");

var _constants = require("../../../common/constants");

var _api = require("../../../common/api");

var _utils = require("../../common/utils");

var _api2 = require("../../routes/api");

var _utils2 = require("../../client/utils");

var _utils3 = require("../../authorization/utils");

var _transform = require("./transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CasesService {
  constructor(log, authentication) {
    (0, _defineProperty2.default)(this, "buildCaseIdsAggs", (size = 100) => ({
      references: {
        nested: {
          path: `${_constants.CASE_COMMENT_SAVED_OBJECT}.references`
        },
        aggregations: {
          caseIds: {
            terms: {
              field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.references.id`,
              size
            }
          }
        }
      }
    }));
    this.log = log;
    this.authentication = authentication;
  }

  async getCaseIdsByAlertId({
    unsecuredSavedObjectsClient,
    alertId,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all cases for alert id ${alertId}`);
      const combinedFilter = (0, _utils2.combineFilters)([_esQuery.nodeBuilder.is(`${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.alertId`, alertId), filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        fields: (0, _utils3.includeFieldsRequiredForAuthentication)(),
        page: 1,
        perPage: 1,
        sortField: _utils.defaultSortField,
        aggs: this.buildCaseIdsAggs(_constants.MAX_DOCS_PER_PAGE),
        filter: combinedFilter
      });
      return response;
    } catch (error) {
      this.log.error(`Error on GET all cases for alert id ${alertId}: ${error}`);
      throw error;
    }
  }
  /**
   * Extracts the case IDs from the alert aggregation
   */


  static getCaseIDsFromAlertAggs(result) {
    var _result$aggregations$, _result$aggregations;

    return (_result$aggregations$ = (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : _result$aggregations.references.caseIds.buckets.map(b => b.key)) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : [];
  }
  /**
   * Returns a map of all cases.
   */


  async findCasesGroupedByID({
    unsecuredSavedObjectsClient,
    caseOptions
  }) {
    const cases = await this.findCases({
      unsecuredSavedObjectsClient,
      options: caseOptions
    });
    const casesMap = cases.saved_objects.reduce((accMap, caseInfo) => {
      accMap.set(caseInfo.id, caseInfo);
      return accMap;
    }, new Map());
    const totalCommentsForCases = await this.getCaseCommentStats({
      unsecuredSavedObjectsClient,
      ids: Array.from(casesMap.keys())
    });
    const casesWithComments = new Map();

    for (const [id, caseInfo] of casesMap.entries()) {
      var _totalCommentsForCase, _totalCommentsForCase2;

      casesWithComments.set(id, (0, _utils.flattenCaseSavedObject)({
        savedObject: caseInfo,
        totalComment: (_totalCommentsForCase = totalCommentsForCases.commentTotals.get(id)) !== null && _totalCommentsForCase !== void 0 ? _totalCommentsForCase : 0,
        totalAlerts: (_totalCommentsForCase2 = totalCommentsForCases.alertTotals.get(id)) !== null && _totalCommentsForCase2 !== void 0 ? _totalCommentsForCase2 : 0
      }));
    }

    return {
      casesMap: casesWithComments,
      page: cases.page,
      perPage: cases.per_page,
      total: cases.total
    };
  }
  /**
   * Retrieves the number of cases that exist with a given status (open, closed, etc).
   */


  async findCaseStatusStats({
    unsecuredSavedObjectsClient,
    caseOptions,
    ensureSavedObjectsAreAuthorized
  }) {
    const cases = await this.findCases({
      unsecuredSavedObjectsClient,
      options: { ...caseOptions,
        page: 1,
        perPage: _constants.MAX_DOCS_PER_PAGE
      }
    }); // make sure that the retrieved cases were correctly filtered by owner

    ensureSavedObjectsAreAuthorized(cases.saved_objects.map(caseInfo => ({
      id: caseInfo.id,
      owner: caseInfo.attributes.owner
    })));
    return cases.saved_objects.length;
  }
  /**
   * Returns the number of total comments and alerts for a case
   */


  async getCaseCommentStats({
    unsecuredSavedObjectsClient,
    ids
  }) {
    if (ids.length <= 0) {
      return {
        commentTotals: new Map(),
        alertTotals: new Map()
      };
    }

    const getCommentsMapper = async id => this.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id,
      options: {
        page: 1,
        perPage: 1
      }
    }); // Ensuring we don't do too many concurrent get running.


    const allComments = await (0, _pMap.default)(ids, getCommentsMapper, {
      concurrency: _constants.MAX_CONCURRENT_SEARCHES
    });
    const alerts = await this.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id: ids,
      options: {
        filter: _esQuery.nodeBuilder.is(`${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _api.CommentType.alert)
      }
    });

    const getID = comments => {
      var _comments$saved_objec;

      return comments.saved_objects.length > 0 ? (_comments$saved_objec = comments.saved_objects[0].references.find(ref => ref.type === _constants.CASE_SAVED_OBJECT)) === null || _comments$saved_objec === void 0 ? void 0 : _comments$saved_objec.id : undefined;
    };

    const groupedComments = allComments.reduce((acc, comments) => {
      const id = getID(comments);

      if (id) {
        acc.set(id, comments.total);
      }

      return acc;
    }, new Map());
    const groupedAlerts = (0, _utils.groupTotalAlertsByID)({
      comments: alerts
    });
    return {
      commentTotals: groupedComments,
      alertTotals: groupedAlerts
    };
  }

  async deleteCase({
    unsecuredSavedObjectsClient,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to DELETE case ${caseId}`);
      return await unsecuredSavedObjectsClient.delete(_constants.CASE_SAVED_OBJECT, caseId);
    } catch (error) {
      this.log.error(`Error on DELETE case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getCase({
    unsecuredSavedObjectsClient,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to GET case ${caseId}`);
      const caseSavedObject = await unsecuredSavedObjectsClient.get(_constants.CASE_SAVED_OBJECT, caseId);
      return (0, _transform.transformSavedObjectToExternalModel)(caseSavedObject);
    } catch (error) {
      this.log.error(`Error on GET case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getResolveCase({
    unsecuredSavedObjectsClient,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to resolve case ${caseId}`);
      const resolveCaseResult = await unsecuredSavedObjectsClient.resolve(_constants.CASE_SAVED_OBJECT, caseId);
      return { ...resolveCaseResult,
        saved_object: (0, _transform.transformSavedObjectToExternalModel)(resolveCaseResult.saved_object)
      };
    } catch (error) {
      this.log.error(`Error on resolve case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getCases({
    unsecuredSavedObjectsClient,
    caseIds
  }) {
    try {
      this.log.debug(`Attempting to GET cases ${caseIds.join(', ')}`);
      const cases = await unsecuredSavedObjectsClient.bulkGet(caseIds.map(caseId => ({
        type: _constants.CASE_SAVED_OBJECT,
        id: caseId
      })));
      return (0, _transform.transformBulkResponseToExternalModel)(cases);
    } catch (error) {
      this.log.error(`Error on GET cases ${caseIds.join(', ')}: ${error}`);
      throw error;
    }
  }

  async findCases({
    unsecuredSavedObjectsClient,
    options
  }) {
    try {
      this.log.debug(`Attempting to find cases`);
      const cases = await unsecuredSavedObjectsClient.find({
        sortField: _utils.defaultSortField,
        ...options,
        type: _constants.CASE_SAVED_OBJECT
      });
      return (0, _transform.transformFindResponseToExternalModel)(cases);
    } catch (error) {
      this.log.error(`Error on find cases: ${error}`);
      throw error;
    }
  }

  asArray(id) {
    if (id === undefined) {
      return [];
    } else if (Array.isArray(id)) {
      return id;
    } else {
      return [id];
    }
  }

  async getAllComments({
    unsecuredSavedObjectsClient,
    id,
    options
  }) {
    try {
      this.log.debug(`Attempting to GET all comments internal for id ${JSON.stringify(id)}`);

      if ((options === null || options === void 0 ? void 0 : options.page) !== undefined || (options === null || options === void 0 ? void 0 : options.perPage) !== undefined) {
        return unsecuredSavedObjectsClient.find({
          type: _constants.CASE_COMMENT_SAVED_OBJECT,
          sortField: _utils.defaultSortField,
          ...options
        });
      }

      return unsecuredSavedObjectsClient.find({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        page: 1,
        perPage: _constants.MAX_DOCS_PER_PAGE,
        sortField: _utils.defaultSortField,
        ...options
      });
    } catch (error) {
      this.log.error(`Error on GET all comments internal for ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }
  /**
   * Default behavior is to retrieve all comments that adhere to a given filter (if one is included).
   * to override this pass in the either the page or perPage options.
   */


  async getAllCaseComments({
    unsecuredSavedObjectsClient,
    id,
    options
  }) {
    try {
      const refs = this.asArray(id).map(caseID => ({
        type: _constants.CASE_SAVED_OBJECT,
        id: caseID
      }));

      if (refs.length <= 0) {
        var _options$perPage, _options$page;

        return {
          saved_objects: [],
          total: 0,
          per_page: (_options$perPage = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : _api2.defaultPerPage,
          page: (_options$page = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page !== void 0 ? _options$page : _api2.defaultPage
        };
      }

      this.log.debug(`Attempting to GET all comments for case caseID ${JSON.stringify(id)}`);
      return await this.getAllComments({
        unsecuredSavedObjectsClient,
        id,
        options: {
          hasReferenceOperator: 'OR',
          hasReference: refs,
          filter: options === null || options === void 0 ? void 0 : options.filter,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for case ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }

  async getReporters({
    unsecuredSavedObjectsClient,
    filter
  }) {
    try {
      var _results$aggregations, _results$aggregations2, _results$aggregations3;

      this.log.debug(`Attempting to GET all reporters`);
      const results = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_SAVED_OBJECT,
        page: 1,
        perPage: 1,
        filter,
        aggs: {
          reporters: {
            terms: {
              field: `${_constants.CASE_SAVED_OBJECT}.attributes.created_by.username`,
              size: _constants.MAX_DOCS_PER_PAGE,
              order: {
                _key: 'asc'
              }
            },
            aggs: {
              top_docs: {
                top_hits: {
                  sort: [{
                    [`${_constants.CASE_SAVED_OBJECT}.created_at`]: {
                      order: 'desc'
                    }
                  }],
                  size: 1,
                  _source: [`${_constants.CASE_SAVED_OBJECT}.created_by`]
                }
              }
            }
          }
        }
      });
      return (_results$aggregations = results === null || results === void 0 ? void 0 : (_results$aggregations2 = results.aggregations) === null || _results$aggregations2 === void 0 ? void 0 : (_results$aggregations3 = _results$aggregations2.reporters) === null || _results$aggregations3 === void 0 ? void 0 : _results$aggregations3.buckets.map(({
        key: username,
        top_docs: topDocs
      }) => {
        var _topDocs$hits$hits$0$, _topDocs$hits, _topDocs$hits$hits, _topDocs$hits$hits$, _topDocs$hits$hits$$_, _topDocs$hits$hits$$_2, _user$full_name, _user$email;

        const user = (_topDocs$hits$hits$0$ = topDocs === null || topDocs === void 0 ? void 0 : (_topDocs$hits = topDocs.hits) === null || _topDocs$hits === void 0 ? void 0 : (_topDocs$hits$hits = _topDocs$hits.hits) === null || _topDocs$hits$hits === void 0 ? void 0 : (_topDocs$hits$hits$ = _topDocs$hits$hits[0]) === null || _topDocs$hits$hits$ === void 0 ? void 0 : (_topDocs$hits$hits$$_ = _topDocs$hits$hits$._source) === null || _topDocs$hits$hits$$_ === void 0 ? void 0 : (_topDocs$hits$hits$$_2 = _topDocs$hits$hits$$_.cases) === null || _topDocs$hits$hits$$_2 === void 0 ? void 0 : _topDocs$hits$hits$$_2.created_by) !== null && _topDocs$hits$hits$0$ !== void 0 ? _topDocs$hits$hits$0$ : {};
        return {
          username,
          full_name: (_user$full_name = user.full_name) !== null && _user$full_name !== void 0 ? _user$full_name : null,
          email: (_user$email = user.email) !== null && _user$email !== void 0 ? _user$email : null
        };
      })) !== null && _results$aggregations !== void 0 ? _results$aggregations : [];
    } catch (error) {
      this.log.error(`Error on GET all reporters: ${error}`);
      throw error;
    }
  }

  async getTags({
    unsecuredSavedObjectsClient,
    filter
  }) {
    try {
      var _results$aggregations4, _results$aggregations5, _results$aggregations6;

      this.log.debug(`Attempting to GET all cases`);
      const results = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_SAVED_OBJECT,
        page: 1,
        perPage: 1,
        filter,
        aggs: {
          tags: {
            terms: {
              field: `${_constants.CASE_SAVED_OBJECT}.attributes.tags`,
              size: _constants.MAX_DOCS_PER_PAGE,
              order: {
                _key: 'asc'
              }
            }
          }
        }
      });
      return (_results$aggregations4 = results === null || results === void 0 ? void 0 : (_results$aggregations5 = results.aggregations) === null || _results$aggregations5 === void 0 ? void 0 : (_results$aggregations6 = _results$aggregations5.tags) === null || _results$aggregations6 === void 0 ? void 0 : _results$aggregations6.buckets.map(({
        key
      }) => key)) !== null && _results$aggregations4 !== void 0 ? _results$aggregations4 : [];
    } catch (error) {
      this.log.error(`Error on GET tags: ${error}`);
      throw error;
    }
  }

  getUser({
    request
  }) {
    try {
      this.log.debug(`Attempting to authenticate a user`);

      if (this.authentication != null) {
        const user = this.authentication.getCurrentUser(request);

        if (!user) {
          return {
            username: null,
            full_name: null,
            email: null
          };
        }

        return user;
      }

      return {
        username: null,
        full_name: null,
        email: null
      };
    } catch (error) {
      this.log.error(`Error on GET user: ${error}`);
      throw error;
    }
  }

  async postNewCase({
    unsecuredSavedObjectsClient,
    attributes,
    id
  }) {
    try {
      this.log.debug(`Attempting to POST a new case`);
      const transformedAttributes = (0, _transform.transformAttributesToESModel)(attributes);
      const createdCase = await unsecuredSavedObjectsClient.create(_constants.CASE_SAVED_OBJECT, transformedAttributes.attributes, {
        id,
        references: transformedAttributes.referenceHandler.build()
      });
      return (0, _transform.transformSavedObjectToExternalModel)(createdCase);
    } catch (error) {
      this.log.error(`Error on POST a new case: ${error}`);
      throw error;
    }
  }

  async patchCase({
    unsecuredSavedObjectsClient,
    caseId,
    updatedAttributes,
    originalCase,
    version
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${caseId}`);
      const transformedAttributes = (0, _transform.transformAttributesToESModel)(updatedAttributes);
      const updatedCase = await unsecuredSavedObjectsClient.update(_constants.CASE_SAVED_OBJECT, caseId, transformedAttributes.attributes, {
        version,
        references: transformedAttributes.referenceHandler.build(originalCase.references)
      });
      return (0, _transform.transformUpdateResponseToExternalModel)(updatedCase);
    } catch (error) {
      this.log.error(`Error on UPDATE case ${caseId}: ${error}`);
      throw error;
    }
  }

  async patchCases({
    unsecuredSavedObjectsClient,
    cases
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${cases.map(c => c.caseId).join(', ')}`);
      const bulkUpdate = cases.map(({
        caseId,
        updatedAttributes,
        version,
        originalCase
      }) => {
        const {
          attributes,
          referenceHandler
        } = (0, _transform.transformAttributesToESModel)(updatedAttributes);
        return {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId,
          attributes,
          references: referenceHandler.build(originalCase.references),
          version
        };
      });
      const updatedCases = await unsecuredSavedObjectsClient.bulkUpdate(bulkUpdate);
      return (0, _transform.transformUpdateResponsesToExternalModels)(updatedCases);
    } catch (error) {
      this.log.error(`Error on UPDATE case ${cases.map(c => c.caseId).join(', ')}: ${error}`);
      throw error;
    }
  }

}

exports.CasesService = CasesService;