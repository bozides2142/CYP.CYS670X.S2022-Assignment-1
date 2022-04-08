"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportSettings = void 0;

var _common = require("../../../../../../../src/plugins/data/common");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExportSettings = async (client, config, timezone, logger) => {
  let setTimezone;

  if (timezone) {
    setTimezone = timezone;
  } else {
    // timezone in settings?
    setTimezone = await client.get(_constants.UI_SETTINGS_DATEFORMAT_TZ);

    if (setTimezone === 'Browser') {
      // if `Browser`, hardcode it to 'UTC' so the export has data that makes sense
      logger.warn(`Kibana Advanced Setting "dateFormat:tz" is set to "Browser". Dates will be formatted as UTC to avoid ambiguity.`);
      setTimezone = 'UTC';
    }
  } // Advanced Settings that affect search export + CSV


  const [includeFrozen, separator, quoteValues] = await Promise.all([client.get(_constants.UI_SETTINGS_SEARCH_INCLUDE_FROZEN), client.get(_constants.UI_SETTINGS_CSV_SEPARATOR), client.get(_constants.UI_SETTINGS_CSV_QUOTE_VALUES)]);
  const escapeFormulaValues = config.get('csv', 'escapeFormulaValues');
  const escapeValue = (0, _common.createEscapeValue)(quoteValues, escapeFormulaValues);
  const bom = config.get('csv', 'useByteOrderMarkEncoding') ? _constants.CSV_BOM_CHARS : '';
  return {
    timezone: setTimezone,
    scroll: {
      size: config.get('csv', 'scroll', 'size'),
      duration: config.get('csv', 'scroll', 'duration')
    },
    bom,
    includeFrozen,
    separator,
    maxSizeBytes: config.get('csv', 'maxSizeBytes'),
    checkForFormulas: config.get('csv', 'checkForFormulas'),
    escapeFormulaValues,
    escapeValue
  };
};

exports.getExportSettings = getExportSettings;