"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatLabel = formatLabel;

var _fieldTypes = require("@kbn/field-types");

var _enums = require("../../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function formatLabel(resp, panel, series, meta, extractFields, fieldFormatService, cachedIndexPatternFetcher) {
  return next => async results => {
    const {
      terms_field: termsField,
      split_mode: splitMode
    } = series;
    const isKibanaIndexPattern = panel.use_kibana_indexes || panel.index_pattern === ''; // no need to format labels for markdown as they also used there as variables keys

    const shouldFormatLabels = isKibanaIndexPattern && termsField && splitMode === _enums.BUCKET_TYPES.TERMS && panel.type !== _enums.PANEL_TYPES.MARKDOWN;

    if (shouldFormatLabels) {
      const {
        indexPattern
      } = await cachedIndexPatternFetcher({
        id: meta.index
      });

      const getFieldFormatByName = fieldName => {
        var _indexPattern$fieldFo;

        return fieldFormatService.deserialize(indexPattern === null || indexPattern === void 0 ? void 0 : (_indexPattern$fieldFo = indexPattern.fieldFormatMap) === null || _indexPattern$fieldFo === void 0 ? void 0 : _indexPattern$fieldFo[fieldName]);
      };

      results.filter(({
        seriesId
      }) => series.id === seriesId).forEach(item => {
        var _indexPattern$fields$;

        const formattedLabel = getFieldFormatByName(termsField).convert(item.label);
        item.label = formattedLabel;
        const termsFieldType = indexPattern === null || indexPattern === void 0 ? void 0 : (_indexPattern$fields$ = indexPattern.fields.find(({
          name
        }) => name === termsField)) === null || _indexPattern$fields$ === void 0 ? void 0 : _indexPattern$fields$.type;

        if (termsFieldType === _fieldTypes.KBN_FIELD_TYPES.DATE) {
          item.labelFormatted = formattedLabel;
        }
      });
    }

    return next(results);
  };
}