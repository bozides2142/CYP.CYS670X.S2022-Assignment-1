"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareParams = exports.formatObservables = exports.combineObservables = exports.apiSIR = void 0;

var _lodash = require("lodash");

var _types = require("./types");

var _api = require("./api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SPLIT_REGEX = /[ ,|\r\n\t]+/;

const formatObservables = (observables, type) => {
  /**
   * ServiceNow accepted formats are: comma, new line, tab, or pipe separators.
   * Before the application the observables were being sent to ServiceNow as a concatenated string with
   * delimiter. With the application the format changed to an array of observables.
   */
  const uniqueObservables = new Set(observables);
  return [...uniqueObservables].filter(obs => !(0, _lodash.isEmpty)(obs)).map(obs => ({
    value: obs,
    type
  }));
};

exports.formatObservables = formatObservables;

const obsAsArray = obs => {
  if ((0, _lodash.isEmpty)(obs)) {
    return [];
  }

  if ((0, _lodash.isString)(obs)) {
    return obs.split(SPLIT_REGEX);
  }

  return obs;
};

const combineObservables = (a, b) => {
  const first = obsAsArray(a);
  const second = obsAsArray(b);
  return [...first, ...second];
};

exports.combineObservables = combineObservables;

const observablesToString = obs => {
  if (Array.isArray(obs)) {
    return obs.join(',');
  }

  return obs !== null && obs !== void 0 ? obs : null;
};

const prepareParams = (usesTableApi, params) => {
  if (usesTableApi) {
    /**
     * The schema has change to accept an array of observables
     * or a string. In the case of connector that uses the old API we need to
     * convert the observables to a string
     */
    return { ...params,
      incident: { ...params.incident,
        dest_ip: observablesToString(params.incident.dest_ip),
        malware_hash: observablesToString(params.incident.malware_hash),
        malware_url: observablesToString(params.incident.malware_url),
        source_ip: observablesToString(params.incident.source_ip)
      }
    };
  }
  /**
   * For connectors that do not use the old API
   * the observables will be added in a different call.
   * They need to be set to null when sending the fields
   * to ServiceNow
   */


  return { ...params,
    incident: { ...params.incident,
      dest_ip: null,
      malware_hash: null,
      malware_url: null,
      source_ip: null
    }
  };
};

exports.prepareParams = prepareParams;

const pushToServiceHandler = async ({
  externalService,
  params,
  config,
  secrets,
  commentFieldKey,
  logger
}) => {
  const res = await _api.api.pushToService({
    externalService,
    params: prepareParams(!!config.usesTableApi, params),
    config,
    secrets,
    commentFieldKey,
    logger
  });
  const {
    incident: {
      dest_ip: destIP,
      malware_hash: malwareHash,
      malware_url: malwareUrl,
      source_ip: sourceIP
    }
  } = params;
  /**
   * Add bulk observables is only available for new connectors
   * Old connectors gonna add their observables
   * through the pushToService call.
   */

  if (!config.usesTableApi) {
    const sirExternalService = externalService;
    const obsWithType = [[combineObservables(destIP !== null && destIP !== void 0 ? destIP : [], sourceIP !== null && sourceIP !== void 0 ? sourceIP : []), _types.ObservableTypes.ip4], [obsAsArray(malwareHash !== null && malwareHash !== void 0 ? malwareHash : []), _types.ObservableTypes.sha256], [obsAsArray(malwareUrl !== null && malwareUrl !== void 0 ? malwareUrl : []), _types.ObservableTypes.url]];
    const observables = obsWithType.map(([obs, type]) => formatObservables(obs, type)).flat();

    if (observables.length > 0) {
      await sirExternalService.bulkAddObservableToIncident(observables, res.id);
    }
  }

  return res;
};

const apiSIR = { ..._api.api,
  pushToService: pushToServiceHandler
};
exports.apiSIR = apiSIR;