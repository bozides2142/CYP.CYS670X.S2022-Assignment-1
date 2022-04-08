"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_CLUSTER_PERMISSIONS = void 0;
exports.getDataStreamPrivileges = getDataStreamPrivileges;
exports.storedPackagePoliciesToAgentPermissions = storedPackagePoliciesToAgentPermissions;

var _constants = require("../constants");

var _packages = require("../../server/services/epm/packages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_CLUSTER_PERMISSIONS = ['monitor'];
exports.DEFAULT_CLUSTER_PERMISSIONS = DEFAULT_CLUSTER_PERMISSIONS;

async function storedPackagePoliciesToAgentPermissions(soClient, packagePolicies) {
  if (packagePolicies.length === 0) {
    return;
  } // I'm not sure what permissions to return for this case, so let's return the defaults


  if (typeof packagePolicies[0] === 'string') {
    throw new Error('storedPackagePoliciesToAgentPermissions should be called with a PackagePolicy');
  }

  const permissionEntries = packagePolicies.map(async packagePolicy => {
    var _packagePolicy$elasti, _packagePolicy$elasti2, _packagePolicy$elasti3;

    if (!packagePolicy.package) {
      throw new Error(`No package for package policy ${packagePolicy.name}`);
    }

    const pkg = await (0, _packages.getPackageInfo)({
      savedObjectsClient: soClient,
      pkgName: packagePolicy.package.name,
      pkgVersion: packagePolicy.package.version
    });

    if (!pkg.data_streams || pkg.data_streams.length === 0) {
      return [packagePolicy.name, undefined];
    }

    let dataStreamsForPermissions;

    switch (pkg.name) {
      case 'endpoint':
        // - Endpoint doesn't store the `data_stream` metadata in
        // `packagePolicy.inputs`, so we will use _all_ data_streams from the
        // package.
        dataStreamsForPermissions = pkg.data_streams;
        break;

      case 'apm':
        // - APM doesn't store the `data_stream` metadata in
        //   `packagePolicy.inputs`, so we will use _all_ data_streams from
        //   the package.
        dataStreamsForPermissions = pkg.data_streams;
        break;

      case 'osquery_manager':
        // - Osquery manager doesn't store the `data_stream` metadata in
        //   `packagePolicy.inputs`, so we will use _all_ data_streams from
        //   the package.
        dataStreamsForPermissions = pkg.data_streams;
        break;

      default:
        // - Normal packages store some of the `data_stream` metadata in
        //   `packagePolicy.inputs[].streams[].data_stream`
        // - The rest of the metadata needs to be fetched from the
        //   `data_stream` object in the package. The link is
        //   `packagePolicy.inputs[].type == pkg.data_streams.streams[].input`
        // - Some packages (custom logs) have a compiled dataset, stored in
        //   `input.streams.compiled_stream.data_stream.dataset`
        dataStreamsForPermissions = packagePolicy.inputs.filter(i => i.enabled).flatMap(input => {
          if (!input.streams) {
            return [];
          }

          const dataStreams_ = [];
          input.streams.filter(s => s.enabled).forEach(stream => {
            var _stream$compiled_stre, _stream$compiled_stre2, _stream$compiled_stre3;

            if (!('data_stream' in stream)) {
              return;
            }

            const ds = {
              type: stream.data_stream.type,
              dataset: (_stream$compiled_stre = (_stream$compiled_stre2 = stream.compiled_stream) === null || _stream$compiled_stre2 === void 0 ? void 0 : (_stream$compiled_stre3 = _stream$compiled_stre2.data_stream) === null || _stream$compiled_stre3 === void 0 ? void 0 : _stream$compiled_stre3.dataset) !== null && _stream$compiled_stre !== void 0 ? _stream$compiled_stre : stream.data_stream.dataset
            };

            if (stream.data_stream.elasticsearch) {
              ds.elasticsearch = stream.data_stream.elasticsearch;
            }

            dataStreams_.push(ds);
          });
          return dataStreams_;
        });
    }

    let clusterRoleDescriptor = {};
    const cluster = (_packagePolicy$elasti = packagePolicy === null || packagePolicy === void 0 ? void 0 : (_packagePolicy$elasti2 = packagePolicy.elasticsearch) === null || _packagePolicy$elasti2 === void 0 ? void 0 : (_packagePolicy$elasti3 = _packagePolicy$elasti2.privileges) === null || _packagePolicy$elasti3 === void 0 ? void 0 : _packagePolicy$elasti3.cluster) !== null && _packagePolicy$elasti !== void 0 ? _packagePolicy$elasti : [];

    if (cluster.length > 0) {
      clusterRoleDescriptor = {
        cluster
      };
    }

    return [packagePolicy.name, {
      indices: dataStreamsForPermissions.map(ds => getDataStreamPrivileges(ds, packagePolicy.namespace)),
      ...clusterRoleDescriptor
    }];
  });
  return Object.fromEntries(await Promise.all(permissionEntries));
}

function getDataStreamPrivileges(dataStream, namespace = '*') {
  var _dataStream$elasticse, _dataStream$elasticse2, _dataStream$elasticse3;

  let index = `${dataStream.type}-${dataStream.dataset}`;

  if (dataStream.dataset_is_prefix) {
    index = `${index}.*`;
  }

  if (dataStream.hidden) {
    index = `.${index}`;
  }

  index += `-${namespace}`;
  const privileges = dataStream !== null && dataStream !== void 0 && (_dataStream$elasticse = dataStream.elasticsearch) !== null && _dataStream$elasticse !== void 0 && (_dataStream$elasticse2 = _dataStream$elasticse.privileges) !== null && _dataStream$elasticse2 !== void 0 && (_dataStream$elasticse3 = _dataStream$elasticse2.indices) !== null && _dataStream$elasticse3 !== void 0 && _dataStream$elasticse3.length ? dataStream.elasticsearch.privileges.indices : _constants.PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES;
  return {
    names: [index],
    privileges
  };
}