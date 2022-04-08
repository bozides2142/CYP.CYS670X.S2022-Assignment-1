"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageCollector = void 0;

var _collector = require("./collector");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @private Only used in fixtures as a type
 */
class UsageCollector extends _collector.Collector {
  constructor(log, // Needed because it doesn't affect on anything here but being explicit creates a lot of pain down the line
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectorOptions) {
    super(log, collectorOptions);
  }

}

exports.UsageCollector = UsageCollector;