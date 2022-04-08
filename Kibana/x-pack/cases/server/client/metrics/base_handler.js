"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseHandler = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class BaseHandler {
  constructor(options, features) {
    this.options = options;
    this.features = features;
  }

  getFeatures() {
    return new Set(this.features);
  }

}

exports.BaseHandler = BaseHandler;