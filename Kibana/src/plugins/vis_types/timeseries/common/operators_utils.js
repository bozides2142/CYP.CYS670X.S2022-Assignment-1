"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldOperate = exports.getOperator = exports.Operator = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let Operator;
exports.Operator = Operator;

(function (Operator) {
  Operator["Gte"] = "gte";
  Operator["Lte"] = "lte";
  Operator["Gt"] = "gt";
  Operator["Lt"] = "lt";
  Operator["Empty"] = "empty";
})(Operator || (exports.Operator = Operator = {}));

const OPERATORS = {
  [Operator.Gte]: _lodash.gte,
  [Operator.Lte]: _lodash.lte,
  [Operator.Gt]: _lodash.gt,
  [Operator.Lt]: _lodash.lt,
  [Operator.Empty]: _lodash.isNull
};
const OPERATORS_ALLOW_NULL = {
  [Operator.Empty]: true
};

const getOperator = operator => {
  return OPERATORS[operator];
}; // This check is necessary for preventing from comparing null values with numeric rules.


exports.getOperator = getOperator;

const shouldOperate = (rule, value) => (0, _lodash.isNull)(rule.value) && OPERATORS_ALLOW_NULL[rule.operator] || !(0, _lodash.isNull)(rule.value) && !(0, _lodash.isNull)(value);

exports.shouldOperate = shouldOperate;