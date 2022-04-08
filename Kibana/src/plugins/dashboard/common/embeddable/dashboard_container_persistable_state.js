"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInject = exports.createExtract = void 0;

var _common = require("../../../controls/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getPanelStatePrefix = state => `${state.explicitInput.id}:`;

const controlGroupReferencePrefix = 'controlGroup_';

const createInject = persistableStateService => {
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
        const panelReferences = filteredReferences.length === 0 ? references : filteredReferences; // Inject dashboard references back in

        if (panel.panelRefName !== undefined) {
          const matchingReference = panelReferences.find(reference => reference.name === panel.panelRefName);

          if (!matchingReference) {
            throw new Error(`Could not find reference "${panel.panelRefName}"`);
          }

          if (matchingReference !== undefined) {
            workingState.panels[key] = { ...panel,
              type: matchingReference.type,
              explicitInput: { ...workingState.panels[key].explicitInput,
                savedObjectId: matchingReference.id
              }
            };
            delete workingState.panels[key].panelRefName;
          }
        }

        const {
          type,
          ...injectedState
        } = persistableStateService.inject({ ...workingState.panels[key].explicitInput,
          type: workingState.panels[key].type
        }, panelReferences);
        workingState.panels[key].explicitInput = injectedState;
      }
    } // since the controlGroup is not part of the panels array, its references need to be injected separately


    if ('controlGroupInput' in workingState && workingState.controlGroupInput) {
      const controlGroupReferences = references.filter(reference => reference.name.indexOf(controlGroupReferencePrefix) === 0).map(reference => ({ ...reference,
        name: reference.name.replace(controlGroupReferencePrefix, '')
      }));
      const {
        type,
        ...injectedControlGroupState
      } = persistableStateService.inject({ ...workingState.controlGroupInput,
        type: _common.CONTROL_GROUP_TYPE
      }, controlGroupReferences);
      workingState.controlGroupInput = injectedControlGroupState;
    }

    return workingState;
  };
};

exports.createInject = createInject;

const createExtract = persistableStateService => {
  return state => {
    const workingState = { ...state
    };
    const references = [];

    if ('panels' in workingState) {
      workingState.panels = { ...workingState.panels
      }; // Run every panel through the state service to get the nested references

      for (const [key, panel] of Object.entries(workingState.panels)) {
        const prefix = getPanelStatePrefix(panel); // If the panel is a saved object, then we will make the reference for that saved object and change the explicit input

        if (panel.explicitInput.savedObjectId) {
          panel.panelRefName = `panel_${key}`;
          references.push({
            name: `${prefix}panel_${key}`,
            type: panel.type,
            id: panel.explicitInput.savedObjectId
          });
          delete panel.explicitInput.savedObjectId;
          delete panel.explicitInput.type;
        }

        const {
          state: panelState,
          references: panelReferences
        } = persistableStateService.extract({ ...panel.explicitInput,
          type: panel.type
        }); // We're going to prefix the names of the references so that we don't end up with dupes (from visualizations for instance)

        const prefixedReferences = panelReferences.filter(reference => reference.type !== 'tag') // panel references should never contain tags. If they do, they must be removed
        .map(reference => ({ ...reference,
          name: `${prefix}${reference.name}`
        }));
        references.push(...prefixedReferences);
        const {
          type,
          ...restOfState
        } = panelState;
        workingState.panels[key].explicitInput = restOfState;
      }
    } // since the controlGroup is not part of the panels array, its references need to be extracted separately


    if ('controlGroupInput' in workingState && workingState.controlGroupInput) {
      const {
        state: extractedControlGroupState,
        references: controlGroupReferences
      } = persistableStateService.extract({ ...workingState.controlGroupInput,
        type: _common.CONTROL_GROUP_TYPE
      });
      workingState.controlGroupInput = extractedControlGroupState;
      const prefixedControlGroupReferences = controlGroupReferences.map(reference => ({ ...reference,
        name: `${controlGroupReferencePrefix}${reference.name}`
      }));
      references.push(...prefixedControlGroupReferences);
    }

    return {
      state: workingState,
      references
    };
  };
};

exports.createExtract = createExtract;