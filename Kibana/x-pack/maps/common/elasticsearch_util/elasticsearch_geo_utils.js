"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
exports.clampToLatBounds = clampToLatBounds;
exports.clampToLonBounds = clampToLonBounds;
exports.formatEnvelopeAsPolygon = formatEnvelopeAsPolygon;
exports.geoPointToGeometry = geoPointToGeometry;
exports.geoShapeToGeometry = geoShapeToGeometry;
exports.getBoundingBoxGeometry = getBoundingBoxGeometry;
exports.hitsToGeoJson = hitsToGeoJson;
exports.makeESBbox = makeESBbox;
exports.roundCoordinates = roundCoordinates;
exports.scaleBounds = scaleBounds;
exports.turfBboxToBounds = turfBboxToBounds;

var _lodash = _interopRequireDefault(require("lodash"));

var _i18n = require("@kbn/i18n");

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function ensureGeoField(type) {
  const expectedTypes = [_constants.ES_GEO_FIELD_TYPE.GEO_POINT, _constants.ES_GEO_FIELD_TYPE.GEO_SHAPE];

  if (!expectedTypes.includes(type)) {
    const errorMessage = _i18n.i18n.translate('xpack.maps.es_geo_utils.unsupportedFieldTypeErrorMessage', {
      defaultMessage: 'Unsupported field type, expected: {expectedTypes}, you provided: {fieldType}',
      values: {
        fieldType: type,
        expectedTypes: expectedTypes.join(',')
      }
    });

    throw new Error(errorMessage);
  }
}

function ensureGeometryType(type, expectedTypes) {
  if (!expectedTypes.includes(type)) {
    const errorMessage = _i18n.i18n.translate('xpack.maps.es_geo_utils.unsupportedGeometryTypeErrorMessage', {
      defaultMessage: 'Unsupported geometry type, expected: {expectedTypes}, you provided: {geometryType}',
      values: {
        geometryType: type,
        expectedTypes: expectedTypes.join(',')
      }
    });

    throw new Error(errorMessage);
  }
}
/**
 * Converts Elasticsearch search results into GeoJson FeatureCollection
 *
 * @param {array} hits Elasticsearch search response hits array
 * @param {function} flattenHit Method to flatten hits._source and hits.fields into properties object.
 *   Should just be IndexPattern.flattenHit but wanted to avoid coupling this method to IndexPattern.
 * @param {string} geoFieldName Geometry field name
 * @param {string} geoFieldType Geometry field type ["geo_point", "geo_shape"]
 * @returns {number}
 */


function hitsToGeoJson(hits, flattenHit, geoFieldName, geoFieldType, epochMillisFields) {
  const features = [];
  const tmpGeometriesAccumulator = [];

  for (let i = 0; i < hits.length; i++) {
    // flattenHit returns value from cache. Create new object to avoid modifying flattenHit cache.
    // not doing deep copy because copying coordinates can be very expensive for complex geometries.
    const properties = { ...flattenHit(hits[i])
    };
    tmpGeometriesAccumulator.length = 0; // truncate accumulator

    ensureGeoField(geoFieldType);

    if (geoFieldType === _constants.ES_GEO_FIELD_TYPE.GEO_POINT) {
      geoPointToGeometry(properties[geoFieldName], tmpGeometriesAccumulator);
    } else {
      geoShapeToGeometry(properties[geoFieldName], tmpGeometriesAccumulator);
    } // There is a bug in Elasticsearch API where epoch_millis are returned as a string instead of a number
    // https://github.com/elastic/elasticsearch/issues/50622
    // Convert these field values to integers.


    for (let k = 0; k < epochMillisFields.length; k++) {
      const fieldName = epochMillisFields[k];

      if (typeof properties[fieldName] === 'string') {
        properties[fieldName] = parseInt(properties[fieldName], 10);
      }
    } // don't include geometry field value in properties


    delete properties[geoFieldName]; // create new geojson Feature for every individual geojson geometry.

    for (let j = 0; j < tmpGeometriesAccumulator.length; j++) {
      features.push({
        type: 'Feature',
        geometry: tmpGeometriesAccumulator[j],
        // _id is not unique across Kibana index pattern. Multiple ES indices could have _id collisions
        // Need to prefix with _index to guarantee uniqueness
        id: `${properties._index}:${properties._id}:${j}`,
        properties
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features
  };
} // Parse geo_point fields API response


function geoPointToGeometry(value, accumulator) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      geoPointToGeometry(value[i], accumulator);
    }

    return;
  }

  accumulator.push(value);
} // Parse geo_shape fields API response


function geoShapeToGeometry(value, accumulator) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    // value expressed as an array of values
    for (let i = 0; i < value.length; i++) {
      geoShapeToGeometry(value[i], accumulator);
    }

    return;
  }

  if (value.type.toLowerCase() === _constants.GEO_JSON_TYPE.GEOMETRY_COLLECTION.toLowerCase()) {
    const geometryCollection = value;

    for (let i = 0; i < geometryCollection.geometries.length; i++) {
      geoShapeToGeometry(geometryCollection.geometries[i], accumulator);
    }

    return;
  } // fields API does not return true geojson yet, circle and envelope still exist which are not part of geojson spec


  if (value.type.toLowerCase() === 'envelope') {
    const envelopeCoords = value.coordinates; // format defined here https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html#_envelope

    const polygon = formatEnvelopeAsPolygon({
      minLon: envelopeCoords[0][0],
      maxLon: envelopeCoords[1][0],
      minLat: envelopeCoords[1][1],
      maxLat: envelopeCoords[0][1]
    });
    accumulator.push(polygon);
  } else if (value.type.toLowerCase() === 'circle') {
    const errorMessage = _i18n.i18n.translate('xpack.maps.es_geo_utils.convert.unsupportedGeometryTypeErrorMessage', {
      defaultMessage: `Unable to convert {geometryType} geometry to geojson, not supported`,
      values: {
        geometryType: value.type
      }
    });

    throw new Error(errorMessage);
  } else {
    accumulator.push(value);
  }
}

function makeESBbox({
  maxLat,
  maxLon,
  minLat,
  minLon
}) {
  const bottom = clampToLatBounds(minLat);
  const top = clampToLatBounds(maxLat);
  let esBbox;

  if (maxLon - minLon >= 360) {
    esBbox = {
      top_left: [-180, top],
      bottom_right: [180, bottom]
    };
  } else {
    // geo_bounding_box does not support ranges outside of -180 and 180
    // When the area crosses the 180° meridian,
    // the value of the lower left longitude will be greater than the value of the upper right longitude.
    // http://docs.opengeospatial.org/is/12-063r5/12-063r5.html#30
    //
    // This ensures bbox goes West->East in the happy case,
    // but will be formatted East->West in case it crosses the date-line
    const newMinlon = (minLon + 180 + 360) % 360 - 180;
    const newMaxlon = (maxLon + 180 + 360) % 360 - 180;
    esBbox = {
      top_left: [newMinlon, top],
      bottom_right: [newMaxlon, bottom]
    };
  }

  return esBbox;
}

function roundCoordinates(coordinates) {
  for (let i = 0; i < coordinates.length; i++) {
    const value = coordinates[i];

    if (Array.isArray(value)) {
      roundCoordinates(value);
    } else if (!isNaN(value)) {
      coordinates[i] = _lodash.default.round(value, _constants.DECIMAL_DEGREES_PRECISION);
    }
  }
}
/*
 * returns Polygon geometry where coordinates define a bounding box that contains the input geometry
 */


function getBoundingBoxGeometry(geometry) {
  ensureGeometryType(geometry.type, [_constants.GEO_JSON_TYPE.POLYGON]);
  const exterior = geometry.coordinates[_constants.POLYGON_COORDINATES_EXTERIOR_INDEX];
  const extent = {
    minLon: exterior[0][_constants.LON_INDEX],
    minLat: exterior[0][_constants.LAT_INDEX],
    maxLon: exterior[0][_constants.LON_INDEX],
    maxLat: exterior[0][_constants.LAT_INDEX]
  };

  for (let i = 1; i < exterior.length; i++) {
    extent.minLon = Math.min(exterior[i][_constants.LON_INDEX], extent.minLon);
    extent.minLat = Math.min(exterior[i][_constants.LAT_INDEX], extent.minLat);
    extent.maxLon = Math.max(exterior[i][_constants.LON_INDEX], extent.maxLon);
    extent.maxLat = Math.max(exterior[i][_constants.LAT_INDEX], extent.maxLat);
  }

  return formatEnvelopeAsPolygon(extent);
}

function formatEnvelopeAsPolygon({
  maxLat,
  maxLon,
  minLat,
  minLon
}) {
  // GeoJSON mandates that the outer polygon must be counterclockwise to avoid ambiguous polygons
  // when the shape crosses the dateline
  const lonDelta = maxLon - minLon;
  const left = lonDelta > 360 ? -180 : minLon;
  const right = lonDelta > 360 ? 180 : maxLon;
  const top = clampToLatBounds(maxLat);
  const bottom = clampToLatBounds(minLat);
  const topLeft = [left, top];
  const bottomLeft = [left, bottom];
  const bottomRight = [right, bottom];
  const topRight = [right, top];
  return {
    type: _constants.GEO_JSON_TYPE.POLYGON,
    coordinates: [[topLeft, bottomLeft, bottomRight, topRight, topLeft]]
  };
}

function clampToLatBounds(lat) {
  return clamp(lat, -89, 89);
}

function clampToLonBounds(lon) {
  return clamp(lon, -180, 180);
}

function clamp(val, min, max) {
  if (val > max) {
    return max;
  } else if (val < min) {
    return min;
  } else {
    return val;
  }
}

function scaleBounds(bounds, scaleFactor) {
  const width = bounds.maxLon - bounds.minLon;
  const height = bounds.maxLat - bounds.minLat;
  const newMinLon = bounds.minLon - width * scaleFactor;
  const nexMaxLon = bounds.maxLon + width * scaleFactor;
  const lonDelta = nexMaxLon - newMinLon;
  const left = lonDelta > 360 ? -180 : newMinLon;
  const right = lonDelta > 360 ? 180 : nexMaxLon;
  return {
    minLon: left,
    minLat: clampToLatBounds(bounds.minLat - height * scaleFactor),
    maxLon: right,
    maxLat: clampToLonBounds(bounds.maxLat + height * scaleFactor)
  };
}

function turfBboxToBounds(turfBbox) {
  return {
    minLon: turfBbox[0],
    minLat: turfBbox[1],
    maxLon: turfBbox[2],
    maxLat: turfBbox[3]
  };
}