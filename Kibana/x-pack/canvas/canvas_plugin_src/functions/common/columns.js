"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = columns;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const prepareFields = fields => fields.split(',').map(field => field.trim());

const getFieldsIds = cols => cols.map(col => {
  var _col$id;

  return (_col$id = col.id) !== null && _col$id !== void 0 ? _col$id : col.name;
});

const splitColumnsByFields = (cols, fields, saveOther = false) => cols.reduce((splitColumns, col) => {
  if (fields.includes(col.id) || fields.includes(col.name)) {
    return { ...splitColumns,
      matched: [...splitColumns.matched, col]
    };
  }

  return saveOther ? { ...splitColumns,
    other: [...splitColumns.other, col]
  } : splitColumns;
}, {
  matched: [],
  other: []
});

function columns() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().columns;
  return {
    name: 'columns',
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      include: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.include
      },
      exclude: {
        types: ['string'],
        help: argHelp.exclude
      }
    },
    fn: (input, args) => {
      const {
        include,
        exclude
      } = args;
      const {
        columns: contextColumns,
        rows: contextRows,
        ...rest
      } = input;
      let result = { ...input
      };

      if (exclude) {
        const fields = prepareFields(exclude);
        const {
          matched: excluded,
          other
        } = splitColumnsByFields(result.columns, fields, true);
        const fieldsIds = getFieldsIds(excluded);
        const rows = excluded.length ? result.rows.map(row => (0, _lodash.omit)(row, fieldsIds)) : result.rows;
        result = {
          rows,
          columns: other,
          ...rest
        };
      }

      if (include) {
        const fields = prepareFields(include);
        const {
          matched: included
        } = splitColumnsByFields(result.columns, fields);
        const fieldsIds = getFieldsIds(included); // Include columns in the order the user specified

        const cols = fields.reduce((includedCols, field) => {
          const column = (0, _lodash.find)(included, col => col.id === field || col.name === field);
          return column ? [...includedCols, column] : includedCols;
        }, []);
        const rows = cols.length ? result.rows.map(row => (0, _lodash.pick)(row, fieldsIds)) : [];
        result = {
          rows,
          columns: cols,
          ...rest
        };
      }

      return result;
    }
  };
}