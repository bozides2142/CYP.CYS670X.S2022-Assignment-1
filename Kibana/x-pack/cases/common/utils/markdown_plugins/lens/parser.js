"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LensParser = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LensParser = function () {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  const tokenizeLens = function (eat, value, silent) {
    if (value.startsWith(`!{${_constants.LENS_ID}`) === false) return true;
    const nextChar = value[6];
    if (nextChar !== '{' && nextChar !== '}') return false; // this isn't actually a lens

    if (silent) {
      return true;
    } // is there a configuration?


    const hasConfiguration = nextChar === '{';
    let match = `!{${_constants.LENS_ID}`;
    let configuration = {};

    if (hasConfiguration) {
      let configurationString = '';
      let openObjects = 0;

      for (let i = 6; i < value.length; i++) {
        const char = value[i];

        if (char === '{') {
          openObjects++;
          configurationString += char;
        } else if (char === '}') {
          openObjects--;

          if (openObjects === -1) {
            break;
          }

          configurationString += char;
        } else {
          configurationString += char;
        }
      }

      match += configurationString;

      try {
        configuration = JSON.parse(configurationString);
      } catch (e) {
        const now = eat.now();
        this.file.fail(`Unable to parse lens JSON configuration: ${e}`, {
          line: now.line,
          column: now.column + 6
        });
      }
    }

    match += '}';
    return eat(match)({
      type: _constants.LENS_ID,
      ...configuration
    });
  };

  tokenizers.lens = tokenizeLens;
  methods.splice(methods.indexOf('text'), 0, _constants.LENS_ID);
};

exports.LensParser = LensParser;