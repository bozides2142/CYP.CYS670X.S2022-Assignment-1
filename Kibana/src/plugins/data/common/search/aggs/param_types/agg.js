"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggParamType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _agg_config = require("../agg_config");

var _base = require("./base");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class AggParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);
    (0, _defineProperty2.default)(this, "makeAgg", void 0);
    (0, _defineProperty2.default)(this, "allowedAggs", []);

    if (config.allowedAggs) {
      this.allowedAggs = config.allowedAggs;
    }

    if (!config.write) {
      this.write = (aggConfig, output) => {
        if (aggConfig.params[this.name] && aggConfig.params[this.name].length) {
          output.params[this.name] = aggConfig.params[this.name];
        }
      };
    }

    if (!config.serialize) {
      this.serialize = agg => {
        return agg.serialize();
      };
    }

    if (!config.deserialize) {
      this.deserialize = (state, agg) => {
        if (!agg) {
          throw new Error('aggConfig was not provided to AggParamType deserialize function');
        }

        return this.makeAgg(agg, state);
      };
    }

    if (!config.toExpressionAst) {
      this.toExpressionAst = agg => {
        if (!agg || !agg.toExpressionAst) {
          throw new Error('aggConfig was not provided to AggParamType toExpressionAst function');
        }

        return agg.toExpressionAst();
      };
    }

    this.makeAgg = config.makeAgg;
    this.valueType = _agg_config.AggConfig;
  }

}

exports.AggParamType = AggParamType;