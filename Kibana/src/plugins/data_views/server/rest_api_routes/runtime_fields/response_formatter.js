"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseFormatter = void 0;

var _constants = require("../../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const responseFormatter = ({
  serviceKey,
  field,
  dataView
}) => {
  const response = {
    body: {
      fields: [field.toSpec()],
      [_constants.SERVICE_KEY]: dataView.toSpec()
    }
  };
  const legacyResponse = {
    body: {
      [_constants.SERVICE_KEY_LEGACY]: dataView.toSpec(),
      field: field.toSpec()
    }
  };
  return serviceKey === _constants.SERVICE_KEY_LEGACY ? legacyResponse : response;
};

exports.responseFormatter = responseFormatter;