"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveTemplate = exports.doesTemplateExist = void 0;

var _lib = require("../../../../common/lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const doesTemplateExist = async ({
  name,
  client,
  isLegacy
}) => {
  if (isLegacy) {
    return await client.asCurrentUser.indices.existsTemplate({
      name
    });
  }

  return await client.asCurrentUser.indices.existsIndexTemplate({
    name
  });
};

exports.doesTemplateExist = doesTemplateExist;

const saveTemplate = async ({
  template,
  client,
  isLegacy
}) => {
  const serializedTemplate = isLegacy ? (0, _lib.serializeLegacyTemplate)(template) : (0, _lib.serializeTemplate)(template);

  if (isLegacy) {
    const {
      order,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      index_patterns,
      version,
      settings,
      mappings,
      aliases
    } = serializedTemplate;
    return await client.asCurrentUser.indices.putTemplate({
      name: template.name,
      order,
      body: {
        index_patterns,
        version,
        settings,
        mappings,
        aliases
      }
    });
  }

  return await client.asCurrentUser.indices.putIndexTemplate({
    name: template.name,
    // @ts-expect-error LegacyTemplateSerialized | TemplateSerialized conflicts with @elastic/elasticsearch IndicesPutIndexTemplateRequest
    body: serializedTemplate
  });
};

exports.saveTemplate = saveTemplate;