"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxMarkdownRenderer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _checkbox = require("../../../form/checkbox");

var _markdown_context = require("../../markdown_context");

var _accessibility = require("../../../../services/accessibility");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var CheckboxMarkdownRenderer = function CheckboxMarkdownRenderer(_ref) {
  var position = _ref.position,
      lead = _ref.lead,
      label = _ref.label,
      isChecked = _ref.isChecked,
      children = _ref.children;

  var _useContext = (0, _react.useContext)(_markdown_context.EuiMarkdownContext),
      replaceNode = _useContext.replaceNode;

  return (0, _react2.jsx)(_checkbox.EuiCheckbox, {
    id: (0, _accessibility.useGeneratedHtmlId)(),
    checked: isChecked,
    label: children,
    onChange: function onChange() {
      replaceNode(position, "".concat(lead, "[").concat(isChecked ? ' ' : 'x', "]").concat(label));
    }
  });
};

exports.CheckboxMarkdownRenderer = CheckboxMarkdownRenderer;