"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareLogTable = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isColumnEqualToAccessor = (column, columnIndex, accessor) => {
  if (typeof accessor === 'number') {
    return accessor === columnIndex;
  }

  return accessor.id === column.id;
};

const getDimensionName = (column, columnIndex, dimensions) => {
  for (const dimension of dimensions) {
    var _dimension$;

    if ((_dimension$ = dimension[0]) !== null && _dimension$ !== void 0 && _dimension$.find(d => isColumnEqualToAccessor(column, columnIndex, d.accessor))) {
      return dimension[1];
    }
  }
};

const prepareLogTable = (datatable, dimensions) => {
  return { ...datatable,
    columns: datatable.columns.map((column, columnIndex) => {
      return { ...column,
        meta: { ...column.meta,
          dimensionName: getDimensionName(column, columnIndex, dimensions)
        }
      };
    })
  };
};

exports.prepareLogTable = prepareLogTable;