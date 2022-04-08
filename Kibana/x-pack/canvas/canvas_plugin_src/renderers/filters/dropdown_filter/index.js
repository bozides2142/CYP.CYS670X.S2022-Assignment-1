"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownFilterFactory = void 0;

var _interpreter = require("@kbn/interpreter");

var _lodash = require("lodash");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _public = require("../../../../../../../src/plugins/kibana_react/public");

var _sync_filter_expression = require("../../../../public/lib/sync_filter_expression");

var _component = require("./component");

var _i18n = require("../../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  dropdownFilter: strings
} = _i18n.RendererStrings;
const MATCH_ALL = '%%CANVAS_MATCH_ALL%%';

const getFilterValue = filterExpression => {
  if (filterExpression === '') {
    return MATCH_ALL;
  }

  const filterAST = (0, _interpreter.fromExpression)(filterExpression);
  return (0, _lodash.get)(filterAST, 'chain[0].arguments.value[0]', MATCH_ALL);
};

const dropdownFilterFactory = (core, plugins) => () => ({
  name: 'dropdown_filter',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,
  height: 50,

  render(domNode, config, handlers) {
    let filterExpression = handlers.getFilter();

    if (filterExpression !== '' && (filterExpression === undefined || !filterExpression.includes('exactly'))) {
      filterExpression = '';
      handlers.event({
        name: 'applyFilterAction',
        data: filterExpression
      });
    } else if (filterExpression !== '') {
      // NOTE: setFilter() will cause a data refresh, avoid calling unless required
      // compare expression and filter, update filter if needed
      const {
        changed,
        newAst
      } = (0, _sync_filter_expression.syncFilterExpression)(config, filterExpression, ['filterGroup']);

      if (changed) {
        handlers.event({
          name: 'applyFilterAction',
          data: (0, _interpreter.toExpression)(newAst)
        });
      }
    }

    const commit = commitValue => {
      if (commitValue === '%%CANVAS_MATCH_ALL%%') {
        handlers.event({
          name: 'applyFilterAction',
          data: ''
        });
      } else {
        const newFilterAST = {
          type: 'expression',
          chain: [{
            type: 'function',
            function: 'exactly',
            arguments: {
              value: [commitValue],
              column: [config.column],
              filterGroup: [config.filterGroup]
            }
          }]
        };
        const newFilter = (0, _interpreter.toExpression)(newFilterAST);
        handlers.event({
          name: 'applyFilterAction',
          data: newFilter
        });
      }
    };

    const filter = /*#__PURE__*/_react.default.createElement(_component.DropdownFilter, {
      commit: commit,
      choices: config.choices || [],
      initialValue: getFilterValue(filterExpression)
    });

    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_public.KibanaThemeProvider, {
      theme$: core.theme.theme$
    }, filter), domNode, () => handlers.done());

    handlers.onDestroy(() => {
      _reactDom.default.unmountComponentAtNode(domNode);
    });
  }

});

exports.dropdownFilterFactory = dropdownFilterFactory;