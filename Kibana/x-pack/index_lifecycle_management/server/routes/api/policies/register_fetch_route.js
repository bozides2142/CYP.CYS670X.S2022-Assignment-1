"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = registerFetchRoute;

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function formatPolicies(policiesMap) {
  return Object.keys(policiesMap).reduce((accum, lifecycleName) => {
    const policyEntry = policiesMap[lifecycleName];
    const {
      in_use_by: {
        indices,
        data_streams: dataStreams,
        composable_templates: indexTemplates
      },
      modified_date: modifiedDate,
      policy,
      version
    } = policyEntry;
    accum.push({
      name: lifecycleName,
      modifiedDate,
      version,
      policy,
      indices,
      dataStreams,
      indexTemplates
    });
    return accum;
  }, []);
}

async function fetchPolicies(client) {
  const options = {
    // we allow 404 since they may have no policies
    ignore: [404]
  }; // @ts-expect-error Policy doesn't contain all known properties (name, in_use_by)

  return client.ilm.getLifecycle({}, options);
}

function registerFetchRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _services.addBasePath)('/policies'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      asCurrentUser
    } = context.core.elasticsearch.client;

    try {
      const policiesResponse = await fetchPolicies(asCurrentUser);

      if (policiesResponse.statusCode === 404) {
        return response.ok({
          body: []
        });
      }

      return response.ok({
        body: formatPolicies(policiesResponse.body)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}