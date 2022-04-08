"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReportingUsage = getReportingUsage;

var _lodash = require("lodash");

var _constants = require("../../common/constants");

var _get_export_stats = require("./get_export_stats");

var _get_export_type_handler = require("./get_export_type_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const JOB_TYPES_KEY = 'jobTypes';
const JOB_TYPES_FIELD = 'jobtype';
const LAYOUT_TYPES_KEY = 'layoutTypes';
const LAYOUT_TYPES_FIELD = 'meta.layout.keyword';
const OBJECT_TYPES_KEY = 'objectTypes';
const OBJECT_TYPE_DEPRECATED_KEY = 'meta.isDeprecated';
const OBJECT_TYPES_FIELD = 'meta.objectType.keyword';
const STATUS_TYPES_KEY = 'statusTypes';
const STATUS_BY_APP_KEY = 'statusByApp';
const STATUS_TYPES_FIELD = 'status';
const OUTPUT_SIZES_KEY = 'sizes';
const OUTPUT_SIZES_FIELD = 'output.size';
const DEFAULT_TERMS_SIZE = 10;
const PRINTABLE_PDF_JOBTYPE = 'printable_pdf'; // indexes some key/count buckets by the "key" property

const getKeyCount = buckets => buckets.reduce((accum, {
  key,
  doc_count: count
}) => ({ ...accum,
  [key]: count
}), {}); // indexes some key/count buckets by statusType > jobType > appName: statusCount


const getAppStatuses = buckets => buckets.reduce((statuses, statusBucket) => {
  return { ...statuses,
    [statusBucket.key]: statusBucket.jobTypes.buckets.reduce((jobTypes, job) => {
      return { ...jobTypes,
        [job.key]: job.appNames.buckets.reduce((apps, app) => {
          return { ...apps,
            [app.key]: app.doc_count
          };
        }, {})
      };
    }, {})
  };
}, {});

function getAggStats(aggs) {
  var _get;

  const {
    buckets: jobBuckets
  } = aggs[JOB_TYPES_KEY];
  const jobTypes = jobBuckets.reduce((accum, bucket) => {
    const {
      key,
      doc_count: count,
      isDeprecated,
      sizes
    } = bucket;
    const deprecatedCount = isDeprecated === null || isDeprecated === void 0 ? void 0 : isDeprecated.doc_count;
    const total = {
      total: count,
      deprecated: deprecatedCount,
      sizes: sizes === null || sizes === void 0 ? void 0 : sizes.values
    };
    return { ...accum,
      [key]: total
    };
  }, {}); // merge pdf stats into pdf jobtype key

  const pdfJobs = jobTypes[PRINTABLE_PDF_JOBTYPE];

  if (pdfJobs) {
    const pdfAppBuckets = (0, _lodash.get)(aggs[OBJECT_TYPES_KEY], 'pdf.buckets', []);
    const pdfLayoutBuckets = (0, _lodash.get)(aggs[LAYOUT_TYPES_KEY], 'pdf.buckets', []);
    pdfJobs.app = getKeyCount(pdfAppBuckets);
    pdfJobs.layout = getKeyCount(pdfLayoutBuckets);
  }

  const all = aggs.doc_count;
  let statusTypes = {};
  const statusBuckets = (0, _lodash.get)(aggs[STATUS_TYPES_KEY], 'buckets', []);

  if (statusBuckets) {
    statusTypes = getKeyCount(statusBuckets);
  }

  let statusByApp = {};
  const statusAppBuckets = (0, _lodash.get)(aggs[STATUS_BY_APP_KEY], 'buckets', []);

  if (statusAppBuckets) {
    statusByApp = getAppStatuses(statusAppBuckets);
  }

  return {
    _all: all,
    status: statusTypes,
    statuses: statusByApp,
    output_size: (_get = (0, _lodash.get)(aggs[OUTPUT_SIZES_KEY], 'values')) !== null && _get !== void 0 ? _get : undefined,
    ...jobTypes
  };
}

async function handleResponse(response) {
  const buckets = (0, _lodash.get)(response, 'aggregations.ranges.buckets');

  if (!buckets) {
    return {};
  }

  const {
    all,
    last7Days
  } = buckets;
  const last7DaysUsage = last7Days ? getAggStats(last7Days) : {};
  const allUsage = all ? getAggStats(all) : {};
  return {
    last7Days: last7DaysUsage,
    ...allUsage
  };
}

async function getReportingUsage(config, getLicense, esClient, exportTypesRegistry) {
  const reportingIndex = _constants.REPORTING_SYSTEM_INDEX;
  const params = {
    index: `${reportingIndex}-*`,
    filter_path: 'aggregations.*.buckets',
    body: {
      size: 0,
      aggs: {
        ranges: {
          filters: {
            filters: {
              all: {
                match_all: {}
              },
              last7Days: {
                range: {
                  created_at: {
                    gte: 'now-7d/d'
                  }
                }
              }
            }
          },
          aggs: {
            [JOB_TYPES_KEY]: {
              terms: {
                field: JOB_TYPES_FIELD,
                size: DEFAULT_TERMS_SIZE
              },
              aggs: {
                isDeprecated: {
                  filter: {
                    term: {
                      [OBJECT_TYPE_DEPRECATED_KEY]: true
                    }
                  }
                },
                [OUTPUT_SIZES_KEY]: {
                  percentiles: {
                    field: OUTPUT_SIZES_FIELD
                  }
                }
              }
            },
            [STATUS_TYPES_KEY]: {
              terms: {
                field: STATUS_TYPES_FIELD,
                size: DEFAULT_TERMS_SIZE
              }
            },
            [STATUS_BY_APP_KEY]: {
              terms: {
                field: 'status',
                size: DEFAULT_TERMS_SIZE
              },
              aggs: {
                jobTypes: {
                  terms: {
                    field: JOB_TYPES_FIELD,
                    size: DEFAULT_TERMS_SIZE
                  },
                  aggs: {
                    appNames: {
                      terms: {
                        field: OBJECT_TYPES_FIELD,
                        size: DEFAULT_TERMS_SIZE
                      }
                    }
                  }
                }
              }
            },
            [OBJECT_TYPES_KEY]: {
              filter: {
                term: {
                  jobtype: PRINTABLE_PDF_JOBTYPE
                }
              },
              aggs: {
                pdf: {
                  terms: {
                    field: OBJECT_TYPES_FIELD,
                    size: DEFAULT_TERMS_SIZE
                  }
                }
              }
            },
            [LAYOUT_TYPES_KEY]: {
              filter: {
                term: {
                  jobtype: PRINTABLE_PDF_JOBTYPE
                }
              },
              aggs: {
                pdf: {
                  terms: {
                    field: LAYOUT_TYPES_FIELD,
                    size: DEFAULT_TERMS_SIZE
                  }
                }
              }
            },
            [OUTPUT_SIZES_KEY]: {
              percentiles: {
                field: OUTPUT_SIZES_FIELD
              }
            }
          }
        }
      }
    }
  };
  const featureAvailability = await getLicense();
  return esClient.search(params).then(({
    body: response
  }) => handleResponse(response)).then(usage => {
    const exportTypesHandler = (0, _get_export_type_handler.getExportTypesHandler)(exportTypesRegistry);
    const availability = exportTypesHandler.getAvailability(featureAvailability);
    const {
      last7Days,
      ...all
    } = usage;
    return {
      available: true,
      enabled: true,
      last7Days: (0, _get_export_stats.getExportStats)(last7Days, availability, exportTypesHandler),
      ...(0, _get_export_stats.getExportStats)(all, availability, exportTypesHandler)
    };
  });
}