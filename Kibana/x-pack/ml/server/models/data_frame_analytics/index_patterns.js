"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewHandler = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DataViewHandler {
  constructor(dataViewService) {
    this.dataViewService = dataViewService;
  } // returns a id based on an index pattern name


  async getDataViewId(indexName) {
    const dv = (await this.dataViewService.find(indexName)).find(({
      title
    }) => title === indexName);
    return dv === null || dv === void 0 ? void 0 : dv.id;
  }

  async deleteDataViewById(dataViewId) {
    return await this.dataViewService.delete(dataViewId);
  }

}

exports.DataViewHandler = DataViewHandler;