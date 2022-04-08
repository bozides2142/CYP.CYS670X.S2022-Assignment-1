"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSessionSavedObjectMigrations = void 0;

var _common = require("../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getLocatorId(urlGeneratorId) {
  if (!urlGeneratorId) return;
  if (urlGeneratorId === 'DISCOVER_APP_URL_GENERATOR') return 'DISCOVER_APP_LOCATOR';
  if (urlGeneratorId === 'DASHBOARD_APP_URL_GENERATOR') return 'DASHBOARD_APP_LOCATOR';
  throw new Error(`No migration found for search session URL generator ${urlGeneratorId}`);
}

const searchSessionSavedObjectMigrations = {
  '7.13.0': doc => {
    if (doc.attributes.status === _common.SearchSessionStatus.COMPLETE) {
      return { ...doc,
        attributes: { ...doc.attributes,
          completed: doc.attributes.touched
        }
      };
    }

    return doc;
  },
  '7.14.0': doc => {
    return { ...doc,
      attributes: { ...doc.attributes,
        version: '7.13.0'
      }
    };
  },
  '8.0.0': doc => {
    const {
      attributes: {
        urlGeneratorId,
        ...otherAttrs
      }
    } = doc;
    const locatorId = getLocatorId(urlGeneratorId);
    const attributes = { ...otherAttrs,
      locatorId
    };
    return { ...doc,
      attributes
    };
  }
};
exports.searchSessionSavedObjectMigrations = searchSessionSavedObjectMigrations;