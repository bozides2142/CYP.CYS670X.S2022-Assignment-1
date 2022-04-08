"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteJobResponseHandler = deleteJobResponseHandler;
exports.downloadJobResponseHandler = downloadJobResponseHandler;

var _util = require("util");

var _constants = require("../../../common/constants");

var _lib = require("../../lib");

var _get_document_payload = require("./get_document_payload");

var _jobs_query = require("./jobs_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function downloadJobResponseHandler(reporting, res, validJobTypes, user, params) {
  const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
  const getDocumentPayload = (0, _get_document_payload.getDocumentPayloadFactory)(reporting);

  try {
    const {
      docId
    } = params;
    const doc = await jobsQuery.get(user, docId);

    if (!doc) {
      return res.notFound();
    }

    if (!validJobTypes.includes(doc.jobtype)) {
      return res.unauthorized({
        body: `Sorry, you are not authorized to download ${doc.jobtype} reports`
      });
    }

    const payload = await getDocumentPayload(doc);

    if (!payload.contentType || !_constants.ALLOWED_JOB_CONTENT_TYPES.includes(payload.contentType)) {
      return res.badRequest({
        body: `Unsupported content-type of ${payload.contentType} specified by job output`
      });
    }

    return res.custom({
      body: typeof payload.content === 'string' ? Buffer.from(payload.content) : payload.content,
      statusCode: payload.statusCode,
      headers: { ...payload.headers,
        'content-type': payload.contentType || ''
      }
    });
  } catch (err) {
    const {
      logger
    } = reporting.getPluginSetupDeps();
    logger.error(err);
    throw err;
  }
}

async function deleteJobResponseHandler(reporting, res, validJobTypes, user, params) {
  const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
  const {
    docId
  } = params;
  const doc = await jobsQuery.get(user, docId);

  if (!doc) {
    return res.notFound();
  }

  const {
    jobtype: jobType
  } = doc;

  if (!validJobTypes.includes(jobType)) {
    return res.unauthorized({
      body: `Sorry, you are not authorized to delete ${jobType} reports`
    });
  }

  const docIndex = doc.index;
  const stream = await (0, _lib.getContentStream)(reporting, {
    id: docId,
    index: docIndex
  });

  try {
    /** @note Overwriting existing content with an empty buffer to remove all the chunks. */
    await (0, _util.promisify)(stream.end.bind(stream, '', 'utf8'))();
    await jobsQuery.delete(docIndex, docId);
    return res.ok({
      body: {
        deleted: true
      }
    });
  } catch (error) {
    return res.customError({
      statusCode: error.statusCode,
      body: error.message
    });
  }
}