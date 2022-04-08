"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsEntitiesClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _get_transforms = require("./get_transforms");

var _post_transforms = require("./post_transforms");

var _delete_transforms = require("./delete_transforms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MetricsEntitiesClient {
  constructor({
    esClient: _esClient,
    logger: _logger,
    kibanaVersion: _kibanaVersion
  }) {
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "getTransforms", async () => {
      const {
        esClient,
        logger
      } = this;
      return (0, _get_transforms.getTransforms)({
        esClient,
        logger
      });
    });
    (0, _defineProperty2.default)(this, "postTransforms", async ({
      autoStart,
      frequency,
      docsPerSecond,
      maxPageSearchSize,
      modules,
      indices,
      prefix,
      suffix,
      query,
      sync
    }) => {
      const {
        esClient,
        logger,
        kibanaVersion
      } = this;
      return (0, _post_transforms.postTransforms)({
        autoStart,
        docsPerSecond,
        esClient,
        frequency,
        indices,
        kibanaVersion,
        logger,
        maxPageSearchSize,
        modules,
        prefix,
        query,
        suffix,
        sync
      });
    });
    (0, _defineProperty2.default)(this, "deleteTransforms", async ({
      modules,
      prefix,
      suffix
    }) => {
      const {
        esClient,
        logger
      } = this;
      return (0, _delete_transforms.deleteTransforms)({
        esClient,
        logger,
        modules,
        prefix,
        suffix
      });
    });
    this.esClient = _esClient;
    this.logger = _logger;
    this.kibanaVersion = _kibanaVersion;
  } // TODO: Type the unknown to be stronger


}

exports.MetricsEntitiesClient = MetricsEntitiesClient;