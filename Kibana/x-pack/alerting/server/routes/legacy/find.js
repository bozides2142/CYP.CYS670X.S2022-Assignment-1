"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAlertRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../../lib/license_api_access");

var _common = require("../../../common");

var _rename_keys = require("./../lib/rename_keys");

var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");

var _track_legacy_terminology = require("../lib/track_legacy_terminology");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// config definition


const querySchema = _configSchema.schema.object({
  per_page: _configSchema.schema.number({
    defaultValue: 10,
    min: 0
  }),
  page: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  }),
  search: _configSchema.schema.maybe(_configSchema.schema.string()),
  default_search_operator: _configSchema.schema.oneOf([_configSchema.schema.literal('OR'), _configSchema.schema.literal('AND')], {
    defaultValue: 'OR'
  }),
  search_fields: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()])),
  sort_field: _configSchema.schema.maybe(_configSchema.schema.string()),
  sort_order: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')])),
  has_reference: _configSchema.schema.maybe( // use nullable as maybe is currently broken
  // in config-schema
  _configSchema.schema.nullable(_configSchema.schema.object({
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  }))),
  fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  filter: _configSchema.schema.maybe(_configSchema.schema.string())
});

const findAlertRoute = (router, licenseState, usageCounter) => {
  router.get({
    path: `${_common.LEGACY_BASE_ALERT_API_PATH}/_find`,
    validate: {
      query: querySchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('find', usageCounter);
    (0, _track_legacy_terminology.trackLegacyTerminology)([req.query.search, req.query.search_fields, req.query.sort_field].filter(Boolean), usageCounter);
    const rulesClient = context.alerting.getRulesClient();
    const query = req.query;
    const renameMap = {
      default_search_operator: 'defaultSearchOperator',
      fields: 'fields',
      has_reference: 'hasReference',
      page: 'page',
      per_page: 'perPage',
      search: 'search',
      sort_field: 'sortField',
      sort_order: 'sortOrder',
      filter: 'filter'
    };
    const options = (0, _rename_keys.renameKeys)(renameMap, query);

    if (query.search_fields) {
      options.searchFields = Array.isArray(query.search_fields) ? query.search_fields : [query.search_fields];
    }

    if (query.fields) {
      usageCounter === null || usageCounter === void 0 ? void 0 : usageCounter.incrementCounter({
        counterName: `legacyAlertingFieldsUsage`,
        counterType: 'alertingFieldsUsage',
        incrementBy: 1
      });
    }

    const findResult = await rulesClient.find({
      options,
      excludeFromPublicApi: true
    });
    return res.ok({
      body: findResult
    });
  }));
};

exports.findAlertRoute = findAlertRoute;