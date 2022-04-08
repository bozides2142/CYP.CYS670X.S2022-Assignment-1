"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteEnrollmentApiKey = deleteEnrollmentApiKey;
exports.deleteEnrollmentApiKeyForAgentPolicyId = deleteEnrollmentApiKeyForAgentPolicyId;
exports.generateEnrollmentAPIKey = generateEnrollmentAPIKey;
exports.getEnrollmentAPIKey = getEnrollmentAPIKey;
exports.getEnrollmentAPIKeyById = getEnrollmentAPIKeyById;
exports.hasEnrollementAPIKeysForPolicy = hasEnrollementAPIKeysForPolicy;
exports.listEnrollmentApiKeys = listEnrollmentApiKeys;

var _uuid = _interopRequireDefault(require("uuid"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _elasticsearch = require("@elastic/elasticsearch");

var _esQuery = require("@kbn/es-query");

var _errors = require("../../errors");

var _constants = require("../../constants");

var _agent_policy = require("../agent_policy");

var _saved_object = require("../saved_object");

var _security = require("./security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uuidRegex = /^\([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\)$/;

async function listEnrollmentApiKeys(esClient, options) {
  var _options$query;

  const {
    page = 1,
    perPage = 20,
    kuery
  } = options;
  const query = (_options$query = options.query) !== null && _options$query !== void 0 ? _options$query : kuery && (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(kuery));
  const res = await esClient.search({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    from: (page - 1) * perPage,
    size: perPage,
    track_total_hits: true,
    ignore_unavailable: true,
    body: {
      sort: [{
        created_at: {
          order: 'desc'
        }
      }],
      ...(query ? {
        query
      } : {})
    }
  }); // @ts-expect-error @elastic/elasticsearch _source is optional

  const items = res.body.hits.hits.map(esDocToEnrollmentApiKey);
  return {
    items,
    // @ts-expect-error value is number | TotalHits
    total: res.body.hits.total.value,
    page,
    perPage
  };
}

async function hasEnrollementAPIKeysForPolicy(esClient, policyId) {
  const res = await listEnrollmentApiKeys(esClient, {
    kuery: `policy_id:"${policyId}"`
  });
  return res.total !== 0;
}

async function getEnrollmentAPIKey(esClient, id) {
  try {
    const res = await esClient.get({
      index: _constants.ENROLLMENT_API_KEYS_INDEX,
      id
    }); // @ts-expect-error esDocToEnrollmentApiKey doesn't accept optional _source

    return esDocToEnrollmentApiKey(res.body);
  } catch (e) {
    if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
      throw _boom.default.notFound(`Enrollment api key ${id} not found`);
    }

    throw e;
  }
}
/**
 * Invalidate an api key and mark it as inactive
 * @param id
 */


async function deleteEnrollmentApiKey(esClient, id, forceDelete = false) {
  const enrollmentApiKey = await getEnrollmentAPIKey(esClient, id);
  await (0, _security.invalidateAPIKeys)([enrollmentApiKey.api_key_id]);

  if (forceDelete) {
    await esClient.delete({
      index: _constants.ENROLLMENT_API_KEYS_INDEX,
      id,
      refresh: 'wait_for'
    });
  } else {
    await esClient.update({
      index: _constants.ENROLLMENT_API_KEYS_INDEX,
      id,
      body: {
        doc: {
          active: false
        }
      },
      refresh: 'wait_for'
    });
  }
}

async function deleteEnrollmentApiKeyForAgentPolicyId(esClient, agentPolicyId) {
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const {
      items
    } = await listEnrollmentApiKeys(esClient, {
      page: page++,
      perPage: 100,
      kuery: `policy_id:${agentPolicyId}`
    });

    if (items.length === 0) {
      hasMore = false;
    }

    for (const apiKey of items) {
      await deleteEnrollmentApiKey(esClient, apiKey.id);
    }
  }
}

async function generateEnrollmentAPIKey(soClient, esClient, data) {
  const id = _uuid.default.v4();

  const {
    name: providedKeyName,
    forceRecreate
  } = data;

  if (data.agentPolicyId) {
    await validateAgentPolicyId(soClient, data.agentPolicyId);
  }

  const agentPolicyId = data.agentPolicyId;

  if (providedKeyName && !forceRecreate) {
    let hasMore = true;
    let page = 1;
    let keys = [];

    while (hasMore) {
      const {
        items
      } = await listEnrollmentApiKeys(esClient, {
        page: page++,
        perPage: 100,
        query: getQueryForExistingKeyNameOnPolicy(agentPolicyId, providedKeyName)
      });

      if (items.length === 0) {
        hasMore = false;
      } else {
        keys = keys.concat(items);
      }
    }

    if (keys.length > 0 && keys.some(k => {
      var _k$name;

      return (// Prevent false positives when the providedKeyName is a prefix of a token name that already exists
        // After removing the providedKeyName and trimming whitespace, the only string left should be a uuid in parens.
        (_k$name = k.name) === null || _k$name === void 0 ? void 0 : _k$name.replace(providedKeyName, '').trim().match(uuidRegex)
      );
    })) {
      throw new _errors.IngestManagerError(_i18n.i18n.translate('xpack.fleet.serverError.enrollmentKeyDuplicate', {
        defaultMessage: 'An enrollment key named {providedKeyName} already exists for agent policy {agentPolicyId}',
        values: {
          providedKeyName,
          agentPolicyId
        }
      }));
    }
  }

  const name = providedKeyName ? `${providedKeyName} (${id})` : id;
  const {
    body: key
  } = await esClient.security.createApiKey({
    body: {
      name,
      metadata: {
        managed_by: 'fleet',
        managed: true,
        type: 'enroll',
        policy_id: data.agentPolicyId
      },
      role_descriptors: {
        // Useless role to avoid to have the privilege of the user that created the key
        'fleet-apikey-enroll': {
          cluster: [],
          index: [],
          applications: [{
            application: 'fleet',
            privileges: ['no-privileges'],
            resources: ['*']
          }]
        }
      }
    }
  }).catch(err => {
    throw new Error(`Impossible to create an api key: ${err.message}`);
  });

  if (!key) {
    throw new Error(_i18n.i18n.translate('xpack.fleet.serverError.unableToCreateEnrollmentKey', {
      defaultMessage: 'Unable to create an enrollment api key'
    }));
  }

  const apiKey = Buffer.from(`${key.id}:${key.api_key}`).toString('base64');
  const body = {
    active: true,
    api_key_id: key.id,
    api_key: apiKey,
    name,
    policy_id: agentPolicyId,
    created_at: new Date().toISOString()
  };
  const res = await esClient.create({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    body,
    id,
    refresh: 'wait_for'
  });
  return {
    id: res.body._id,
    ...body
  };
}

function getQueryForExistingKeyNameOnPolicy(agentPolicyId, providedKeyName) {
  const query = {
    bool: {
      filter: [{
        bool: {
          should: [{
            match_phrase: {
              policy_id: agentPolicyId
            }
          }],
          minimum_should_match: 1
        }
      }, {
        bool: {
          should: [{
            query_string: {
              fields: ['name'],
              query: `(${providedKeyName}) *`
            }
          }],
          minimum_should_match: 1
        }
      }]
    }
  };
  return query;
}

async function getEnrollmentAPIKeyById(esClient, apiKeyId) {
  const res = await esClient.search({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    ignore_unavailable: true,
    q: `api_key_id:${(0, _saved_object.escapeSearchQueryPhrase)(apiKeyId)}`
  }); // @ts-expect-error esDocToEnrollmentApiKey doesn't accept optional _source

  const [enrollmentAPIKey] = res.body.hits.hits.map(esDocToEnrollmentApiKey);

  if ((enrollmentAPIKey === null || enrollmentAPIKey === void 0 ? void 0 : enrollmentAPIKey.api_key_id) !== apiKeyId) {
    throw new Error(_i18n.i18n.translate('xpack.fleet.serverError.returnedIncorrectKey', {
      defaultMessage: 'find enrollmentKeyById returned an incorrect key'
    }));
  }

  return enrollmentAPIKey;
}

async function validateAgentPolicyId(soClient, agentPolicyId) {
  try {
    await _agent_policy.agentPolicyService.get(soClient, agentPolicyId);
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.fleet.serverError.agentPolicyDoesNotExist', {
        defaultMessage: 'Agent policy {agentPolicyId} does not exist',
        values: {
          agentPolicyId
        }
      }));
    }

    throw e;
  }
}

function esDocToEnrollmentApiKey(doc) {
  return {
    id: doc._id,
    ...doc._source,
    created_at: doc._source.created_at,
    active: doc._source.active || false
  };
}