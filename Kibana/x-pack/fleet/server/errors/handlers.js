"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultIngestErrorHandler = void 0;
exports.ingestErrorToResponseOptions = ingestErrorToResponseOptions;

var _boom = require("@hapi/boom");

var _services = require("../services");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// unsure if this is correct. would prefer to use something "official"
// this type is based on BadRequest values observed while debugging https://github.com/elastic/kibana/issues/75862


const getHTTPResponseCode = error => {
  if (error instanceof _index.RegistryResponseError) {
    // 4xx/5xx's from EPR
    return 500;
  }

  if (error instanceof _index.RegistryConnectionError || error instanceof _index.RegistryError) {
    // Connection errors (ie. RegistryConnectionError) / fallback  (RegistryError) from EPR
    return 502; // Bad Gateway
  }

  if (error instanceof _index.PackageNotFoundError) {
    return 404; // Not Found
  }

  if (error instanceof _index.AgentPolicyNameExistsError) {
    return 409; // Conflict
  }

  if (error instanceof _index.PackageUnsupportedMediaTypeError) {
    return 415; // Unsupported Media Type
  }

  if (error instanceof _index.ConcurrentInstallOperationError) {
    return 409; // Conflict
  }

  if (error instanceof _index.AgentNotFoundError) {
    return 404;
  }

  return 400; // Bad Request
};

function ingestErrorToResponseOptions(error) {
  const logger = _services.appContextService.getLogger(); // our "expected" errors


  if (error instanceof _index.IngestManagerError) {
    // only log the message
    logger.error(error.message);
    return {
      statusCode: getHTTPResponseCode(error),
      body: {
        message: error.message
      }
    };
  } // handle any older Boom-based errors or the few places our app uses them


  if ((0, _boom.isBoom)(error)) {
    // only log the message
    logger.error(error.output.payload.message);
    return {
      statusCode: error.output.statusCode,
      body: {
        message: error.output.payload.message
      }
    };
  } // not sure what type of error this is. log as much as possible


  logger.error(error);
  return {
    statusCode: 500,
    body: {
      message: error.message
    }
  };
}

const defaultIngestErrorHandler = async ({
  error,
  response
}) => {
  const options = ingestErrorToResponseOptions(error);
  return response.customError(options);
};

exports.defaultIngestErrorHandler = defaultIngestErrorHandler;