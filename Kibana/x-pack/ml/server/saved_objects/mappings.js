"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlModule = exports.mlJob = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mlJob = {
  properties: {
    job_id: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    datafeed_id: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    type: {
      type: 'keyword'
    }
  }
};
exports.mlJob = mlJob;
const mlModule = {
  dynamic: false,
  properties: {
    id: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    title: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    description: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    type: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    logo: {
      type: 'object'
    },
    defaultIndexPattern: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    },
    query: {
      type: 'object'
    },
    jobs: {
      type: 'object'
    },
    datafeeds: {
      type: 'object'
    }
  }
};
exports.mlModule = mlModule;