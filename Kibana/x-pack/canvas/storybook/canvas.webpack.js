"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canvasWebpack = exports.canvasStorybookConfig = void 0;

var _path = require("path");

var _storybook = require("@kbn/storybook");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const canvasWebpack = {
  module: {
    rules: [// Enable CSS Modules in Storybook (Shareable Runtime)
    {
      test: /\.module\.s(a|c)ss$/,
      loader: ['style-loader', {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          modules: {
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }, {
        loader: 'postcss-loader',
        options: {
          path: (0, _path.resolve)(_constants.KIBANA_ROOT, 'src/optimize/postcss.config.js')
        }
      }, {
        loader: 'sass-loader',
        options: {
          implementation: require('node-sass')
        }
      }]
    }, // Exclude large-dependency, troublesome or irrelevant modules.
    {
      test: [(0, _path.resolve)(_constants.KIBANA_ROOT, 'x-pack/plugins/canvas/public/components/embeddable_flyout'), (0, _path.resolve)(_constants.KIBANA_ROOT, 'x-pack/plugins/reporting/public')],
      use: 'null-loader'
    }]
  },
  resolve: {
    alias: {
      'src/plugins': (0, _path.resolve)(_constants.KIBANA_ROOT, 'src/plugins'),
      '../../lib/es_service': (0, _path.resolve)(_constants.KIBANA_ROOT, 'x-pack/plugins/canvas/storybook/__mocks__/es_service.ts')
    }
  }
};
exports.canvasWebpack = canvasWebpack;
const canvasStorybookConfig = { ..._storybook.defaultConfig,
  addons: [...(_storybook.defaultConfig.addons || []), './addon/target/register'],
  ...(0, _storybook.mergeWebpackFinal)(canvasWebpack)
};
exports.canvasStorybookConfig = canvasStorybookConfig;