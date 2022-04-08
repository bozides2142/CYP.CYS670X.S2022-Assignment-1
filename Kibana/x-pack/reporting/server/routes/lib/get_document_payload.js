"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentPayloadFactory = getDocumentPayloadFactory;

var _contentDisposition = _interopRequireDefault(require("content-disposition"));

var _constants = require("../../../common/constants");

var _lib = require("../../lib");

var _jobs_query = require("./jobs_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const DEFAULT_TITLE = 'report';

const getTitle = (exportType, title) => `${title || DEFAULT_TITLE}.${exportType.jobContentExtension}`;

const getReportingHeaders = (output, exportType) => {
  const metaDataHeaders = {};

  if (exportType.jobType === _constants.CSV_JOB_TYPE || exportType.jobType === _constants.CSV_JOB_TYPE_DEPRECATED) {
    var _output$csv_contains_, _output$max_size_reac;

    const csvContainsFormulas = (_output$csv_contains_ = output.csv_contains_formulas) !== null && _output$csv_contains_ !== void 0 ? _output$csv_contains_ : false;
    const maxSizedReach = (_output$max_size_reac = output.max_size_reached) !== null && _output$max_size_reac !== void 0 ? _output$max_size_reac : false;
    metaDataHeaders['kbn-csv-contains-formulas'] = csvContainsFormulas;
    metaDataHeaders['kbn-max-size-reached'] = maxSizedReach;
  }

  return metaDataHeaders;
};

function getDocumentPayloadFactory(reporting) {
  const exportTypesRegistry = reporting.getExportTypesRegistry();

  async function getCompleted({
    id,
    index,
    output,
    jobtype: jobType,
    payload: {
      title
    }
  }) {
    const exportType = exportTypesRegistry.get(item => item.jobType === jobType);
    const encoding = exportType.jobContentEncoding === 'base64' ? 'base64' : 'raw';
    const content = await (0, _lib.getContentStream)(reporting, {
      id,
      index
    }, {
      encoding
    });
    const filename = getTitle(exportType, title);
    const headers = getReportingHeaders(output, exportType);
    return {
      content,
      statusCode: 200,
      contentType: output.content_type,
      headers: { ...headers,
        'Content-Disposition': (0, _contentDisposition.default)(filename, {
          type: 'inline'
        }),
        'Content-Length': output.size
      }
    };
  } // @TODO: These should be semantic HTTP codes as 500/503's indicate
  // error then these are really operating properly.


  async function getFailure({
    id
  }) {
    const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
    const error = await jobsQuery.getError(id);
    return {
      statusCode: 500,
      content: {
        message: `Reporting generation failed: ${error}`
      },
      contentType: 'application/json',
      headers: {}
    };
  }

  function getIncomplete({
    status
  }) {
    return {
      statusCode: 503,
      content: status,
      contentType: 'text/plain',
      headers: {
        'retry-after': 30
      }
    };
  }

  return async function getDocumentPayload(report) {
    if (report.output) {
      if ([_lib.statuses.JOB_STATUS_COMPLETED, _lib.statuses.JOB_STATUS_WARNINGS].includes(report.status)) {
        return getCompleted(report);
      }

      if (_lib.statuses.JOB_STATUS_FAILED === report.status) {
        return getFailure(report);
      }
    } // send a 503 indicating that the report isn't completed yet


    return getIncomplete(report);
  };
}