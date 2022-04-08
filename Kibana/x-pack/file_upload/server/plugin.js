"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUploadPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _routes = require("./routes");

var _telemetry = require("./telemetry");

var _constants = require("../common/constants");

var _capabilities = require("./capabilities");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FileUploadPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "_logger", void 0);
    this._logger = initializerContext.logger.get();
  }

  setup(coreSetup, plugins) {
    (0, _routes.fileUploadRoutes)(coreSetup, this._logger);
    (0, _capabilities.setupCapabilities)(coreSetup);
    coreSetup.uiSettings.register({
      [_constants.UI_SETTING_MAX_FILE_SIZE]: {
        name: _i18n.i18n.translate('xpack.fileUpload.maxFileSizeUiSetting.name', {
          defaultMessage: 'Maximum file upload size'
        }),
        value: _constants.MAX_FILE_SIZE,
        description: _i18n.i18n.translate('xpack.fileUpload.maxFileSizeUiSetting.description', {
          defaultMessage: 'Sets the file size limit when importing files. The highest supported value for this setting is 1GB.'
        }),
        schema: _configSchema.schema.string({
          validate: value => {
            if (!/^\d+[mg][b]$/i.test(value)) {
              return _i18n.i18n.translate('xpack.fileUpload.maxFileSizeUiSetting.error', {
                defaultMessage: 'Should be a valid data size. e.g. 200MB, 1GB'
              });
            }
          }
        })
      }
    });
    (0, _telemetry.initFileUploadTelemetry)(coreSetup, plugins.usageCollection);
  }

  start(core) {}

}

exports.FileUploadPlugin = FileUploadPlugin;