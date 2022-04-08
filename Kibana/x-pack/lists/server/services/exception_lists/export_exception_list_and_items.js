"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExport = exports.exportExceptionListAndItems = void 0;

var _securitysolutionUtils = require("@kbn/securitysolution-utils");

var _find_exception_list_item = require("./find_exception_list_item");

var _get_exception_list = require("./get_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exportExceptionListAndItems = async ({
  id,
  listId,
  namespaceType,
  savedObjectsClient
}) => {
  const exceptionList = await (0, _get_exception_list.getExceptionList)({
    id,
    listId,
    namespaceType,
    savedObjectsClient
  });

  if (exceptionList == null) {
    return null;
  } else {
    var _listItems$data; // TODO: Will need to address this when we switch over to
    // using PIT, don't want it to get lost
    // https://github.com/elastic/kibana/issues/103944


    const listItems = await (0, _find_exception_list_item.findExceptionListItem)({
      filter: undefined,
      listId: exceptionList.list_id,
      namespaceType: exceptionList.namespace_type,
      page: 1,
      perPage: 10000,
      savedObjectsClient,
      sortField: 'exception-list.created_at',
      sortOrder: 'desc'
    });
    const exceptionItems = (_listItems$data = listItems === null || listItems === void 0 ? void 0 : listItems.data) !== null && _listItems$data !== void 0 ? _listItems$data : [];
    const {
      exportData
    } = getExport([exceptionList, ...exceptionItems]); // TODO: Add logic for missing lists and items on errors

    return {
      exportData: `${exportData}`,
      exportDetails: {
        exported_exception_list_count: 1,
        exported_exception_list_item_count: exceptionItems.length,
        missing_exception_list_item_count: 0,
        missing_exception_list_items: [],
        missing_exception_lists: [],
        missing_exception_lists_count: 0
      }
    };
  }
};

exports.exportExceptionListAndItems = exportExceptionListAndItems;

const getExport = data => {
  const ndjson = (0, _securitysolutionUtils.transformDataToNdjson)(data);
  return {
    exportData: ndjson
  };
};

exports.getExport = getExport;