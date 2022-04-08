"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _lodash = require("lodash");

var _lib = require("../../../common/lib");

var _constants = require("../../../common/constants");

var _license_pre_routing_factory = require("../../lib/license_pre_routing_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const register = deps => {
  const {
    router,
    lib: {
      handleEsError
    }
  } = deps;

  const allHandler = async (ctx, request, response) => {
    try {
      const {
        client: clusterClient
      } = ctx.core.elasticsearch;
      const {
        body: clusterSettings
      } = await clusterClient.asCurrentUser.cluster.getSettings();
      const transientClusterNames = Object.keys((0, _lodash.get)(clusterSettings, 'transient.cluster.remote') || {});
      const persistentClusterNames = Object.keys((0, _lodash.get)(clusterSettings, 'persistent.cluster.remote') || {});
      const {
        body: clustersByName
      } = await clusterClient.asCurrentUser.cluster.remoteInfo();
      const clusterNames = clustersByName && Object.keys(clustersByName) || [];
      const body = clusterNames.map(clusterName => {
        const cluster = clustersByName[clusterName];
        const isTransient = transientClusterNames.includes(clusterName);
        const isPersistent = persistentClusterNames.includes(clusterName);
        const {
          config
        } = deps; // If the cluster hasn't been stored in the cluster state, then it's defined by the
        // node's config file.

        const isConfiguredByNode = !isTransient && !isPersistent; // Pre-7.6, ES supported an undocumented "proxy" field
        // ES does not handle migrating this to the new implementation, so we need to surface it in the UI
        // This value is not available via the GET /_remote/info API, so we get it from the cluster settings

        const deprecatedProxyAddress = isPersistent ? (0, _lodash.get)(clusterSettings, `persistent.cluster.remote[${clusterName}].proxy`, undefined) : undefined;
        return { ...(0, _lib.deserializeCluster)(clusterName, cluster, deprecatedProxyAddress, config.isCloudEnabled),
          isConfiguredByNode
        };
      });
      return response.ok({
        body
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  };

  router.get({
    path: _constants.API_BASE_PATH,
    validate: false
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, allHandler));
};

exports.register = register;