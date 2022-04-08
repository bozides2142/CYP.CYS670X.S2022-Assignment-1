"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexPatternLoadMeta = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'indexPatternLoad';
const type = 'index_pattern';

const getIndexPatternLoadMeta = () => ({
  name,
  type,
  inputTypes: ['null'],
  help: _i18n.i18n.translate('dataViews.functions.dataViewLoad.help', {
    defaultMessage: 'Loads a data view'
  }),
  args: {
    id: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('dataViews.functions.dataViewLoad.id.help', {
        defaultMessage: 'data view id to load'
      })
    }
  },

  extract(state) {
    const refName = 'indexPatternLoad.id';
    const references = [{
      name: refName,
      type: 'search',
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
    const reference = references.find(ref => ref.name === 'indexPatternLoad.id');

    if (reference) {
      state.id[0] = reference.id;
    }

    return state;
  }

});

exports.getIndexPatternLoadMeta = getIndexPatternLoadMeta;