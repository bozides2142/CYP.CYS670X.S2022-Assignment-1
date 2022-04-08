"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uninstallTransforms = void 0;

var _std = require("@kbn/std");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Uninstalls all the transforms underneath a given module
 */


const uninstallTransforms = async ({
  esClient,
  logger,
  prefix,
  suffix,
  transforms
}) => {
  await (0, _std.asyncForEach)(transforms, async transform => {
    const {
      id
    } = transform;
    const computedId = (0, _utils.computeTransformId)({
      id,
      prefix,
      suffix
    });
    const exists = await (0, _utils.getTransformExists)(esClient, computedId);

    if (exists) {
      (0, _utils.logTransformInfo)({
        id: computedId,
        logger,
        message: 'stopping transform'
      });

      try {
        await esClient.transform.stopTransform({
          allow_no_match: true,
          force: true,
          timeout: '5s',
          transform_id: computedId,
          wait_for_completion: true
        });
      } catch (error) {
        (0, _utils.logTransformError)({
          error,
          id: computedId,
          logger,
          message: 'Could not stop transform, still attempting to delete it',
          postBody: undefined
        });
      }

      (0, _utils.logTransformInfo)({
        id: computedId,
        logger,
        message: 'deleting transform'
      });

      try {
        await esClient.transform.deleteTransform({
          force: true,
          transform_id: computedId
        });
      } catch (error) {
        (0, _utils.logTransformError)({
          error,
          id: computedId,
          logger,
          message: 'Could not create and/or start',
          postBody: undefined
        });
      }
    } else {
      (0, _utils.logTransformInfo)({
        id: computedId,
        logger,
        message: 'transform does not exist to delete'
      });
    }
  });
};

exports.uninstallTransforms = uninstallTransforms;