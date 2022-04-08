"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = void 0;

var _esQuery = require("@kbn/es-query");

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const query = ({
  req,
  panel,
  esQueryConfig,
  seriesIndex,
  buildSeriesMetaParams
}) => next => async doc => {
  const {
    timeField
  } = await buildSeriesMetaParams();
  const {
    from,
    to
  } = (0, _helpers.getTimerange)(req);
  const indexPattern = seriesIndex.indexPattern || undefined;
  const queries = !panel.ignore_global_filter ? req.body.query : [];
  const filters = !panel.ignore_global_filter ? req.body.filters : [];
  const esQuery = (0, _esQuery.buildEsQuery)(indexPattern, queries, filters, esQueryConfig);

  if (timeField) {
    const timerange = {
      range: {
        [timeField]: {
          gte: from.toISOString(),
          lte: to.toISOString(),
          format: 'strict_date_optional_time'
        }
      }
    };
    esQuery.bool.must.push(timerange);
  }

  if (panel.filter) {
    esQuery.bool.must.push((0, _esQuery.buildEsQuery)(indexPattern, [panel.filter], [], esQueryConfig));
  }

  (0, _helpers.overwrite)(doc, 'size', 0);
  (0, _helpers.overwrite)(doc, 'query', esQuery);
  return next(doc);
};

exports.query = query;