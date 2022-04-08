"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_BUFFER_TIME = exports.EVENT_BUFFER_LENGTH = exports.ClusterClientAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _util = _interopRequireDefault(require("util"));

var _esQuery = require("@kbn/es-query");

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EVENT_BUFFER_TIME = 1000; // milliseconds

exports.EVENT_BUFFER_TIME = EVENT_BUFFER_TIME;
const EVENT_BUFFER_LENGTH = 100;
exports.EVENT_BUFFER_LENGTH = EVENT_BUFFER_LENGTH;
const LEGACY_ID_CUTOFF_VERSION = '8.0.0';

class ClusterClientAdapter {
  constructor(opts) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "elasticsearchClientPromise", void 0);
    (0, _defineProperty2.default)(this, "docBuffer$", void 0);
    (0, _defineProperty2.default)(this, "wait", void 0);
    (0, _defineProperty2.default)(this, "docsBufferedFlushed", void 0);
    this.logger = opts.logger;
    this.elasticsearchClientPromise = opts.elasticsearchClientPromise;
    this.wait = opts.wait;
    this.docBuffer$ = new _rxjs.Subject(); // buffer event log docs for time / buffer length, ignore empty
    // buffers, then index the buffered docs; kick things off with a
    // promise on the observable, which we'll wait on in shutdown

    this.docsBufferedFlushed = this.docBuffer$.pipe((0, _operators.bufferTime)(EVENT_BUFFER_TIME, null, EVENT_BUFFER_LENGTH), (0, _operators.filter)(docs => docs.length > 0), (0, _operators.switchMap)(async docs => await this.indexDocuments(docs))).toPromise();
  } // This will be called at plugin stop() time; the assumption is any plugins
  // depending on the event_log will already be stopped, and so will not be
  // writing more event docs.  We complete the docBuffer$ observable,
  // and wait for the docsBufffered$ observable to complete via it's promise,
  // and so should end up writing all events out that pass through, before
  // Kibana shuts down (cleanly).


  async shutdown() {
    this.docBuffer$.complete();
    await this.docsBufferedFlushed;
  }

  indexDocument(doc) {
    this.docBuffer$.next(doc);
  }

  async indexDocuments(docs) {
    // If es initialization failed, don't try to index.
    // Also, don't log here, we log the failure case in plugin startup
    // instead, otherwise we'd be spamming the log (if done here)
    if (!(await this.wait())) {
      this.logger.debug(`Initialization failed, not indexing ${docs.length} documents`);
      return;
    }

    this.logger.debug(`Indexing ${docs.length} documents`);
    const bulkBody = [];

    for (const doc of docs) {
      if (doc.body === undefined) continue;
      bulkBody.push({
        create: {
          _index: doc.index
        }
      });
      bulkBody.push(doc.body);
    }

    try {
      const esClient = await this.elasticsearchClientPromise;
      const response = await esClient.bulk({
        body: bulkBody
      });

      if (response.body.errors) {
        const error = new Error('Error writing some bulk events');
        error.stack += '\n' + _util.default.inspect(response.body.items, {
          depth: null
        });
        this.logger.error(error);
      }
    } catch (err) {
      this.logger.error(`error writing bulk events: "${err.message}"; docs: ${JSON.stringify(bulkBody)}`);
    }
  }

  async doesIlmPolicyExist(policyName) {
    const request = {
      method: 'GET',
      path: `/_ilm/policy/${policyName}`
    };

    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.transport.request(request);
    } catch (err) {
      if (err.statusCode === 404) return false;
      throw new Error(`error checking existance of ilm policy: ${err.message}`);
    }

    return true;
  }

  async createIlmPolicy(policyName, policy) {
    const request = {
      method: 'PUT',
      path: `/_ilm/policy/${policyName}`,
      body: policy
    };

    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.transport.request(request);
    } catch (err) {
      throw new Error(`error creating ilm policy: ${err.message}`);
    }
  }

  async doesIndexTemplateExist(name) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      const {
        body: legacyResult
      } = await esClient.indices.existsTemplate({
        name
      });
      const {
        body: indexTemplateResult
      } = await esClient.indices.existsIndexTemplate({
        name
      });
      return legacyResult || indexTemplateResult;
    } catch (err) {
      throw new Error(`error checking existence of index template: ${err.message}`);
    }
  }

  async createIndexTemplate(name, template) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.putIndexTemplate({
        name,
        body: template,
        // @ts-expect-error doesn't exist in @elastic/elasticsearch
        create: true
      });
    } catch (err) {
      // The error message doesn't have a type attribute we can look to guarantee it's due
      // to the template already existing (only long message) so we'll check ourselves to see
      // if the template now exists. This scenario would happen if you startup multiple Kibana
      // instances at the same time.
      const existsNow = await this.doesIndexTemplateExist(name);

      if (!existsNow) {
        const error = new Error(`error creating index template: ${err.message}`);
        Object.assign(error, {
          wrapped: err
        });
        throw error;
      }
    }
  }

  async getExistingLegacyIndexTemplates(indexTemplatePattern) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      const {
        body: templates
      } = await esClient.indices.getTemplate({
        name: indexTemplatePattern
      }, {
        ignore: [404]
      });
      return templates;
    } catch (err) {
      throw new Error(`error getting existing legacy index templates: ${err.message}`);
    }
  }

  async setLegacyIndexTemplateToHidden(indexTemplateName, currentIndexTemplate) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.putTemplate({
        name: indexTemplateName,
        body: { ...currentIndexTemplate,
          settings: { ...currentIndexTemplate.settings,
            'index.hidden': true
          }
        }
      });
    } catch (err) {
      throw new Error(`error setting existing legacy index template ${indexTemplateName} to hidden: ${err.message}`);
    }
  }

  async getExistingIndices(indexPattern) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      const {
        body: indexSettings
      } = await esClient.indices.getSettings({
        index: indexPattern
      }, {
        ignore: [404]
      });
      return indexSettings;
    } catch (err) {
      throw new Error(`error getting existing indices matching pattern ${indexPattern}: ${err.message}`);
    }
  }

  async setIndexToHidden(indexName) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.putSettings({
        index: indexName,
        body: {
          'index.hidden': true
        }
      });
    } catch (err) {
      throw new Error(`error setting existing index ${indexName} to hidden: ${err.message}`);
    }
  }

  async getExistingIndexAliases(indexPattern) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      const {
        body: indexAliases
      } = await esClient.indices.getAlias({
        index: indexPattern
      }, {
        ignore: [404]
      });
      return indexAliases;
    } catch (err) {
      throw new Error(`error getting existing index aliases matching pattern ${indexPattern}: ${err.message}`);
    }
  }

  async setIndexAliasToHidden(aliasName, currentAliasData) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.updateAliases({
        body: {
          actions: currentAliasData.map(aliasData => {
            const existingAliasOptions = (0, _lodash.pick)(aliasData, ['is_write_index', 'filter', 'index_routing', 'routing', 'search_routing']);
            return {
              add: { ...existingAliasOptions,
                index: aliasData.indexName,
                alias: aliasName,
                is_hidden: true
              }
            };
          })
        }
      });
    } catch (err) {
      throw new Error(`error setting existing index aliases for alias ${aliasName} to is_hidden: ${err.message}`);
    }
  }

  async doesAliasExist(name) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      const {
        body
      } = await esClient.indices.existsAlias({
        name
      });
      return body;
    } catch (err) {
      throw new Error(`error checking existance of initial index: ${err.message}`);
    }
  }

  async createIndex(name, body = {}) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.create({
        index: name,
        body
      });
    } catch (err) {
      var _err$body, _err$body$error;

      if (((_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) !== 'resource_already_exists_exception') {
        throw new Error(`error creating initial index: ${err.message}`);
      }
    }
  }

  async queryEventsBySavedObjects(queryOptions) {
    const {
      index,
      namespace,
      type,
      ids,
      findOptions,
      legacyIds
    } = queryOptions; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      page,
      per_page: perPage,
      start,
      end,
      sort_field,
      sort_order,
      filter
    } = findOptions;
    const defaultNamespaceQuery = {
      bool: {
        must_not: {
          exists: {
            field: 'kibana.saved_objects.namespace'
          }
        }
      }
    };
    const namedNamespaceQuery = {
      term: {
        'kibana.saved_objects.namespace': {
          value: namespace
        }
      }
    };
    const namespaceQuery = namespace === undefined ? defaultNamespaceQuery : namedNamespaceQuery;
    const esClient = await this.elasticsearchClientPromise;
    let dslFilterQuery;

    try {
      dslFilterQuery = filter ? (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(filter)) : [];
    } catch (err) {
      this.debug(`Invalid kuery syntax for the filter (${filter}) error:`, {
        message: err.message,
        statusCode: err.statusCode
      });
      throw err;
    }

    const savedObjectsQueryMust = [{
      term: {
        'kibana.saved_objects.rel': {
          value: _types.SAVED_OBJECT_REL_PRIMARY
        }
      }
    }, {
      term: {
        'kibana.saved_objects.type': {
          value: type
        }
      }
    }, // @ts-expect-error undefined is not assignable as QueryDslTermQuery value
    namespaceQuery];
    const musts = [{
      nested: {
        path: 'kibana.saved_objects',
        query: {
          bool: {
            must: (0, _lodash.reject)(savedObjectsQueryMust, _lodash.isUndefined)
          }
        }
      }
    }];
    const shouldQuery = [];
    shouldQuery.push({
      bool: {
        must: [{
          nested: {
            path: 'kibana.saved_objects',
            query: {
              bool: {
                must: [{
                  terms: {
                    // default maximum of 65,536 terms, configurable by index.max_terms_count
                    'kibana.saved_objects.id': ids
                  }
                }]
              }
            }
          }
        }, {
          range: {
            'kibana.version': {
              gte: LEGACY_ID_CUTOFF_VERSION
            }
          }
        }]
      }
    });

    if (legacyIds && legacyIds.length > 0) {
      shouldQuery.push({
        bool: {
          must: [{
            nested: {
              path: 'kibana.saved_objects',
              query: {
                bool: {
                  must: [{
                    terms: {
                      // default maximum of 65,536 terms, configurable by index.max_terms_count
                      'kibana.saved_objects.id': legacyIds
                    }
                  }]
                }
              }
            }
          }, {
            bool: {
              should: [{
                range: {
                  'kibana.version': {
                    lt: LEGACY_ID_CUTOFF_VERSION
                  }
                }
              }, {
                bool: {
                  must_not: {
                    exists: {
                      field: 'kibana.version'
                    }
                  }
                }
              }]
            }
          }]
        }
      });
    }

    musts.push({
      bool: {
        should: shouldQuery
      }
    });

    if (start) {
      musts.push({
        range: {
          '@timestamp': {
            gte: start
          }
        }
      });
    }

    if (end) {
      musts.push({
        range: {
          '@timestamp': {
            lte: end
          }
        }
      });
    }

    const body = {
      size: perPage,
      from: (page - 1) * perPage,
      sort: [{
        [sort_field]: {
          order: sort_order
        }
      }],
      query: {
        bool: {
          filter: dslFilterQuery,
          must: (0, _lodash.reject)(musts, _lodash.isUndefined)
        }
      }
    };

    try {
      const {
        body: {
          hits: {
            hits,
            total
          }
        }
      } = await esClient.search({
        index,
        track_total_hits: true,
        body
      });
      return {
        page,
        per_page: perPage,
        total: (0, _lodash.isNumber)(total) ? total : total.value,
        data: hits.map(hit => hit._source)
      };
    } catch (err) {
      throw new Error(`querying for Event Log by for type "${type}" and ids "${ids}" failed with: ${err.message}`);
    }
  }

  debug(message, object) {
    const objectString = object == null ? '' : JSON.stringify(object);
    this.logger.debug(`esContext: ${message} ${objectString}`);
  }

}

exports.ClusterClientAdapter = ClusterClientAdapter;