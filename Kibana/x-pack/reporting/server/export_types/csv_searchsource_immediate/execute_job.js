"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;

var _cancellation_token = require("../../../common/cancellation_token");

var _constants = require("../../../common/constants");

var _services = require("../../services");

var _generate_csv = require("../csv_searchsource/generate_csv/generate_csv");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runTaskFnFactory = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  const logger = parentLogger.clone([_constants.CSV_SEARCHSOURCE_IMMEDIATE_TYPE, 'execute-job']);
  return async function runTask(_jobId, immediateJobParams, context, stream, req) {
    const job = {
      objectType: 'immediate-search',
      ...immediateJobParams
    };
    const savedObjectsClient = context.core.savedObjects.client;
    const uiSettings = await reporting.getUiSettingsServiceFactory(savedObjectsClient);
    const dataPluginStart = await reporting.getDataService();
    const fieldFormatsRegistry = await (0, _services.getFieldFormats)().fieldFormatServiceFactory(uiSettings);
    const [es, searchSourceStart] = await Promise.all([(await reporting.getEsClient()).asScoped(req), await dataPluginStart.search.searchSource.asScoped(req)]);
    const clients = {
      uiSettings,
      data: dataPluginStart.search.asScoped(req),
      es
    };
    const dependencies = {
      fieldFormatsRegistry,
      searchSourceStart
    };
    const cancellationToken = new _cancellation_token.CancellationToken();
    const csv = new _generate_csv.CsvGenerator(job, config, clients, dependencies, cancellationToken, logger, stream);
    const result = await csv.generateData();

    if (result.csv_contains_formulas) {
      logger.warn(`CSV may contain formulas whose values have been escaped`);
    }

    if (result.max_size_reached) {
      logger.warn(`Max size reached: CSV output truncated`);
    }

    const {
      warnings
    } = result;

    if (warnings) {
      warnings.forEach(warning => {
        logger.warning(warning);
      });
    }

    return result;
  };
};

exports.runTaskFnFactory = runTaskFnFactory;