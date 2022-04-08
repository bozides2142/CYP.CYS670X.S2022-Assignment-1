"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseField = void 0;
exports.getUseField = getUseField;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _hooks = require("../hooks");

var _form_context = require("../form_context");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function UseFieldComp(props) {
  const {
    path,
    config,
    defaultValue,
    component,
    componentProps,
    readDefaultValueOnForm = true,
    onChange,
    onError,
    children,
    validationData: customValidationData,
    validationDataProvider: customValidationDataProvider,
    ...rest
  } = props;
  const form = (0, _form_context.useFormContext)();
  const ComponentToRender = component !== null && component !== void 0 ? component : 'input';
  const propsToForward = { ...componentProps,
    ...rest
  };
  const fieldConfig = config !== undefined ? { ...config
  } : { ...form.__readFieldConfigFromSchema(path)
  };

  if (defaultValue !== undefined) {
    // update the form "defaultValue" ref object so when/if we reset the form we can go back to this value
    form.__updateDefaultValueAt(path, defaultValue); // Use the defaultValue prop as initial value


    fieldConfig.initialValue = defaultValue;
  } else {
    if (readDefaultValueOnForm) {
      var _ref;

      // Read the field initial value from the "defaultValue" object passed to the form
      fieldConfig.initialValue = (_ref = form.getFieldDefaultValue(path)) !== null && _ref !== void 0 ? _ref : fieldConfig.defaultValue;
    }
  }

  const field = (0, _hooks.useField)(form, path, fieldConfig, onChange, onError, {
    customValidationData,
    customValidationDataProvider
  }); // Children prevails over anything else provided.

  if (children) {
    return children(field);
  }

  if (ComponentToRender === 'input') {
    return /*#__PURE__*/_react.default.createElement(ComponentToRender, (0, _extends2.default)({
      type: field.type,
      onChange: field.onChange,
      value: field.value
    }, propsToForward));
  }

  return /*#__PURE__*/_react.default.createElement(ComponentToRender, (0, _extends2.default)({
    field
  }, propsToForward));
}

const UseField = /*#__PURE__*/_react.default.memo(UseFieldComp);
/**
 * Get a <UseField /> component providing some common props for all instances.
 * @param partialProps Partial props to apply to all <UseField /> instances
 */


exports.UseField = UseField;

function getUseField(partialProps) {
  return function (props) {
    const componentProps = { ...partialProps,
      ...props
    };
    return /*#__PURE__*/_react.default.createElement(UseField, componentProps);
  };
}