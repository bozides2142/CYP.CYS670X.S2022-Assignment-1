"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureDefaultComponentTemplate = ensureDefaultComponentTemplate;
exports.getAllTemplateRefs = getAllTemplateRefs;
exports.installTemplate = installTemplate;
exports.installTemplateForDataStream = installTemplateForDataStream;
exports.installTemplates = void 0;

var _lodash = require("lodash");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _types = require("../../../../types");

var _field = require("../../fields/field");

var _install = require("../ingest_pipeline/install");

var _archive = require("../../archive");

var _install2 = require("../../packages/install");

var _constants = require("../../../../constants");

var _meta2 = require("../meta");

var _retry = require("../retry");

var _packages = require("../../packages");

var _template = require("./template");

var _default_settings = require("./default_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installTemplates = async (installablePackage, esClient, logger, paths, savedObjectsClient) => {
  // install any pre-built index template assets,
  // atm, this is only the base package's global index templates
  // Install component templates first, as they are used by the index templates
  await installPreBuiltComponentTemplates(paths, esClient, logger);
  await installPreBuiltTemplates(paths, esClient, logger); // remove package installation's references to index templates

  await (0, _install2.removeAssetTypesFromInstalledEs)(savedObjectsClient, installablePackage.name, [_types.ElasticsearchAssetType.indexTemplate, _types.ElasticsearchAssetType.componentTemplate]); // build templates per data stream from yml files

  const dataStreams = installablePackage.data_streams;
  if (!dataStreams) return [];
  const packageInfo = await (0, _packages.getPackageInfo)({
    savedObjectsClient,
    pkgName: installablePackage.name,
    pkgVersion: installablePackage.version
  });
  const installedTemplatesNested = await Promise.all(dataStreams.map(dataStream => installTemplateForDataStream({
    pkg: packageInfo,
    esClient,
    logger,
    dataStream
  })));
  const installedTemplates = installedTemplatesNested.flat(); // get template refs to save

  const installedIndexTemplateRefs = getAllTemplateRefs(installedTemplates); // add package installation's references to index templates

  await (0, _install2.saveInstalledEsRefs)(savedObjectsClient, installablePackage.name, installedIndexTemplateRefs);
  return installedTemplates;
};

exports.installTemplates = installTemplates;

const installPreBuiltTemplates = async (paths, esClient, logger) => {
  const templatePaths = paths.filter(path => isTemplate(path));
  const templateInstallPromises = templatePaths.map(async path => {
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const templateName = file.substr(0, file.lastIndexOf('.'));
    const content = JSON.parse((0, _archive.getAsset)(path).toString('utf8'));
    const esClientParams = {
      name: templateName,
      body: content
    };
    const esClientRequestOptions = {
      ignore: [404]
    };

    if (content.hasOwnProperty('template') || content.hasOwnProperty('composed_of')) {
      // Template is v2
      return (0, _retry.retryTransientEsErrors)(() => esClient.indices.putIndexTemplate(esClientParams, esClientRequestOptions), {
        logger
      });
    } else {
      // template is V1
      return (0, _retry.retryTransientEsErrors)(() => esClient.indices.putTemplate(esClientParams, esClientRequestOptions), {
        logger
      });
    }
  });

  try {
    return await Promise.all(templateInstallPromises);
  } catch (e) {
    throw new _boom.default.Boom(`Error installing prebuilt index templates ${e.message}`, {
      statusCode: 400
    });
  }
};

const installPreBuiltComponentTemplates = async (paths, esClient, logger) => {
  const templatePaths = paths.filter(path => isComponentTemplate(path));
  const templateInstallPromises = templatePaths.map(async path => {
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const templateName = file.substr(0, file.lastIndexOf('.'));
    const content = JSON.parse((0, _archive.getAsset)(path).toString('utf8'));
    const esClientParams = {
      name: templateName,
      body: content
    };
    return (0, _retry.retryTransientEsErrors)(() => esClient.cluster.putComponentTemplate(esClientParams, {
      ignore: [404]
    }), {
      logger
    });
  });

  try {
    return await Promise.all(templateInstallPromises);
  } catch (e) {
    throw new _boom.default.Boom(`Error installing prebuilt component templates ${e.message}`, {
      statusCode: 400
    });
  }
};

const isTemplate = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.indexTemplate;
};

const isComponentTemplate = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.componentTemplate;
};
/**
 * installTemplateForDataStream installs one template for each data stream
 *
 * The template is currently loaded with the pkgkey-package-data_stream
 */


async function installTemplateForDataStream({
  pkg,
  esClient,
  logger,
  dataStream
}) {
  const fields = await (0, _field.loadFieldsFromYaml)(pkg, dataStream.path);
  return installTemplate({
    esClient,
    logger,
    fields,
    dataStream,
    packageVersion: pkg.version,
    packageName: pkg.name
  });
}

function putComponentTemplate(esClient, logger, params) {
  const {
    name,
    body,
    create = false
  } = params;
  return {
    clusterPromise: (0, _retry.retryTransientEsErrors)(() => esClient.cluster.putComponentTemplate({
      name,
      body,
      create
    }, {
      ignore: [404]
    }), {
      logger
    }),
    name
  };
}

const mappingsSuffix = '@mappings';
const settingsSuffix = '@settings';
const userSettingsSuffix = '@custom';

const isUserSettingsTemplate = name => name.endsWith(userSettingsSuffix);

function buildComponentTemplates(params) {
  var _registryElasticsearc;

  const {
    templateName,
    registryElasticsearch,
    packageName,
    defaultSettings
  } = params;
  const mappingsTemplateName = `${templateName}${mappingsSuffix}`;
  const settingsTemplateName = `${templateName}${settingsSuffix}`;
  const userSettingsTemplateName = `${templateName}${userSettingsSuffix}`;
  const templatesMap = {};

  const _meta = (0, _meta2.getESAssetMetadata)({
    packageName
  });

  if (registryElasticsearch && registryElasticsearch['index_template.mappings']) {
    templatesMap[mappingsTemplateName] = {
      template: {
        mappings: registryElasticsearch['index_template.mappings']
      },
      _meta
    };
  }

  templatesMap[settingsTemplateName] = {
    template: {
      settings: (0, _lodash.merge)(defaultSettings, (_registryElasticsearc = registryElasticsearch === null || registryElasticsearch === void 0 ? void 0 : registryElasticsearch['index_template.settings']) !== null && _registryElasticsearc !== void 0 ? _registryElasticsearc : {})
    },
    _meta
  }; // return empty/stub template

  templatesMap[userSettingsTemplateName] = {
    template: {
      settings: {}
    },
    _meta
  };
  return templatesMap;
}

async function installDataStreamComponentTemplates(params) {
  const {
    templateName,
    registryElasticsearch,
    esClient,
    packageName,
    defaultSettings,
    logger
  } = params;
  const templates = buildComponentTemplates({
    templateName,
    registryElasticsearch,
    packageName,
    defaultSettings
  });
  const templateNames = Object.keys(templates);
  const templateEntries = Object.entries(templates); // TODO: Check return values for errors

  await Promise.all(templateEntries.map(async ([name, body]) => {
    if (isUserSettingsTemplate(name)) {
      var _result$body$componen; // look for existing user_settings template


      const result = await (0, _retry.retryTransientEsErrors)(() => esClient.cluster.getComponentTemplate({
        name
      }, {
        ignore: [404]
      }), {
        logger
      });
      const hasUserSettingsTemplate = ((_result$body$componen = result.body.component_templates) === null || _result$body$componen === void 0 ? void 0 : _result$body$componen.length) === 1;

      if (!hasUserSettingsTemplate) {
        // only add if one isn't already present
        const {
          clusterPromise
        } = putComponentTemplate(esClient, logger, {
          body,
          name
        });
        return clusterPromise;
      }
    } else {
      const {
        clusterPromise
      } = putComponentTemplate(esClient, logger, {
        body,
        name
      });
      return clusterPromise;
    }
  }));
  return templateNames;
}

async function ensureDefaultComponentTemplate(esClient, logger) {
  var _getTemplateRes$compo;

  const {
    body: getTemplateRes
  } = await (0, _retry.retryTransientEsErrors)(() => esClient.cluster.getComponentTemplate({
    name: _constants.FLEET_GLOBAL_COMPONENT_TEMPLATE_NAME
  }, {
    ignore: [404]
  }), {
    logger
  });
  const existingTemplate = getTemplateRes === null || getTemplateRes === void 0 ? void 0 : (_getTemplateRes$compo = getTemplateRes.component_templates) === null || _getTemplateRes$compo === void 0 ? void 0 : _getTemplateRes$compo[0];

  if (!existingTemplate) {
    await putComponentTemplate(esClient, logger, {
      name: _constants.FLEET_GLOBAL_COMPONENT_TEMPLATE_NAME,
      body: _constants.FLEET_GLOBAL_COMPONENT_TEMPLATE_CONTENT
    }).clusterPromise;
  }

  return {
    isCreated: !existingTemplate
  };
}

async function installTemplate({
  esClient,
  logger,
  fields,
  dataStream,
  packageVersion,
  packageName
}) {
  var _getTemplateRes$index, _existingIndexTemplat, _existingIndexTemplat2;

  const validFields = (0, _field.processFields)(fields);
  const mappings = (0, _template.generateMappings)(validFields);
  const templateName = (0, _template.generateTemplateName)(dataStream);
  const templateIndexPattern = (0, _template.generateTemplateIndexPattern)(dataStream);
  const templatePriority = (0, _template.getTemplatePriority)(dataStream);
  let pipelineName;

  if (dataStream.ingest_pipeline) {
    pipelineName = (0, _install.getPipelineNameForInstallation)({
      pipelineName: dataStream.ingest_pipeline,
      dataStream,
      packageVersion
    });
  } // Datastream now throw an error if the aliases field is present so ensure that we remove that field.


  const {
    body: getTemplateRes
  } = await (0, _retry.retryTransientEsErrors)(() => esClient.indices.getIndexTemplate({
    name: templateName
  }, {
    ignore: [404]
  }), {
    logger
  });
  const existingIndexTemplate = getTemplateRes === null || getTemplateRes === void 0 ? void 0 : (_getTemplateRes$index = getTemplateRes.index_templates) === null || _getTemplateRes$index === void 0 ? void 0 : _getTemplateRes$index[0];

  if (existingIndexTemplate && existingIndexTemplate.name === templateName && existingIndexTemplate !== null && existingIndexTemplate !== void 0 && (_existingIndexTemplat = existingIndexTemplate.index_template) !== null && _existingIndexTemplat !== void 0 && (_existingIndexTemplat2 = _existingIndexTemplat.template) !== null && _existingIndexTemplat2 !== void 0 && _existingIndexTemplat2.aliases) {
    const updateIndexTemplateParams = {
      name: templateName,
      body: { ...existingIndexTemplate.index_template,
        template: { ...existingIndexTemplate.index_template.template,
          // Remove the aliases field
          aliases: undefined
        }
      }
    };
    await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putIndexTemplate(updateIndexTemplateParams, {
      ignore: [404]
    }), {
      logger
    });
  }

  const defaultSettings = (0, _default_settings.buildDefaultSettings)({
    templateName,
    packageName,
    fields: validFields,
    type: dataStream.type,
    ilmPolicy: dataStream.ilm_policy
  });
  const composedOfTemplates = await installDataStreamComponentTemplates({
    templateName,
    registryElasticsearch: dataStream.elasticsearch,
    esClient,
    logger,
    packageName,
    defaultSettings
  });
  const template = (0, _template.getTemplate)({
    type: dataStream.type,
    templateIndexPattern,
    fields: validFields,
    mappings,
    pipelineName,
    packageName,
    composedOfTemplates,
    templatePriority,
    hidden: dataStream.hidden
  }); // TODO: Check return values for errors

  const esClientParams = {
    name: templateName,
    body: template
  };
  await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putIndexTemplate(esClientParams, {
    ignore: [404]
  }), {
    logger
  });
  return {
    templateName,
    indexTemplate: template
  };
}

function getAllTemplateRefs(installedTemplates) {
  return installedTemplates.flatMap(installedTemplate => {
    const indexTemplates = [{
      id: installedTemplate.templateName,
      type: _types.ElasticsearchAssetType.indexTemplate
    }];
    const componentTemplates = installedTemplate.indexTemplate.composed_of // Filter global component template shared between integrations
    .filter(componentTemplateId => componentTemplateId !== _constants.FLEET_GLOBAL_COMPONENT_TEMPLATE_NAME).map(componentTemplateId => ({
      id: componentTemplateId,
      type: _types.ElasticsearchAssetType.componentTemplate
    }));
    return indexTemplates.concat(componentTemplates);
  });
}