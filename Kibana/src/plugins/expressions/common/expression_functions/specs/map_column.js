"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapColumn = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _i18n = require("@kbn/i18n");

var _expression_types = require("../../expression_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const mapColumn = {
  name: 'mapColumn',
  aliases: ['mc'],
  // midnight commander. So many times I've launched midnight commander instead of moving a file.
  type: 'datatable',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressions.functions.mapColumnHelpText', {
    defaultMessage: 'Adds a column calculated as the result of other columns. ' + 'Changes are made only when you provide arguments.' + 'See also {alterColumnFn} and {staticColumnFn}.',
    values: {
      alterColumnFn: '`alterColumn`',
      staticColumnFn: '`staticColumn`'
    }
  }),
  args: {
    id: {
      types: ['string', 'null'],
      help: _i18n.i18n.translate('expressions.functions.mapColumn.args.idHelpText', {
        defaultMessage: 'An optional id of the resulting column. When no id is provided, the id will be looked up from the existing column by the provided name argument. If no column with this name exists yet, a new column with this name and an identical id will be added to the table.'
      }),
      required: false,
      default: null
    },
    name: {
      types: ['string'],
      aliases: ['_', 'column'],
      help: _i18n.i18n.translate('expressions.functions.mapColumn.args.nameHelpText', {
        defaultMessage: 'The name of the resulting column. Names are not required to be unique.'
      }),
      required: true
    },
    expression: {
      types: ['boolean', 'number', 'string', 'null'],
      resolve: false,
      aliases: ['exp', 'fn', 'function'],
      help: _i18n.i18n.translate('expressions.functions.mapColumn.args.expressionHelpText', {
        defaultMessage: 'An expression that is executed on every row, provided with a single-row {DATATABLE} context and returning the cell value.',
        values: {
          DATATABLE: '`datatable`'
        }
      }),
      required: true
    },
    copyMetaFrom: {
      types: ['string', 'null'],
      help: _i18n.i18n.translate('expressions.functions.mapColumn.args.copyMetaFromHelpText', {
        defaultMessage: "If set, the meta object from the specified column id is copied over to the specified target column. If the column doesn't exist it silently fails."
      }),
      required: false,
      default: null
    }
  },

  fn(input, args) {
    var _ref, _input$columns$column, _input$columns$column2;

    const metaColumn = args.copyMetaFrom ? input.columns.find(({
      id
    }) => id === args.copyMetaFrom) : undefined;
    const existingColumnIndex = input.columns.findIndex(({
      id,
      name
    }) => args.id ? id === args.id : name === args.name);
    const columnIndex = existingColumnIndex === -1 ? input.columns.length : existingColumnIndex;
    const id = (_ref = (_input$columns$column = (_input$columns$column2 = input.columns[columnIndex]) === null || _input$columns$column2 === void 0 ? void 0 : _input$columns$column2.id) !== null && _input$columns$column !== void 0 ? _input$columns$column : args.id) !== null && _ref !== void 0 ? _ref : args.name;
    return (0, _rxjs.defer)(() => (0, _rxjs.combineLatest)(input.rows.map(row => args.expression({
      type: 'datatable',
      columns: [...input.columns],
      rows: [row]
    }).pipe((0, _operators.map)(value => ({ ...row,
      [id]: value
    })), (0, _operators.defaultIfEmpty)(row))))).pipe((0, _operators.defaultIfEmpty)([]), (0, _operators.map)(rows => {
      var _metaColumn$meta;

      let type = 'null';

      for (const row of rows) {
        const rowType = (0, _expression_types.getType)(row[id]);

        if (rowType !== 'null') {
          type = rowType;
          break;
        }
      }

      const columns = [...input.columns];
      columns[columnIndex] = {
        id,
        name: args.name,
        meta: {
          type,
          params: {
            id: type
          },
          ...((_metaColumn$meta = metaColumn === null || metaColumn === void 0 ? void 0 : metaColumn.meta) !== null && _metaColumn$meta !== void 0 ? _metaColumn$meta : {})
        }
      };
      return {
        columns,
        rows,
        type: 'datatable'
      };
    }));
  }

};
exports.mapColumn = mapColumn;