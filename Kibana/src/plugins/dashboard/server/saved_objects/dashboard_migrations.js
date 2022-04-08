"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDashboardSavedObjectTypeMigrations = void 0;

var _lodash = require("lodash");

var _migrations_ = require("./migrations_730");

var _migrate_match_all_query = require("./migrate_match_all_query");

var _saved_dashboard_references = require("../../common/saved_dashboard_references");

var _embeddable_saved_object_converters = require("../../common/embeddable/embeddable_saved_object_converters");

var _common = require("../../../data/common");

var _common2 = require("../../../kibana_utils/common");

var _replace_index_pattern_reference = require("./replace_index_pattern_reference");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function migrateIndexPattern(doc) {
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');

  if (typeof searchSourceJSON !== 'string') {
    return;
  }

  let searchSource;

  try {
    searchSource = JSON.parse(searchSourceJSON);
  } catch (e) {
    // Let it go, the data is invalid and we'll leave it as is
    return;
  }

  if (searchSource.index) {
    searchSource.indexRefName = 'kibanaSavedObjectMeta.searchSourceJSON.index';
    doc.references.push({
      name: searchSource.indexRefName,
      type: _common.DATA_VIEW_SAVED_OBJECT_TYPE,
      id: searchSource.index
    });
    delete searchSource.index;
  }

  if (searchSource.filter) {
    searchSource.filter.forEach((filterRow, i) => {
      if (!filterRow.meta || !filterRow.meta.index) {
        return;
      }

      filterRow.meta.indexRefName = `kibanaSavedObjectMeta.searchSourceJSON.filter[${i}].meta.index`;
      doc.references.push({
        name: filterRow.meta.indexRefName,
        type: _common.DATA_VIEW_SAVED_OBJECT_TYPE,
        id: filterRow.meta.index
      });
      delete filterRow.meta.index;
    });
  }

  doc.attributes.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(searchSource);
}

const migrations700 = doc => {
  // Set new "references" attribute
  doc.references = doc.references || []; // Migrate index pattern

  migrateIndexPattern(doc); // Migrate panels

  const panelsJSON = (0, _lodash.get)(doc, 'attributes.panelsJSON');

  if (typeof panelsJSON !== 'string') {
    return doc;
  }

  let panels;

  try {
    panels = JSON.parse(panelsJSON);
  } catch (e) {
    // Let it go, the data is invalid and we'll leave it as is
    return doc;
  }

  if (!Array.isArray(panels)) {
    return doc;
  }

  panels.forEach((panel, i) => {
    if (!panel.type || !panel.id) {
      return;
    }

    panel.panelRefName = `panel_${i}`;
    doc.references.push({
      name: `panel_${i}`,
      type: panel.type,
      id: panel.id
    });
    delete panel.type;
    delete panel.id;
  });
  doc.attributes.panelsJSON = JSON.stringify(panels);
  return doc;
};
/**
 * In 7.8.0 we introduced dashboard drilldowns which are stored inside dashboard saved object as part of embeddable state
 * In 7.11.0 we created an embeddable references/migrations system that allows to properly extract embeddable persistable state
 * https://github.com/elastic/kibana/issues/71409
 * The idea of this migration is to inject all the embeddable panel references and then run the extraction again.
 * As the result of the extraction:
 * 1. In addition to regular `panel_` we will get new references which are extracted by `embeddablePersistableStateService` (dashboard drilldown references)
 * 2. `panel_` references will be regenerated
 * All other references like index-patterns are forwarded non touched
 * @param deps
 */


function createExtractPanelReferencesMigration(deps) {
  return doc => {
    var _doc$references;

    const references = (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : [];
    /**
     * Remembering this because dashboard's extractReferences won't return those
     * All other references like `panel_` will be overwritten
     */

    const oldNonPanelReferences = references.filter(ref => !ref.name.startsWith('panel_'));
    const injectedAttributes = (0, _saved_dashboard_references.injectReferences)({
      attributes: doc.attributes,
      references
    }, {
      embeddablePersistableStateService: deps.embeddable
    });
    const {
      attributes,
      references: newPanelReferences
    } = (0, _saved_dashboard_references.extractReferences)({
      attributes: injectedAttributes,
      references: []
    }, {
      embeddablePersistableStateService: deps.embeddable
    });
    return { ...doc,
      references: [...oldNonPanelReferences, ...newPanelReferences],
      attributes
    };
  };
}

// Runs the embeddable migrations on each panel
const migrateByValuePanels = (migrate, version) => doc => {
  const {
    attributes
  } = doc; // Skip if panelsJSON is missing otherwise this will cause saved object import to fail when
  // importing objects without panelsJSON. At development time of this, there is no guarantee each saved
  // object has panelsJSON in all previous versions of kibana.

  if (typeof (attributes === null || attributes === void 0 ? void 0 : attributes.panelsJSON) !== 'string') {
    return doc;
  }

  const panels = JSON.parse(attributes.panelsJSON); // Same here, prevent failing saved object import if ever panels aren't an array.

  if (!Array.isArray(panels)) {
    return doc;
  }

  const newPanels = [];
  panels.forEach(panel => {
    // Convert each panel into a state that can be passed to EmbeddablesSetup.migrate
    const originalPanelState = (0, _embeddable_saved_object_converters.convertSavedDashboardPanelToPanelState)(panel); // saved vis is used to store by value input for Visualize. This should eventually be renamed to `attributes` to align with Lens and Maps

    if (originalPanelState.explicitInput.attributes || originalPanelState.explicitInput.savedVis) {
      // If this panel is by value, migrate the state using embeddable migrations
      const migratedInput = migrate({ ...originalPanelState.explicitInput,
        type: originalPanelState.type
      }); // Convert the embeddable state back into the panel shape

      newPanels.push((0, _embeddable_saved_object_converters.convertPanelStateToSavedDashboardPanel)({ ...originalPanelState,
        explicitInput: { ...migratedInput,
          id: migratedInput.id
        }
      }, version));
    } else {
      newPanels.push(panel);
    }
  });
  return { ...doc,
    attributes: { ...attributes,
      panelsJSON: JSON.stringify(newPanels)
    }
  };
};

const createDashboardSavedObjectTypeMigrations = deps => {
  const embeddableMigrations = (0, _lodash.mapValues)(deps.embeddable.getAllMigrations(), migrateByValuePanels);
  const dashboardMigrations = {
    /**
     * We need to have this migration twice, once with a version prior to 7.0.0 once with a version
     * after it. The reason for that is, that this migration has been introduced once 7.0.0 was already
     * released. Thus a user who already had 7.0.0 installed already got the 7.0.0 migrations below running,
     * so we need a version higher than that. But this fix was backported to the 6.7 release, meaning if we
     * would only have the 7.0.1 migration in here a user on the 6.7 release will migrate their saved objects
     * to the 7.0.1 state, and thus when updating their Kibana to 7.0, will never run the 7.0.0 migrations introduced
     * in that version. So we apply this twice, once with 6.7.2 and once with 7.0.1 while the backport to 6.7
     * only contained the 6.7.2 migration and not the 7.0.1 migration.
     */
    '6.7.2': (0, _lodash.flow)(_migrate_match_all_query.migrateMatchAllQuery),
    '7.0.0': (0, _lodash.flow)(migrations700),
    '7.3.0': (0, _lodash.flow)(_migrations_.migrations730),
    '7.9.3': (0, _lodash.flow)(_migrate_match_all_query.migrateMatchAllQuery),
    '7.11.0': (0, _lodash.flow)(createExtractPanelReferencesMigration(deps)),

    /**
     * Any dashboard saved object migrations that come after this point will have to be wary of
     * potentially overwriting embeddable migrations. An example of how to mitigate this follows:
     */
    // '7.x': flow(yourNewMigrationFunction, embeddableMigrations['7.x'] ?? identity),
    '7.14.0': (0, _lodash.flow)(_replace_index_pattern_reference.replaceIndexPatternReference)
  };
  return (0, _common2.mergeMigrationFunctionMaps)(dashboardMigrations, embeddableMigrations);
};

exports.createDashboardSavedObjectTypeMigrations = createDashboardSavedObjectTypeMigrations;