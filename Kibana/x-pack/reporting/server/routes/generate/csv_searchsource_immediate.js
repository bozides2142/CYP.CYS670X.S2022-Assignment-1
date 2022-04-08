"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGenerateCsvFromSavedObjectImmediate = registerGenerateCsvFromSavedObjectImmediate;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _execute_job = require("../../export_types/csv_searchsource_immediate/execute_job");

var _lib = require("../../lib");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");

var _request_handler = require("../lib/request_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const API_BASE_URL_V1 = '/api/reporting/v1';
const API_BASE_GENERATE_V1 = `${API_BASE_URL_V1}/generate`;
/*
 * This function registers API Endpoints for immediate Reporting jobs. The API inputs are:
 * - saved object type and ID
 * - time range and time zone
 * - application state:
 *     - filters
 *     - query bar
 *     - local (transient) changes the user made to the saved object
 */

function registerGenerateCsvFromSavedObjectImmediate(reporting, parentLogger) {
  const setupDeps = reporting.getPluginSetupDeps();
  const {
    router
  } = setupDeps; // TODO: find a way to abstract this using ExportTypeRegistry: it needs a new
  // public method to return this array
  // const registry = reporting.getExportTypesRegistry();
  // const kibanaAccessControlTags = registry.getAllAccessControlTags();

  const useKibanaAccessControl = reporting.getDeprecatedAllowedRoles() === false; // true if deprecated config is turned off

  const kibanaAccessControlTags = useKibanaAccessControl ? ['access:downloadCsv'] : []; // This API calls run the SearchSourceImmediate export type's runTaskFn directly

  router.post({
    path: `${API_BASE_GENERATE_V1}/immediate/csv_searchsource`,
    validate: {
      body: _configSchema.schema.object({
        columns: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        searchSource: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        browserTimezone: _configSchema.schema.string({
          defaultValue: 'UTC'
        }),
        title: _configSchema.schema.string(),
        version: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      tags: kibanaAccessControlTags
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    const logger = parentLogger.clone([_constants.CSV_SEARCHSOURCE_IMMEDIATE_TYPE]);
    const runTaskFn = (0, _execute_job.runTaskFnFactory)(reporting, logger);
    const requestHandler = new _request_handler.RequestHandler(reporting, user, context, req, res, logger);
    const stream = new _lib.PassThroughStream();
    const eventLog = reporting.getEventLogger({
      jobtype: _constants.CSV_SEARCHSOURCE_IMMEDIATE_TYPE,
      created_by: user && user.username,
      payload: {
        browserTimezone: req.params.browserTimezone
      }
    });

    const logError = error => {
      logger.error(error);
      eventLog.logError(error);
    };

    try {
      eventLog.logExecutionStart();
      const taskPromise = runTaskFn(null, req.body, context, stream, req).then(() => {
        logger.info(`Job output size: ${stream.bytesWritten} bytes.`);

        if (!stream.bytesWritten) {
          logger.warn('CSV Job Execution created empty content result');
        }

        eventLog.logExecutionComplete({
          byteSize: stream.bytesWritten
        });
      }).finally(() => stream.end());
      await Promise.race([stream.firstBytePromise, taskPromise]);
      taskPromise.catch(logError);
      return res.ok({
        body: stream,
        headers: {
          'content-type': 'text/csv;charset=utf-8',
          'accept-ranges': 'none'
        }
      });
    } catch (error) {
      logError(error);
      return requestHandler.handleError(error);
    }
  }));
}