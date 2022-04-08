"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexAnnotationSchema = exports.getAnnotationsSchema = exports.deleteAnnotationSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _annotations = require("../../../common/constants/annotations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const indexAnnotationSchema = _configSchema.schema.object({
  timestamp: _configSchema.schema.number(),
  end_timestamp: _configSchema.schema.number(),
  annotation: _configSchema.schema.string(),
  job_id: _configSchema.schema.string(),
  type: _configSchema.schema.oneOf([_configSchema.schema.literal(_annotations.ANNOTATION_TYPE.ANNOTATION), _configSchema.schema.literal(_annotations.ANNOTATION_TYPE.COMMENT)]),
  create_time: _configSchema.schema.maybe(_configSchema.schema.number()),
  create_username: _configSchema.schema.maybe(_configSchema.schema.string()),
  modified_time: _configSchema.schema.maybe(_configSchema.schema.number()),
  modified_username: _configSchema.schema.maybe(_configSchema.schema.string()),
  event: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('user'), _configSchema.schema.literal('delayed_data'), _configSchema.schema.literal('model_snapshot_stored'), _configSchema.schema.literal('model_change'), _configSchema.schema.literal('categorization_status_change')])),
  detector_index: _configSchema.schema.maybe(_configSchema.schema.number()),
  partition_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  partition_field_value: _configSchema.schema.maybe(_configSchema.schema.string()),
  over_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  over_field_value: _configSchema.schema.maybe(_configSchema.schema.string()),
  by_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  by_field_value: _configSchema.schema.maybe(_configSchema.schema.string()),

  /** Document id */
  _id: _configSchema.schema.maybe(_configSchema.schema.string()),
  key: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.indexAnnotationSchema = indexAnnotationSchema;

const getAnnotationsSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  earliestMs: _configSchema.schema.nullable(_configSchema.schema.number()),
  latestMs: _configSchema.schema.nullable(_configSchema.schema.number()),
  maxAnnotations: _configSchema.schema.number(),

  /** Fields to find unique values for (e.g. events or created_by) */
  fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    field: _configSchema.schema.string(),
    missing: _configSchema.schema.maybe(_configSchema.schema.string())
  }))),
  detectorIndex: _configSchema.schema.maybe(_configSchema.schema.number()),
  entities: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    fieldType: _configSchema.schema.maybe(_configSchema.schema.string()),
    fieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
    fieldValue: _configSchema.schema.maybe(_configSchema.schema.string())
  })))
});

exports.getAnnotationsSchema = getAnnotationsSchema;

const deleteAnnotationSchema = _configSchema.schema.object({
  annotationId: _configSchema.schema.string()
});

exports.deleteAnnotationSchema = deleteAnnotationSchema;