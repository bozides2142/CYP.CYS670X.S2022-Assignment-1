"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertHistoryIndexTemplate = createAlertHistoryIndexTemplate;
exports.getAlertHistoryIndexTemplate = getAlertHistoryIndexTemplate;

var _common = require("../../../common");

var _mappings = _interopRequireDefault(require("./mappings.json"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAlertHistoryIndexTemplate() {
  return {
    index_patterns: [`${_common.ALERT_HISTORY_PREFIX}*`],
    _meta: {
      description: 'System generated mapping for preconfigured alert history Elasticsearch index connector.'
    },
    template: {
      settings: {
        number_of_shards: 1,
        auto_expand_replicas: '0-1'
      },
      mappings: _mappings.default
    }
  };
}

async function doesIndexTemplateExist({
  client,
  templateName
}) {
  let result;

  try {
    result = (await client.indices.existsIndexTemplate({
      name: templateName
    })).body;
  } catch (err) {
    throw new Error(`error checking existence of index template: ${err.message}`);
  }

  return result;
}

async function createIndexTemplate({
  client,
  template,
  templateName
}) {
  try {
    await client.indices.putIndexTemplate({
      name: templateName,
      body: template,
      // @ts-expect-error doesn't exist in @elastic/elasticsearch
      create: true
    });
  } catch (err) {
    // The error message doesn't have a type attribute we can look to guarantee it's due
    // to the template already existing (only long message) so we'll check ourselves to see
    // if the template now exists. This scenario would happen if you startup multiple Kibana
    // instances at the same time.
    const existsNow = await doesIndexTemplateExist({
      client,
      templateName
    });

    if (!existsNow) {
      throw new Error(`error creating index template: ${err.message}`);
    }
  }
}

async function createIndexTemplateIfNotExists({
  client,
  template,
  templateName
}) {
  const indexTemplateExists = await doesIndexTemplateExist({
    client,
    templateName
  });

  if (!indexTemplateExists) {
    await createIndexTemplate({
      client,
      template,
      templateName
    });
  }
}

async function createAlertHistoryIndexTemplate({
  client,
  logger
}) {
  try {
    const indexTemplate = getAlertHistoryIndexTemplate();
    await createIndexTemplateIfNotExists({
      client,
      templateName: `${_common.ALERT_HISTORY_PREFIX}template`,
      template: indexTemplate
    });
  } catch (err) {
    logger.error(`Could not initialize alert history index with mappings: ${err.message}.`);
  }
}