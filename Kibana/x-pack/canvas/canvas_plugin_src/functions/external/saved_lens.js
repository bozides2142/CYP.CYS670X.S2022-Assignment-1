"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedLens = savedLens;

var _build_embeddable_filters = require("../../../common/lib/build_embeddable_filters");

var _expression_types = require("../../expression_types");

var _i18n = require("../../../i18n");
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

function savedLens() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().savedLens;
  return {
    name: 'savedLens',
    help,
    args: {
      id: {
        types: ['string'],
        required: false,
        help: argHelp.id
      },
      timerange: {
        types: ['timerange'],
        help: argHelp.timerange,
        required: false
      },
      title: {
        types: ['string'],
        help: argHelp.title,
        required: false
      },
      palette: {
        types: ['palette'],
        help: argHelp.palette,
        required: false
      }
    },
    type: _expression_types.EmbeddableExpressionType,
    fn: (input, {
      id,
      timerange,
      title,
      palette
    }) => {
      const filters = input ? input.and : [];
      return {
        type: _expression_types.EmbeddableExpressionType,
        input: {
          id,
          savedObjectId: id,
          filters: (0, _build_embeddable_filters.getQueryFilters)(filters),
          timeRange: timerange || defaultTimeRange,
          title: title === null ? undefined : title,
          disableTriggers: true,
          palette
        },
        embeddableType: _expression_types.EmbeddableTypes.lens,
        generatedAt: Date.now()
      };
    },

    extract(state) {
      const refName = 'savedLens.id';
      const references = [{
        name: refName,
        type: 'lens',
        id: state.id[0]
      }];
      return {
        state: { ...state,
          id: [refName]
        },
        references
      };
    },

    inject(state, references) {
      const reference = references.find(ref => ref.name === 'savedLens.id');

      if (reference) {
        state.id[0] = reference.id;
      }

      return state;
    }

  };
}