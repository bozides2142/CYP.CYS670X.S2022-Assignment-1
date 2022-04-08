"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeprecationsRoutes = void 0;

var _elasticsearch = require("@elastic/elasticsearch");

var _constants = require("../../../common/constants");

var _lib = require("../../lib");

var _deprecations = require("../../lib/deprecations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDeprecationsRoutes = (reporting, logger) => {
  const {
    router
  } = reporting.getPluginSetupDeps();

  const authzWrapper = handler => {
    return async (ctx, req, res) => {
      const {
        security
      } = reporting.getPluginSetupDeps();

      if (!(security !== null && security !== void 0 && security.license.isEnabled())) {
        return handler(ctx, req, res);
      }

      const {
        core: {
          elasticsearch
        }
      } = ctx;
      const store = await reporting.getStore();

      try {
        const {
          body
        } = await elasticsearch.client.asCurrentUser.security.hasPrivileges({
          body: {
            index: [{
              privileges: ['manage'],
              // required to do anything with the reporting indices
              names: [store.getReportingIndexPattern()],
              allow_restricted_indices: true
            } // TODO: Needed until `allow_restricted_indices` is added to the types.
            ]
          }
        });

        if (!body.has_all_requested) {
          return res.notFound();
        }
      } catch (e) {
        logger.error(e);
        return res.customError({
          statusCode: e.statusCode,
          body: e.message
        });
      }

      return handler(ctx, req, res);
    };
  };

  router.get({
    path: _constants.API_GET_ILM_POLICY_STATUS,
    validate: false
  }, authzWrapper(async ({
    core: {
      elasticsearch: {
        client: scopedClient
      }
    }
  }, _req, res) => {
    const checkIlmMigrationStatus = () => {
      return _deprecations.deprecations.checkIlmMigrationStatus({
        reportingCore: reporting,
        // We want to make the current status visible to all reporting users
        elasticsearchClient: scopedClient.asInternalUser
      });
    };

    try {
      const response = {
        status: await checkIlmMigrationStatus()
      };
      return res.ok({
        body: response
      });
    } catch (e) {
      var _e$statusCode;

      logger.error(e);
      return res.customError({
        statusCode: (_e$statusCode = e === null || e === void 0 ? void 0 : e.statusCode) !== null && _e$statusCode !== void 0 ? _e$statusCode : 500,
        body: {
          message: e.message
        }
      });
    }
  }));
  router.put({
    path: _constants.API_MIGRATE_ILM_POLICY_URL,
    validate: false
  }, authzWrapper(async ({
    core: {
      elasticsearch
    }
  }, _req, res) => {
    const store = await reporting.getStore();
    const {
      client: {
        asCurrentUser: client
      }
    } = elasticsearch;

    const scopedIlmPolicyManager = _lib.IlmPolicyManager.create({
      client
    }); // First we ensure that the reporting ILM policy exists in the cluster


    try {
      // We don't want to overwrite an existing reporting policy because it may contain alterations made by users
      if (!(await scopedIlmPolicyManager.doesIlmPolicyExist())) {
        await scopedIlmPolicyManager.createIlmPolicy();
      }
    } catch (e) {
      var _e$statusCode2;

      return res.customError({
        statusCode: (_e$statusCode2 = e === null || e === void 0 ? void 0 : e.statusCode) !== null && _e$statusCode2 !== void 0 ? _e$statusCode2 : 500,
        body: {
          message: e.message
        }
      });
    }

    const indexPattern = store.getReportingIndexPattern(); // Second we migrate all of the existing indices to be managed by the reporting ILM policy

    try {
      await client.indices.putSettings({
        index: indexPattern,
        body: {
          'index.lifecycle': {
            name: _constants.ILM_POLICY_NAME
          }
        }
      });
      return res.ok();
    } catch (err) {
      logger.error(err);

      if (err instanceof _elasticsearch.errors.ResponseError) {
        var _err$statusCode; // If there were no reporting indices to update, that's OK because then there is nothing to migrate


        if (err.statusCode === 404) {
          return res.ok();
        }

        return res.customError({
          statusCode: (_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 500,
          body: {
            message: err.message,
            name: err.name
          }
        });
      }

      throw err;
    }
  }));
};

exports.registerDeprecationsRoutes = registerDeprecationsRoutes;