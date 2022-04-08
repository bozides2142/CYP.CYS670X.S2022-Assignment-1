"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureFleetFinalPipelineIsInstalled = ensureFleetFinalPipelineIsInstalled;
exports.getPipelineNameForInstallation = void 0;
exports.installAllPipelines = installAllPipelines;
exports.isTopLevelPipeline = exports.installPipelines = void 0;
exports.rewriteIngestPipeline = rewriteIngestPipeline;

var _types = require("../../../../types");

var _archive = require("../../archive");

var _install = require("../../packages/install");

var _packages = require("../../packages");

var _constants = require("../../../../constants");

var _meta = require("../meta");

var _retry = require("../retry");

var _remove = require("./remove");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isTopLevelPipeline = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ingestPipeline && pathParts.dataset === undefined;
};

exports.isTopLevelPipeline = isTopLevelPipeline;

const installPipelines = async (installablePackage, paths, esClient, savedObjectsClient, logger) => {
  // unlike other ES assets, pipeline names are versioned so after a template is updated
  // it can be created pointing to the new template, without removing the old one and effecting data
  // so do not remove the currently installed pipelines here
  const dataStreams = installablePackage.data_streams;
  const {
    name: pkgName,
    version: pkgVersion
  } = installablePackage;
  const pipelinePaths = paths.filter(path => isPipeline(path));
  const topLevelPipelinePaths = paths.filter(path => isTopLevelPipeline(path));
  if (!(dataStreams !== null && dataStreams !== void 0 && dataStreams.length) && topLevelPipelinePaths.length === 0) return []; // get and save pipeline refs before installing pipelines

  let pipelineRefs = dataStreams ? dataStreams.reduce((acc, dataStream) => {
    const filteredPaths = pipelinePaths.filter(path => isDataStreamPipeline(path, dataStream.path));
    const pipelineObjectRefs = filteredPaths.map(path => {
      const {
        name
      } = getNameAndExtension(path);
      const nameForInstallation = getPipelineNameForInstallation({
        pipelineName: name,
        dataStream,
        packageVersion: installablePackage.version
      });
      return {
        id: nameForInstallation,
        type: _types.ElasticsearchAssetType.ingestPipeline
      };
    });
    acc.push(...pipelineObjectRefs);
    return acc;
  }, []) : [];
  const topLevelPipelineRefs = topLevelPipelinePaths.map(path => {
    const {
      name
    } = getNameAndExtension(path);
    const nameForInstallation = getPipelineNameForInstallation({
      pipelineName: name,
      packageVersion: installablePackage.version
    });
    return {
      id: nameForInstallation,
      type: _types.ElasticsearchAssetType.ingestPipeline
    };
  });
  pipelineRefs = [...pipelineRefs, ...topLevelPipelineRefs]; // check that we don't duplicate the pipeline refs if the user is reinstalling

  const installedPkg = await (0, _packages.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  if (!installedPkg) throw new Error("integration wasn't found while installing pipelines"); // remove the current pipeline refs, if any exist, associated with this version before saving new ones so no duplicates occur

  await (0, _remove.deletePipelineRefs)(savedObjectsClient, installedPkg.attributes.installed_es, pkgName, pkgVersion);
  await (0, _install.saveInstalledEsRefs)(savedObjectsClient, installablePackage.name, pipelineRefs);
  const pipelines = dataStreams ? dataStreams.reduce((acc, dataStream) => {
    if (dataStream.ingest_pipeline) {
      acc.push(installAllPipelines({
        dataStream,
        esClient,
        logger,
        paths: pipelinePaths,
        installablePackage
      }));
    }

    return acc;
  }, []) : [];

  if (topLevelPipelinePaths) {
    pipelines.push(installAllPipelines({
      dataStream: undefined,
      esClient,
      logger,
      paths: topLevelPipelinePaths,
      installablePackage
    }));
  }

  return await Promise.all(pipelines).then(results => results.flat());
};

exports.installPipelines = installPipelines;

function rewriteIngestPipeline(pipeline, substitutions) {
  substitutions.forEach(sub => {
    const {
      source,
      target,
      templateFunction
    } = sub; // This fakes the use of the golang text/template expression {{SomeTemplateFunction 'some-param'}}
    // cf. https://github.com/elastic/beats/blob/master/filebeat/fileset/fileset.go#L294
    // "Standard style" uses '{{' and '}}' as delimiters

    const matchStandardStyle = `{{\\s?${templateFunction}\\s+['"]${source}['"]\\s?}}`; // "Beats style" uses '{<' and '>}' as delimiters because this is current practice in the beats project

    const matchBeatsStyle = `{<\\s?${templateFunction}\\s+['"]${source}['"]\\s?>}`;
    const regexStandardStyle = new RegExp(matchStandardStyle);
    const regexBeatsStyle = new RegExp(matchBeatsStyle);
    pipeline = pipeline.replace(regexStandardStyle, target).replace(regexBeatsStyle, target);
  });
  return pipeline;
}

async function installAllPipelines({
  esClient,
  logger,
  paths,
  dataStream,
  installablePackage
}) {
  const pipelinePaths = dataStream ? paths.filter(path => isDataStreamPipeline(path, dataStream.path)) : paths;
  let pipelines = [];
  const substitutions = [];
  pipelinePaths.forEach(path => {
    const {
      name,
      extension
    } = getNameAndExtension(path);
    const nameForInstallation = getPipelineNameForInstallation({
      pipelineName: name,
      dataStream,
      packageVersion: installablePackage.version
    });
    const content = (0, _archive.getAsset)(path).toString('utf-8');
    pipelines.push({
      name,
      nameForInstallation,
      content,
      extension
    });
    substitutions.push({
      source: name,
      target: nameForInstallation,
      templateFunction: 'IngestPipeline'
    });
  });
  pipelines = pipelines.map(pipeline => {
    return { ...pipeline,
      contentForInstallation: rewriteIngestPipeline(pipeline.content, substitutions)
    };
  });
  const installationPromises = pipelines.map(async pipeline => {
    return installPipeline({
      esClient,
      pipeline,
      installablePackage,
      logger
    });
  });
  return Promise.all(installationPromises);
}

async function installPipeline({
  esClient,
  logger,
  pipeline,
  installablePackage
}) {
  const pipelineWithMetadata = (0, _meta.appendMetadataToIngestPipeline)({
    pipeline,
    packageName: installablePackage === null || installablePackage === void 0 ? void 0 : installablePackage.name
  });
  const esClientParams = {
    id: pipelineWithMetadata.nameForInstallation,
    body: pipelineWithMetadata.contentForInstallation
  };
  const esClientRequestOptions = {
    ignore: [404]
  };

  if (pipelineWithMetadata.extension === 'yml') {
    esClientRequestOptions.headers = {
      // pipeline is YAML
      'Content-Type': 'application/yaml',
      // but we want JSON responses (to extract error messages, status code, or other metadata)
      Accept: 'application/json'
    };
  }

  await (0, _retry.retryTransientEsErrors)(() => esClient.ingest.putPipeline(esClientParams, esClientRequestOptions), {
    logger
  });
  return {
    id: pipelineWithMetadata.nameForInstallation,
    type: _types.ElasticsearchAssetType.ingestPipeline
  };
}

async function ensureFleetFinalPipelineIsInstalled(esClient, logger) {
  var _res$body$FLEET_FINAL;

  const esClientRequestOptions = {
    ignore: [404]
  };
  const res = await esClient.ingest.getPipeline({
    id: _constants.FLEET_FINAL_PIPELINE_ID
  }, esClientRequestOptions);
  const installedVersion = res === null || res === void 0 ? void 0 : (_res$body$FLEET_FINAL = res.body[_constants.FLEET_FINAL_PIPELINE_ID]) === null || _res$body$FLEET_FINAL === void 0 ? void 0 : _res$body$FLEET_FINAL.version;

  if (res.statusCode === 404 || !installedVersion || installedVersion < _constants.FLEET_FINAL_PIPELINE_VERSION) {
    await installPipeline({
      esClient,
      logger,
      pipeline: {
        nameForInstallation: _constants.FLEET_FINAL_PIPELINE_ID,
        contentForInstallation: _constants.FLEET_FINAL_PIPELINE_CONTENT,
        extension: 'yml'
      }
    });
    return {
      isCreated: true
    };
  }

  return {
    isCreated: false
  };
}

const isDirectory = ({
  path
}) => path.endsWith('/');

const isDataStreamPipeline = (path, dataStreamDataset) => {
  const pathParts = (0, _archive.getPathParts)(path);
  return !isDirectory({
    path
  }) && pathParts.type === _types.ElasticsearchAssetType.ingestPipeline && pathParts.dataset !== undefined && dataStreamDataset === pathParts.dataset;
};

const isPipeline = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ingestPipeline;
}; // XXX: assumes path/to/file.ext -- 0..n '/' and exactly one '.'


const getNameAndExtension = path => {
  const splitPath = path.split('/');
  const filename = splitPath[splitPath.length - 1];
  return {
    name: filename.split('.')[0],
    extension: filename.split('.')[1]
  };
};

const getPipelineNameForInstallation = ({
  pipelineName,
  dataStream,
  packageVersion
}) => {
  if (dataStream !== undefined) {
    const isPipelineEntry = pipelineName === dataStream.ingest_pipeline;
    const suffix = isPipelineEntry ? '' : `-${pipelineName}`; // if this is the pipeline entry, don't add a suffix

    return `${dataStream.type}-${dataStream.dataset}-${packageVersion}${suffix}`;
  } // It's a top-level pipeline


  return `${packageVersion}-${pipelineName}`;
};

exports.getPipelineNameForInstallation = getPipelineNameForInstallation;