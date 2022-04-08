"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerJobInfoRoutes = registerJobInfoRoutes;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _server = require("../../../../security/server");

var _constants = require("../../../common/constants");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");

var _jobs_query = require("../lib/jobs_query");

var _job_response_handler = require("../lib/job_response_handler");

var _request_handler = require("../lib/request_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAIN_ENTRY = `${_constants.API_BASE_URL}/jobs`;

function registerJobInfoRoutes(reporting) {
  const setupDeps = reporting.getPluginSetupDeps();
  const {
    router
  } = setupDeps;
  const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting); // list jobs in the queue, paginated

  router.get({
    path: `${MAIN_ENTRY}/list`,
    validate: {
      query: _configSchema.schema.object({
        page: _configSchema.schema.string({
          defaultValue: '0'
        }),
        size: _configSchema.schema.string({
          defaultValue: '10'
        }),
        ids: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return (0, _request_handler.handleUnavailable)(res);
    }

    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const {
      page: queryPage = '0',
      size: querySize = '10',
      ids: queryIds = null
    } = req.query;
    const page = parseInt(queryPage, 10) || 0;
    const size = Math.min(100, parseInt(querySize, 10) || 10);
    const jobIds = queryIds ? queryIds.split(',') : null;
    const results = await jobsQuery.list(jobTypes, user, page, size, jobIds);
    return res.ok({
      body: results,
      headers: {
        'content-type': 'application/json'
      }
    });
  })); // return the count of all jobs in the queue

  router.get({
    path: `${MAIN_ENTRY}/count`,
    validate: false
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, _req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return (0, _request_handler.handleUnavailable)(res);
    }

    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const count = await jobsQuery.count(jobTypes, user);
    return res.ok({
      body: count.toString(),
      headers: {
        'content-type': 'text/plain'
      }
    });
  })); // return some info about the job

  router.get({
    path: `${MAIN_ENTRY}/info/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 2
        })
      })
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return res.custom({
        statusCode: 503
      });
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const result = await jobsQuery.get(user, docId);

    if (!result) {
      return res.notFound();
    }

    const {
      jobtype: jobType
    } = result;

    if (!jobTypes.includes(jobType)) {
      return res.forbidden({
        body: _i18n.i18n.translate('xpack.reporting.jobsQuery.infoError.unauthorizedErrorMessage', {
          defaultMessage: 'Sorry, you are not authorized to view {jobType} info',
          values: {
            jobType
          }
        })
      });
    }

    return res.ok({
      body: result,
      headers: {
        'content-type': 'application/json'
      }
    });
  })); // trigger a download of the output from a job

  router.get({
    path: `${MAIN_ENTRY}/download/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 3
        })
      })
    },
    options: {
      tags: [_server.ROUTE_TAG_CAN_REDIRECT]
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return (0, _request_handler.handleUnavailable)(res);
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    return (0, _job_response_handler.downloadJobResponseHandler)(reporting, res, jobTypes, user, {
      docId
    });
  })); // allow a report to be deleted

  router.delete({
    path: `${MAIN_ENTRY}/delete/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 3
        })
      })
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return (0, _request_handler.handleUnavailable)(res);
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    return (0, _job_response_handler.deleteJobResponseHandler)(reporting, res, jobTypes, user, {
      docId
    });
  }));
}