"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrossClusterReplicationServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _constants = require("../common/constants");

var _routes = require("./routes");

var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ccrDataEnricher = async (indicesList, client) => {
  if (!(indicesList !== null && indicesList !== void 0 && indicesList.length)) {
    return indicesList;
  }

  try {
    const {
      body: {
        follower_indices: followerIndices
      }
    } = await client.asCurrentUser.ccr.followInfo({
      index: '_all'
    });
    return indicesList.map(index => {
      const isFollowerIndex = !!followerIndices.find(followerIndex => {
        return followerIndex.follower_index === index.name;
      });
      return { ...index,
        isFollowerIndex
      };
    });
  } catch (e) {
    return indicesList;
  }
};

class CrossClusterReplicationServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
    this.config$ = initializerContext.config.create();
    this.license = new _shared_imports.License();
  }

  setup({
    http,
    getStartServices
  }, {
    features,
    licensing,
    indexManagement,
    remoteClusters
  }) {
    this.config$.pipe((0, _operators.first)()).toPromise().then(config => {
      // remoteClusters.isUiEnabled is driven by the xpack.remote_clusters.ui.enabled setting.
      // The CCR UI depends upon the Remote Clusters UI (e.g. by cross-linking to it), so if
      // the Remote Clusters UI is disabled we can't show the CCR UI.
      const isCcrUiEnabled = config.ui.enabled && remoteClusters.isUiEnabled; // If the UI isn't enabled, then we don't want to expose any CCR concepts in the UI, including
      // "follower" badges for follower indices.

      if (isCcrUiEnabled) {
        if (indexManagement.indexDataEnricher) {
          indexManagement.indexDataEnricher.add(ccrDataEnricher);
        }
      }
    });
    this.license.setup({
      pluginName: _constants.PLUGIN.TITLE,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: 'cross_cluster_replication',
      management: {
        data: ['cross_cluster_replication']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage', 'manage_ccr'],
        ui: []
      }]
    });
    (0, _routes.registerApiRoutes)({
      router: http.createRouter(),
      license: this.license,
      lib: {
        handleEsError: _shared_imports.handleEsError
      }
    });
  }

  start(core, {
    licensing
  }) {
    this.license.start({
      pluginId: _constants.PLUGIN.ID,
      minimumLicenseType: _constants.PLUGIN.minimumLicenseType,
      licensing
    });
  }

  stop() {}

}

exports.CrossClusterReplicationServerPlugin = CrossClusterReplicationServerPlugin;