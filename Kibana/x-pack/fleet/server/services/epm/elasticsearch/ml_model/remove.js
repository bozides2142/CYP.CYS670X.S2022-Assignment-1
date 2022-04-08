"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMlModel = void 0;

var _app_context = require("../../../app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteMlModel = async (esClient, mlModelIds) => {
  const logger = _app_context.appContextService.getLogger();

  if (mlModelIds.length) {
    logger.info(`Deleting currently installed ml model ids ${mlModelIds}`);
  }

  await Promise.all(mlModelIds.map(async modelId => {
    await esClient.ml.deleteTrainedModel({
      model_id: modelId
    }, {
      ignore: [404]
    });
    logger.info(`Deleted: ${modelId}`);
  }));
};

exports.deleteMlModel = deleteMlModel;