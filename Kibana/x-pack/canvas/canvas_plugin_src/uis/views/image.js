"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = void 0;

var _lib = require("../../../../../../src/plugins/presentation_util/common/lib");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Image: strings
} = _i18n.ViewStrings;

const image = () => {
  return {
    name: 'image',
    displayName: strings.getDisplayName(),
    modelArgs: [],
    requiresContext: false,
    args: [{
      name: 'dataurl',
      argType: 'imageUpload',
      resolve: async ({
        args
      }) => {
        const {
          elasticLogo
        } = await (0, _lib.getElasticLogo)();
        return {
          dataurl: (0, _lib.resolveFromArgs)(args, elasticLogo)
        };
      }
    }, {
      name: 'mode',
      displayName: strings.getModeDisplayName(),
      help: strings.getModeHelp(),
      argType: 'select',
      options: {
        choices: [{
          value: 'contain',
          name: strings.getContainMode()
        }, {
          value: 'cover',
          name: strings.getCoverMode()
        }, {
          value: 'stretch',
          name: strings.getStretchMode()
        }]
      }
    }]
  };
};

exports.image = image;