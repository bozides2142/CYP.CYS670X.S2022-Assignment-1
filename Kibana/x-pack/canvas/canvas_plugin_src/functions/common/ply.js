"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ply = ply;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function ply() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().ply;
  const errors = (0, _i18n.getFunctionErrors)().ply;
  return {
    name: 'ply',
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      by: {
        types: ['string'],
        help: argHelp.by,
        multi: true
      },
      expression: {
        types: ['datatable'],
        resolve: false,
        multi: true,
        aliases: ['exp', 'fn', 'function'],
        help: argHelp.expression
      }
    },

    fn(input, args) {
      var _args$by$map, _args$by;

      if (!args) {
        return input;
      }

      const byColumns = (_args$by$map = (_args$by = args.by) === null || _args$by === void 0 ? void 0 : _args$by.map(by => {
        const column = input.columns.find(({
          name
        }) => name === by);

        if (!column) {
          throw errors.columnNotFound(by);
        }

        return column;
      })) !== null && _args$by$map !== void 0 ? _args$by$map : [];
      const originalDatatables = args.by ? Object.values((0, _lodash.groupBy)(input.rows, row => JSON.stringify((0, _lodash.pick)(row, args.by)))).map(rows => ({ ...input,
        rows
      })) : [input];
      const datatables$ = originalDatatables.map(originalDatatable => {
        var _args$expression$map, _args$expression;

        return (0, _rxjs.combineLatest)((_args$expression$map = (_args$expression = args.expression) === null || _args$expression === void 0 ? void 0 : _args$expression.map(expression => (0, _rxjs.defer)(() => expression(originalDatatable)))) !== null && _args$expression$map !== void 0 ? _args$expression$map : [(0, _rxjs.of)(originalDatatable)]).pipe((0, _operators.map)(combineAcross));
      });
      return (datatables$.length ? (0, _rxjs.combineLatest)(datatables$) : (0, _rxjs.of)([])).pipe((0, _operators.map)(newDatatables => {
        // Here we're just merging each for the by splits, so it doesn't actually matter if the rows are the same length
        const columns = combineColumns([byColumns].concat((0, _lodash.map)(newDatatables, 'columns')));
        const rows = (0, _lodash.flatten)(newDatatables.map((datatable, index) => datatable.rows.map(row => ({ ...(0, _lodash.pick)(originalDatatables[index].rows[0], args.by),
          ...row
        }))));
        return {
          type: 'datatable',
          rows,
          columns
        };
      }));
    }

  };
}

function combineColumns(arrayOfColumnsArrays) {
  return (0, _lodash.uniqWith)(arrayOfColumnsArrays.flat(), ({
    name: a
  }, {
    name: b
  }) => a === b);
} // This handles merging the tables produced by multiple expressions run on a single member of the `by` split.
// Thus all tables must be the same length, although their columns do not need to be the same, we will handle combining the columns


function combineAcross(datatableArray) {
  const errors = (0, _i18n.getFunctionErrors)().ply;
  const [referenceTable] = datatableArray;
  const targetRowLength = referenceTable.rows.length; // Sanity check

  datatableArray.forEach(datatable => {
    if (datatable.rows.length !== targetRowLength) {
      throw errors.rowCountMismatch();
    }
  }); // Merge columns and rows.

  const arrayOfRowsArrays = (0, _lodash.map)(datatableArray, 'rows');
  const rows = [];

  for (let i = 0; i < targetRowLength; i++) {
    const rowsAcross = (0, _lodash.map)(arrayOfRowsArrays, i); // The reason for the Object.assign is that rowsAcross is an array
    // and those rows need to be applied as arguments to Object.assign

    rows.push(Object.assign({}, ...rowsAcross));
  }

  const columns = combineColumns((0, _lodash.map)(datatableArray, 'columns'));
  return {
    type: 'datatable',
    rows,
    columns
  };
}