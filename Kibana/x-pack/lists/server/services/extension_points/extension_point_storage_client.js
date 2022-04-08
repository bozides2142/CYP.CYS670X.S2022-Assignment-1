"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtensionPointStorageClient = void 0;

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ExtensionPointStorageClient {
  constructor(storage, logger) {
    this.storage = storage;
    this.logger = logger;
  }
  /**
   * Retrieve a list (`Set`) of extension points that are registered for a given type
   * @param extensionType
   */


  get(extensionType) {
    return this.storage.get(extensionType);
  }
  /**
   * Runs a set of callbacks by piping the Response from one extension point callback to the next callback
   * and finally returning the last callback payload.
   *
   * @param extensionType
   * @param initialCallbackInput The initial argument given to the first extension point callback
   * @param callbackContext
   * @param callbackResponseValidator A function to validate the returned data from an extension point callback
   */


  async pipeRun(extensionType, initialCallbackInput, callbackContext, callbackResponseValidator) {
    let inputArgument = initialCallbackInput;
    const externalExtensions = this.get(extensionType);

    if (!externalExtensions || externalExtensions.size === 0) {
      return inputArgument;
    }

    for (const externalExtension of externalExtensions) {
      const extensionRegistrationSource = this.storage.getExtensionRegistrationSource(externalExtension);
      inputArgument = await externalExtension.callback({
        context: callbackContext,
        data: inputArgument
      });

      if (callbackResponseValidator) {
        // Before calling the next one, make sure the returned payload is valid
        const validationError = callbackResponseValidator(inputArgument);

        if (validationError) {
          this.logger.error(new _errors.ExtensionPointError(`Extension point for ${externalExtension.type} returned data that failed validation: ${extensionRegistrationSource}`, {
            validationError
          }));
          throw validationError;
        }
      }
    }

    return inputArgument;
  }

}

exports.ExtensionPointStorageClient = ExtensionPointStorageClient;