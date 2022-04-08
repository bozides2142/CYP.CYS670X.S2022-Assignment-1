"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDistanceFilterWithMeta = createDistanceFilterWithMeta;
exports.createExtentFilter = createExtentFilter;
exports.createSpatialFilterWithGeometry = createSpatialFilterWithGeometry;
exports.extractFeaturesFromFilters = extractFeaturesFromFilters;

var _i18n = require("@kbn/i18n");

var _circle = _interopRequireDefault(require("@turf/circle"));

var _esQuery = require("@kbn/es-query");

var _constants = require("../constants");

var _i18n_getters = require("../i18n_getters");

var _elasticsearch_geo_utils = require("./elasticsearch_geo_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error


const SPATIAL_FILTER_TYPE = _esQuery.FILTERS.SPATIAL_FILTER; // wrapper around boiler plate code for creating bool.should clause with nested bool.must clauses
// ensuring geoField exists prior to running geoField query
// This allows for writing a single geo filter that spans multiple indices with different geo fields.

function createMultiGeoFieldFilter(geoFieldNames, meta, createGeoFilter) {
  if (geoFieldNames.length === 0) {
    throw new Error('Unable to create filter, geo fields not provided');
  }

  if (geoFieldNames.length === 1) {
    return {
      meta: { ...meta,
        key: geoFieldNames[0]
      },
      query: {
        bool: {
          must: [{
            exists: {
              field: geoFieldNames[0]
            }
          }, createGeoFilter(geoFieldNames[0])]
        }
      }
    };
  }

  return {
    meta: { ...meta,
      key: undefined,
      isMultiIndex: true
    },
    query: {
      bool: {
        should: geoFieldNames.map(geoFieldName => {
          return {
            bool: {
              must: [{
                exists: {
                  field: geoFieldName
                }
              }, createGeoFilter(geoFieldName)]
            }
          };
        })
      }
    }
  };
}

function createExtentFilter(mapExtent, geoFieldNames) {
  const esBbox = (0, _elasticsearch_geo_utils.makeESBbox)(mapExtent);

  function createGeoFilter(geoFieldName) {
    return {
      geo_bounding_box: {
        [geoFieldName]: esBbox
      }
    };
  }

  const meta = {
    alias: null,
    disabled: false,
    negate: false
  };
  return createMultiGeoFieldFilter(geoFieldNames, meta, createGeoFilter);
}

function createSpatialFilterWithGeometry({
  preIndexedShape,
  geometry,
  geometryLabel,
  geoFieldNames,
  relation = _constants.ES_SPATIAL_RELATIONS.INTERSECTS
}) {
  const meta = {
    type: SPATIAL_FILTER_TYPE,
    negate: false,
    key: geoFieldNames.length === 1 ? geoFieldNames[0] : undefined,
    alias: `${(0, _i18n_getters.getEsSpatialRelationLabel)(relation)} ${geometryLabel}`,
    disabled: false
  };

  function createGeoFilter(geoFieldName) {
    const shapeQuery = {
      relation
    };

    if (preIndexedShape) {
      shapeQuery.indexed_shape = preIndexedShape;
    } else if (geometry) {
      shapeQuery.shape = geometry;
    } else {
      throw new Error('Must supply either preIndexedShape or geometry, you did not supply either');
    }

    return {
      geo_shape: {
        ignore_unmapped: true,
        [geoFieldName]: shapeQuery
      }
    };
  } // Currently no way to create an object with exclude property from index signature
  // typescript error for "ignore_unmapped is not assignable to type 'GeoShapeQueryBody'" expected"
  // @ts-expect-error


  return createMultiGeoFieldFilter(geoFieldNames, meta, createGeoFilter);
}

function createDistanceFilterWithMeta({
  alias,
  distanceKm,
  geoFieldNames,
  point
}) {
  const meta = {
    type: SPATIAL_FILTER_TYPE,
    negate: false,
    alias: alias ? alias : _i18n.i18n.translate('xpack.maps.es_geo_utils.distanceFilterAlias', {
      defaultMessage: 'within {distanceKm}km of {pointLabel}',
      values: {
        distanceKm,
        pointLabel: point.join(', ')
      }
    }),
    disabled: false
  };

  function createGeoFilter(geoFieldName) {
    return {
      geo_distance: {
        distance: `${distanceKm}km`,
        [geoFieldName]: point
      }
    };
  }

  return createMultiGeoFieldFilter(geoFieldNames, meta, createGeoFilter);
}

function extractGeometryFromFilter(geoFieldName, filter) {
  if (filter.geo_distance && filter.geo_distance[geoFieldName]) {
    const distanceSplit = filter.geo_distance.distance.split('km');
    const distance = parseFloat(distanceSplit[0]);
    const circleFeature = (0, _circle.default)(filter.geo_distance[geoFieldName], distance);
    return circleFeature.geometry;
  }

  if (filter.geo_shape && filter.geo_shape[geoFieldName] && filter.geo_shape[geoFieldName].shape) {
    return filter.geo_shape[geoFieldName].shape;
  }
}

function extractFeaturesFromFilters(filters) {
  const features = [];
  filters.filter(filter => {
    return filter.meta.type === SPATIAL_FILTER_TYPE;
  }).forEach(filter => {
    let geometry;

    if (filter.meta.isMultiIndex) {
      var _filter$query, _filter$query$bool, _filter$query$bool$sh, _filter$query$bool$sh2, _filter$query$bool$sh3, _filter$query$bool$sh4, _filter$query$bool$sh5, _filter$query$bool$sh6, _filter$query2, _filter$query2$bool, _filter$query2$bool$s, _filter$query2$bool$s2, _filter$query2$bool$s3, _filter$query2$bool$s4;

      const geoFieldName = filter === null || filter === void 0 ? void 0 : (_filter$query = filter.query) === null || _filter$query === void 0 ? void 0 : (_filter$query$bool = _filter$query.bool) === null || _filter$query$bool === void 0 ? void 0 : (_filter$query$bool$sh = _filter$query$bool.should) === null || _filter$query$bool$sh === void 0 ? void 0 : (_filter$query$bool$sh2 = _filter$query$bool$sh[0]) === null || _filter$query$bool$sh2 === void 0 ? void 0 : (_filter$query$bool$sh3 = _filter$query$bool$sh2.bool) === null || _filter$query$bool$sh3 === void 0 ? void 0 : (_filter$query$bool$sh4 = _filter$query$bool$sh3.must) === null || _filter$query$bool$sh4 === void 0 ? void 0 : (_filter$query$bool$sh5 = _filter$query$bool$sh4[0]) === null || _filter$query$bool$sh5 === void 0 ? void 0 : (_filter$query$bool$sh6 = _filter$query$bool$sh5.exists) === null || _filter$query$bool$sh6 === void 0 ? void 0 : _filter$query$bool$sh6.field;
      const spatialClause = filter === null || filter === void 0 ? void 0 : (_filter$query2 = filter.query) === null || _filter$query2 === void 0 ? void 0 : (_filter$query2$bool = _filter$query2.bool) === null || _filter$query2$bool === void 0 ? void 0 : (_filter$query2$bool$s = _filter$query2$bool.should) === null || _filter$query2$bool$s === void 0 ? void 0 : (_filter$query2$bool$s2 = _filter$query2$bool$s[0]) === null || _filter$query2$bool$s2 === void 0 ? void 0 : (_filter$query2$bool$s3 = _filter$query2$bool$s2.bool) === null || _filter$query2$bool$s3 === void 0 ? void 0 : (_filter$query2$bool$s4 = _filter$query2$bool$s3.must) === null || _filter$query2$bool$s4 === void 0 ? void 0 : _filter$query2$bool$s4[1];

      if (geoFieldName && spatialClause) {
        geometry = extractGeometryFromFilter(geoFieldName, spatialClause);
      }
    } else {
      var _filter$query3, _filter$query3$bool, _filter$query3$bool$m;

      const geoFieldName = filter.meta.key;
      const spatialClause = filter === null || filter === void 0 ? void 0 : (_filter$query3 = filter.query) === null || _filter$query3 === void 0 ? void 0 : (_filter$query3$bool = _filter$query3.bool) === null || _filter$query3$bool === void 0 ? void 0 : (_filter$query3$bool$m = _filter$query3$bool.must) === null || _filter$query3$bool$m === void 0 ? void 0 : _filter$query3$bool$m[1];

      if (geoFieldName && spatialClause) {
        geometry = extractGeometryFromFilter(geoFieldName, spatialClause);
      }
    }

    if (geometry) {
      features.push({
        type: 'Feature',
        geometry,
        properties: {
          filter: filter.meta.alias
        }
      });
    }
  });
  return features;
}