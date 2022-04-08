"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mathColumn = void 0;

var _i18n = require("@kbn/i18n");

var _math = require("./math");

var _expression_types = require("../../expression_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const mathColumn = {
  name: 'mathColumn',
  type: 'datatable',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressions.functions.mathColumnHelpText', {
    defaultMessage: 'Adds a column by evaluating {tinymath} on each row. ' + 'This function is optimized for math and performs better than using a math expression in {mapColumnFn}.',
    values: {
      mapColumnFn: '`mapColumn`',
      tinymath: '`TinyMath`'
    }
  }),
  args: { ..._math.math.args,
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('expressions.functions.mathColumn.args.idHelpText', {
        defaultMessage: 'id of the resulting column. Must be unique.'
      }),
      required: true
    },
    name: {
      types: ['string'],
      aliases: ['_', 'column'],
      help: _i18n.i18n.translate('expressions.functions.mathColumn.args.nameHelpText', {
        defaultMessage: 'The name of the resulting column. Names are not required to be unique.'
      }),
      required: true
    },
    copyMetaFrom: {
      types: ['string', 'null'],
      help: _i18n.i18n.translate('expressions.functions.mathColumn.args.copyMetaFromHelpText', {
        defaultMessage: "If set, the meta object from the specified column id is copied over to the specified target column. If the column doesn't exist it silently fails."
      }),
      required: false,
      default: null
    }
  },
  fn: async (input, args, context) => {
    var _args$name;

    const columns = [...input.columns];
    const existingColumnIndex = columns.findIndex(({
      id
    }) => {
      return id === args.id;
    });

    if (existingColumnIndex > -1) {
      throw new Error(_i18n.i18n.translate('expressions.functions.mathColumn.uniqueIdError', {
        defaultMessage: 'ID must be unique'
      }));
    }

    const newRows = await Promise.all(input.rows.map(async row => {
      const result = await _math.math.fn({
        type: 'datatable',
        columns: input.columns,
        rows: [row]
      }, {
        expression: args.expression,
        onError: args.onError
      }, context);

      if (Array.isArray(result)) {
        if (result.length === 1) {
          return { ...row,
            [args.id]: result[0]
          };
        }

        throw new Error(_i18n.i18n.translate('expressions.functions.mathColumn.arrayValueError', {
          defaultMessage: 'Cannot perform math on array values at {name}',
          values: {
            name: args.name
          }
        }));
      }

      return { ...row,
        [args.id]: result
      };
    }));
    let type = 'null';

    if (newRows.length) {
      for (const row of newRows) {
        const rowType = (0, _expression_types.getType)(row[args.id]);

        if (rowType !== 'null') {
          type = rowType;
          break;
        }
      }
    }

    const newColumn = {
      id: args.id,
      name: (_args$name = args.name) !== null && _args$name !== void 0 ? _args$name : args.id,
      meta: {
        type,
        params: {
          id: type
        }
      }
    };

    if (args.copyMetaFrom) {
      const metaSourceFrom = columns.find(({
        id
      }) => id === args.copyMetaFrom);
      newColumn.meta = { ...newColumn.meta,
        ...((metaSourceFrom === null || metaSourceFrom === void 0 ? void 0 : metaSourceFrom.meta) || {})
      };
    }

    columns.push(newColumn);
    return {
      type: 'datatable',
      columns,
      rows: newRows
    };
  }
};
exports.mathColumn = mathColumn;