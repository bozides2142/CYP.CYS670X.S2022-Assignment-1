"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _with_debounce_arg = require("../../../public/components/with_debounce_arg");

var _i18n = require("../../../i18n");

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
  Range: strings
} = _i18n.ArgumentStrings;

const RangeArgInput = ({
  typeInstance,
  onValueChange,
  argValue
}) => {
  const {
    min,
    max,
    step
  } = typeInstance.options;
  const [value, setValue] = (0, _react.useState)(argValue);
  const handleChange = (0, _react.useCallback)(ev => {
    const {
      value
    } = ev.target;
    const numberVal = Number(value);
    setValue(numberVal);
    onValueChange(numberVal);
  }, [onValueChange]);
  return /*#__PURE__*/_react.default.createElement(_eui.EuiRange, {
    compressed: true,
    min: min,
    max: max,
    step: step,
    showLabels: true,
    showInput: true,
    value: value,
    onChange: handleChange
  });
};

RangeArgInput.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  typeInstance: _propTypes.default.shape({
    options: _propTypes.default.shape({
      min: _propTypes.default.number.isRequired,
      max: _propTypes.default.number.isRequired,
      step: _propTypes.default.number
    }).isRequired
  }),
  argId: _propTypes.default.string.isRequired
};

const range = () => ({
  name: 'range',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)((0, _with_debounce_arg.withDebounceArg)(RangeArgInput, 50))
});

exports.range = range;