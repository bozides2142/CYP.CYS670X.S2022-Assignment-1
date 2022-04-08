"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleErrorResponse = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getErrorMessage = (errBody, defaultMessage) => {
  if (typeof errBody === 'string') {
    return errBody;
  } else {
    if (errBody.caused_by) {
      return getErrorMessage(errBody.caused_by, errBody.reason);
    }

    return errBody.reason || defaultMessage;
  }
};

const handleErrorResponse = panel => error => {
  const result = {};

  if (error.errBody) {
    const errorResponse = typeof error.errBody === 'string' ? error.errBody : getErrorMessage(error.errBody.error);
    result[panel.id] = {
      id: panel.id,
      error: errorResponse !== null && errorResponse !== void 0 ? errorResponse : _i18n.i18n.translate('visTypeTimeseries.handleErrorResponse.unexpectedError', {
        defaultMessage: 'Unexpected error'
      }),
      series: []
    };
  }

  return result;
};

exports.handleErrorResponse = handleErrorResponse;