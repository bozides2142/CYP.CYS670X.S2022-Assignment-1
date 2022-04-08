"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataViewsServiceFactory = getDataViewsServiceFactory;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getDataViewsServiceFactory(getDataViews, savedObjectClient, scopedClient, request) {
  const dataViews = getDataViews();

  if (dataViews === null) {
    throw Error('data views service has not been initialized');
  }

  return () => dataViews.dataViewsServiceFactory(savedObjectClient, scopedClient.asCurrentUser, request);
}