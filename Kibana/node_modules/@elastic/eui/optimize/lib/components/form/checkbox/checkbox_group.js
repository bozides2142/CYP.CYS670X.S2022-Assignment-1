"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCheckboxGroup = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_fieldset = require("../form_fieldset");

var _checkbox = require("./checkbox");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiCheckboxGroup = function EuiCheckboxGroup(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      _ref$idToSelectedMap = _ref.idToSelectedMap,
      idToSelectedMap = _ref$idToSelectedMap === void 0 ? {} : _ref$idToSelectedMap,
      onChange = _ref.onChange,
      className = _ref.className,
      disabled = _ref.disabled,
      compressed = _ref.compressed,
      legend = _ref.legend,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["options", "idToSelectedMap", "onChange", "className", "disabled", "compressed", "legend"]);
  var checkboxes = options.map(function (option, index) {
    var isOptionDisabled = option.disabled,
        optionClass = option.className,
        optionRest = (0, _objectWithoutProperties2.default)(option, ["disabled", "className"]);
    return (0, _react2.jsx)(_checkbox.EuiCheckbox, (0, _extends2.default)({
      className: (0, _classnames.default)('euiCheckboxGroup__item', optionClass),
      key: index,
      checked: idToSelectedMap[option.id],
      disabled: disabled || isOptionDisabled,
      onChange: onChange.bind(null, option.id),
      compressed: compressed
    }, optionRest));
  });

  if (!!legend) {
    // Be sure to pass down the compressed option to the legend
    legend.compressed = compressed;
    return (0, _react2.jsx)(_form_fieldset.EuiFormFieldset, (0, _extends2.default)({
      className: className,
      legend: legend
    }, rest), checkboxes);
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: className
  }, rest), checkboxes);
};

exports.EuiCheckboxGroup = EuiCheckboxGroup;