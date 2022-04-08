"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteList = void 0;

var _get_list = require("./get_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteList = async ({
  id,
  esClient,
  listIndex,
  listItemIndex
}) => {
  const list = await (0, _get_list.getList)({
    esClient,
    id,
    listIndex
  });

  if (list == null) {
    return null;
  } else {
    await esClient.deleteByQuery({
      body: {
        query: {
          term: {
            list_id: id
          }
        }
      },
      index: listItemIndex,
      refresh: false
    });
    await esClient.delete({
      id,
      index: listIndex,
      refresh: 'wait_for'
    });
    return list;
  }
};

exports.deleteList = deleteList;