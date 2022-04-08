"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const format = (theCase, alerts) => {
  var _ref, _theCase$id;

  const {
    destIp = null,
    sourceIp = null,
    category = null,
    subcategory = null,
    malwareHash = null,
    malwareUrl = null,
    priority = null
  } = (_ref = theCase.connector.fields) !== null && _ref !== void 0 ? _ref : {};
  const alertFieldMapping = {
    destIp: {
      alertPath: 'destination.ip',
      sirFieldKey: 'dest_ip',
      add: !!destIp
    },
    sourceIp: {
      alertPath: 'source.ip',
      sirFieldKey: 'source_ip',
      add: !!sourceIp
    },
    malwareHash: {
      alertPath: 'file.hash.sha256',
      sirFieldKey: 'malware_hash',
      add: !!malwareHash
    },
    malwareUrl: {
      alertPath: 'url.full',
      sirFieldKey: 'malware_url',
      add: !!malwareUrl
    }
  };
  const manageDuplicate = {
    dest_ip: new Set(),
    source_ip: new Set(),
    malware_hash: new Set(),
    malware_url: new Set()
  };
  let sirFields = {
    dest_ip: [],
    source_ip: [],
    malware_hash: [],
    malware_url: []
  };
  const fieldsToAdd = Object.keys(alertFieldMapping).filter(key => alertFieldMapping[key].add);

  if (fieldsToAdd.length > 0) {
    sirFields = alerts.reduce((acc, alert) => {
      let temp = {};
      fieldsToAdd.forEach(alertField => {
        const field = (0, _fp.get)(alertFieldMapping[alertField].alertPath, alert);

        if (field && !manageDuplicate[alertFieldMapping[alertField].sirFieldKey].has(field)) {
          manageDuplicate[alertFieldMapping[alertField].sirFieldKey].add(field);
          temp = { ...acc,
            ...temp,
            [alertFieldMapping[alertField].sirFieldKey]: [...acc[alertFieldMapping[alertField].sirFieldKey], field]
          };
        }
      });
      return { ...acc,
        ...temp
      };
    }, sirFields);
  }

  return { ...sirFields,
    category,
    subcategory,
    priority,
    correlation_id: (_theCase$id = theCase.id) !== null && _theCase$id !== void 0 ? _theCase$id : null,
    correlation_display: 'Elastic Case'
  };
};

exports.format = format;