"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexDataEnricher = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class IndexDataEnricher {
  constructor() {
    (0, _defineProperty2.default)(this, "_enrichers", []);
    (0, _defineProperty2.default)(this, "enrichIndices", async (indices, client) => {
      let enrichedIndices = indices;

      for (let i = 0; i < this.enrichers.length; i++) {
        const dataEnricher = this.enrichers[i];

        try {
          const dataEnricherResponse = await dataEnricher(enrichedIndices, client);
          enrichedIndices = dataEnricherResponse;
        } catch (e) {// silently swallow enricher response errors
        }
      }

      return enrichedIndices;
    });
  }

  add(enricher) {
    this._enrichers.push(enricher);
  }

  get enrichers() {
    return this._enrichers;
  }

}

exports.IndexDataEnricher = IndexDataEnricher;