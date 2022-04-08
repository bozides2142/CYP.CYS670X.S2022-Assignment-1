"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embeddableMigrations = void 0;

var _move_attribution = require("../common/migrations/move_attribution");

var _set_ems_tms_default_modes = require("../common/migrations/set_ems_tms_default_modes");

var _rename_layer_types = require("../common/migrations/rename_layer_types");

var _references = require("../common/migrations/references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Embeddables such as Maps, Lens, and Visualize can be embedded by value or by reference on a dashboard.
 * To ensure that any migrations (>7.12) are run correctly in both cases,
 * the migration function must be registered as both a saved object migration and an embeddable migration
 *
 * This is the embeddable migration registry.
 */


const embeddableMigrations = {
  '7.14.0': state => {
    try {
      return { ...state,
        attributes: (0, _move_attribution.moveAttribution)(state)
      };
    } catch (e) {
      // Do not fail migration
      // Maps application can display error when viewed
      return state;
    }
  },
  '8.0.0': state => {
    try {
      return { ...state,
        attributes: (0, _set_ems_tms_default_modes.setEmsTmsDefaultModes)(state)
      };
    } catch (e) {
      // Do not fail migration
      // Maps application can display error when viewed
      return state;
    }
  },
  '8.0.1': state => {
    try {
      const {
        attributes
      } = (0, _references.extractReferences)(state);
      return { ...state,
        attributes
      };
    } catch (e) {
      // Do not fail migration
      // Maps application can display error when viewed
      return state;
    }
  },
  '8.1.0': state => {
    try {
      return { ...state,
        attributes: (0, _rename_layer_types.renameLayerTypes)(state)
      };
    } catch (e) {
      // Do not fail migration
      // Maps application can display error when viewed
      return state;
    }
  }
};
exports.embeddableMigrations = embeddableMigrations;