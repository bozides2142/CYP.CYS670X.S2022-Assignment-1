"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSavedObjectToSavedSourceConfiguration = exports.InfraSources = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var _PathReporter = require("io-ts/lib/PathReporter");

var _lodash = require("lodash");

var _source_configuration = require("../../../common/source_configuration/source_configuration");

var _defaults = require("./defaults");

var _errors = require("./errors");

var _saved_object_references = require("./saved_object_references");

var _saved_object_type = require("./saved_object_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class InfraSources {
  constructor(libs) {
    (0, _defineProperty2.default)(this, "internalSourceConfigurations", new Map());
    (0, _defineProperty2.default)(this, "libs", void 0);
    this.libs = libs;
  }

  async getSourceConfiguration(savedObjectsClient, sourceId) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const savedSourceConfiguration = await this.getInternalSourceConfiguration(sourceId).then(internalSourceConfiguration => ({
      id: sourceId,
      version: undefined,
      updatedAt: undefined,
      origin: 'internal',
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, internalSourceConfiguration)
    })).catch(err => err instanceof _errors.NotFoundError ? this.getSavedSourceConfiguration(savedObjectsClient, sourceId).then(result => ({ ...result,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, result.configuration)
    })) : Promise.reject(err)).catch(err => savedObjectsClient.errors.isNotFoundError(err) ? Promise.resolve({
      id: sourceId,
      version: undefined,
      updatedAt: undefined,
      origin: 'fallback',
      configuration: staticDefaultSourceConfiguration
    }) : Promise.reject(err));
    return savedSourceConfiguration;
  }

  async getAllSourceConfigurations(savedObjectsClient) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const savedSourceConfigurations = await this.getAllSavedSourceConfigurations(savedObjectsClient);
    return savedSourceConfigurations.map(savedSourceConfiguration => ({ ...savedSourceConfiguration,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, savedSourceConfiguration.configuration)
    }));
  }

  async createSourceConfiguration(savedObjectsClient, sourceId, source) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const {
      anomalyThreshold
    } = source;
    if (anomalyThreshold && !(0, _lodash.inRange)(anomalyThreshold, 0, 101)) throw new _errors.AnomalyThresholdRangeError('anomalyThreshold must be 1-100');
    const newSourceConfiguration = mergeSourceConfiguration(staticDefaultSourceConfiguration, source);
    const {
      attributes,
      references
    } = (0, _saved_object_references.extractSavedObjectReferences)(newSourceConfiguration);
    const createdSourceConfiguration = convertSavedObjectToSavedSourceConfiguration(await savedObjectsClient.create(_saved_object_type.infraSourceConfigurationSavedObjectName, attributes, {
      id: sourceId,
      references
    }));
    return { ...createdSourceConfiguration,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, createdSourceConfiguration.configuration)
    };
  }

  async deleteSourceConfiguration(savedObjectsClient, sourceId) {
    await savedObjectsClient.delete(_saved_object_type.infraSourceConfigurationSavedObjectName, sourceId);
  }

  async updateSourceConfiguration(savedObjectsClient, sourceId, sourceProperties) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const {
      anomalyThreshold
    } = sourceProperties;
    if (anomalyThreshold && !(0, _lodash.inRange)(anomalyThreshold, 0, 101)) throw new _errors.AnomalyThresholdRangeError('anomalyThreshold must be 1-100');
    const {
      configuration,
      version
    } = await this.getSourceConfiguration(savedObjectsClient, sourceId);
    const updatedSourceConfigurationAttributes = mergeSourceConfiguration(configuration, sourceProperties);
    const {
      attributes,
      references
    } = (0, _saved_object_references.extractSavedObjectReferences)(updatedSourceConfigurationAttributes);
    const updatedSourceConfiguration = convertSavedObjectToSavedSourceConfiguration( // update() will perform a deep merge. We use create() with overwrite: true instead. mergeSourceConfiguration()
    // ensures the correct and intended merging of properties.
    await savedObjectsClient.create(_saved_object_type.infraSourceConfigurationSavedObjectName, attributes, {
      id: sourceId,
      overwrite: true,
      references,
      version
    }));
    return { ...updatedSourceConfiguration,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, updatedSourceConfiguration.configuration)
    };
  }

  async defineInternalSourceConfiguration(sourceId, sourceProperties) {
    this.internalSourceConfigurations.set(sourceId, sourceProperties);
  }

  async getInternalSourceConfiguration(sourceId) {
    const internalSourceConfiguration = this.internalSourceConfigurations.get(sourceId);

    if (!internalSourceConfiguration) {
      throw new _errors.NotFoundError(`Failed to load internal source configuration: no configuration "${sourceId}" found.`);
    }

    return internalSourceConfiguration;
  }

  async getStaticDefaultSourceConfiguration() {
    const staticSourceConfiguration = (0, _pipeable.pipe)(_source_configuration.sourceConfigurationConfigFilePropertiesRT.decode(this.libs.config), (0, _Either.map)(({
      sources: {
        default: defaultConfiguration
      }
    }) => defaultConfiguration), (0, _Either.fold)((0, _function.constant)({}), _function.identity));
    return mergeSourceConfiguration(_defaults.defaultSourceConfiguration, staticSourceConfiguration);
  }

  async getSavedSourceConfiguration(savedObjectsClient, sourceId) {
    const savedObject = await savedObjectsClient.get(_saved_object_type.infraSourceConfigurationSavedObjectName, sourceId);
    return convertSavedObjectToSavedSourceConfiguration(savedObject);
  }

  async getAllSavedSourceConfigurations(savedObjectsClient) {
    const savedObjects = await savedObjectsClient.find({
      type: _saved_object_type.infraSourceConfigurationSavedObjectName
    });
    return savedObjects.saved_objects.map(convertSavedObjectToSavedSourceConfiguration);
  }

}

exports.InfraSources = InfraSources;

const mergeSourceConfiguration = (first, ...others) => others.reduce((previousSourceConfiguration, currentSourceConfiguration) => ({ ...previousSourceConfiguration,
  ...currentSourceConfiguration,
  fields: { ...previousSourceConfiguration.fields,
    ...currentSourceConfiguration.fields
  }
}), first);

const convertSavedObjectToSavedSourceConfiguration = savedObject => (0, _pipeable.pipe)(_source_configuration.SourceConfigurationSavedObjectRuntimeType.decode(savedObject), (0, _Either.map)(savedSourceConfiguration => ({
  id: savedSourceConfiguration.id,
  version: savedSourceConfiguration.version,
  updatedAt: savedSourceConfiguration.updated_at,
  origin: 'stored',
  configuration: (0, _saved_object_references.resolveSavedObjectReferences)(savedSourceConfiguration.attributes, savedObject.references)
})), (0, _Either.fold)(errors => {
  throw new Error((0, _PathReporter.failure)(errors).join('\n'));
}, _function.identity));

exports.convertSavedObjectToSavedSourceConfiguration = convertSavedObjectToSavedSourceConfiguration;