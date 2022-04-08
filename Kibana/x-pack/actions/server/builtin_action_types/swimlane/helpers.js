"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBodyForEventAction = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mappingKeysToIncidentKeys = {
  ruleNameConfig: 'ruleName',
  alertIdConfig: 'alertId',
  caseIdConfig: 'caseId',
  caseNameConfig: 'caseName',
  severityConfig: 'severity',
  descriptionConfig: 'description'
};

const getBodyForEventAction = (applicationId, mappingConfig, params, incidentId) => {
  const data = {
    applicationId,
    ...(incidentId ? {
      id: incidentId
    } : {}),
    values: {}
  };
  return Object.keys(mappingConfig).reduce((acc, key) => {
    const fieldMap = mappingConfig[key];

    if (!fieldMap) {
      return acc;
    }

    const {
      id,
      fieldType
    } = fieldMap;
    const paramName = mappingKeysToIncidentKeys[key];
    const value = params[paramName];

    if (value) {
      switch (fieldType) {
        case 'numeric':
          {
            const number = Number(value);
            return { ...acc,
              values: { ...acc.values,
                [id]: isNaN(number) ? 0 : number
              }
            };
          }

        default:
          {
            return { ...acc,
              values: { ...acc.values,
                [id]: value
              }
            };
          }
      }
    }

    return acc;
  }, data);
};

exports.getBodyForEventAction = getBodyForEventAction;