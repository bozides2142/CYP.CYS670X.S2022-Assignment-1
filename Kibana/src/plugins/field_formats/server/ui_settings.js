"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _languages = _interopRequireDefault(require("@elastic/numeral/languages"));

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore untyped module
// We add the `en` key manually here, since that's not a real numeral locale, but the
// default fallback in case the locale is not found.
const numeralLanguageIds = ['en', ..._languages.default.map(numeralLanguage => {
  return numeralLanguage.id;
})];

function getUiSettings() {
  return {
    [_common.FORMATS_UI_SETTINGS.SHORT_DOTS_ENABLE]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.shortenFieldsTitle', {
        defaultMessage: 'Shorten fields'
      }),
      value: false,
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.shortenFieldsText', {
        defaultMessage: 'Shorten long fields, for example, instead of foo.bar.baz, show f.b.baz'
      }),
      schema: _configSchema.schema.boolean()
    },
    [_common.FORMATS_UI_SETTINGS.FORMAT_DEFAULT_TYPE_MAP]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.format.defaultTypeMapTitle', {
        defaultMessage: 'Field type format name'
      }),
      value: `{
  "ip": { "id": "ip", "params": {} },
  "date": { "id": "date", "params": {} },
  "date_nanos": { "id": "date_nanos", "params": {}, "es": true },
  "geo_point": { "id": "geo_point", "params": { "transform": "wkt" } },
  "number": { "id": "number", "params": {} },
  "boolean": { "id": "boolean", "params": {} },
  "histogram": { "id": "histogram", "params": {} },
  "_source": { "id": "_source", "params": {} },
  "_default_": { "id": "string", "params": {} }
}`,
      type: 'json',
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.format.defaultTypeMapText', {
        defaultMessage: 'Map of the format name to use by default for each field type. ' + '{defaultFormat} is used if the field type is not mentioned explicitly',
        values: {
          defaultFormat: '"_default_"'
        }
      }),
      schema: _configSchema.schema.object({
        ip: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        }),
        date: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        }),
        date_nanos: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({}),
          es: _configSchema.schema.boolean()
        }),
        geo_point: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({
            transform: _configSchema.schema.string()
          })
        }),
        number: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        }),
        boolean: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        }),
        histogram: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        }),
        _source: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        }),
        _default_: _configSchema.schema.object({
          id: _configSchema.schema.string(),
          params: _configSchema.schema.object({})
        })
      })
    },
    [_common.FORMATS_UI_SETTINGS.FORMAT_NUMBER_DEFAULT_PATTERN]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.format.numberFormatTitle', {
        defaultMessage: 'Number format'
      }),
      value: '0,0.[000]',
      type: 'string',
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.format.numberFormatText', {
        defaultMessage: 'Default {numeralFormatLink} for the "number" format',
        description: 'Part of composite text: fieldFormats.advancedSettings.format.numberFormatText + ' + 'fieldFormats.advancedSettings.format.numberFormat.numeralFormatLinkText',
        values: {
          numeralFormatLink: '<a href="https://www.elastic.co/guide/en/kibana/current/numeral.html" target="_blank" rel="noopener">' + _i18n.i18n.translate('fieldFormats.advancedSettings.format.numberFormat.numeralFormatLinkText', {
            defaultMessage: 'numeral format'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    },
    [_common.FORMATS_UI_SETTINGS.FORMAT_PERCENT_DEFAULT_PATTERN]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.format.percentFormatTitle', {
        defaultMessage: 'Percent format'
      }),
      value: '0,0.[000]%',
      type: 'string',
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.format.percentFormatText', {
        defaultMessage: 'Default {numeralFormatLink} for the "percent" format',
        description: 'Part of composite text: fieldFormats.advancedSettings.format.percentFormatText + ' + 'fieldFormats.advancedSettings.format.percentFormat.numeralFormatLinkText',
        values: {
          numeralFormatLink: '<a href="https://www.elastic.co/guide/en/kibana/current/numeral.html" target="_blank" rel="noopener">' + _i18n.i18n.translate('fieldFormats.advancedSettings.format.percentFormat.numeralFormatLinkText', {
            defaultMessage: 'numeral format'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    },
    [_common.FORMATS_UI_SETTINGS.FORMAT_BYTES_DEFAULT_PATTERN]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.format.bytesFormatTitle', {
        defaultMessage: 'Bytes format'
      }),
      value: '0,0.[0]b',
      type: 'string',
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.format.bytesFormatText', {
        defaultMessage: 'Default {numeralFormatLink} for the "bytes" format',
        description: 'Part of composite text: fieldFormats.advancedSettings.format.bytesFormatText + ' + 'fieldFormats.advancedSettings.format.bytesFormat.numeralFormatLinkText',
        values: {
          numeralFormatLink: '<a href="https://www.elastic.co/guide/en/kibana/current/numeral.html" target="_blank" rel="noopener">' + _i18n.i18n.translate('fieldFormats.advancedSettings.format.bytesFormat.numeralFormatLinkText', {
            defaultMessage: 'numeral format'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    },
    [_common.FORMATS_UI_SETTINGS.FORMAT_CURRENCY_DEFAULT_PATTERN]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.format.currencyFormatTitle', {
        defaultMessage: 'Currency format'
      }),
      value: '($0,0.[00])',
      type: 'string',
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.format.currencyFormatText', {
        defaultMessage: 'Default {numeralFormatLink} for the "currency" format',
        description: 'Part of composite text: fieldFormats.advancedSettings.format.currencyFormatText + ' + 'fieldFormats.advancedSettings.format.currencyFormat.numeralFormatLinkText',
        values: {
          numeralFormatLink: '<a href="https://www.elastic.co/guide/en/kibana/current/numeral.html" target="_blank" rel="noopener">' + _i18n.i18n.translate('fieldFormats.advancedSettings.format.currencyFormat.numeralFormatLinkText', {
            defaultMessage: 'numeral format'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    },
    [_common.FORMATS_UI_SETTINGS.FORMAT_NUMBER_DEFAULT_LOCALE]: {
      name: _i18n.i18n.translate('fieldFormats.advancedSettings.format.formattingLocaleTitle', {
        defaultMessage: 'Formatting locale'
      }),
      value: 'en',
      type: 'select',
      options: numeralLanguageIds,
      optionLabels: Object.fromEntries(_languages.default.map(language => [language.id, language.name])),
      description: _i18n.i18n.translate('fieldFormats.advancedSettings.format.formattingLocaleText', {
        defaultMessage: `{numeralLanguageLink} locale`,
        description: 'Part of composite text: fieldFormats.advancedSettings.format.formattingLocale.numeralLanguageLinkText + ' + 'fieldFormats.advancedSettings.format.formattingLocaleText',
        values: {
          numeralLanguageLink: '<a href="https://www.elastic.co/guide/en/kibana/current/numeral.html" target="_blank" rel="noopener">' + _i18n.i18n.translate('fieldFormats.advancedSettings.format.formattingLocale.numeralLanguageLinkText', {
            defaultMessage: 'Numeral language'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    }
  };
}