"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectShortUrlStorage = void 0;

var _legacy_short_url_locator = require("../../../../common/url_service/locators/legacy_short_url_locator");

var _util = require("../util");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createShortUrlData = savedObject => {
  const attributes = savedObject.attributes;

  if (!!attributes.url) {
    const {
      url,
      ...rest
    } = attributes;
    const state = {
      url
    };
    return {
      id: savedObject.id,
      slug: savedObject.id,
      locator: {
        id: _legacy_short_url_locator.LEGACY_SHORT_URL_LOCATOR_ID,
        version: '7.15.0',
        state
      },
      ...rest
    };
  }

  const {
    locatorJSON,
    ...rest
  } = attributes;
  const locator = JSON.parse(locatorJSON);
  return {
    id: savedObject.id,
    locator,
    ...rest
  };
};

const createAttributes = data => {
  const {
    accessCount = 0,
    accessDate = 0,
    createDate = 0,
    slug = '',
    locator
  } = data;
  const attributes = {
    accessCount,
    accessDate,
    createDate,
    slug,
    locatorJSON: locator ? JSON.stringify(locator) : '',
    url: ''
  };
  return attributes;
};

class SavedObjectShortUrlStorage {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  async create(data, {
    references
  } = {}) {
    const {
      savedObjects,
      savedObjectType
    } = this.dependencies;
    const attributes = createAttributes(data);
    const savedObject = await savedObjects.create(savedObjectType, attributes, {
      refresh: true,
      references
    });
    return createShortUrlData(savedObject);
  }

  async update(id, data, {
    references
  } = {}) {
    const {
      savedObjects,
      savedObjectType
    } = this.dependencies;
    const attributes = createAttributes(data);
    await savedObjects.update(savedObjectType, id, attributes, {
      refresh: true,
      references
    });
  }

  async getById(id) {
    const {
      savedObjects,
      savedObjectType
    } = this.dependencies;
    const savedObject = await savedObjects.get(savedObjectType, id);
    return {
      data: createShortUrlData(savedObject),
      references: savedObject.references
    };
  }

  async getBySlug(slug) {
    const {
      savedObjects
    } = this.dependencies;
    const search = `(attributes.slug:"${(0, _util.escapeSearchReservedChars)(slug)}")`;
    const result = await savedObjects.find({
      type: this.dependencies.savedObjectType,
      search
    });

    if (result.saved_objects.length !== 1) {
      throw new Error('not found');
    }

    const savedObject = result.saved_objects[0];
    return {
      data: createShortUrlData(savedObject),
      references: savedObject.references
    };
  }

  async exists(slug) {
    const {
      savedObjects
    } = this.dependencies;
    const search = `(attributes.slug:"${(0, _util.escapeSearchReservedChars)(slug)}")`;
    const result = await savedObjects.find({
      type: this.dependencies.savedObjectType,
      search
    });
    return result.saved_objects.length > 0;
  }

  async delete(id) {
    const {
      savedObjects,
      savedObjectType
    } = this.dependencies;
    await savedObjects.delete(savedObjectType, id);
  }

}

exports.SavedObjectShortUrlStorage = SavedObjectShortUrlStorage;