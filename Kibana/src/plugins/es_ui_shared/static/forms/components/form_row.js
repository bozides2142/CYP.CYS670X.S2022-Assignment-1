"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormRow = exports.FormRow = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _field = require("./field");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isTitleString(title) {
  return typeof title === 'string' || title.type.name === 'FormattedMessage';
}

const FormRow = ({
  title,
  idAria,
  description,
  field,
  children,
  titleTag = 'h4',
  ...rest
}) => {
  let titleWrapped; // If a string is provided, create a default Euititle of size "m"

  if (isTitleString(title)) {
    // Create the correct title tag
    const titleWithHTag = /*#__PURE__*/_react.default.createElement(titleTag, undefined, title);

    titleWrapped = /*#__PURE__*/_react.default.createElement(_eui.EuiTitle, {
      size: "s"
    }, titleWithHTag);
  } else {
    titleWrapped = title;
  }

  return /*#__PURE__*/_react.default.createElement(_eui.EuiDescribedFormGroup, {
    title: titleWrapped,
    description: description,
    fullWidth: true
  }, children ? children : field ? /*#__PURE__*/_react.default.createElement(_field.Field, (0, _extends2.default)({
    field: field
  }, rest)) : null);
};
/**
 * Get a <FormRow /> component providing some common props for all instances.
 * @param partialProps Partial props to apply to all <FormRow /> instances
 */


exports.FormRow = FormRow;

const getFormRow = partialProps => props => {
  const componentProps = { ...partialProps,
    ...props
  };
  return /*#__PURE__*/_react.default.createElement(FormRow, componentProps);
};

exports.getFormRow = getFormRow;