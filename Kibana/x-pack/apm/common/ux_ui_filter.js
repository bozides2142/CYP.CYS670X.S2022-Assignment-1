"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uxLocalUIFilters = exports.uxLocalUIFilterNames = exports.uxFiltersByName = void 0;

var _i18n = require("@kbn/i18n");

var _elasticsearch_fieldnames = require("./elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uxFiltersByName = {
  transactionUrl: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.transactionUrl', {
      defaultMessage: 'URL'
    }),
    fieldName: _elasticsearch_fieldnames.TRANSACTION_URL
  },
  transactionUrlExcluded: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.transactionUrl', {
      defaultMessage: 'URL'
    }),
    fieldName: _elasticsearch_fieldnames.TRANSACTION_URL,
    excluded: true
  },
  browser: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.browser', {
      defaultMessage: 'Browser'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_NAME
  },
  browserExcluded: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.browser', {
      defaultMessage: 'Browser'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_NAME,
    excluded: true
  },
  device: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.device', {
      defaultMessage: 'Device'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_DEVICE
  },
  deviceExcluded: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.device', {
      defaultMessage: 'Device'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_DEVICE,
    excluded: true
  },
  location: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.location', {
      defaultMessage: 'Location'
    }),
    fieldName: _elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE
  },
  locationExcluded: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.location', {
      defaultMessage: 'Location'
    }),
    fieldName: _elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE,
    excluded: true
  },
  os: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.os', {
      defaultMessage: 'OS'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_OS
  },
  osExcluded: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.os', {
      defaultMessage: 'OS'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_OS,
    excluded: true
  },
  serviceName: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.serviceName', {
      defaultMessage: 'Service name'
    }),
    fieldName: _elasticsearch_fieldnames.SERVICE_NAME
  }
};
exports.uxFiltersByName = uxFiltersByName;
const uxLocalUIFilterNames = Object.keys(uxFiltersByName);
exports.uxLocalUIFilterNames = uxLocalUIFilterNames;
const uxLocalUIFilters = uxLocalUIFilterNames.reduce((acc, key) => {
  const field = uxFiltersByName[key];
  return { ...acc,
    [key]: { ...field,
      name: key
    }
  };
}, {});
exports.uxLocalUIFilters = uxLocalUIFilters;