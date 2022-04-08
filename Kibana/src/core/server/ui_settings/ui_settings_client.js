"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSettingsClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _saved_objects = require("../saved_objects");

var _create_or_upgrade_saved_config = require("./create_or_upgrade_saved_config");

var _ui_settings_errors = require("./ui_settings_errors");

var _cache = require("./cache");

var _base_ui_settings_client = require("./base_ui_settings_client");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class UiSettingsClient extends _base_ui_settings_client.BaseUiSettingsClient {
  constructor(options) {
    const {
      type,
      id,
      buildNum,
      savedObjectsClient,
      log,
      defaults = {},
      overrides = {}
    } = options;
    super({
      overrides,
      defaults,
      log
    });
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "buildNum", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "cache", void 0);
    this.type = type;
    this.id = id;
    this.buildNum = buildNum;
    this.savedObjectsClient = savedObjectsClient;
    this.cache = new _cache.Cache();
  }

  async getUserProvided() {
    const cachedValue = this.cache.get();

    if (cachedValue) {
      return cachedValue;
    }

    const userProvided = this.onReadHook(await this.read()); // write all overridden keys, dropping the userValue is override is null and
    // adding keys for overrides that are not in saved object

    for (const [key, value] of Object.entries(this.overrides)) {
      userProvided[key] = value === null ? {
        isOverridden: true
      } : {
        isOverridden: true,
        userValue: value
      };
    }

    this.cache.set(userProvided);
    return userProvided;
  }

  async setMany(changes) {
    this.cache.del();
    this.onWriteHook(changes);
    await this.write({
      changes
    });
  }

  async set(key, value) {
    await this.setMany({
      [key]: value
    });
  }

  async remove(key) {
    await this.set(key, null);
  }

  async removeMany(keys) {
    const changes = {};
    keys.forEach(key => {
      changes[key] = null;
    });
    await this.setMany(changes);
  }

  assertUpdateAllowed(key) {
    if (this.isOverridden(key)) {
      throw new _ui_settings_errors.CannotOverrideError(`Unable to update "${key}" because it is overridden`);
    }
  }

  onWriteHook(changes) {
    for (const key of Object.keys(changes)) {
      this.assertUpdateAllowed(key);
    }

    for (const [key, value] of Object.entries(changes)) {
      this.validateKey(key, value);
    }
  }

  onReadHook(values) {
    // write the userValue for each key stored in the saved object that is not overridden
    // validate value read from saved objects as it can be changed via SO API
    const filteredValues = {};

    for (const [key, userValue] of Object.entries(values)) {
      if (userValue === null || this.isOverridden(key)) continue;

      try {
        this.validateKey(key, userValue);
        filteredValues[key] = {
          userValue: userValue
        };
      } catch (error) {
        this.log.warn(`Ignore invalid UiSettings value. ${error}.`);
      }
    }

    return filteredValues;
  }

  async write({
    changes,
    autoCreateOrUpgradeIfMissing = true
  }) {
    try {
      await this.savedObjectsClient.update(this.type, this.id, changes);
    } catch (error) {
      if (!_saved_objects.SavedObjectsErrorHelpers.isNotFoundError(error) || !autoCreateOrUpgradeIfMissing) {
        throw error;
      }

      await (0, _create_or_upgrade_saved_config.createOrUpgradeSavedConfig)({
        savedObjectsClient: this.savedObjectsClient,
        version: this.id,
        buildNum: this.buildNum,
        log: this.log,
        handleWriteErrors: false
      });
      await this.write({
        changes,
        autoCreateOrUpgradeIfMissing: false
      });
    }
  }

  async read({
    autoCreateOrUpgradeIfMissing = true
  } = {}) {
    try {
      const resp = await this.savedObjectsClient.get(this.type, this.id);
      return resp.attributes;
    } catch (error) {
      if (_saved_objects.SavedObjectsErrorHelpers.isNotFoundError(error) && autoCreateOrUpgradeIfMissing) {
        const failedUpgradeAttributes = await (0, _create_or_upgrade_saved_config.createOrUpgradeSavedConfig)({
          savedObjectsClient: this.savedObjectsClient,
          version: this.id,
          buildNum: this.buildNum,
          log: this.log,
          handleWriteErrors: true
        });

        if (!failedUpgradeAttributes) {
          return await this.read({
            autoCreateOrUpgradeIfMissing: false
          });
        }

        return failedUpgradeAttributes;
      }

      if (this.isIgnorableError(error)) {
        return {};
      }

      throw error;
    }
  }

  isIgnorableError(error) {
    const {
      isForbiddenError,
      isEsUnavailableError
    } = this.savedObjectsClient.errors;
    return isForbiddenError(error) || isEsUnavailableError(error);
  }

}

exports.UiSettingsClient = UiSettingsClient;