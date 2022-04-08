"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetry = exports.migrateToLatest = exports.inject = exports.getAllMigrations = exports.extract = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _common = require("../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const extract = filters => {
  const references = [];
  const updatedFilters = filters.map(filter => {
    var _filter$meta;

    if ((_filter$meta = filter.meta) !== null && _filter$meta !== void 0 && _filter$meta.index) {
      const id = (0, _uuid.default)();
      references.push({
        type: _common.DATA_VIEW_SAVED_OBJECT_TYPE,
        name: id,
        id: filter.meta.index
      });
      return { ...filter,
        meta: { ...filter.meta,
          index: id
        }
      };
    }

    return filter;
  });
  return {
    state: updatedFilters,
    references
  };
};

exports.extract = extract;

const inject = (filters, references) => {
  return filters.map(filter => {
    if (!filter.meta.index) {
      return filter;
    }

    const reference = references.find(ref => ref.name === filter.meta.index);
    return { ...filter,
      meta: { ...filter.meta,
        index: reference && reference.id
      }
    };
  });
};

exports.inject = inject;

const telemetry = (filters, collector) => {
  return {};
};

exports.telemetry = telemetry;

const migrateToLatest = (filters, version) => {
  return filters;
};

exports.migrateToLatest = migrateToLatest;

const getAllMigrations = () => {
  return {};
};

exports.getAllMigrations = getAllMigrations;