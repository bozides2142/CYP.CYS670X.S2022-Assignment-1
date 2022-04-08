"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;

var _constants = require("../../../common/constants");

var _services = require("../../services");

var _common = require("../common");

var _generate_csv = require("./generate_csv/generate_csv");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runTaskFnFactory = (reporting, parentLogger) => {
  const config = reporting.getConfig();
  return async function runTask(jobId, job, cancellationToken, stream) {
    const logger = parentLogger.clone([_constants.CSV_JOB_TYPE, 'execute-job', jobId]);
    const encryptionKey = config.get('encryptionKey');
    const headers = await (0, _common.decryptJobHeaders)(encryptionKey, job.headers, logger);
    const fakeRequest = reporting.getFakeRequest({
      headers
    }, job.spaceId, logger);
    const uiSettings = await reporting.getUiSettingsClient(fakeRequest, logger);
    const dataPluginStart = await reporting.getDataService();
    const fieldFormatsRegistry = await (0, _services.getFieldFormats)().fieldFormatServiceFactory(uiSettings);
    const [es, searchSourceStart] = await Promise.all([(await reporting.getEsClient()).asScoped(fakeRequest), await dataPluginStart.search.searchSource.asScoped(fakeRequest)]);
    const clients = {
      uiSettings,
      data: dataPluginStart.search.asScoped(fakeRequest),
      es
    };
    const dependencies = {
      searchSourceStart,
      fieldFormatsRegistry
    };
    const csv = new _generate_csv.CsvGenerator(job, config, clients, dependencies, cancellationToken, logger, stream);
    return await csv.generateData();
  };
};

exports.runTaskFnFactory = runTaskFnFactory;