"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLocatorUrl = void 0;

var _react = require("react");

var _useMountedState = _interopRequireDefault(require("react-use/lib/useMountedState"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const useLocatorUrl = (locator, params, getUrlParams, deps = []) => {
  const [url, setUrl] = (0, _react.useState)('');
  const isMounted = (0, _useMountedState.default)();
  /* eslint-disable react-hooks/exhaustive-deps */

  (0, _react.useEffect)(() => {
    if (!locator) {
      setUrl('');
      return;
    }

    locator.getUrl(params, getUrlParams).then(result => {
      if (!isMounted()) return;
      setUrl(result);
    }).catch(error => {
      if (!isMounted()) return; // eslint-disable-next-line no-console

      console.error('useLocatorUrl', error);
      setUrl('');
    });
  }, [locator, ...deps]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return url;
};

exports.useLocatorUrl = useLocatorUrl;