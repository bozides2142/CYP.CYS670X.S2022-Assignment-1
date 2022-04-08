"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorPicker = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _with_debounce_arg = require("../../../../public/components/with_debounce_arg");

var _i18n = require("../../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Color: strings
} = _i18n.ArgumentStrings;

const ColorPicker = ({
  onValueChange,
  argValue
}) => {
  const [color, setColor, errors] = (0, _eui.useColorPickerState)(argValue);

  const pickColor = (value, meta) => {
    setColor(value, meta);
    onValueChange(value);
  };

  return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    gutterSize: "s"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiColorPicker, {
    compressed: true,
    onChange: pickColor,
    color: color,
    isInvalid: !!errors
  })));
};

ColorPicker.propTypes = {
  argValue: _propTypes.default.any.isRequired,
  onValueChange: _propTypes.default.func.isRequired
};

const colorPicker = () => ({
  name: 'color_picker',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)((0, _with_debounce_arg.withDebounceArg)(ColorPicker)),
  default: '"#000"'
});

exports.colorPicker = colorPicker;