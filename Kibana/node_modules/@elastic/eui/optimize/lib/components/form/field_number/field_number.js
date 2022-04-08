"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFieldNumber = void 0;

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
var EuiFieldNumber = function EuiFieldNumber(_ref) {
  var className = _ref.className,
      icon = _ref.icon,
      id = _ref.id,
      placeholder = _ref.placeholder,
      name = _ref.name,
      min = _ref.min,
      max = _ref.max,
      value = _ref.value,
      isInvalid = _ref.isInvalid,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? false : _ref$isLoading,
      _ref$compressed = _ref.compressed,
      compressed = _ref$compressed === void 0 ? false : _ref$compressed,
      prepend = _ref.prepend,
      append = _ref.append,
      inputRef = _ref.inputRef,
      readOnly = _ref.readOnly,
      controlOnly = _ref.controlOnly,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "icon", "id", "placeholder", "name", "min", "max", "value", "isInvalid", "fullWidth", "isLoading", "compressed", "prepend", "append", "inputRef", "readOnly", "controlOnly"]);
  var classes = (0, _classnames.default)('euiFieldNumber', className, {
    'euiFieldNumber--withIcon': icon,
    'euiFieldNumber--fullWidth': fullWidth,
    'euiFieldNumber--compressed': compressed,
    'euiFieldNumber--inGroup': prepend || append,
    'euiFieldNumber-isLoading': isLoading
  });
  var control = (0, _react2.jsx)(_validatable_control.EuiValidatableControl, {
    isInvalid: isInvalid
  }, (0, _react2.jsx)("input", (0, _extends2.default)({
    type: "number",
    id: id,
    min: min,
    max: max,
    name: name,
    value: value,
    placeholder: placeholder,
    readOnly: readOnly,
    className: classes,
    ref: inputRef
  }, rest)));

  if (controlOnly) {
    return control;
  }

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

exports.EuiFieldNumber = EuiFieldNumber;