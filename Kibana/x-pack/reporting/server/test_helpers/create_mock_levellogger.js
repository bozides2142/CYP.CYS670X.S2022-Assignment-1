"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockLevelLogger = createMockLevelLogger;

var _mocks = require("src/core/server/mocks");

var _level_logger = require("../lib/level_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


jest.mock('../lib/level_logger');

function createMockLevelLogger() {
  // eslint-disable-next-line no-console
  const consoleLogger = tag => message => console.log(tag, message);

  const logger = new _level_logger.LevelLogger(_mocks.loggingSystemMock.create()); // logger.debug.mockImplementation(consoleLogger('debug')); // uncomment this to see debug logs in jest tests

  logger.info.mockImplementation(consoleLogger('info'));
  logger.warn.mockImplementation(consoleLogger('warn'));
  logger.warning = jest.fn().mockImplementation(consoleLogger('warn'));
  logger.error.mockImplementation(consoleLogger('error'));
  logger.trace.mockImplementation(consoleLogger('trace'));
  logger.clone.mockImplementation(() => logger);
  return logger;
}