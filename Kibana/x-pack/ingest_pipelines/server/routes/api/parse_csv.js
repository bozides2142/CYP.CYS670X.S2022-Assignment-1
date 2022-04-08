"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerParseCsvRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  file: _configSchema.schema.string(),
  copyAction: _configSchema.schema.string()
});

const registerParseCsvRoute = ({
  router
}) => {
  router.post({
    path: `${_constants.API_BASE_PATH}/parse_csv`,
    validate: {
      body: bodySchema
    }
  }, async (contxt, req, res) => {
    const {
      file,
      copyAction
    } = req.body;

    try {
      const result = (0, _lib.csvToIngestPipeline)(file, copyAction);
      return res.ok({
        body: result
      });
    } catch (error) {
      return res.badRequest({
        body: error.message
      });
    }
  });
};

exports.registerParseCsvRoute = registerParseCsvRoute;