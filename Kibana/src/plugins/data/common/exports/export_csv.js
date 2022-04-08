"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LINE_FEED_CHARACTER = exports.CSV_MIME_TYPE = void 0;
exports.datatableToCSV = datatableToCSV;

var _escape_value = require("./escape_value");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Inspired by the inspector CSV exporter
const LINE_FEED_CHARACTER = '\r\n';
exports.LINE_FEED_CHARACTER = LINE_FEED_CHARACTER;
const CSV_MIME_TYPE = 'text/plain;charset=utf-8';
exports.CSV_MIME_TYPE = CSV_MIME_TYPE;

function datatableToCSV({
  columns,
  rows
}, {
  csvSeparator,
  quoteValues,
  formatFactory,
  raw,
  escapeFormulaValues
}) {
  const escapeValues = (0, _escape_value.createEscapeValue)(quoteValues, escapeFormulaValues); // Build the header row by its names

  const header = columns.map(col => escapeValues(col.name));
  const formatters = columns.reduce((memo, {
    id,
    meta
  }) => {
    memo[id] = formatFactory(meta === null || meta === void 0 ? void 0 : meta.params);
    return memo;
  }, {}); // Convert the array of row objects to an array of row arrays

  const csvRows = rows.map(row => {
    return columns.map(column => escapeValues(raw ? row[column.id] : formatters[column.id].convert(row[column.id])));
  });

  if (header.length === 0) {
    return '';
  }

  return [header, ...csvRows].map(row => row.join(csvSeparator)).join(LINE_FEED_CHARACTER) + LINE_FEED_CHARACTER; // Add \r\n after last line
}