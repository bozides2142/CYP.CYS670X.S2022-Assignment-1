"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeDataToIndex = writeDataToIndex;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function writeDataToIndex(index, data, asCurrentUser) {
  try {
    const {
      body: indexExists
    } = await asCurrentUser.indices.exists({
      index
    });

    if (!indexExists) {
      throw new Error(_i18n.i18n.translate('xpack.maps.indexData.indexExists', {
        defaultMessage: `Index: '{index}' not found. A valid index must be provided`,
        values: {
          index
        }
      }));
    }

    const settings = {
      index,
      body: data,
      refresh: true
    };
    const {
      body: resp
    } = await asCurrentUser.index(settings); // @ts-expect-error always false

    if (resp.result === 'Error') {
      throw resp;
    } else {
      return {
        success: true,
        data
      };
    }
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}