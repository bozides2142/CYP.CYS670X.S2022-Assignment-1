"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSiemResponse = exports.SiemResponseFactory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Copied from x-pack/plugins/security_solution/server/lib/detection_engine/routes/utils.ts
 * We cannot put this in kbn package just yet as the types from 'src/core/server' aren't a kbn package yet and this would pull in a lot of copied things.
 * TODO: Once more types are moved into kbn package we can move this into a kbn package.
 */

const statusToErrorMessage = statusCode => {
  switch (statusCode) {
    case 400:
      return 'Bad Request';

    case 401:
      return 'Unauthorized';

    case 403:
      return 'Forbidden';

    case 404:
      return 'Not Found';

    case 409:
      return 'Conflict';

    case 500:
      return 'Internal Error';

    default:
      return '(unknown error)';
  }
};
/**
 * Copied from x-pack/plugins/security_solution/server/lib/detection_engine/routes/utils.ts
 * We cannot put this in kbn package just yet as the types from 'src/core/server' aren't a kbn package yet and this would pull in a lot of copied things.
 * TODO: Once more types are moved into kbn package we can move this into a kbn package.
 */


class SiemResponseFactory {
  constructor(response) {
    this.response = response;
  } // eslint-disable-next-line @typescript-eslint/explicit-function-return-type


  error({
    statusCode,
    body,
    headers
  }) {
    // KibanaResponse is not exported so we cannot use a return type here and that is why the linter is turned off above
    const contentType = {
      'content-type': 'application/json'
    };
    const defaultedHeaders = { ...contentType,
      ...(headers !== null && headers !== void 0 ? headers : {})
    };
    return this.response.custom({
      body: Buffer.from(JSON.stringify({
        message: body !== null && body !== void 0 ? body : statusToErrorMessage(statusCode),
        status_code: statusCode
      })),
      headers: defaultedHeaders,
      statusCode
    });
  }

}
/**
 * Copied from x-pack/plugins/security_solution/server/lib/detection_engine/routes/utils.ts
 * We cannot put this in kbn package just yet as the types from 'src/core/server' aren't a kbn package yet and this would pull in a lot of copied things.
 * TODO: Once more types are moved into kbn package we can move this into a kbn package.
 */


exports.SiemResponseFactory = SiemResponseFactory;

const buildSiemResponse = response => new SiemResponseFactory(response);

exports.buildSiemResponse = buildSiemResponse;