"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visdimension = void 0;

var _react = _interopRequireWildcard(require("react"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

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
  VisDimension: strings
} = _i18n.ArgumentStrings;

const VisDimensionArgInput = ({
  argValue,
  typeInstance,
  onValueChange,
  resolved: {
    columns
  }
}) => {
  var _typeInstance$options, _value$chain$0$argume;

  const [value, setValue] = (0, _react.useState)(argValue);
  const confirm = typeInstance === null || typeInstance === void 0 ? void 0 : (_typeInstance$options = typeInstance.options) === null || _typeInstance$options === void 0 ? void 0 : _typeInstance$options.confirm;
  (0, _react.useEffect)(() => {
    setValue(argValue);
  }, [argValue]);
  const onChange = (0, _react.useCallback)(ev => {
    const onChangeFn = confirm ? setValue : onValueChange;
    const astObj = {
      type: 'expression',
      chain: [{
        type: 'function',
        function: 'visdimension',
        arguments: {
          _: [ev.target.value]
        }
      }]
    };
    onChangeFn(astObj);
  }, [confirm, onValueChange]);
  const options = [{
    value: '',
    text: strings.getDefaultOptionName(),
    disabled: true
  }, ...columns.map(column => ({
    value: column.name,
    text: column.name
  }))];
  const selectedValue = (_value$chain$0$argume = value.chain[0].arguments._) === null || _value$chain$0$argume === void 0 ? void 0 : _value$chain$0$argume[0];
  const column = columns.map(col => col.name).find(colName => colName === selectedValue) || '';
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    gutterSize: "s",
    direction: "column"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    options: options,
    value: column,
    onChange: onChange
  })), confirm && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
    size: "s",
    onClick: () => onValueChange(value)
  }, confirm)));
};

const visdimension = () => ({
  name: 'vis_dimension',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(VisDimensionArgInput)
});

exports.visdimension = visdimension;