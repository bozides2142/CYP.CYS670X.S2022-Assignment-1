"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeEs = initializeEs;
exports.parseIndexAliases = parseIndexAliases;

var _std = require("@kbn/std");

var _lodash = require("lodash");

var _documents = require("./documents");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function initializeEs(esContext) {
  esContext.logger.debug('initializing elasticsearch resources starting');

  try {
    await initializeEsResources(esContext);
  } catch (err) {
    esContext.logger.error(`error initializing elasticsearch resources: ${err.message}`);
    return false;
  }

  esContext.logger.debug('initializing elasticsearch resources complete');
  return true;
}

async function initializeEsResources(esContext) {
  const steps = new EsInitializationSteps(esContext);
  await steps.setExistingAssetsToHidden();
  await steps.createIlmPolicyIfNotExists();
  await steps.createIndexTemplateIfNotExists();
  await steps.createInitialIndexIfNotExists();
}

function parseIndexAliases(aliasInfo) {
  return Object.keys(aliasInfo).flatMap(indexName => Object.keys(aliasInfo[indexName].aliases).map(alias => ({ ...aliasInfo[indexName].aliases[alias],
    indexName,
    alias
  })));
}

class EsInitializationSteps {
  constructor(esContext) {
    this.esContext = esContext;
    this.esContext = esContext;
  }

  async setExistingIndexTemplatesToHidden() {
    let indexTemplates = {};

    try {
      // look up existing index templates and update index.hidden to true if that
      // setting is currently false or undefined
      // since we are updating to the new index template API and converting new event log
      // indices to hidden in the same PR, we only need to use the legacy template API to
      // look for and update existing event log indices.
      indexTemplates = await this.esContext.esAdapter.getExistingLegacyIndexTemplates(this.esContext.esNames.indexPattern);
    } catch (err) {
      // errors when trying to get existing index templates
      // should not block the rest of initialization, log the error and move on
      this.esContext.logger.error(`error getting existing index templates - ${err.message}`);
    }

    await (0, _std.asyncForEach)(Object.keys(indexTemplates), async indexTemplateName => {
      try {
        var _indexTemplates$index, _indexTemplates$index2, _indexTemplates$index3;

        const hidden = (_indexTemplates$index = indexTemplates[indexTemplateName]) === null || _indexTemplates$index === void 0 ? void 0 : (_indexTemplates$index2 = _indexTemplates$index.settings) === null || _indexTemplates$index2 === void 0 ? void 0 : (_indexTemplates$index3 = _indexTemplates$index2.index) === null || _indexTemplates$index3 === void 0 ? void 0 : _indexTemplates$index3.hidden; // Check to see if this index template is hidden

        if (hidden !== true && hidden !== 'true') {
          this.esContext.logger.debug(`setting existing "${indexTemplateName}" index template to hidden.`);
          await this.esContext.esAdapter.setLegacyIndexTemplateToHidden(indexTemplateName, indexTemplates[indexTemplateName]);
        }
      } catch (err) {
        // errors when trying to update existing index templates to hidden
        // should not block the rest of initialization, log the error and move on
        this.esContext.logger.error(`error setting existing "${indexTemplateName}" index template to hidden - ${err.message}`);
      }
    });
  }

  async setExistingIndicesToHidden() {
    let indices = {};

    try {
      // look up existing indices and update index.hidden to true if that
      // setting is currently false or undefined
      indices = await this.esContext.esAdapter.getExistingIndices(this.esContext.esNames.indexPattern);
    } catch (err) {
      // errors when trying to get existing indices
      // should not block the rest of initialization, log the error and move on
      this.esContext.logger.error(`error getting existing indices - ${err.message}`);
    }

    await (0, _std.asyncForEach)(Object.keys(indices), async indexName => {
      try {
        var _indices$indexName, _indices$indexName$se, _indices$indexName$se2;

        const hidden = (_indices$indexName = indices[indexName]) === null || _indices$indexName === void 0 ? void 0 : (_indices$indexName$se = _indices$indexName.settings) === null || _indices$indexName$se === void 0 ? void 0 : (_indices$indexName$se2 = _indices$indexName$se.index) === null || _indices$indexName$se2 === void 0 ? void 0 : _indices$indexName$se2.hidden; // Check to see if this index template is hidden

        if (hidden !== true && hidden !== 'true') {
          this.esContext.logger.debug(`setting existing ${indexName} index to hidden.`);
          await this.esContext.esAdapter.setIndexToHidden(indexName);
        }
      } catch (err) {
        // errors when trying to update existing indices to hidden
        // should not block the rest of initialization, log the error and move on
        this.esContext.logger.error(`error setting existing "${indexName}" index to hidden - ${err.message}`);
      }
    });
  }

  async setExistingIndexAliasesToHidden() {
    let indexAliases = {};

    try {
      // Look up existing index aliases and update index.is_hidden to true if that
      // setting is currently false or undefined
      indexAliases = await this.esContext.esAdapter.getExistingIndexAliases(this.esContext.esNames.indexPattern);
    } catch (err) {
      // errors when trying to get existing index aliases
      // should not block the rest of initialization, log the error and move on
      this.esContext.logger.error(`error getting existing index aliases - ${err.message}`);
    } // Flatten the results so we can group by index alias


    const parsedAliasData = parseIndexAliases(indexAliases); // Group by index alias name

    const indexAliasData = (0, _lodash.groupBy)(parsedAliasData, 'alias');
    await (0, _std.asyncForEach)(Object.keys(indexAliasData), async aliasName => {
      try {
        const aliasData = indexAliasData[aliasName];
        const isNotHidden = aliasData.some(data => data.is_hidden !== true);

        if (isNotHidden) {
          this.esContext.logger.debug(`setting existing "${aliasName}" index alias to hidden.`);
          await this.esContext.esAdapter.setIndexAliasToHidden(aliasName, indexAliasData[aliasName]);
        }
      } catch (err) {
        // errors when trying to set existing index aliases to is_hidden
        // should not block the rest of initialization, log the error and move on
        this.esContext.logger.error(`error setting existing "${aliasName}" index aliases - ${err.message}`);
      }
    });
  }

  async setExistingAssetsToHidden() {
    await this.setExistingIndexTemplatesToHidden();
    await this.setExistingIndicesToHidden();
    await this.setExistingIndexAliasesToHidden();
  }

  async createIlmPolicyIfNotExists() {
    const exists = await this.esContext.esAdapter.doesIlmPolicyExist(this.esContext.esNames.ilmPolicy);

    if (!exists) {
      await this.esContext.esAdapter.createIlmPolicy(this.esContext.esNames.ilmPolicy, (0, _documents.getIlmPolicy)());
    }
  }

  async createIndexTemplateIfNotExists() {
    const exists = await this.esContext.esAdapter.doesIndexTemplateExist(this.esContext.esNames.indexTemplate);

    if (!exists) {
      const templateBody = (0, _documents.getIndexTemplate)(this.esContext.esNames);
      await this.esContext.esAdapter.createIndexTemplate(this.esContext.esNames.indexTemplate, templateBody);
    }
  }

  async createInitialIndexIfNotExists() {
    const exists = await this.esContext.esAdapter.doesAliasExist(this.esContext.esNames.alias);

    if (!exists) {
      await this.esContext.esAdapter.createIndex(this.esContext.esNames.initialIndex, {
        aliases: {
          [this.esContext.esNames.alias]: {
            is_write_index: true,
            is_hidden: true
          }
        }
      });
    }
  }

}