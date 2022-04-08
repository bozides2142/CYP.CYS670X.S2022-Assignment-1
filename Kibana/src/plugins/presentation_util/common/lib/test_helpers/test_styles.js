"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fontStyle = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fontStyle = {
  type: 'style',
  spec: {
    fontFamily: 'Chalkboard, serif',
    fontWeight: 'bolder',
    fontStyle: 'normal',
    textDecoration: 'underline',
    color: 'pink',
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '21px'
  },
  css: 'font-family:Chalkboard, serif;font-weight:bolder;font-style:normal;text-decoration:underline;color:pink;text-align:center;font-size:14px;line-height:21px'
};
exports.fontStyle = fontStyle;