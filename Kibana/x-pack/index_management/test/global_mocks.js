"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// NOTE: Import this file for its side-effects. You must import it before the code that it mocks
// is imported. Typically this means just importing above your other imports.
// See https://jestjs.io/docs/manual-mocks for more info.


jest.mock('../../../../src/plugins/es_ui_shared/public', () => {
  const original = jest.requireActual('../../../../src/plugins/es_ui_shared/public');
  return { ...original,
    EuiCodeEditor: props => /*#__PURE__*/_react.default.createElement("input", {
      "data-test-subj": props['data-test-subj'] || 'mockCodeEditor',
      "data-currentvalue": props.value,
      onChange: syntheticEvent => {
        props.onChange(syntheticEvent.jsonString);
      }
    })
  };
});