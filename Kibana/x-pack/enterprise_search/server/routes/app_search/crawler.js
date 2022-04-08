"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCrawlerRoutes = registerCrawlerRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCrawlerRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{name}/crawler',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler'
  }));
  router.get({
    path: '/internal/app_search/engines/{name}/crawler/crawl_requests',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_requests'
  }));
  router.get({
    path: '/internal/app_search/engines/{name}/crawler/crawl_requests/{id}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_requests/:id'
  }));
  router.post({
    path: '/internal/app_search/engines/{name}/crawler/crawl_requests',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        overrides: _configSchema.schema.maybe(_configSchema.schema.object({
          domain_allowlist: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
        }))
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_requests'
  }));
  router.post({
    path: '/internal/app_search/engines/{name}/crawler/crawl_requests/cancel',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_requests/active/cancel'
  }));
  router.get({
    path: '/internal/app_search/engines/{name}/crawler/domains',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        'page[current]': _configSchema.schema.number(),
        'page[size]': _configSchema.schema.number()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/domains'
  }));
  router.post({
    path: '/internal/app_search/engines/{name}/crawler/domains',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        entry_points: _configSchema.schema.arrayOf(_configSchema.schema.object({
          value: _configSchema.schema.string()
        }))
      }),
      query: _configSchema.schema.object({
        respond_with: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/domains'
  }));
  router.get({
    path: '/internal/app_search/engines/{name}/crawler/domains/{id}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/domains/:id'
  }));
  router.delete({
    path: '/internal/app_search/engines/{name}/crawler/domains/{id}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        respond_with: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/domains/:id'
  }));
  router.put({
    path: '/internal/app_search/engines/{name}/crawler/domains/{id}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        crawl_rules: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          order: _configSchema.schema.number(),
          id: _configSchema.schema.string()
        }))),
        deduplication_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        deduplication_fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/domains/:id'
  }));
  router.post({
    path: '/internal/app_search/crawler/validate_url',
    validate: {
      body: _configSchema.schema.object({
        url: _configSchema.schema.string(),
        checks: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/crawler/validate_url'
  }));
  router.post({
    path: '/internal/app_search/engines/{name}/crawler/process_crawls',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        domains: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/process_crawls'
  }));
  router.get({
    path: '/internal/app_search/engines/{name}/crawler/crawl_schedule',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_schedule'
  }));
  router.put({
    path: '/internal/app_search/engines/{name}/crawler/crawl_schedule',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        unit: _configSchema.schema.string(),
        frequency: _configSchema.schema.number()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_schedule'
  }));
  router.delete({
    path: '/internal/app_search/engines/{name}/crawler/crawl_schedule',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:name/crawler/crawl_schedule'
  }));
}