"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAccountCreateSourceRoute = registerAccountCreateSourceRoute;
exports.registerAccountPreSourceRoute = registerAccountPreSourceRoute;
exports.registerAccountPrepareSourcesRoute = registerAccountPrepareSourcesRoute;
exports.registerAccountSourceDisplaySettingsConfig = registerAccountSourceDisplaySettingsConfig;
exports.registerAccountSourceDocumentsRoute = registerAccountSourceDocumentsRoute;
exports.registerAccountSourceDownloadDiagnosticsRoute = registerAccountSourceDownloadDiagnosticsRoute;
exports.registerAccountSourceFederatedSummaryRoute = registerAccountSourceFederatedSummaryRoute;
exports.registerAccountSourceReauthPrepareRoute = registerAccountSourceReauthPrepareRoute;
exports.registerAccountSourceReindexJobRoute = registerAccountSourceReindexJobRoute;
exports.registerAccountSourceRoute = registerAccountSourceRoute;
exports.registerAccountSourceSchemasRoute = registerAccountSourceSchemasRoute;
exports.registerAccountSourceSearchableRoute = registerAccountSourceSearchableRoute;
exports.registerAccountSourceSettingsRoute = registerAccountSourceSettingsRoute;
exports.registerAccountSourcesRoute = registerAccountSourcesRoute;
exports.registerAccountSourcesStatusRoute = registerAccountSourcesStatusRoute;
exports.registerOauthConnectorParamsRoute = registerOauthConnectorParamsRoute;
exports.registerOrgCreateSourceRoute = registerOrgCreateSourceRoute;
exports.registerOrgPreSourceRoute = registerOrgPreSourceRoute;
exports.registerOrgPrepareSourcesRoute = registerOrgPrepareSourcesRoute;
exports.registerOrgSourceDisplaySettingsConfig = registerOrgSourceDisplaySettingsConfig;
exports.registerOrgSourceDocumentsRoute = registerOrgSourceDocumentsRoute;
exports.registerOrgSourceDownloadDiagnosticsRoute = registerOrgSourceDownloadDiagnosticsRoute;
exports.registerOrgSourceFederatedSummaryRoute = registerOrgSourceFederatedSummaryRoute;
exports.registerOrgSourceOauthConfigurationRoute = registerOrgSourceOauthConfigurationRoute;
exports.registerOrgSourceOauthConfigurationsRoute = registerOrgSourceOauthConfigurationsRoute;
exports.registerOrgSourceReauthPrepareRoute = registerOrgSourceReauthPrepareRoute;
exports.registerOrgSourceReindexJobRoute = registerOrgSourceReindexJobRoute;
exports.registerOrgSourceRoute = registerOrgSourceRoute;
exports.registerOrgSourceSchemasRoute = registerOrgSourceSchemasRoute;
exports.registerOrgSourceSearchableRoute = registerOrgSourceSearchableRoute;
exports.registerOrgSourceSettingsRoute = registerOrgSourceSettingsRoute;
exports.registerOrgSourceSynchronizeRoute = registerOrgSourceSynchronizeRoute;
exports.registerOrgSourcesRoute = registerOrgSourcesRoute;
exports.registerOrgSourcesStatusRoute = registerOrgSourcesStatusRoute;
exports.registerSourcesRoutes = void 0;

var _configSchema = require("@kbn/config-schema");

var _get_oauth_token_package_params = require("../../lib/get_oauth_token_package_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const schemaValuesSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.oneOf([_configSchema.schema.literal('text'), _configSchema.schema.literal('number'), _configSchema.schema.literal('geolocation'), _configSchema.schema.literal('date')]));

const pageSchema = _configSchema.schema.object({
  current: _configSchema.schema.nullable(_configSchema.schema.number()),
  size: _configSchema.schema.nullable(_configSchema.schema.number()),
  total_pages: _configSchema.schema.nullable(_configSchema.schema.number()),
  total_results: _configSchema.schema.nullable(_configSchema.schema.number())
});

const oauthConfigSchema = _configSchema.schema.object({
  base_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  client_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  client_secret: _configSchema.schema.maybe(_configSchema.schema.string()),
  service_type: _configSchema.schema.string(),
  private_key: _configSchema.schema.maybe(_configSchema.schema.string()),
  public_key: _configSchema.schema.maybe(_configSchema.schema.string()),
  consumer_key: _configSchema.schema.maybe(_configSchema.schema.string())
});

const displayFieldSchema = _configSchema.schema.object({
  fieldName: _configSchema.schema.string(),
  label: _configSchema.schema.string()
});

const displaySettingsSchema = _configSchema.schema.object({
  titleField: _configSchema.schema.maybe(_configSchema.schema.string()),
  subtitleField: _configSchema.schema.nullable(_configSchema.schema.string()),
  descriptionField: _configSchema.schema.nullable(_configSchema.schema.string()),
  urlField: _configSchema.schema.maybe(_configSchema.schema.string()),
  typeField: _configSchema.schema.nullable(_configSchema.schema.string()),
  mediaTypeField: _configSchema.schema.nullable(_configSchema.schema.string()),
  createdByField: _configSchema.schema.nullable(_configSchema.schema.string()),
  updatedByField: _configSchema.schema.nullable(_configSchema.schema.string()),
  color: _configSchema.schema.string(),
  urlFieldIsLinkable: _configSchema.schema.boolean(),
  detailFields: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(displayFieldSchema), displayFieldSchema])
});

const sourceSettingsSchema = _configSchema.schema.object({
  content_source: _configSchema.schema.object({
    name: _configSchema.schema.maybe(_configSchema.schema.string()),
    private_key: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
    indexing: _configSchema.schema.maybe(_configSchema.schema.object({
      enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
      features: _configSchema.schema.maybe(_configSchema.schema.object({
        thumbnails: _configSchema.schema.maybe(_configSchema.schema.object({
          enabled: _configSchema.schema.boolean()
        })),
        content_extraction: _configSchema.schema.maybe(_configSchema.schema.object({
          enabled: _configSchema.schema.boolean()
        }))
      })),
      schedule: _configSchema.schema.maybe(_configSchema.schema.object({
        full: _configSchema.schema.maybe(_configSchema.schema.string()),
        incremental: _configSchema.schema.maybe(_configSchema.schema.string()),
        delete: _configSchema.schema.maybe(_configSchema.schema.string()),
        permissions: _configSchema.schema.maybe(_configSchema.schema.string()),
        blocked_windows: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          job_type: _configSchema.schema.string(),
          day: _configSchema.schema.string(),
          start: _configSchema.schema.string(),
          end: _configSchema.schema.string()
        })))
      }))
    }))
  })
}); // Account routes


function registerAccountSourcesRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources'
  }));
}

function registerAccountSourcesStatusRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/status',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/status'
  }));
}

function registerAccountSourceRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id'
  }));
  router.delete({
    path: '/internal/workplace_search/account/sources/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id'
  }));
}

function registerAccountCreateSourceRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/account/create_source',
    validate: {
      body: _configSchema.schema.object({
        service_type: _configSchema.schema.string(),
        name: _configSchema.schema.maybe(_configSchema.schema.string()),
        login: _configSchema.schema.maybe(_configSchema.schema.string()),
        password: _configSchema.schema.maybe(_configSchema.schema.string()),
        organizations: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        index_permissions: _configSchema.schema.maybe(_configSchema.schema.boolean())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/form_create'
  }));
}

function registerAccountSourceDocumentsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/account/sources/{id}/documents',
    validate: {
      body: _configSchema.schema.object({
        query: _configSchema.schema.string(),
        page: pageSchema
      }),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/documents'
  }));
}

function registerAccountSourceFederatedSummaryRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{id}/federated_summary',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/federated_summary'
  }));
}

function registerAccountSourceReauthPrepareRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{id}/reauth_prepare',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        kibana_host: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/reauth_prepare'
  }));
}

function registerAccountSourceSettingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.patch({
    path: '/internal/workplace_search/account/sources/{id}/settings',
    validate: {
      body: sourceSettingsSchema,
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/settings'
  }));
}

function registerAccountPreSourceRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/pre_sources/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/pre_content_sources/:id'
  }));
}

function registerAccountPrepareSourcesRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{serviceType}/prepare',
    validate: {
      params: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        kibana_host: _configSchema.schema.string(),
        subdomain: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:serviceType/prepare'
  }));
}

function registerAccountSourceSearchableRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/workplace_search/account/sources/{id}/searchable',
    validate: {
      body: _configSchema.schema.object({
        searchable: _configSchema.schema.boolean()
      }),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/searchable'
  }));
}

function registerAccountSourceDisplaySettingsConfig({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{id}/display_settings/config',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/display_settings/config'
  }));
  router.post({
    path: '/internal/workplace_search/account/sources/{id}/display_settings/config',
    validate: {
      body: displaySettingsSchema,
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/display_settings/config'
  }));
}

function registerAccountSourceSchemasRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{id}/schemas',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/schemas'
  }));
  router.post({
    path: '/internal/workplace_search/account/sources/{id}/schemas',
    validate: {
      body: schemaValuesSchema,
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:id/schemas'
  }));
}

function registerAccountSourceReindexJobRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{sourceId}/reindex_job/{jobId}',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string(),
        jobId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:sourceId/reindex_job/:jobId'
  }));
}

function registerAccountSourceDownloadDiagnosticsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/account/sources/{sourceId}/download_diagnostics',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/sources/:sourceId/download_diagnostics',
    hasJsonResponse: false
  }));
} // Org routes


function registerOrgSourcesRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources'
  }));
}

function registerOrgSourcesStatusRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/status',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/status'
  }));
}

function registerOrgSourceRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id'
  }));
  router.delete({
    path: '/internal/workplace_search/org/sources/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id'
  }));
}

function registerOrgCreateSourceRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/org/create_source',
    validate: {
      body: _configSchema.schema.object({
        service_type: _configSchema.schema.string(),
        name: _configSchema.schema.maybe(_configSchema.schema.string()),
        login: _configSchema.schema.maybe(_configSchema.schema.string()),
        password: _configSchema.schema.maybe(_configSchema.schema.string()),
        organizations: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        index_permissions: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        app_id: _configSchema.schema.maybe(_configSchema.schema.string()),
        base_url: _configSchema.schema.maybe(_configSchema.schema.string()),
        private_key: _configSchema.schema.nullable(_configSchema.schema.maybe(_configSchema.schema.string()))
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/form_create'
  }));
}

function registerOrgSourceDocumentsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/org/sources/{id}/documents',
    validate: {
      body: _configSchema.schema.object({
        query: _configSchema.schema.string(),
        page: pageSchema
      }),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/documents'
  }));
}

function registerOrgSourceFederatedSummaryRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{id}/federated_summary',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/federated_summary'
  }));
}

function registerOrgSourceReauthPrepareRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{id}/reauth_prepare',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        kibana_host: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/reauth_prepare'
  }));
}

function registerOrgSourceSettingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.patch({
    path: '/internal/workplace_search/org/sources/{id}/settings',
    validate: {
      body: sourceSettingsSchema,
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/settings'
  }));
}

function registerOrgPreSourceRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/pre_sources/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/pre_content_sources/:id'
  }));
}

function registerOrgPrepareSourcesRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{serviceType}/prepare',
    validate: {
      params: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        kibana_host: _configSchema.schema.string(),
        index_permissions: _configSchema.schema.boolean(),
        subdomain: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:serviceType/prepare'
  }));
}

function registerOrgSourceSearchableRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/workplace_search/org/sources/{id}/searchable',
    validate: {
      body: _configSchema.schema.object({
        searchable: _configSchema.schema.boolean()
      }),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/searchable'
  }));
}

function registerOrgSourceDisplaySettingsConfig({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{id}/display_settings/config',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/display_settings/config'
  }));
  router.post({
    path: '/internal/workplace_search/org/sources/{id}/display_settings/config',
    validate: {
      body: displaySettingsSchema,
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/display_settings/config'
  }));
}

function registerOrgSourceSchemasRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{id}/schemas',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/schemas'
  }));
  router.post({
    path: '/internal/workplace_search/org/sources/{id}/schemas',
    validate: {
      body: schemaValuesSchema,
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/schemas'
  }));
}

function registerOrgSourceReindexJobRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{sourceId}/reindex_job/{jobId}',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string(),
        jobId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:sourceId/reindex_job/:jobId'
  }));
}

function registerOrgSourceDownloadDiagnosticsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/sources/{sourceId}/download_diagnostics',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:sourceId/download_diagnostics',
    hasJsonResponse: false
  }));
}

function registerOrgSourceOauthConfigurationsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/settings/connectors',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors'
  }));
  router.post({
    path: '/internal/workplace_search/org/settings/connectors',
    validate: {
      body: oauthConfigSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors'
  }));
  router.put({
    path: '/internal/workplace_search/org/settings/connectors',
    validate: {
      body: oauthConfigSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors'
  }));
}

function registerOrgSourceOauthConfigurationRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/settings/connectors/{serviceType}',
    validate: {
      params: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors/:serviceType'
  }));
  router.post({
    path: '/internal/workplace_search/org/settings/connectors/{serviceType}',
    validate: {
      params: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      }),
      body: oauthConfigSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors/:serviceType'
  }));
  router.put({
    path: '/internal/workplace_search/org/settings/connectors/{serviceType}',
    validate: {
      params: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      }),
      body: oauthConfigSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors/:serviceType'
  }));
  router.delete({
    path: '/internal/workplace_search/org/settings/connectors/{serviceType}',
    validate: {
      params: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/connectors/:serviceType'
  }));
}

function registerOrgSourceSynchronizeRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/org/sources/{id}/sync',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/sources/:id/sync'
  }));
} // Same route is used for org and account. `state` passes the context.


function registerOauthConnectorParamsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/sources/create',
    validate: {
      query: _configSchema.schema.object({
        kibana_host: _configSchema.schema.string(),
        code: _configSchema.schema.maybe(_configSchema.schema.string()),
        session_state: _configSchema.schema.maybe(_configSchema.schema.string()),
        authuser: _configSchema.schema.maybe(_configSchema.schema.string()),
        prompt: _configSchema.schema.maybe(_configSchema.schema.string()),
        hd: _configSchema.schema.maybe(_configSchema.schema.string()),
        scope: _configSchema.schema.maybe(_configSchema.schema.string()),
        state: _configSchema.schema.string(),
        oauth_token: _configSchema.schema.maybe(_configSchema.schema.string()),
        oauth_verifier: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    return enterpriseSearchRequestHandler.createRequest({
      path: '/ws/sources/create',
      params: (0, _get_oauth_token_package_params.getOAuthTokenPackageParams)(request.headers.cookie)
    })(context, request, response);
  });
}

const registerSourcesRoutes = dependencies => {
  registerAccountSourcesRoute(dependencies);
  registerAccountSourcesStatusRoute(dependencies);
  registerAccountSourceRoute(dependencies);
  registerAccountCreateSourceRoute(dependencies);
  registerAccountSourceDocumentsRoute(dependencies);
  registerAccountSourceFederatedSummaryRoute(dependencies);
  registerAccountSourceReauthPrepareRoute(dependencies);
  registerAccountSourceSettingsRoute(dependencies);
  registerAccountPreSourceRoute(dependencies);
  registerAccountPrepareSourcesRoute(dependencies);
  registerAccountSourceSearchableRoute(dependencies);
  registerAccountSourceDisplaySettingsConfig(dependencies);
  registerAccountSourceSchemasRoute(dependencies);
  registerAccountSourceReindexJobRoute(dependencies);
  registerAccountSourceDownloadDiagnosticsRoute(dependencies);
  registerOrgSourcesRoute(dependencies);
  registerOrgSourcesStatusRoute(dependencies);
  registerOrgSourceRoute(dependencies);
  registerOrgCreateSourceRoute(dependencies);
  registerOrgSourceDocumentsRoute(dependencies);
  registerOrgSourceFederatedSummaryRoute(dependencies);
  registerOrgSourceReauthPrepareRoute(dependencies);
  registerOrgSourceSettingsRoute(dependencies);
  registerOrgPreSourceRoute(dependencies);
  registerOrgPrepareSourcesRoute(dependencies);
  registerOrgSourceSearchableRoute(dependencies);
  registerOrgSourceDisplaySettingsConfig(dependencies);
  registerOrgSourceSchemasRoute(dependencies);
  registerOrgSourceReindexJobRoute(dependencies);
  registerOrgSourceDownloadDiagnosticsRoute(dependencies);
  registerOrgSourceOauthConfigurationsRoute(dependencies);
  registerOrgSourceOauthConfigurationRoute(dependencies);
  registerOrgSourceSynchronizeRoute(dependencies);
  registerOauthConnectorParamsRoute(dependencies);
};

exports.registerSourcesRoutes = registerSourcesRoutes;