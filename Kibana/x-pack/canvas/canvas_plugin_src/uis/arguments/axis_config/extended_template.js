"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedTemplate = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _objectPathImmutable = _interopRequireDefault(require("object-path-immutable"));

var _lodash = require("lodash");

var _ui = require("../../../../i18n/ui");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  AxisConfig: strings
} = _ui.ArgumentStrings;
const {
  set
} = _objectPathImmutable.default;
const defaultExpression = {
  type: 'expression',
  chain: [{
    type: 'function',
    function: 'axisConfig',
    arguments: {}
  }]
};

class ExtendedTemplate extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "getArgValue", (name, alt) => {
      return (0, _lodash.get)(this.props.argValue, `chain.0.arguments.${name}.0`, alt);
    });
    (0, _defineProperty2.default)(this, "setArgValue", name => ev => {
      if (!ev || !ev.target) {
        return;
      }

      const val = ev.target.value;
      const {
        argValue,
        onValueChange
      } = this.props;
      const oldVal = typeof argValue === 'boolean' ? defaultExpression : argValue;
      const newValue = set(oldVal, `chain.0.arguments.${name}.0`, val);
      onValueChange(newValue);
    });
  }

  render() {
    const isDisabled = typeof this.props.argValue === 'boolean' && this.props.argValue === false;

    if (isDisabled) {
      return /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
        color: "subdued",
        size: "xs"
      }, /*#__PURE__*/_react.default.createElement("p", null, strings.getDisabledText()));
    }

    const positions = {
      xaxis: [{
        value: 'bottom',
        text: strings.getPositionBottom()
      }, {
        value: 'top',
        text: strings.getPositionTop()
      }],
      yaxis: [{
        value: 'left',
        text: strings.getPositionLeft()
      }, {
        value: 'right',
        text: strings.getPositionRight()
      }]
    };
    const argName = this.props.typeInstance.name;
    const position = this.getArgValue('position', positions[argName][0].value);
    const options = positions[argName];
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
      label: strings.getPositionLabel(),
      display: "columnCompressed"
    }, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
      compressed: true,
      value: position,
      options: options,
      onChange: this.setArgValue('position')
    })), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
      size: "s"
    }));
  }

}

exports.ExtendedTemplate = ExtendedTemplate;
(0, _defineProperty2.default)(ExtendedTemplate, "propTypes", {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.shape({
    chain: _propTypes.default.array
  }).isRequired]),
  typeInstance: _propTypes.default.object.isRequired
});
(0, _defineProperty2.default)(ExtendedTemplate, "displayName", 'AxisConfigExtendedInput');