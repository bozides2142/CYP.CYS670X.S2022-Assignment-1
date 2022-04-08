"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFilterFunction = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const selectFilterFunction = {
  name: 'selectFilter',
  type: 'kibana_context',
  inputTypes: ['kibana_context'],
  help: _i18n.i18n.translate('data.search.functions.selectFilter.help', {
    defaultMessage: 'Selects filters from context'
  }),
  args: {
    group: {
      types: ['string'],
      aliases: ['_'],
      help: _i18n.i18n.translate('data.search.functions.selectFilter.group.help', {
        defaultMessage: 'Select only filters belonging to the provided group'
      }),
      multi: true
    },
    from: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.functions.selectFilter.from.help', {
        defaultMessage: 'Select only filters owned by the provided id'
      })
    },
    ungrouped: {
      types: ['boolean'],
      aliases: ['nogroup', 'nogroups'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.selectFilter.ungrouped.help', {
        defaultMessage: 'Should filters without group be included'
      })
    }
  },

  fn(input, {
    group = [],
    ungrouped,
    from
  }) {
    var _input$filters;

    return { ...input,
      filters: ((_input$filters = input.filters) === null || _input$filters === void 0 ? void 0 : _input$filters.filter(({
        meta
      }) => {
        const isGroupMatching = !group.length && !ungrouped || meta.group && group.length && group.includes(meta.group) || ungrouped && !meta.group;
        const isOriginMatching = !from || from === meta.controlledBy;
        return isGroupMatching && isOriginMatching;
      })) || []
    };
  }

};
exports.selectFilterFunction = selectFilterFunction;