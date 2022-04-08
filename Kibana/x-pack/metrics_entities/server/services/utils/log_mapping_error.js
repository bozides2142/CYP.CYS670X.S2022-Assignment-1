"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logMappingError = void 0;

var _get_json = require("./get_json");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const logMappingError = ({
  logger,
  id,
  message,
  error,
  postBody
}) => {
  const postString = postBody != null ? `, post body: "${(0, _get_json.getJSON)(postBody)}"` : '';
  logger.error(`${message}, mapping id: "${id}"${postString}, error: ${(0, _get_json.getJSON)(error)}`);
};

exports.logMappingError = logMappingError;