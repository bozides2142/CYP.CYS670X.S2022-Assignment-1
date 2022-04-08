"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareParams = exports.apiITOM = void 0;

var _api = require("./api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isValidDate = d => !isNaN(d.valueOf());

const formatTimeOfEvent = timeOfEvent => {
  if (timeOfEvent != null) {
    const date = new Date(timeOfEvent);
    return isValidDate(date) ? // The format is: yyyy-MM-dd HH:mm:ss GMT
    date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'GMT'
    }) : undefined;
  }
};

const removeNullValues = params => Object.keys(params).reduce((acc, key) => ({ ...acc,
  ...(params[key] != null ? {
    [key]: params[key]
  } : {})
}), {});

const prepareParams = params => {
  const timeOfEvent = formatTimeOfEvent(params.time_of_event);
  return removeNullValues({ ...params,
    time_of_event: timeOfEvent !== null && timeOfEvent !== void 0 ? timeOfEvent : null
  });
};

exports.prepareParams = prepareParams;

const addEventServiceHandler = async ({
  externalService,
  params
}) => {
  const itomExternalService = externalService;
  const preparedParams = prepareParams(params);
  await itomExternalService.addEvent(preparedParams);
};

const apiITOM = {
  getChoices: _api.api.getChoices,
  addEvent: addEventServiceHandler
};
exports.apiITOM = apiITOM;