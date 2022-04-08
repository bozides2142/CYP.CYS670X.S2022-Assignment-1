"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeVisualizeEmbeddableFactory = void 0;

var _lodash = require("lodash");

var _common = require("../../../kibana_utils/common");

var _visualization_common_migrations = require("../migrations/visualization_common_migrations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const byValueAddSupportOfDualIndexSelectionModeInTSVB = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddSupportOfDualIndexSelectionModeInTSVB)(state.savedVis)
  };
};

const byValueHideTSVBLastValueIndicator = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonHideTSVBLastValueIndicator)(state.savedVis)
  };
};

const byValueAddDropLastBucketIntoTSVBModel = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddDropLastBucketIntoTSVBModel)(state.savedVis)
  };
};

const byValueAddDropLastBucketIntoTSVBModel714Above = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddDropLastBucketIntoTSVBModel714Above)(state.savedVis)
  };
};

const byValueRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel)(state.savedVis)
  };
};

const byValueAddEmptyValueColorRule = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonAddEmptyValueColorRule)(state.savedVis)
  };
};

const byValueMigrateVislibPie = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonMigrateVislibPie)(state.savedVis)
  };
};

const byValueMigrateTagcloud = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonMigrateTagCloud)(state.savedVis)
  };
};

const byValueRemoveMarkdownLessFromTSVB = state => {
  return { ...state,
    savedVis: (0, _visualization_common_migrations.commonRemoveMarkdownLessFromTSVB)(state.savedVis)
  };
};

const getEmbeddedVisualizationSearchSourceMigrations = searchSourceMigrations => (0, _lodash.mapValues)(searchSourceMigrations, migrate => state => {
  const _state = state;
  return { ..._state,
    savedVis: { ..._state.savedVis,
      data: { ..._state.savedVis.data,
        searchSource: migrate(_state.savedVis.data.searchSource)
      }
    }
  };
});

const makeVisualizeEmbeddableFactory = getSearchSourceMigrations => () => {
  return {
    id: 'visualization',
    // migrations set up as a callable so that getSearchSourceMigrations doesn't get invoked till after plugin setup steps
    migrations: () => (0, _common.mergeMigrationFunctionMaps)(getEmbeddedVisualizationSearchSourceMigrations(getSearchSourceMigrations()), {
      // These migrations are run in 7.13.1 for `by value` panels because the 7.13 release window was missed.
      '7.13.1': state => (0, _lodash.flow)(byValueAddSupportOfDualIndexSelectionModeInTSVB, byValueHideTSVBLastValueIndicator, byValueRemoveDefaultIndexPatternAndTimeFieldFromTSVBModel)(state),
      '7.14.0': state => (0, _lodash.flow)(byValueAddEmptyValueColorRule, byValueMigrateVislibPie, byValueMigrateTagcloud, byValueAddDropLastBucketIntoTSVBModel)(state),
      '7.17.0': state => (0, _lodash.flow)(byValueAddDropLastBucketIntoTSVBModel714Above)(state),
      '8.0.0': state => (0, _lodash.flow)(byValueRemoveMarkdownLessFromTSVB)(state)
    })
  };
};

exports.makeVisualizeEmbeddableFactory = makeVisualizeEmbeddableFactory;