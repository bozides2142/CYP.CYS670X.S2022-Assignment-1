"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegistryResponseError = exports.RegistryError = exports.RegistryConnectionError = exports.PackageUnsupportedMediaTypeError = exports.PackagePolicyValidationError = exports.PackagePolicyIneligibleForUpgradeError = exports.PackageOutdatedError = exports.PackageOperationNotSupportedError = exports.PackageNotFoundError = exports.PackageKeyInvalidError = exports.PackageInvalidArchiveError = exports.PackageCacheError = exports.OutputUnauthorizedError = exports.IngestManagerError = exports.HostedAgentPolicyRestrictionRelatedError = exports.GenerateServiceTokenError = exports.FleetUnauthorizedError = exports.FleetSetupError = exports.ConcurrentInstallOperationError = exports.BundledPackageNotFoundError = exports.ArtifactsElasticsearchError = exports.ArtifactsClientError = exports.ArtifactsClientAccessDeniedError = exports.AgentReassignmentError = exports.AgentPolicyNotFoundError = exports.AgentPolicyNameExistsError = exports.AgentPolicyError = exports.AgentNotFoundError = void 0;
Object.defineProperty(exports, "defaultIngestErrorHandler", {
  enumerable: true,
  get: function () {
    return _handlers.defaultIngestErrorHandler;
  }
});
Object.defineProperty(exports, "ingestErrorToResponseOptions", {
  enumerable: true,
  get: function () {
    return _handlers.ingestErrorToResponseOptions;
  }
});
Object.defineProperty(exports, "isESClientError", {
  enumerable: true,
  get: function () {
    return _utils.isESClientError;
  }
});

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("./utils");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */


class IngestManagerError extends Error {
  constructor(message, meta) {
    super(message);
    this.meta = meta;
    this.name = this.constructor.name; // for stack traces
  }

}

exports.IngestManagerError = IngestManagerError;

class RegistryError extends IngestManagerError {}

exports.RegistryError = RegistryError;

class RegistryConnectionError extends RegistryError {}

exports.RegistryConnectionError = RegistryConnectionError;

class RegistryResponseError extends RegistryError {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

}

exports.RegistryResponseError = RegistryResponseError;

class PackageNotFoundError extends IngestManagerError {}

exports.PackageNotFoundError = PackageNotFoundError;

class PackageKeyInvalidError extends IngestManagerError {}

exports.PackageKeyInvalidError = PackageKeyInvalidError;

class PackageOutdatedError extends IngestManagerError {}

exports.PackageOutdatedError = PackageOutdatedError;

class AgentPolicyError extends IngestManagerError {}

exports.AgentPolicyError = AgentPolicyError;

class AgentPolicyNotFoundError extends IngestManagerError {}

exports.AgentPolicyNotFoundError = AgentPolicyNotFoundError;

class AgentNotFoundError extends IngestManagerError {}

exports.AgentNotFoundError = AgentNotFoundError;

class AgentPolicyNameExistsError extends AgentPolicyError {}

exports.AgentPolicyNameExistsError = AgentPolicyNameExistsError;

class PackageUnsupportedMediaTypeError extends IngestManagerError {}

exports.PackageUnsupportedMediaTypeError = PackageUnsupportedMediaTypeError;

class PackageInvalidArchiveError extends IngestManagerError {}

exports.PackageInvalidArchiveError = PackageInvalidArchiveError;

class PackageCacheError extends IngestManagerError {}

exports.PackageCacheError = PackageCacheError;

class PackageOperationNotSupportedError extends IngestManagerError {}

exports.PackageOperationNotSupportedError = PackageOperationNotSupportedError;

class ConcurrentInstallOperationError extends IngestManagerError {}

exports.ConcurrentInstallOperationError = ConcurrentInstallOperationError;

class AgentReassignmentError extends IngestManagerError {}

exports.AgentReassignmentError = AgentReassignmentError;

class PackagePolicyIneligibleForUpgradeError extends IngestManagerError {}

exports.PackagePolicyIneligibleForUpgradeError = PackagePolicyIneligibleForUpgradeError;

class PackagePolicyValidationError extends IngestManagerError {}

exports.PackagePolicyValidationError = PackagePolicyValidationError;

class BundledPackageNotFoundError extends IngestManagerError {}

exports.BundledPackageNotFoundError = BundledPackageNotFoundError;

class HostedAgentPolicyRestrictionRelatedError extends IngestManagerError {
  constructor(message = 'Cannot perform that action') {
    super(`${message} in Fleet because the agent policy is managed by an external orchestration solution, such as Elastic Cloud, Kubernetes, etc. Please make changes using your orchestration solution.`);
  }

}

exports.HostedAgentPolicyRestrictionRelatedError = HostedAgentPolicyRestrictionRelatedError;

class FleetSetupError extends IngestManagerError {}

exports.FleetSetupError = FleetSetupError;

class GenerateServiceTokenError extends IngestManagerError {}

exports.GenerateServiceTokenError = GenerateServiceTokenError;

class FleetUnauthorizedError extends IngestManagerError {}

exports.FleetUnauthorizedError = FleetUnauthorizedError;

class OutputUnauthorizedError extends IngestManagerError {}

exports.OutputUnauthorizedError = OutputUnauthorizedError;

class ArtifactsClientError extends IngestManagerError {}

exports.ArtifactsClientError = ArtifactsClientError;

class ArtifactsClientAccessDeniedError extends IngestManagerError {
  constructor(deniedPackageName, allowedPackageName) {
    super(`Access denied. Artifact package name (${deniedPackageName}) does not match ${allowedPackageName}`);
  }

}

exports.ArtifactsClientAccessDeniedError = ArtifactsClientAccessDeniedError;

class ArtifactsElasticsearchError extends IngestManagerError {
  constructor(meta) {
    var _meta$meta$body, _meta$meta$body$error, _meta$meta$body2, _meta$meta$body2$erro;

    super(`${(0, _utils.isESClientError)(meta) && (_meta$meta$body = meta.meta.body) !== null && _meta$meta$body !== void 0 && (_meta$meta$body$error = _meta$meta$body.error) !== null && _meta$meta$body$error !== void 0 && _meta$meta$body$error.reason ? (_meta$meta$body2 = meta.meta.body) === null || _meta$meta$body2 === void 0 ? void 0 : (_meta$meta$body2$erro = _meta$meta$body2.error) === null || _meta$meta$body2$erro === void 0 ? void 0 : _meta$meta$body2$erro.reason : `Elasticsearch error while working with artifacts: ${meta.message}`}`);
    (0, _defineProperty2.default)(this, "requestDetails", void 0);
    this.meta = meta;

    if ((0, _utils.isESClientError)(meta)) {
      const {
        method,
        path,
        querystring = '',
        body = ''
      } = meta.meta.meta.request.params;
      this.requestDetails = `${method} ${path}${querystring ? `?${querystring}` : ''}${body ? `\n${body}` : ''}`;
    } else {
      this.requestDetails = 'unable to determine request details';
    }
  }

}

exports.ArtifactsElasticsearchError = ArtifactsElasticsearchError;