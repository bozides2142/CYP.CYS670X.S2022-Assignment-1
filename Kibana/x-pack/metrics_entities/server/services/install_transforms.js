"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installTransforms = void 0;

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installTransforms = async ({
  autoStart,
  esClient,
  frequency,
  indices,
  docsPerSecond,
  logger,
  maxPageSearchSize,
  prefix,
  suffix,
  transforms,
  query,
  sync
}) => {
  for (const transform of transforms) {
    var _transform$dest$index, _transform$dest;

    const destIndex = (_transform$dest$index = transform === null || transform === void 0 ? void 0 : (_transform$dest = transform.dest) === null || _transform$dest === void 0 ? void 0 : _transform$dest.index) !== null && _transform$dest$index !== void 0 ? _transform$dest$index : transform.id;
    const computedMappingIndex = (0, _utils.computeMappingId)({
      id: destIndex,
      prefix,
      suffix
    });
    const {
      id,
      ...transformNoId
    } = { ...transform,
      ...{
        source: { ...transform.source,
          index: indices,
          query
        }
      },
      ...{
        dest: { ...transform.dest,
          index: computedMappingIndex
        }
      },
      ...{
        settings: { ...transform.settings,
          docs_per_second: docsPerSecond,
          max_page_search_size: maxPageSearchSize
        }
      },
      frequency,
      sync
    };
    const computedName = (0, _utils.computeTransformId)({
      id,
      prefix,
      suffix
    });
    const exists = await (0, _utils.getTransformExists)(esClient, computedName);

    if (!exists) {
      try {
        (0, _utils.logTransformInfo)({
          id: computedName,
          logger,
          message: 'does not exist, creating the transform'
        });
        await esClient.transform.putTransform({
          body: transformNoId,
          defer_validation: true,
          transform_id: computedName
        });

        if (autoStart) {
          (0, _utils.logTransformInfo)({
            id: computedName,
            logger,
            message: 'is being auto started'
          });
          await esClient.transform.startTransform({
            transform_id: computedName
          });
        } else {
          (0, _utils.logTransformInfo)({
            id: computedName,
            logger,
            message: 'is not being auto started'
          });
        }
      } catch (error) {
        (0, _utils.logTransformError)({
          error,
          id: computedName,
          logger,
          message: 'Could not create and/or start',
          postBody: transformNoId
        });
      }
    } else {
      (0, _utils.logTransformDebug)({
        id: computedName,
        logger,
        message: 'already exists. It will not be recreated'
      });
    }
  }
};

exports.installTransforms = installTransforms;