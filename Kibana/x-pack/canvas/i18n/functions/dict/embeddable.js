"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.embeddableHelpText', {
    defaultMessage: `Returns an embeddable with the provided configuration`
  }),
  args: {
    config: _i18n.i18n.translate('xpack.canvas.functions.embeddable.args.idHelpText', {
      defaultMessage: `The base64 encoded embeddable input object`
    }),
    type: _i18n.i18n.translate('xpack.canvas.functions.embeddable.args.typeHelpText', {
      defaultMessage: `The embeddable type`
    })
  }
};
exports.help = help;