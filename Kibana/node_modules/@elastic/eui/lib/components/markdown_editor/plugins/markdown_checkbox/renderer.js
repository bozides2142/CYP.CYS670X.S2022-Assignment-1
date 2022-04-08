"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxMarkdownRenderer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _checkbox = require("../../../form/checkbox");

var _markdown_context = require("../../markdown_context");

var _accessibility = require("../../../../services/accessibility");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
CheckboxMarkdownRenderer.propTypes = {
  type: _propTypes.default.oneOf(["checkboxPlugin"]).isRequired,
  lead: _propTypes.default.string.isRequired,
  label: _propTypes.default.string.isRequired,
  isChecked: _propTypes.default.bool.isRequired,
  position: _propTypes.default.shape({
    start: _propTypes.default.shape({
      line: _propTypes.default.number.isRequired,
      column: _propTypes.default.number.isRequired,
      offset: _propTypes.default.number.isRequired
    }).isRequired,
    end: _propTypes.default.shape({
      line: _propTypes.default.number.isRequired,
      column: _propTypes.default.number.isRequired,
      offset: _propTypes.default.number.isRequired
    }).isRequired
  }).isRequired
};