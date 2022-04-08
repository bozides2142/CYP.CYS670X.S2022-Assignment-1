"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPackRoute = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../../fleet/common");

var _types = require("../../../common/types");

var _common2 = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars


const findPackRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/packs',
    validate: {
      query: _configSchema.schema.object({
        pageIndex: _configSchema.schema.maybe(_configSchema.schema.string()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number()),
        sortField: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-readPacks`]
    }
  }, async (context, request, response) => {
    var _request$query$pageIn, _request$query$pageSi, _request$query$sortFi, _request$query$sortOr;

    const savedObjectsClient = context.core.savedObjects.client;
    const soClientResponse = await savedObjectsClient.find({
      type: _types.packSavedObjectType,
      page: parseInt((_request$query$pageIn = request.query.pageIndex) !== null && _request$query$pageIn !== void 0 ? _request$query$pageIn : '0', 10) + 1,
      perPage: (_request$query$pageSi = request.query.pageSize) !== null && _request$query$pageSi !== void 0 ? _request$query$pageSi : 20,
      sortField: (_request$query$sortFi = request.query.sortField) !== null && _request$query$sortFi !== void 0 ? _request$query$sortFi : 'updated_at',
      // @ts-expect-error sortOrder type must be union of ['asc', 'desc']
      sortOrder: (_request$query$sortOr = request.query.sortOrder) !== null && _request$query$sortOr !== void 0 ? _request$query$sortOr : 'desc'
    });
    soClientResponse.saved_objects.map(pack => {
      const policyIds = (0, _lodash.map)((0, _lodash.filter)(pack.references, ['type', _common.AGENT_POLICY_SAVED_OBJECT_TYPE]), 'id'); // @ts-expect-error update types

      pack.policy_ids = policyIds;
      return pack;
    });
    return response.ok({
      body: soClientResponse
    });
  });
};

exports.findPackRoute = findPackRoute;