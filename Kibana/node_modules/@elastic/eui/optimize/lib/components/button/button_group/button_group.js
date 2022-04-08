"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiButtonGroup = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _accessibility = require("../../accessibility");

var _button_group_button = require("./button_group_button");

var _button = require("../button");

var _services = require("../../../services");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var groupSizeToClassNameMap = {
  s: '--small',
  m: '--medium',
  compressed: '--compressed'
};

var EuiButtonGroup = function EuiButtonGroup(_ref) {
  var className = _ref.className,
      _ref$buttonSize = _ref.buttonSize,
      buttonSize = _ref$buttonSize === void 0 ? 's' : _ref$buttonSize,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'text' : _ref$color,
      _ref$idSelected = _ref.idSelected,
      idSelected = _ref$idSelected === void 0 ? '' : _ref$idSelected,
      _ref$idToSelectedMap = _ref.idToSelectedMap,
      idToSelectedMap = _ref$idToSelectedMap === void 0 ? {} : _ref$idToSelectedMap,
      _ref$isDisabled = _ref.isDisabled,
      isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
      _ref$isFullWidth = _ref.isFullWidth,
      isFullWidth = _ref$isFullWidth === void 0 ? false : _ref$isFullWidth,
      _ref$isIconOnly = _ref.isIconOnly,
      isIconOnly = _ref$isIconOnly === void 0 ? false : _ref$isIconOnly,
      legend = _ref.legend,
      name = _ref.name,
      onChange = _ref.onChange,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'single' : _ref$type,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "buttonSize", "color", "idSelected", "idToSelectedMap", "isDisabled", "isFullWidth", "isIconOnly", "legend", "name", "onChange", "options", "type"]);
  // Compressed style can't support `ghost` color because it's more like a form field than a button
  var badColorCombo = buttonSize === 'compressed' && color === 'ghost';
  var resolvedColor = badColorCombo ? 'text' : color;

  if (badColorCombo) {
    console.warn('EuiButtonGroup of compressed size does not support the ghost color. It will render as text instead.');
  }

  var classes = (0, _classnames.default)('euiButtonGroup', "euiButtonGroup".concat(groupSizeToClassNameMap[buttonSize]), "euiButtonGroup".concat(_button.colorToClassNameMap[resolvedColor]), {
    'euiButtonGroup--fullWidth': isFullWidth,
    'euiButtonGroup--isDisabled': isDisabled
  }, className);
  var typeIsSingle = type === 'single';
  var nameIfSingle = (0, _services.useGeneratedHtmlId)({
    conditionalId: name
  });
  return (0, _react2.jsx)("fieldset", (0, _extends2.default)({
    className: classes
  }, rest, {
    disabled: isDisabled
  }), (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("legend", null, legend)), (0, _react2.jsx)("div", {
    className: "euiButtonGroup__buttons"
  }, options.map(function (option, index) {
    return (0, _react2.jsx)(_button_group_button.EuiButtonGroupButton, (0, _extends2.default)({
      key: index,
      name: nameIfSingle,
      isDisabled: isDisabled
    }, option, {
      element: typeIsSingle ? 'label' : 'button',
      isSelected: typeIsSingle ? option.id === idSelected : idToSelectedMap[option.id],
      color: resolvedColor,
      size: buttonSize,
      isIconOnly: isIconOnly,
      onChange: onChange
    }));
  })));
};

exports.EuiButtonGroup = EuiButtonGroup;