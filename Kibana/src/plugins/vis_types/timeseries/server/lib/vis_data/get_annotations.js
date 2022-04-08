"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotations = getAnnotations;

var _annotations = require("./response_processors/annotations");

var _get_request_params = require("./annotations/get_request_params");

var _timestamp = require("./helpers/timestamp");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function validAnnotation(annotation) {
  return annotation.fields && annotation.icon && annotation.template && !annotation.hidden;
}

async function getAnnotations({
  req,
  panel,
  series,
  services,
  trackedEsSearches
}) {
  const annotations = panel.annotations.filter(validAnnotation);
  const lastSeriesTimestamp = (0, _timestamp.getLastSeriesTimestamp)(series);
  const handleAnnotationResponseBy = (0, _annotations.handleAnnotationResponse)(lastSeriesTimestamp);
  const searches = await Promise.all(annotations.map(annotation => (0, _get_request_params.getAnnotationRequestParams)(req, panel, annotation, services)));
  if (!searches.length) return {
    responses: []
  };

  try {
    const data = await services.searchStrategy.search(services.requestContext, req, searches, trackedEsSearches);
    return annotations.reduce((acc, annotation, index) => {
      acc[annotation.id] = handleAnnotationResponseBy(data[index].rawResponse, annotation);
      return acc;
    }, {});
  } catch (error) {
    if (error.message === 'missing-indices') return {
      responses: []
    };
    throw error;
  }
}