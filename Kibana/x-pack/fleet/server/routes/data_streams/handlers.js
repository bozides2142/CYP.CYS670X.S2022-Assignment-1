"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListHandler = void 0;

var _lodash = require("lodash");

var _common = require("../../../common");

var _get = require("../../services/epm/packages/get");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DATA_STREAM_INDEX_PATTERN = 'logs-*-*,metrics-*-*,traces-*-*,synthetics-*-*';

const getListHandler = async (context, request, response) => {
  // Query datastreams as the current user as the Kibana internal user may not have all the required permission
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const body = {
    data_streams: []
  };

  try {
    // Get matching data streams, their stats, and package SOs
    const [{
      body: {
        data_streams: dataStreamsInfo
      }
    }, {
      body: {
        data_streams: dataStreamStats
      }
    }, packageSavedObjects] = await Promise.all([esClient.indices.getDataStream({
      name: DATA_STREAM_INDEX_PATTERN
    }), esClient.indices.dataStreamsStats({
      name: DATA_STREAM_INDEX_PATTERN
    }), (0, _get.getPackageSavedObjects)(context.core.savedObjects.client)]);
    const dataStreamsInfoByName = (0, _lodash.keyBy)(dataStreamsInfo, 'name');
    const dataStreamsStatsByName = (0, _lodash.keyBy)(dataStreamStats, 'data_stream'); // Combine data stream info

    const dataStreams = (0, _lodash.merge)(dataStreamsInfoByName, dataStreamsStatsByName);
    const dataStreamNames = (0, _lodash.keys)(dataStreams); // Map package SOs

    const packageSavedObjectsByName = (0, _lodash.keyBy)(packageSavedObjects.saved_objects, 'id');
    const packageMetadata = {}; // Get dashboard information for all packages

    const dashboardIdsByPackageName = packageSavedObjects.saved_objects.reduce((allDashboards, pkgSavedObject) => {
      var _pkgSavedObject$attri;

      const dashboards = [];
      (((_pkgSavedObject$attri = pkgSavedObject.attributes) === null || _pkgSavedObject$attri === void 0 ? void 0 : _pkgSavedObject$attri.installed_kibana) || []).forEach(o => {
        if (o.type === _common.KibanaSavedObjectType.dashboard) {
          dashboards.push(o.id);
        }
      });
      allDashboards[pkgSavedObject.id] = dashboards;
      return allDashboards;
    }, {});
    const allDashboardSavedObjectsResponse = await context.core.savedObjects.client.bulkGet(Object.values(dashboardIdsByPackageName).flatMap(dashboardIds => dashboardIds.map(id => ({
      id,
      type: _common.KibanaSavedObjectType.dashboard,
      fields: ['title']
    })))); // Ignore dashboards not found

    const allDashboardSavedObjects = allDashboardSavedObjectsResponse.saved_objects.filter(so => {
      if (so.error) {
        if (so.error.statusCode === 404) {
          return false;
        }

        throw so.error;
      }

      return true;
    });
    const allDashboardSavedObjectsById = (0, _lodash.keyBy)(allDashboardSavedObjects, dashboardSavedObject => dashboardSavedObject.id); // Query additional information for each data stream

    const dataStreamPromises = dataStreamNames.map(async dataStreamName => {
      var _dataStream$_meta, _dataStream$_meta$pac, _, _2, _3;

      const dataStream = dataStreams[dataStreamName];
      const dataStreamResponse = {
        index: dataStreamName,
        dataset: '',
        namespace: '',
        type: '',
        package: ((_dataStream$_meta = dataStream._meta) === null || _dataStream$_meta === void 0 ? void 0 : (_dataStream$_meta$pac = _dataStream$_meta.package) === null || _dataStream$_meta$pac === void 0 ? void 0 : _dataStream$_meta$pac.name) || '',
        package_version: '',
        last_activity_ms: dataStream.maximum_timestamp,
        // overridden below if maxIngestedTimestamp agg returns a result
        size_in_bytes: dataStream.store_size_bytes,
        dashboards: []
      }; // Query backing indices to extract data stream dataset, namespace, and type values

      const {
        body: {
          aggregations: dataStreamAggs
        }
      } = await esClient.search({
        index: dataStream.name,
        body: {
          size: 0,
          query: {
            bool: {
              filter: [{
                exists: {
                  field: 'data_stream.namespace'
                }
              }, {
                exists: {
                  field: 'data_stream.dataset'
                }
              }]
            }
          },
          aggs: {
            maxIngestedTimestamp: {
              max: {
                field: 'event.ingested'
              }
            },
            dataset: {
              terms: {
                field: 'data_stream.dataset',
                size: 1
              }
            },
            namespace: {
              terms: {
                field: 'data_stream.namespace',
                size: 1
              }
            },
            type: {
              terms: {
                field: 'data_stream.type',
                size: 1
              }
            }
          }
        }
      });
      const {
        maxIngestedTimestamp
      } = dataStreamAggs;
      const {
        dataset,
        namespace,
        type
      } = dataStreamAggs; // some integrations e.g custom logs don't have event.ingested

      if (maxIngestedTimestamp !== null && maxIngestedTimestamp !== void 0 && maxIngestedTimestamp.value) {
        dataStreamResponse.last_activity_ms = maxIngestedTimestamp === null || maxIngestedTimestamp === void 0 ? void 0 : maxIngestedTimestamp.value;
      }

      dataStreamResponse.dataset = ((_ = dataset.buckets[0]) === null || _ === void 0 ? void 0 : _.key) || '';
      dataStreamResponse.namespace = ((_2 = namespace.buckets[0]) === null || _2 === void 0 ? void 0 : _2.key) || '';
      dataStreamResponse.type = ((_3 = type.buckets[0]) === null || _3 === void 0 ? void 0 : _3.key) || ''; // Find package saved object

      const pkgName = dataStreamResponse.package;
      const pkgSavedObject = pkgName ? packageSavedObjectsByName[pkgName] : null;

      if (pkgSavedObject) {
        // if
        // - the data stream is associated with a package
        // - and the package has been installed through EPM
        // - and we didn't pick the metadata in an earlier iteration of this map()
        if (!packageMetadata[pkgName]) {
          var _pkgSavedObject$attri2; // then pick the dashboards from the package saved object


          const packageDashboardIds = dashboardIdsByPackageName[pkgName] || [];
          const packageDashboards = packageDashboardIds.reduce((dashboards, dashboardId) => {
            const dashboard = allDashboardSavedObjectsById[dashboardId];

            if (dashboard) {
              dashboards.push({
                id: dashboard.id,
                title: dashboard.attributes.title || dashboard.id
              });
            }

            return dashboards;
          }, []);
          packageMetadata[pkgName] = {
            version: ((_pkgSavedObject$attri2 = pkgSavedObject.attributes) === null || _pkgSavedObject$attri2 === void 0 ? void 0 : _pkgSavedObject$attri2.version) || '',
            dashboards: packageDashboards
          };
        } // Set values from package information


        dataStreamResponse.package = pkgName;
        dataStreamResponse.package_version = packageMetadata[pkgName].version;
        dataStreamResponse.dashboards = packageMetadata[pkgName].dashboards;
      }

      return dataStreamResponse;
    }); // Return final data streams objects sorted by last activity, descending
    // After filtering out data streams that are missing dataset/namespace/type fields

    body.data_streams = (await Promise.all(dataStreamPromises)).filter(({
      dataset,
      namespace,
      type
    }) => dataset && namespace && type).sort((a, b) => b.last_activity_ms - a.last_activity_ms);
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getListHandler = getListHandler;