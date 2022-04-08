"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _simple_template = require("../simple_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultValues = {
  argValue: false
};

class Interactive extends _react2.default.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", defaultValues);
  }

  render() {
    return /*#__PURE__*/_react2.default.createElement(_simple_template.SimpleTemplate, {
      onValueChange: argValue => {
        (0, _addonActions.action)('onValueChange')(argValue);
        this.setState({
          argValue
        });
      },
      argValue: this.state.argValue
    });
  }

}

(0, _react.storiesOf)('arguments/AxisConfig', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '323px',
    padding: '16px',
    background: '#fff'
  }
}, story())).add('simple', () => /*#__PURE__*/_react2.default.createElement(Interactive, null));
(0, _react.storiesOf)('arguments/AxisConfig/components', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '323px',
    padding: '16px',
    background: '#fff'
  }
}, story())).add('simple template', () => /*#__PURE__*/_react2.default.createElement(_simple_template.SimpleTemplate, {
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: false
}));