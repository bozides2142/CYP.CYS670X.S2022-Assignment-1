"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreadPoolSearchRejectionsRule = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _thread_pool_rejections_rule_base = require("./thread_pool_rejections_rule_base");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ThreadPoolSearchRejectionsRule extends _thread_pool_rejections_rule_base.ThreadPoolRejectionsRuleBase {
  constructor(sanitizedRule) {
    super(sanitizedRule, ThreadPoolSearchRejectionsRule.TYPE, ThreadPoolSearchRejectionsRule.THREAD_POOL_TYPE, ThreadPoolSearchRejectionsRule.LABEL, _thread_pool_rejections_rule_base.ThreadPoolRejectionsRuleBase.createActionVariables(ThreadPoolSearchRejectionsRule.THREAD_POOL_TYPE));
  }

}

exports.ThreadPoolSearchRejectionsRule = ThreadPoolSearchRejectionsRule;
(0, _defineProperty2.default)(ThreadPoolSearchRejectionsRule, "TYPE", _constants.RULE_THREAD_POOL_SEARCH_REJECTIONS);
(0, _defineProperty2.default)(ThreadPoolSearchRejectionsRule, "THREAD_POOL_TYPE", 'search');
(0, _defineProperty2.default)(ThreadPoolSearchRejectionsRule, "LABEL", _constants.RULE_DETAILS[_constants.RULE_THREAD_POOL_SEARCH_REJECTIONS].label);