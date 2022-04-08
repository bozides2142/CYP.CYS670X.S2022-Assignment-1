"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportingSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const appCountsSchema = {
  search: {
    type: 'long'
  },
  'canvas workpad': {
    type: 'long'
  },
  dashboard: {
    type: 'long'
  },
  visualization: {
    type: 'long'
  }
};
const layoutCountsSchema = {
  canvas: {
    type: 'long'
  },
  print: {
    type: 'long'
  },
  preserve_layout: {
    type: 'long'
  }
};
const byAppCountsSchema = {
  csv_searchsource: appCountsSchema,
  csv_searchsource_immediate: appCountsSchema,
  PNG: appCountsSchema,
  PNGV2: appCountsSchema,
  printable_pdf: appCountsSchema,
  printable_pdf_v2: appCountsSchema
};
const sizesSchema = {
  '1.0': {
    type: 'long'
  },
  '5.0': {
    type: 'long'
  },
  '25.0': {
    type: 'long'
  },
  '50.0': {
    type: 'long'
  },
  '75.0': {
    type: 'long'
  },
  '95.0': {
    type: 'long'
  },
  '99.0': {
    type: 'long'
  }
};
const availableTotalSchema = {
  available: {
    type: 'boolean'
  },
  total: {
    type: 'long'
  },
  deprecated: {
    type: 'long'
  },
  sizes: sizesSchema,
  app: appCountsSchema,
  layout: layoutCountsSchema
};
const jobTypesSchema = {
  csv_searchsource: availableTotalSchema,
  csv_searchsource_immediate: availableTotalSchema,
  PNG: availableTotalSchema,
  PNGV2: availableTotalSchema,
  printable_pdf: availableTotalSchema,
  printable_pdf_v2: availableTotalSchema
};
const rangeStatsSchema = { ...jobTypesSchema,
  _all: {
    type: 'long'
  },
  status: {
    completed: {
      type: 'long'
    },
    completed_with_warnings: {
      type: 'long'
    },
    failed: {
      type: 'long'
    },
    pending: {
      type: 'long'
    },
    processing: {
      type: 'long'
    }
  },
  statuses: {
    completed: byAppCountsSchema,
    completed_with_warnings: byAppCountsSchema,
    failed: byAppCountsSchema,
    pending: byAppCountsSchema,
    processing: byAppCountsSchema
  },
  output_size: sizesSchema
};
const reportingSchema = { ...rangeStatsSchema,
  available: {
    type: 'boolean'
  },
  enabled: {
    type: 'boolean'
  },
  last7Days: rangeStatsSchema
};
exports.reportingSchema = reportingSchema;