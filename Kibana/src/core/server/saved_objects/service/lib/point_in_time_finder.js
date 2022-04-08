"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointInTimeFinder = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

var _log = /*#__PURE__*/new WeakMap();

var _client = /*#__PURE__*/new WeakMap();

var _findOptions = /*#__PURE__*/new WeakMap();

var _open = /*#__PURE__*/new WeakMap();

var _pitId = /*#__PURE__*/new WeakMap();

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @public
 */

/**
 * @public
 */

/**
 * @internal
 */

/**
 * @internal
 */

/** @public */

/**
 * @internal
 */
class PointInTimeFinder {
  constructor(findOptions, {
    logger,
    client
  }) {
    _classPrivateFieldInitSpec(this, _log, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _findOptions, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _open, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _pitId, {
      writable: true,
      value: void 0
    });

    (0, _classPrivateFieldSet2.default)(this, _log, logger.get('point-in-time-finder'));
    (0, _classPrivateFieldSet2.default)(this, _client, client);
    (0, _classPrivateFieldSet2.default)(this, _findOptions, {
      // Default to 1000 items per page as a tradeoff between
      // speed and memory consumption.
      perPage: 1000,
      ...findOptions
    });
  }

  async *find() {
    if ((0, _classPrivateFieldGet2.default)(this, _open)) {
      throw new Error('Point In Time has already been opened for this finder instance. ' + 'Please call `close()` before calling `find()` again.');
    } // Open PIT and request our first page of hits


    await this.open();
    let lastResultsCount;
    let lastHitSortValue;

    do {
      const results = await this.findNext({
        findOptions: (0, _classPrivateFieldGet2.default)(this, _findOptions),
        id: (0, _classPrivateFieldGet2.default)(this, _pitId),
        searchAfter: lastHitSortValue
      });
      (0, _classPrivateFieldSet2.default)(this, _pitId, results.pit_id);
      lastResultsCount = results.saved_objects.length;
      lastHitSortValue = this.getLastHitSortValue(results);
      (0, _classPrivateFieldGet2.default)(this, _log).debug(`Collected [${lastResultsCount}] saved objects`); // Close PIT if this was our last page

      if ((0, _classPrivateFieldGet2.default)(this, _pitId) && lastResultsCount < (0, _classPrivateFieldGet2.default)(this, _findOptions).perPage) {
        await this.close();
      }

      yield results; // We've reached the end when there are fewer hits than our perPage size,
      // or when `close()` has been called.
    } while ((0, _classPrivateFieldGet2.default)(this, _open) && lastResultsCount >= (0, _classPrivateFieldGet2.default)(this, _findOptions).perPage);

    return;
  }

  async close() {
    try {
      if ((0, _classPrivateFieldGet2.default)(this, _pitId)) {
        (0, _classPrivateFieldGet2.default)(this, _log).debug(`Closing PIT for types [${(0, _classPrivateFieldGet2.default)(this, _findOptions).type}]`);
        await (0, _classPrivateFieldGet2.default)(this, _client).closePointInTime((0, _classPrivateFieldGet2.default)(this, _pitId));
        (0, _classPrivateFieldSet2.default)(this, _pitId, undefined);
      }

      (0, _classPrivateFieldSet2.default)(this, _open, false);
    } catch (e) {
      (0, _classPrivateFieldGet2.default)(this, _log).error(`Failed to close PIT for types [${(0, _classPrivateFieldGet2.default)(this, _findOptions).type}]`);
      throw e;
    }
  }

  async open() {
    try {
      const {
        id
      } = await (0, _classPrivateFieldGet2.default)(this, _client).openPointInTimeForType((0, _classPrivateFieldGet2.default)(this, _findOptions).type, {
        namespaces: (0, _classPrivateFieldGet2.default)(this, _findOptions).namespaces
      });
      (0, _classPrivateFieldSet2.default)(this, _pitId, id);
      (0, _classPrivateFieldSet2.default)(this, _open, true);
    } catch (e) {
      var _e$output;

      // Since `find` swallows 404s, it is expected that finder will do the same,
      // so we only rethrow non-404 errors here.
      if (((_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.statusCode) !== 404) {
        (0, _classPrivateFieldGet2.default)(this, _log).error(`Failed to open PIT for types [${(0, _classPrivateFieldGet2.default)(this, _findOptions).type}]`);
        throw e;
      }

      (0, _classPrivateFieldGet2.default)(this, _log).debug(`Unable to open PIT for types [${(0, _classPrivateFieldGet2.default)(this, _findOptions).type}]: 404 ${e}`);
    }
  }

  async findNext({
    findOptions,
    id,
    searchAfter
  }) {
    try {
      return await (0, _classPrivateFieldGet2.default)(this, _client).find({
        // Sort fields are required to use searchAfter, so we set some defaults here
        sortField: 'updated_at',
        sortOrder: 'desc',
        // Bump keep_alive by 2m on every new request to allow for the ES client
        // to make multiple retries in the event of a network failure.
        pit: id ? {
          id,
          keepAlive: '2m'
        } : undefined,
        searchAfter,
        ...findOptions
      });
    } catch (e) {
      if (id) {
        // Clean up PIT on any errors.
        await this.close();
      }

      throw e;
    }
  }

  getLastHitSortValue(res) {
    if (res.saved_objects.length < 1) {
      return undefined;
    }

    return res.saved_objects[res.saved_objects.length - 1].sort;
  }

}

exports.PointInTimeFinder = PointInTimeFinder;