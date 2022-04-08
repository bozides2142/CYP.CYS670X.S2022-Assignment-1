"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFieldText = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_control_layout = require("../form_control_layout");

var _validatable_control = require("../validatable_control");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiFieldText = function EuiFieldText(_ref) {
  var id = _ref.id,
      name = _ref.name,
      placeholder = _ref.placeholder,
      value = _ref.value,
      className = _ref.className,
      icon = _ref.icon,
      isInvalid = _ref.isInvalid,
      inputRef = _ref.inputRef,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      isLoading = _ref.isLoading,
      compressed = _ref.compressed,
      prepend = _ref.prepend,
      append = _ref.append,
      readOnly = _ref.readOnly,
      controlOnly = _ref.controlOnly,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["id", "name", "placeholder", "value", "className", "icon", "isInvalid", "inputRef", "fullWidth", "isLoading", "compressed", "prepend", "append", "readOnly", "controlOnly"]);
  var classes = (0, _classnames.default)('euiFieldText', className, {
    'euiFieldText--withIcon': icon,
    'euiFieldText--fullWidth': fullWidth,
    'euiFieldText--compressed': compressed,
    'euiFieldText--inGroup': prepend || append,
    'euiFieldText-isLoading': isLoading
  });
  var control = (0, _react2.jsx)(_validatable_control.EuiValidatableControl, {
    isInvalid: isInvalid
  }, (0, _react2.jsx)("input", (0, _extends2.default)({
    type: "text",
    id: id,
    name: name,
    placeholder: placeholder,
    className: classes,
    value: value,
    ref: inputRef,
    readOnly: readOnly
  }, rest)));
  if (controlOnly) return control;
  return (0, _react2.jsx)(_form_control_layout.EuiFormControlLayout, {
    icon: icon,
    fullWidth: fullWidth,
    isLoading: isLoading,
    compressed: compressed,
    readOnly: readOnly,
    prepend: prepend,
    append: append,
    inputId: id
  }, control);
};

exports.EuiFieldText = EuiFieldText;