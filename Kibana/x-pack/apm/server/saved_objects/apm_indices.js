"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmIndices = void 0;

var _i18n = require("@kbn/i18n");

var _update_apm_oss_index_paths = require("./migrations/update_apm_oss_index_paths");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const properties = {
  sourcemap: {
    type: 'keyword'
  },
  error: {
    type: 'keyword'
  },
  onboarding: {
    type: 'keyword'
  },
  span: {
    type: 'keyword'
  },
  transaction: {
    type: 'keyword'
  },
  metric: {
    type: 'keyword'
  }
};
const apmIndices = {
  name: 'apm-indices',
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    properties
  },
  management: {
    importableAndExportable: true,
    icon: 'apmApp',
    getTitle: () => _i18n.i18n.translate('xpack.apm.apmSettings.index', {
      defaultMessage: 'APM Settings - Index'
    })
  },
  migrations: {
    '7.16.0': doc => {
      const attributes = (0, _update_apm_oss_index_paths.updateApmOssIndexPaths)(doc.attributes);
      return { ...doc,
        attributes
      };
    }
  }
};
exports.apmIndices = apmIndices;