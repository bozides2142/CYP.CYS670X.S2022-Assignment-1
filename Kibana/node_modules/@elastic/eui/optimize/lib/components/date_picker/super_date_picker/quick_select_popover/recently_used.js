"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRecentlyUsed = void 0;

var _react = _interopRequireDefault(require("react"));

var _pretty_duration = require("../pretty_duration");

var _i18n = require("../../../i18n");

var _services = require("../../../../services");

var _title = require("../../../title");

var _link = require("../../../link");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiRecentlyUsed = function EuiRecentlyUsed(_ref) {
  var applyTime = _ref.applyTime,
      commonlyUsedRanges = _ref.commonlyUsedRanges,
      dateFormat = _ref.dateFormat,
      _ref$recentlyUsedRang = _ref.recentlyUsedRanges,
      recentlyUsedRanges = _ref$recentlyUsedRang === void 0 ? [] : _ref$recentlyUsedRang;
  var legendId = (0, _services.useGeneratedHtmlId)();

  if (recentlyUsedRanges.length === 0) {
    return null;
  }

  var links = recentlyUsedRanges.map(function (_ref2) {
    var start = _ref2.start,
        end = _ref2.end;

    var applyRecentlyUsed = function applyRecentlyUsed() {
      applyTime({
        start: start,
        end: end
      });
    };

    return (0, _react2.jsx)("li", {
      className: "euiQuickSelectPopover__sectionItem",
      key: "".concat(start, "-").concat(end)
    }, (0, _react2.jsx)(_link.EuiLink, {
      onClick: applyRecentlyUsed
    }, (0, _pretty_duration.prettyDuration)(start, end, commonlyUsedRanges, dateFormat)));
  });
  return (0, _react2.jsx)("fieldset", null, (0, _react2.jsx)(_title.EuiTitle, {
    size: "xxxs"
  }, (0, _react2.jsx)("legend", {
    id: legendId
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiRecentlyUsed.legend",
    default: "Recently used date ranges"
  }))), (0, _react2.jsx)("div", {
    className: "euiQuickSelectPopover__section"
  }, (0, _react2.jsx)("ul", null, links)));
};

exports.EuiRecentlyUsed = EuiRecentlyUsed;
EuiRecentlyUsed.displayName = 'EuiRecentlyUsed';