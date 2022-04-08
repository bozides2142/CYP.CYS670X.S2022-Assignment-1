"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeBufferToItems = exports.importListItemsToStream = void 0;

var _i18n = require("@kbn/i18n");

var _create_list_if_it_does_not_exist = require("../lists/create_list_if_it_does_not_exist");

var _buffer_lines = require("./buffer_lines");

var _create_list_items_bulk = require("./create_list_items_bulk");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const importListItemsToStream = ({
  config,
  deserializer,
  serializer,
  listId,
  stream,
  esClient,
  listItemIndex,
  listIndex,
  type,
  user,
  meta,
  version
}) => {
  return new Promise(resolve => {
    const readBuffer = new _buffer_lines.BufferLines({
      bufferSize: config.importBufferSize,
      input: stream
    });
    let fileName;
    let list = null;
    readBuffer.on('fileName', async fileNameEmitted => {
      readBuffer.pause();
      fileName = decodeURIComponent(fileNameEmitted);

      if (listId == null) {
        list = await (0, _create_list_if_it_does_not_exist.createListIfItDoesNotExist)({
          description: _i18n.i18n.translate('xpack.lists.services.items.fileUploadFromFileSystem', {
            defaultMessage: 'File uploaded from file system of {fileName}',
            values: {
              fileName
            }
          }),
          deserializer,
          esClient,
          id: fileName,
          immutable: false,
          listIndex,
          meta,
          name: fileName,
          serializer,
          type,
          user,
          version
        });
      }

      readBuffer.resume();
    });
    readBuffer.on('lines', async lines => {
      if (listId != null) {
        await writeBufferToItems({
          buffer: lines,
          deserializer,
          esClient,
          listId,
          listItemIndex,
          meta,
          serializer,
          type,
          user
        });
      } else if (fileName != null) {
        await writeBufferToItems({
          buffer: lines,
          deserializer,
          esClient,
          listId: fileName,
          listItemIndex,
          meta,
          serializer,
          type,
          user
        });
      }
    });
    readBuffer.on('close', () => {
      resolve(list);
    });
  });
};

exports.importListItemsToStream = importListItemsToStream;

const writeBufferToItems = async ({
  listId,
  esClient,
  deserializer,
  serializer,
  listItemIndex,
  buffer,
  type,
  user,
  meta
}) => {
  await (0, _create_list_items_bulk.createListItemsBulk)({
    deserializer,
    esClient,
    listId,
    listItemIndex,
    meta,
    serializer,
    type,
    user,
    value: buffer
  });
  return {
    linesProcessed: buffer.length
  };
};

exports.writeBufferToItems = writeBufferToItems;