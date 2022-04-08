"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScriptedFieldsDeprecationsConfig = void 0;
exports.hasScriptedField = hasScriptedField;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createScriptedFieldsDeprecationsConfig = core => ({
  getDeprecations: async context => {
    const finder = context.savedObjectsClient.createPointInTimeFinder({
      type: 'index-pattern',
      perPage: 1000,
      fields: ['title', 'fields']
    });
    const indexPatternsWithScriptedFields = [];

    for await (const response of finder.find()) {
      indexPatternsWithScriptedFields.push(...response.saved_objects.map(so => so.attributes).filter(hasScriptedField));
    }

    if (indexPatternsWithScriptedFields.length > 0) {
      const PREVIEW_LIMIT = 3;
      const indexPatternTitles = indexPatternsWithScriptedFields.map(ip => ip.title);
      return [{
        title: _i18n.i18n.translate('dataViews.deprecations.scriptedFieldsTitle', {
          defaultMessage: 'Found data views using scripted fields'
        }),
        message: _i18n.i18n.translate('dataViews.deprecations.scriptedFieldsMessage', {
          defaultMessage: `You have {numberOfIndexPatternsWithScriptedFields} data views ({titlesPreview}...) that use scripted fields. Scripted fields are deprecated and will be removed in future. Use runtime fields instead.`,
          values: {
            titlesPreview: indexPatternTitles.slice(0, PREVIEW_LIMIT).join('; '),
            numberOfIndexPatternsWithScriptedFields: indexPatternsWithScriptedFields.length
          }
        }),
        documentationUrl: 'https://www.elastic.co/guide/en/elasticsearch/reference/7.x/runtime.html',
        // TODO: documentation service is not available serverside https://github.com/elastic/kibana/issues/95389
        level: 'warning',
        // warning because it is not set in stone WHEN we remove scripted fields, hence this deprecation is not a blocker for 8.0 upgrade
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('dataViews.deprecations.scriptedFields.manualStepOneMessage', {
            defaultMessage: 'Navigate to Stack Management > Kibana > Data Views.'
          }), _i18n.i18n.translate('dataViews.deprecations.scriptedFields.manualStepTwoMessage', {
            defaultMessage: 'Update {numberOfIndexPatternsWithScriptedFields} data views that have scripted fields to use runtime fields instead. In most cases, to migrate existing scripts, you will need to change "return <value>;" to "emit(<value>);". Data views with at least one scripted field: {allTitles}',
            values: {
              allTitles: indexPatternTitles.join('; '),
              numberOfIndexPatternsWithScriptedFields: indexPatternsWithScriptedFields.length
            }
          })]
        }
      }];
    } else {
      return [];
    }
  }
});

exports.createScriptedFieldsDeprecationsConfig = createScriptedFieldsDeprecationsConfig;

function hasScriptedField(indexPattern) {
  if (indexPattern.fields) {
    try {
      return JSON.parse(indexPattern.fields).some(field => field === null || field === void 0 ? void 0 : field.scripted);
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}