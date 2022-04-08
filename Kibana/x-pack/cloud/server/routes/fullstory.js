"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFullStoryLibraryFactory = exports.registerFullstoryRoute = exports.FULLSTORY_LIBRARY_PATH = void 0;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _crypto = require("crypto");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
/** @internal exported for testing */

const FULLSTORY_LIBRARY_PATH = _path.default.join(__dirname, '..', 'assets', 'fullstory_library.js');
/** @internal exported for testing */


exports.FULLSTORY_LIBRARY_PATH = FULLSTORY_LIBRARY_PATH;

const renderFullStoryLibraryFactory = (dist = true) => (0, _lodash.once)(async () => {
  const srcBuffer = await _promises.default.readFile(FULLSTORY_LIBRARY_PATH);
  const hash = (0, _crypto.createHash)('sha1');
  hash.update(srcBuffer);
  const hashDigest = hash.digest('hex');
  return {
    body: srcBuffer,
    // In dist mode, return a long max-age, otherwise use etag + must-revalidate
    headers: dist ? {
      'cache-control': `max-age=${DAY * 365}`
    } : {
      'cache-control': 'must-revalidate',
      etag: hashDigest
    }
  };
});

exports.renderFullStoryLibraryFactory = renderFullStoryLibraryFactory;

const registerFullstoryRoute = ({
  httpResources,
  packageInfo
}) => {
  const renderFullStoryLibrary = renderFullStoryLibraryFactory(packageInfo.dist);
  /**
   * Register a custom JS endpoint in order to acheive best caching possible with `max-age` similar to plugin bundles.
   */

  httpResources.register({
    // Use the build number in the URL path to leverage max-age caching on production builds
    path: `/internal/cloud/${packageInfo.buildNum}/fullstory.js`,
    validate: false,
    options: {
      authRequired: false
    }
  }, async (context, req, res) => {
    try {
      return res.renderJs(await renderFullStoryLibrary());
    } catch (e) {
      return res.customError({
        body: `Could not load FullStory library from disk due to error: ${e.toString()}`,
        statusCode: 500
      });
    }
  });
};

exports.registerFullstoryRoute = registerFullstoryRoute;