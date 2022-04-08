"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createControlGroupInject = exports.createControlGroupExtract = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getPanelStatePrefix = state => `${state.explicitInput.id}:`;

const createControlGroupInject = persistableStateService => {
  return (state, references) => {
    const workingState = { ...state
    };

    if ('panels' in workingState) {
      workingState.panels = { ...workingState.panels
      };

      for (const [key, panel] of Object.entries(workingState.panels)) {
        workingState.panels[key] = { ...panel
        }; // Find the references for this panel

        const prefix = getPanelStatePrefix(panel);
        const filteredReferences = references.filter(reference => reference.name.indexOf(prefix) === 0).map(reference => ({ ...reference,
          name: reference.name.replace(prefix, '')
        }));
        const panelReferences = filteredReferences.length === 0 ? references : filteredReferences;
        const {
          type,
          ...injectedState
        } = persistableStateService.inject({ ...workingState.panels[key].explicitInput,
          type: workingState.panels[key].type
        }, panelReferences);
        workingState.panels[key].explicitInput = injectedState;
      }
    }

    return workingState;
  };
};

exports.createControlGroupInject = createControlGroupInject;

const createControlGroupExtract = persistableStateService => {
  return state => {
    const workingState = { ...state
    };
    const references = [];

    if ('panels' in workingState) {
      workingState.panels = { ...workingState.panels
      }; // Run every panel through the state service to get the nested references

      for (const [key, panel] of Object.entries(workingState.panels)) {
        const prefix = getPanelStatePrefix(panel);
        const {
          state: panelState,
          references: panelReferences
        } = persistableStateService.extract({ ...panel.explicitInput,
          type: panel.type
        }); // Map reference to its embeddable id for lookup in inject

        const mappedReferences = panelReferences.map(reference => ({ ...reference,
          name: `${prefix}${reference.name}`
        }));
        references.push(...mappedReferences);
        const {
          type,
          ...restOfState
        } = panelState;
        workingState.panels[key].explicitInput = restOfState;
      }
    }

    return {
      state: workingState,
      references
    };
  };
};

exports.createControlGroupExtract = createControlGroupExtract;