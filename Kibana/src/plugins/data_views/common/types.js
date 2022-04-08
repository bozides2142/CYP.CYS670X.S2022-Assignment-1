"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternType = exports.DataViewType = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line

/**
 * @deprecated
 * IIndexPattern allows for an IndexPattern OR an index pattern saved object
 * Use IndexPattern or IndexPatternSpec instead
 */

/**
 * Interface for an index pattern saved object
 */

/**
 * @deprecated Use DataViewAttributes. All index pattern interfaces were renamed.
 */

/**
 * @intenal
 * Storage of field attributes. Necessary since the field list isn't saved.
 */

/**
 * @deprecated Use IDataViewsApiClient. All index pattern interfaces were renamed.
 */
let DataViewType;
/**
 * @deprecated Use DataViewType. All index pattern interfaces were renamed.
 */

exports.DataViewType = DataViewType;

(function (DataViewType) {
  DataViewType["DEFAULT"] = "default";
  DataViewType["ROLLUP"] = "rollup";
})(DataViewType || (exports.DataViewType = DataViewType = {}));

let IndexPatternType;
exports.IndexPatternType = IndexPatternType;

(function (IndexPatternType) {
  IndexPatternType[IndexPatternType["DEFAULT"] = DataViewType.DEFAULT] = "DEFAULT";
  IndexPatternType[IndexPatternType["ROLLUP"] = DataViewType.ROLLUP] = "ROLLUP";
})(IndexPatternType || (exports.IndexPatternType = IndexPatternType = {}));