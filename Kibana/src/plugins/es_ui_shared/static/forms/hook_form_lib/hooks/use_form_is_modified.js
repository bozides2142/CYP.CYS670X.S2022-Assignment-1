"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormIsModified = void 0;

var _react = require("react");

var _lodash = require("lodash");

var _form_context = require("../form_context");

var _use_form_data = require("./use_form_data");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Hook to detect if any of the form fields have been modified by the user.
 * If a field is modified and then the value is changed back to the initial value
 * the form **won't be marked as modified**.
 * This is useful to detect if a form has changed and we need to display a confirm modal
 * to the user before he navigates away and loses his changes.
 *
 * @param options - Optional options object
 * @returns flag to indicate if the form has been modified
 */
const useFormIsModified = ({
  form: formFromOptions,
  discard = []
} = {}) => {
  // As hook calls can not be conditional we first try to access the form through context
  let form = (0, _form_context.useFormContext)({
    throwIfNotFound: false
  });

  if (formFromOptions) {
    form = formFromOptions;
  }

  if (!form) {
    throw new Error(`useFormIsModified() used outside the form context and no form was provided in the options.`);
  }

  const {
    getFields,
    __getFieldsRemoved,
    __getFormDefaultValue
  } = form;
  const discardToString = JSON.stringify(discard); // Create a map of the fields to discard to optimize look up

  const fieldsToDiscard = (0, _react.useMemo)(() => {
    if (discard.length === 0) {
      return;
    }

    return discard.reduce((acc, path) => ({ ...acc,
      [path]: {}
    }), {}); // discardToString === discard, we don't want to add it to the deps so we
    // the coansumer does not need to memoize the array he provides.
  }, [discardToString]); // eslint-disable-line react-hooks/exhaustive-deps
  // We listen to all the form data change to trigger a re-render
  // and update our derived "isModified" state

  (0, _use_form_data.useFormData)({
    form
  });

  let predicate = () => true;

  if (fieldsToDiscard) {
    predicate = ([path]) => fieldsToDiscard[path] === undefined;
  }

  let isModified = Object.entries(getFields()).filter(predicate).some(([_, field]) => field.isModified);

  if (isModified) {
    return isModified;
  } // Check if any field has been removed.
  // If somme field has been removed **and** they were originaly present on the
  // form "defaultValue" then the form has been modified.


  const formDefaultValue = __getFormDefaultValue();

  const fieldOnFormDefaultValue = path => Boolean((0, _lodash.get)(formDefaultValue, path));

  const fieldsRemovedFromDOM = fieldsToDiscard ? Object.keys(__getFieldsRemoved()).filter(path => fieldsToDiscard[path] === undefined).filter(fieldOnFormDefaultValue) : Object.keys(__getFieldsRemoved()).filter(fieldOnFormDefaultValue);
  isModified = fieldsRemovedFromDOM.length > 0;
  return isModified;
};

exports.useFormIsModified = useFormIsModified;