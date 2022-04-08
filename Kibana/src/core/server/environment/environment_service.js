"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnvironmentService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _utils = require("@kbn/utils");

var _http = require("../http");

var _pid_config = require("./pid_config");

var _resolve_uuid = require("./resolve_uuid");

var _create_data_folder = require("./create_data_folder");

var _write_pid_file = require("./write_pid_file");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class EnvironmentService {
  constructor(core) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "processLogger", void 0);
    (0, _defineProperty2.default)(this, "configService", void 0);
    (0, _defineProperty2.default)(this, "uuid", '');
    this.log = core.logger.get('environment');
    this.processLogger = core.logger.get('process');
    this.configService = core.configService;
  }

  async preboot() {
    // IMPORTANT: This code is based on the assumption that none of the configuration values used
    // here is supposed to change during preboot phase and it's safe to read them only once.
    const [pathConfig, serverConfig, pidConfig] = await Promise.all([this.configService.atPath(_utils.config.path).pipe((0, _operators.take)(1)).toPromise(), this.configService.atPath(_http.config.path).pipe((0, _operators.take)(1)).toPromise(), this.configService.atPath(_pid_config.config.path).pipe((0, _operators.take)(1)).toPromise()]); // Log unhandled rejections so that we can fix them in preparation for https://github.com/elastic/kibana/issues/77469

    process.on('unhandledRejection', reason => {
      var _stack;

      const message = (_stack = reason === null || reason === void 0 ? void 0 : reason.stack) !== null && _stack !== void 0 ? _stack : JSON.stringify(reason);
      this.log.warn(`Detected an unhandled Promise rejection: ${message}`);
    });
    process.on('warning', warning => {
      // deprecation warnings do no reflect a current problem for the user and should be filtered out.
      if (warning.name === 'DeprecationWarning') {
        return;
      }

      this.processLogger.warn(warning);
    });
    await (0, _create_data_folder.createDataFolder)({
      pathConfig,
      logger: this.log
    });
    await (0, _write_pid_file.writePidFile)({
      pidConfig,
      logger: this.log
    });
    this.uuid = await (0, _resolve_uuid.resolveInstanceUuid)({
      pathConfig,
      serverConfig,
      logger: this.log
    });
    return {
      instanceUuid: this.uuid
    };
  }

  setup() {
    return {
      instanceUuid: this.uuid
    };
  }

}

exports.EnvironmentService = EnvironmentService;