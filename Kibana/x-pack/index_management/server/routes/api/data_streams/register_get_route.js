"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllRoute = registerGetAllRoute;
exports.registerGetOneRoute = registerGetOneRoute;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../../common/lib");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const enhanceDataStreams = ({
  dataStreams,
  dataStreamsStats,
  dataStreamsPrivileges
}) => {
  return dataStreams.map(dataStream => {
    let enhancedDataStream = { ...dataStream
    };

    if (dataStreamsStats) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {
        store_size,
        store_size_bytes,
        maximum_timestamp
      } = dataStreamsStats.find(({
        data_stream: statsName
      }) => statsName === dataStream.name) || {};
      enhancedDataStream = { ...enhancedDataStream,
        store_size,
        store_size_bytes,
        maximum_timestamp
      };
    }

    enhancedDataStream = { ...enhancedDataStream,
      privileges: {
        delete_index: dataStreamsPrivileges ? dataStreamsPrivileges.index[dataStream.name].delete_index : true
      }
    };
    return enhancedDataStream;
  });
};

const getDataStreams = (client, name = '*') => {
  return client.asCurrentUser.indices.getDataStream({
    name,
    expand_wildcards: 'all'
  });
};

const getDataStreamsStats = (client, name = '*') => {
  return client.asCurrentUser.indices.dataStreamsStats({
    name,
    expand_wildcards: 'all',
    human: true
  });
};

const getDataStreamsPrivileges = (client, names) => {
  return client.asCurrentUser.security.hasPrivileges({
    body: {
      index: [{
        names,
        privileges: ['delete_index']
      }]
    }
  });
};

function registerGetAllRoute({
  router,
  lib: {
    handleEsError
  },
  config
}) {
  const querySchema = _configSchema.schema.object({
    includeStats: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
  });

  router.get({
    path: (0, _index.addBasePath)('/data_streams'),
    validate: {
      query: querySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const includeStats = request.query.includeStats === 'true';

    try {
      const {
        body: {
          data_streams: dataStreams
        }
      } = await getDataStreams(client);
      let dataStreamsStats;
      let dataStreamsPrivileges;

      if (includeStats) {
        ({
          body: {
            data_streams: dataStreamsStats
          }
        } = await getDataStreamsStats(client));
      }

      if (config.isSecurityEnabled() && dataStreams.length > 0) {
        ({
          body: dataStreamsPrivileges
        } = await getDataStreamsPrivileges(client, dataStreams.map(dataStream => dataStream.name)));
      }

      const enhancedDataStreams = enhanceDataStreams({
        // @ts-expect-error DataStreamFromEs conflicts with @elastic/elasticsearch IndicesGetDataStreamIndicesGetDataStreamItem
        dataStreams,
        // @ts-expect-error StatsFromEs conflicts with @elastic/elasticsearch IndicesDataStreamsStatsDataStreamsStatsItem
        dataStreamsStats,
        // @ts-expect-error PrivilegesFromEs conflicts with @elastic/elasticsearch ApplicationsPrivileges
        dataStreamsPrivileges
      });
      return response.ok({
        body: (0, _lib.deserializeDataStreamList)(enhancedDataStreams)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}

function registerGetOneRoute({
  router,
  lib: {
    handleEsError
  },
  config
}) {
  const paramsSchema = _configSchema.schema.object({
    name: _configSchema.schema.string()
  });

  router.get({
    path: (0, _index.addBasePath)('/data_streams/{name}'),
    validate: {
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      name
    } = request.params;
    const {
      client
    } = context.core.elasticsearch;

    try {
      const [{
        body: {
          data_streams: dataStreams
        }
      }, {
        body: {
          data_streams: dataStreamsStats
        }
      }] = await Promise.all([getDataStreams(client, name), getDataStreamsStats(client, name)]);

      if (dataStreams[0]) {
        let dataStreamsPrivileges;

        if (config.isSecurityEnabled()) {
          ({
            body: dataStreamsPrivileges
          } = await getDataStreamsPrivileges(client, [dataStreams[0].name]));
        }

        const enhancedDataStreams = enhanceDataStreams({
          // @ts-expect-error DataStreamFromEs conflicts with @elastic/elasticsearch IndicesGetDataStreamIndicesGetDataStreamItem
          dataStreams,
          // @ts-expect-error StatsFromEs conflicts with @elastic/elasticsearch IndicesDataStreamsStatsDataStreamsStatsItem
          dataStreamsStats,
          // @ts-expect-error PrivilegesFromEs conflicts with @elastic/elasticsearch ApplicationsPrivileges
          dataStreamsPrivileges
        });
        const body = (0, _lib.deserializeDataStream)(enhancedDataStreams[0]);
        return response.ok({
          body
        });
      }

      return response.notFound();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}