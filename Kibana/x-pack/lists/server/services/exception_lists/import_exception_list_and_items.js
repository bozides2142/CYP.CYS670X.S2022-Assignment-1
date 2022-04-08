"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importExceptionsAsStream = exports.importExceptions = exports.CHUNK_PARSED_OBJECT_SIZE = void 0;

var _utils = require("@kbn/utils");

var _fp = require("lodash/fp");

var _import_exception_lists = require("./utils/import/import_exception_lists");

var _import_exception_list_items = require("./utils/import/import_exception_list_items");

var _dedupe_incoming_lists = require("./utils/import/dedupe_incoming_lists");

var _dedupe_incoming_items = require("./utils/import/dedupe_incoming_items");

var _create_exceptions_stream_logic = require("./utils/import/create_exceptions_stream_logic");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CHUNK_PARSED_OBJECT_SIZE = 100;
/**
 * Import exception lists parent containers and items as stream. The shape of the list and items
 * will be validated here as well.
 * @params exceptionsToImport {stream} ndjson stream of lists and items to be imported
 * @params maxExceptionsImportSize {number} the max number of lists and items to import, defaults to 10,000
 * @params overwrite {boolean} whether or not to overwrite an exception list with imported list if a matching list_id found
 * @params savedObjectsClient {object} SO client
 * @params user {string} user importing list and items
 * @return {ImportExceptionsResponseSchema} summary of imported count and errors
 */

exports.CHUNK_PARSED_OBJECT_SIZE = CHUNK_PARSED_OBJECT_SIZE;

const importExceptionsAsStream = async ({
  exceptionsToImport,
  maxExceptionsImportSize,
  overwrite,
  savedObjectsClient,
  user
}) => {
  // validation of import and sorting of lists and items
  const readStream = (0, _create_exceptions_stream_logic.createExceptionsStreamFromNdjson)(maxExceptionsImportSize);
  const [parsedObjects] = await (0, _utils.createPromiseFromStreams)([exceptionsToImport, ...readStream]);
  return importExceptions({
    exceptions: parsedObjects,
    overwrite,
    savedObjectsClient,
    user
  });
};

exports.importExceptionsAsStream = importExceptionsAsStream;

const importExceptions = async ({
  exceptions,
  overwrite,
  savedObjectsClient,
  user
}) => {
  // removal of duplicates
  const [exceptionListDuplicateErrors, uniqueExceptionLists] = (0, _dedupe_incoming_lists.getTupleErrorsAndUniqueExceptionLists)(exceptions.lists);
  const [exceptionListItemsDuplicateErrors, uniqueExceptionListItems] = (0, _dedupe_incoming_items.getTupleErrorsAndUniqueExceptionListItems)(exceptions.items); // chunking of validated import stream

  const chunkParsedListObjects = (0, _fp.chunk)(CHUNK_PARSED_OBJECT_SIZE, uniqueExceptionLists);
  const chunkParsedItemsObjects = (0, _fp.chunk)(CHUNK_PARSED_OBJECT_SIZE, uniqueExceptionListItems); // where the magic happens - purposely importing parent exception
  // containers first, items second

  const importExceptionListsResponse = await (0, _import_exception_lists.importExceptionLists)({
    isOverwrite: overwrite,
    listsChunks: chunkParsedListObjects,
    savedObjectsClient,
    user
  });
  const importExceptionListItemsResponse = await (0, _import_exception_list_items.importExceptionListItems)({
    isOverwrite: overwrite,
    itemsChunks: chunkParsedItemsObjects,
    savedObjectsClient,
    user
  });
  const importsSummary = {
    errors: [...importExceptionListsResponse.errors, ...exceptionListDuplicateErrors, ...importExceptionListItemsResponse.errors, ...exceptionListItemsDuplicateErrors],
    success_count_exception_list_items: importExceptionListItemsResponse.success_count,
    success_count_exception_lists: importExceptionListsResponse.success_count,
    success_exception_list_items: importExceptionListItemsResponse.errors.length === 0 && exceptionListItemsDuplicateErrors.length === 0,
    success_exception_lists: importExceptionListsResponse.errors.length === 0 && exceptionListDuplicateErrors.length === 0
  };
  return { ...importsSummary,
    success: importsSummary.success_exception_list_items && importsSummary.success_exception_lists,
    success_count: importsSummary.success_count_exception_lists + importsSummary.success_count_exception_list_items
  };
};

exports.importExceptions = importExceptions;