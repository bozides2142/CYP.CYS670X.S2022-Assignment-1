"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryShortUrlStorage = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _uuid = require("uuid");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const clone = obj => JSON.parse(JSON.stringify(obj));

class MemoryShortUrlStorage {
  constructor() {
    (0, _defineProperty2.default)(this, "urls", new Map());
  }

  async create(data, {
    references = []
  } = {}) {
    const id = (0, _uuid.v4)();
    const url = {
      data: { ...data,
        id
      },
      references
    };
    this.urls.set(id, url);
    return clone(url.data);
  }

  async update(id, data, {
    references
  } = {}) {
    const so = await this.getById(id);
    Object.assign(so.data, data);
    if (references) so.references = references;
    this.urls.set(id, so);
  }

  async getById(id) {
    if (!this.urls.has(id)) {
      throw new Error(`No short url with id "${id}"`);
    }

    return clone(this.urls.get(id));
  }

  async getBySlug(slug) {
    for (const url of this.urls.values()) {
      if (url.data.slug === slug) {
        return clone(url);
      }
    }

    throw new Error(`No short url with slug "${slug}".`);
  }

  async exists(slug) {
    for (const url of this.urls.values()) {
      if (url.data.slug === slug) {
        return true;
      }
    }

    return false;
  }

  async delete(id) {
    this.urls.delete(id);
  }

}

exports.MemoryShortUrlStorage = MemoryShortUrlStorage;