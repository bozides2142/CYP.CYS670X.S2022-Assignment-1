"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCollectorFetch = createCollectorFetch;
exports.getTranslationCount = getTranslationCount;
exports.registerLocalizationUsageCollector = registerLocalizationUsageCollector;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _file_integrity = require("./file_integrity");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getTranslationCount(loader, locale) {
  const translations = await loader.getTranslationsByLocale(locale);
  return (0, _lodash.size)(translations.messages);
}

function createCollectorFetch({
  getLocale,
  getTranslationFiles
}) {
  return async function fetchUsageStats() {
    const locale = getLocale();
    const translationFilePaths = getTranslationFiles();
    const [labelsCount, integrities] = await Promise.all([getTranslationCount(_i18n.i18nLoader, locale), (0, _file_integrity.getIntegrityHashes)(translationFilePaths)]);
    return {
      locale,
      integrities,
      labelsCount
    };
  };
}

function registerLocalizationUsageCollector(usageCollection, i18n) {
  const collector = usageCollection.makeUsageCollector({
    type: 'localization',
    isReady: () => true,
    fetch: createCollectorFetch(i18n),
    schema: {
      locale: {
        type: 'keyword',
        _meta: {
          description: 'The default locale set on the Kibana system'
        }
      },
      integrities: {
        DYNAMIC_KEY: {
          type: 'text',
          _meta: {
            description: 'Translation file hash. If the hash is different it indicates that a custom translation file is used'
          }
        }
      },
      labelsCount: {
        type: 'long',
        _meta: {
          description: 'The number of translated labels'
        }
      }
    }
  });
  usageCollection.registerCollector(collector);
}