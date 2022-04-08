"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRadioGroup = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_fieldset = require("../form_fieldset");

var _radio = require("./radio");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiRadioGroup = function EuiRadioGroup(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      idSelected = _ref.idSelected,
      onChange = _ref.onChange,
      name = _ref.name,
      className = _ref.className,
      disabled = _ref.disabled,
      compressed = _ref.compressed,
      legend = _ref.legend,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["options", "idSelected", "onChange", "name", "className", "disabled", "compressed", "legend"]);
  var radios = options.map(function (option, index) {
    var isOptionDisabled = option.disabled,
        optionClass = option.className,
        id = option.id,
        label = option.label,
        optionRest = (0, _objectWithoutProperties2.default)(option, ["disabled", "className", "id", "label"]);
    return (0, _react2.jsx)(_radio.EuiRadio, (0, _extends2.default)({
      className: (0, _classnames.default)('euiRadioGroup__item', optionClass),
      key: index,
      name: name,
      checked: id === idSelected,
      disabled: disabled || isOptionDisabled,
      onChange: onChange.bind(null, id, option.value),
      compressed: compressed,
      id: id,
      label: label
    }, optionRest));
  });

  if (!!legend) {
    // Be sure to pass down the compressed option to the legend
    legend.compressed = compressed;
    return (0, _react2.jsx)(_form_fieldset.EuiFormFieldset, (0, _extends2.default)({
      className: className,
      legend: legend
    }, rest), radios);
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: className
  }, rest), radios);
};

exports.EuiRadioGroup = EuiRadioGroup;