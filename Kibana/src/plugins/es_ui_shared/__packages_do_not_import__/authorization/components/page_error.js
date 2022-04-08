"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageError = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _eui = require("@elastic/eui");

var _react = _interopRequireDefault(require("react"));

var _public = require("../../../../../../src/core/public");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * A reusable component to handle full page errors.
 * This is based on Kibana design guidelines related
 * to the new management navigation structure.
 * In some scenarios, it replaces the usage of <SectionError />.
 */
const PageError = ({
  title,
  error,
  actions,
  isCentered,
  ...rest
}) => {
  const errorString = error === null || error === void 0 ? void 0 : error.error;
  const cause = error === null || error === void 0 ? void 0 : error.cause; // wrapEsError() on the server adds a "cause" array

  const message = error === null || error === void 0 ? void 0 : error.message;

  const errorContent = /*#__PURE__*/_react.default.createElement(_eui.EuiPageContent, {
    verticalPosition: "center",
    horizontalPosition: "center",
    color: "danger"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiEmptyPrompt, (0, _extends2.default)({
    title: /*#__PURE__*/_react.default.createElement("h2", null, title),
    body: error && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, cause ? message || errorString : /*#__PURE__*/_react.default.createElement("p", {
      className: "eui-textBreakWord"
    }, message || errorString), cause && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
      size: "s"
    }), /*#__PURE__*/_react.default.createElement("ul", null, cause.map((causeMsg, i) => /*#__PURE__*/_react.default.createElement("li", {
      key: i
    }, causeMsg))))),
    iconType: "alert",
    actions: actions
  }, rest)));

  if (isCentered) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: _public.APP_WRAPPER_CLASS
    }, errorContent);
  }

  return errorContent;
};

exports.PageError = PageError;