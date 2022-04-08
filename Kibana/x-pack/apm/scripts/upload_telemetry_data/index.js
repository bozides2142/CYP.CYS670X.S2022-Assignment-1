"use strict";

var _lodash = require("lodash");

var _yargs = require("yargs");

var _download_telemetry_template = require("../shared/download_telemetry_template");

var _apm_telemetry = require("../../common/apm_telemetry");

var _generate_sample_documents = require("./generate_sample_documents");

var _read_kibana_config = require("../shared/read_kibana_config");

var _get_http_auth = require("../shared/get_http_auth");

var _create_or_update_index = require("../shared/create_or_update_index");

var _get_es_client = require("../shared/get_es_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This script downloads the telemetry mapping, runs the APM telemetry tasks,
// generates a bunch of randomized data based on the downloaded sample,
// and uploads it to a cluster of your choosing in the same format as it is
// stored in the telemetry cluster. Its purpose is twofold:
// - Easier testing of the telemetry tasks
// - Validate whether we can run the queries we want to on the telemetry data


async function uploadData() {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw new Error('GITHUB_TOKEN was not provided.');
  }

  const xpackTelemetryIndexName = 'xpack-phone-home';
  const telemetryTemplate = await (0, _download_telemetry_template.downloadTelemetryTemplate)({
    githubToken
  });
  const config = (0, _read_kibana_config.readKibanaConfig)();
  const httpAuth = (0, _get_http_auth.getHttpAuth)(config);
  const client = (0, _get_es_client.getEsClient)({
    node: config['elasticsearch.hosts'],
    ...(httpAuth ? {
      auth: { ...httpAuth,
        username: 'elastic'
      }
    } : {})
  }); // The new template is the template downloaded from the telemetry repo, with
  // our current telemetry mapping merged in, with the "index_patterns" key
  // (which cannot be used when creating an index) removed.

  const newTemplate = (0, _lodash.omit)((0, _apm_telemetry.mergeApmTelemetryMapping)((0, _lodash.merge)(telemetryTemplate, {
    index_patterns: undefined,
    settings: {
      index: {
        mapping: {
          total_fields: {
            limit: 10000
          }
        }
      }
    }
  })), 'index_patterns');
  await (0, _create_or_update_index.createOrUpdateIndex)({
    indexName: xpackTelemetryIndexName,
    client,
    template: newTemplate,
    clear: !!_yargs.argv.clear
  });
  const sampleDocuments = await (0, _generate_sample_documents.generateSampleDocuments)({
    collectTelemetryParams: {
      logger: console,
      indices: {
        transaction: config['xpack.apm.indices.transaction'],
        metric: config['xpack.apm.indices.metric'],
        error: config['xpack.apm.indices.error'],
        span: config['xpack.apm.indices.span'],
        onboarding: config['xpack.apm.indices.onboarding'],
        sourcemap: config['xpack.apm.indices.sourcemap'],
        apmCustomLinkIndex: '.apm-custom-links',
        apmAgentConfigurationIndex: '.apm-agent-configuration'
      },
      search: body => {
        return client.search(body);
      },
      indicesStats: body => {
        return client.indices.stats(body);
      },
      transportRequest: params => {
        return;
      }
    }
  });
  const chunks = (0, _lodash.chunk)(sampleDocuments, 250);
  await chunks.reduce((prev, documents) => {
    return prev.then(async () => {
      const body = (0, _lodash.flatten)(documents.map(doc => [{
        index: {
          _index: xpackTelemetryIndexName
        }
      }, doc]));
      return client.bulk({
        body,
        refresh: 'wait_for'
      }).then(response => {
        if (response.errors) {
          const firstError = response.items.filter(item => item.index.status >= 400)[0].index.error;
          throw new Error(`Failed to upload documents: ${firstError.reason} `);
        }
      });
    });
  }, Promise.resolve());
}

uploadData().catch(e => {
  if ('response' in e) {
    if (typeof e.response === 'string') {
      // eslint-disable-next-line no-console
      console.log(e.response);
    } else {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(e.response, ['status', 'statusText', 'headers', 'data'], 2));
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  process.exit(1);
}).then(() => {
  // eslint-disable-next-line no-console
  console.log('Finished uploading generated telemetry data');
});