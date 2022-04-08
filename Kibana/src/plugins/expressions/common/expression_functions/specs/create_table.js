"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTable = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createTable = {
  name: 'createTable',
  type: 'datatable',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('expressions.functions.createTableHelpText', {
    defaultMessage: 'Creates a datatable with a list of columns, and 1 or more empty rows. ' + 'To populate the rows, use {mapColumnFn} or {mathColumnFn}.',
    values: {
      mathColumnFn: '`mathColumn`',
      mapColumnFn: '`mapColumn`'
    }
  }),
  args: {
    ids: {
      types: ['string'],
      help: _i18n.i18n.translate('expressions.functions.createTable.args.idsHelpText', {
        defaultMessage: 'Column ids to generate in positional order. ID represents the key in the row.'
      }),
      required: false,
      multi: true
    },
    names: {
      types: ['string'],
      help: _i18n.i18n.translate('expressions.functions.createTable.args.nameHelpText', {
        defaultMessage: 'Column names to generate in positional order. Names are not required to be unique, and default to the ID if not provided.'
      }),
      required: false,
      multi: true
    },
    rowCount: {
      types: ['number'],
      help: _i18n.i18n.translate('expressions.functions.createTable.args.rowCountText', {
        defaultMessage: 'The number of empty rows to add to the table, to be assigned a value later'
      }),
      default: 1,
      required: false
    }
  },

  fn(input, args) {
    var _args$ids;

    const columns = [];
    ((_args$ids = args.ids) !== null && _args$ids !== void 0 ? _args$ids : []).map((id, index) => {
      var _args$names$index, _args$names;

      columns.push({
        id,
        name: (_args$names$index = (_args$names = args.names) === null || _args$names === void 0 ? void 0 : _args$names[index]) !== null && _args$names$index !== void 0 ? _args$names$index : id,
        meta: {
          type: 'null'
        }
      });
    });
    return {
      columns,
      // Each row gets a unique object
      rows: [...Array(args.rowCount)].map(() => ({})),
      type: 'datatable'
    };
  }

};
exports.createTable = createTable;