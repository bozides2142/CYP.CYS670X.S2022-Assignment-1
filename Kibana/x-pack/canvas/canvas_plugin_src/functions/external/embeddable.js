"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embeddableFunctionFactory = embeddableFunctionFactory;

var _lodash = require("lodash");

var _expression_types = require("../../expression_types");

var _i18n = require("../../../i18n");

var _build_embeddable_filters = require("../../../common/lib/build_embeddable_filters");

var _embeddable_dataurl = require("../../../common/lib/embeddable_dataurl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultTimeRange = {
  from: 'now-15m',
  to: 'now'
};
const baseEmbeddableInput = {
  timeRange: defaultTimeRange,
  disableTriggers: true,
  renderMode: 'noInteractivity'
};

function embeddableFunctionFactory({
  embeddablePersistableStateService
}) {
  return function embeddable() {
    const {
      help,
      args: argHelp
    } = (0, _i18n.getFunctionHelp)().embeddable;

    const migrateByValueEmbeddable = migrateFn => state => {
      const embeddableInput = (0, _embeddable_dataurl.decode)(state.arguments.config[0]);
      const embeddableType = state.arguments.type[0];
      const migratedInput = migrateFn({ ...embeddableInput,
        type: embeddableType
      });
      state.arguments.config[0] = (0, _embeddable_dataurl.encode)(migratedInput);
      state.arguments.type[0] = migratedInput.type;
      return state;
    };

    return {
      name: 'embeddable',
      help,
      args: {
        config: {
          aliases: ['_'],
          types: ['string'],
          required: true,
          help: argHelp.config
        },
        type: {
          types: ['string'],
          required: true,
          help: argHelp.type
        }
      },
      context: {
        types: ['filter']
      },
      type: _expression_types.EmbeddableExpressionType,
      fn: (input, args) => {
        const filters = input ? input.and : [];
        const embeddableInput = (0, _embeddable_dataurl.decode)(args.config);
        return {
          type: _expression_types.EmbeddableExpressionType,
          input: { ...baseEmbeddableInput,
            ...embeddableInput,
            filters: (0, _build_embeddable_filters.getQueryFilters)(filters)
          },
          generatedAt: Date.now(),
          embeddableType: args.type
        };
      },

      extract(state) {
        const input = (0, _embeddable_dataurl.decode)(state.config[0]); // extracts references for by-reference embeddables

        if (input.savedObjectId) {
          const refName = 'embeddable.savedObjectId';
          const references = [{
            name: refName,
            type: state.type[0],
            id: input.savedObjectId
          }];
          return {
            state,
            references
          };
        } // extracts references for by-value embeddables


        const {
          state: extractedState,
          references: extractedReferences
        } = embeddablePersistableStateService.extract({ ...input,
          type: state.type[0]
        });
        const {
          type,
          ...extractedInput
        } = extractedState;
        return {
          state: { ...state,
            config: [(0, _embeddable_dataurl.encode)(extractedInput)],
            type: [type]
          },
          references: extractedReferences
        };
      },

      inject(state, references) {
        const input = (0, _embeddable_dataurl.decode)(state.config[0]);
        const savedObjectReference = references.find(ref => ref.name === 'embeddable.savedObjectId'); // injects saved object id for by-references embeddable

        if (savedObjectReference) {
          input.savedObjectId = savedObjectReference.id;
          state.config[0] = (0, _embeddable_dataurl.encode)(input);
          state.type[0] = savedObjectReference.type;
        } else {
          // injects references for by-value embeddables
          const {
            type,
            ...injectedInput
          } = embeddablePersistableStateService.inject({ ...input,
            type: state.type[0]
          }, references);
          state.config[0] = (0, _embeddable_dataurl.encode)(injectedInput);
          state.type[0] = type;
        }

        return state;
      },

      migrations: (0, _lodash.mapValues)(embeddablePersistableStateService.getAllMigrations(), migrateByValueEmbeddable)
    };
  };
}