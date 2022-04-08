"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topHits = void 0;

var _helpers = require("../../helpers");

var _fields_utils = require("../../../../../common/fields_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const topHits = ({
  panel,
  annotation,
  annotationIndex
}) => {
  return next => doc => {
    var _annotationIndex$inde;

    const fields = annotation.fields && annotation.fields.split(/[,\s]+/) || [];
    const timeField = annotation.time_field || ((_annotationIndex$inde = annotationIndex.indexPattern) === null || _annotationIndex$inde === void 0 ? void 0 : _annotationIndex$inde.timeFieldName) || '';

    if (panel.use_kibana_indexes) {
      (0, _fields_utils.validateField)(timeField, annotationIndex);
    }

    (0, _helpers.overwrite)(doc, `aggs.${annotation.id}.aggs.hits.top_hits`, {
      sort: [{
        [timeField]: {
          order: 'desc'
        }
      }],
      fields: [...fields, timeField],
      size: 5
    });
    return next(doc);
  };
};

exports.topHits = topHits;