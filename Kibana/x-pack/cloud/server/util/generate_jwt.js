"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSignedJwt = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const generateSignedJwt = (userId, secret) => {
  const options = {
    header: {
      alg: 'HS256',
      typ: 'JWT'
    },
    expiresIn: 5 * 60 // 5m

  };
  const payload = {
    sub: userId
  };
  return _jsonwebtoken.default.sign(payload, secret, options);
};

exports.generateSignedJwt = generateSignedJwt;