"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransforms = void 0;

var _constants = require("../../common/constants");

var _get_metrics_entities_client = require("./utils/get_metrics_entities_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns all transforms from all modules
 * TODO: Add support for specific modules and prefix
 * @param router The router to get the collection of transforms
 */


const getTransforms = router => {
  router.get({
    path: _constants.METRICS_ENTITIES_TRANSFORMS,
    // TODO: Add the validation instead of false
    // TODO: Add the prefix and module support
    validate: false
  }, async (context, _, response) => {
    const metrics = (0, _get_metrics_entities_client.getMetricsEntitiesClient)(context);
    const summaries = await metrics.getTransforms();
    return response.ok({
      body: {
        summaries
      }
    });
  });
};

exports.getTransforms = getTransforms;