"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const pushToServiceHandler = async ({
  externalService,
  params
}) => {
  const {
    comments
  } = params;
  let res;
  const {
    externalId,
    ...rest
  } = params.incident;
  const incident = rest;

  if (externalId != null) {
    res = await externalService.updateRecord({
      incidentId: externalId,
      incident
    });
  } else {
    res = await externalService.createRecord({
      incident
    });
  }

  const createdDate = new Date().toISOString();

  if (comments && Array.isArray(comments) && comments.length > 0) {
    res.comments = [];

    for (const currentComment of comments) {
      var _res$comments;

      const comment = await externalService.createComment({
        incidentId: res.id,
        comment: currentComment,
        createdDate
      });
      res.comments = [...((_res$comments = res.comments) !== null && _res$comments !== void 0 ? _res$comments : []), {
        commentId: comment.commentId,
        pushedDate: comment.pushedDate
      }];
    }
  }

  return res;
};

const api = {
  pushToService: pushToServiceHandler
};
exports.api = api;