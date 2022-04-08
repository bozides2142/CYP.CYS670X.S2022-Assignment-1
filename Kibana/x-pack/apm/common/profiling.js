"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueTypeConfig = exports.ProfilingValueTypeUnit = exports.ProfilingValueType = void 0;

var _i18n = require("@kbn/i18n");

var _elasticsearch_fieldnames = require("./elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let ProfilingValueType;
exports.ProfilingValueType = ProfilingValueType;

(function (ProfilingValueType) {
  ProfilingValueType["wallTime"] = "wall_time";
  ProfilingValueType["cpuTime"] = "cpu_time";
  ProfilingValueType["samples"] = "samples";
  ProfilingValueType["allocObjects"] = "alloc_objects";
  ProfilingValueType["allocSpace"] = "alloc_space";
  ProfilingValueType["inuseObjects"] = "inuse_objects";
  ProfilingValueType["inuseSpace"] = "inuse_space";
})(ProfilingValueType || (exports.ProfilingValueType = ProfilingValueType = {}));

let ProfilingValueTypeUnit;
exports.ProfilingValueTypeUnit = ProfilingValueTypeUnit;

(function (ProfilingValueTypeUnit) {
  ProfilingValueTypeUnit["ns"] = "ns";
  ProfilingValueTypeUnit["us"] = "us";
  ProfilingValueTypeUnit["count"] = "count";
  ProfilingValueTypeUnit["bytes"] = "bytes";
})(ProfilingValueTypeUnit || (exports.ProfilingValueTypeUnit = ProfilingValueTypeUnit = {}));

const config = {
  [ProfilingValueType.wallTime]: {
    unit: ProfilingValueTypeUnit.us,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.wallTime', {
      defaultMessage: 'Wall'
    }),
    field: _elasticsearch_fieldnames.PROFILE_WALL_US
  },
  [ProfilingValueType.cpuTime]: {
    unit: ProfilingValueTypeUnit.ns,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.cpuTime', {
      defaultMessage: 'On-CPU'
    }),
    field: _elasticsearch_fieldnames.PROFILE_CPU_NS
  },
  [ProfilingValueType.samples]: {
    unit: ProfilingValueTypeUnit.count,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.samples', {
      defaultMessage: 'Samples'
    }),
    field: _elasticsearch_fieldnames.PROFILE_SAMPLES_COUNT
  },
  [ProfilingValueType.allocObjects]: {
    unit: ProfilingValueTypeUnit.count,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.allocObjects', {
      defaultMessage: 'Alloc. objects'
    }),
    field: _elasticsearch_fieldnames.PROFILE_ALLOC_OBJECTS
  },
  [ProfilingValueType.allocSpace]: {
    unit: ProfilingValueTypeUnit.bytes,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.allocSpace', {
      defaultMessage: 'Alloc. space'
    }),
    field: _elasticsearch_fieldnames.PROFILE_ALLOC_SPACE
  },
  [ProfilingValueType.inuseObjects]: {
    unit: ProfilingValueTypeUnit.count,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.inuseObjects', {
      defaultMessage: 'In-use objects'
    }),
    field: _elasticsearch_fieldnames.PROFILE_INUSE_OBJECTS
  },
  [ProfilingValueType.inuseSpace]: {
    unit: ProfilingValueTypeUnit.bytes,
    label: _i18n.i18n.translate('xpack.apm.serviceProfiling.valueTypeLabel.inuseSpace', {
      defaultMessage: 'In-use space'
    }),
    field: _elasticsearch_fieldnames.PROFILE_INUSE_SPACE
  }
};

const getValueTypeConfig = type => {
  return config[type];
};

exports.getValueTypeConfig = getValueTypeConfig;