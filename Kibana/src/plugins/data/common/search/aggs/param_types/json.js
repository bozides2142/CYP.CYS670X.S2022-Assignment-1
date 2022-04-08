"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonParamType = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _base = require("./base");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function collapseLiteralStrings(xjson) {
  const tripleQuotes = '"""';
  const splitData = xjson.split(tripleQuotes);

  for (let idx = 1; idx < splitData.length - 1; idx += 2) {
    splitData[idx] = JSON.stringify(splitData[idx]);
  }

  return splitData.join('');
}

class JsonParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);
    this.name = config.name || 'json';

    if (!config.write) {
      this.write = (aggConfig, output) => {
        let paramJson;
        const param = aggConfig.params[this.name];

        if (!param) {
          return;
        }

        try {
          paramJson = JSON.parse(collapseLiteralStrings(param));
        } catch (err) {
          return;
        }

        function filteredCombine(srcA, srcB) {
          function mergeObjs(a, b) {
            return (0, _lodash.default)(a).keys().union(_lodash.default.keys(b)).transform(function (dest, key) {
              const val = compare(a[key], b[key]);
              if (val !== undefined) dest[key] = val;
            }, {}).value();
          }

          function mergeArrays(a, b) {
            // attempt to merge each value
            return _lodash.default.times(Math.max(a.length, b.length), function (i) {
              return compare(a[i], b[i]);
            });
          }

          function compare(a, b) {
            if (_lodash.default.isPlainObject(a) && _lodash.default.isPlainObject(b)) return mergeObjs(a, b);
            if (Array.isArray(a) && Array.isArray(b)) return mergeArrays(a, b);
            if (b === null) return undefined;
            if (b !== undefined) return b;
            return a;
          }

          return compare(srcA, srcB);
        }

        output.params = filteredCombine(output.params, paramJson);
        return;
      };
    }
  }

}

exports.JsonParamType = JsonParamType;