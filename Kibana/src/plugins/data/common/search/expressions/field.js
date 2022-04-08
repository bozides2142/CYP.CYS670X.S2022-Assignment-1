"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldFunction = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fieldFunction = {
  name: 'field',
  type: 'kibana_field',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.field.help', {
    defaultMessage: 'Create a Kibana field.'
  }),
  args: {
    name: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.field.name.help', {
        defaultMessage: 'Name of the field'
      })
    },
    type: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.field.type.help', {
        defaultMessage: 'Type of the field'
      })
    },
    script: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.functions.field.script.help', {
        defaultMessage: 'A field script, in case the field is scripted.'
      })
    }
  },

  fn(input, args) {
    return {
      type: 'kibana_field',
      spec: {
        name: args.name,
        type: args.type,
        scripted: args.script ? true : false,
        script: args.script
      }
    };
  }

};
exports.fieldFunction = fieldFunction;