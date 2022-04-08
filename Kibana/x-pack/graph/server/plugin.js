"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _license_state = require("./lib/license_state");

var _search = require("./routes/search");

var _explore = require("./routes/explore");

var _sample_data = require("./sample_data");

var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class GraphPlugin {
  constructor() {
    (0, _defineProperty2.default)(this, "licenseState", null);
  }

  setup(core, {
    licensing,
    home,
    features
  }) {
    const licenseState = new _license_state.LicenseState();
    licenseState.start(licensing.license$);
    this.licenseState = licenseState;
    core.savedObjects.registerType(_saved_objects.graphWorkspace);
    licensing.featureUsage.register('Graph', 'platinum');

    if (home) {
      (0, _sample_data.registerSampleData)(home.sampleData, licenseState);
    }

    if (features) {
      features.registerKibanaFeature({
        id: 'graph',
        name: _i18n.i18n.translate('xpack.graph.featureRegistry.graphFeatureName', {
          defaultMessage: 'Graph'
        }),
        order: 600,
        category: _server.DEFAULT_APP_CATEGORIES.kibana,
        app: ['graph', 'kibana'],
        catalogue: ['graph'],
        minimumLicense: 'platinum',
        privileges: {
          all: {
            app: ['graph', 'kibana'],
            catalogue: ['graph'],
            savedObject: {
              all: ['graph-workspace'],
              read: ['index-pattern']
            },
            ui: ['save', 'delete', 'show']
          },
          read: {
            app: ['graph', 'kibana'],
            catalogue: ['graph'],
            savedObject: {
              all: [],
              read: ['index-pattern', 'graph-workspace']
            },
            ui: ['show']
          }
        }
      });
    }

    const router = core.http.createRouter();
    (0, _search.registerSearchRoute)({
      licenseState,
      router
    });
    (0, _explore.registerExploreRoute)({
      licenseState,
      router
    });
  }

  start(core, {
    licensing
  }) {
    this.licenseState.setNotifyUsage(licensing.featureUsage.notifyUsage);
  }

  stop() {
    if (this.licenseState) {
      this.licenseState.stop();
    }
  }

}

exports.GraphPlugin = GraphPlugin;