"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettingFn = getUiSettingFn;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
function getUiSettingFn({
  getStartDependencies
}) {
  return {
    name: 'uiSetting',
    help: _i18n.i18n.translate('expressions.functions.uiSetting.help', {
      defaultMessage: 'Returns a UI settings parameter value.'
    }),
    args: {
      default: {
        help: _i18n.i18n.translate('expressions.functions.uiSetting.args.default', {
          defaultMessage: 'A default value in case of the parameter is not set.'
        })
      },
      parameter: {
        aliases: ['_'],
        help: _i18n.i18n.translate('expressions.functions.uiSetting.args.parameter', {
          defaultMessage: 'The parameter name.'
        }),
        required: true,
        types: ['string']
      }
    },

    async fn(input, {
      default: defaultValue,
      parameter
    }, {
      getKibanaRequest
    }) {
      const {
        uiSettings
      } = await getStartDependencies(() => {
        const request = getKibanaRequest === null || getKibanaRequest === void 0 ? void 0 : getKibanaRequest();

        if (!request) {
          throw new Error(_i18n.i18n.translate('expressions.functions.uiSetting.error.kibanaRequest', {
            defaultMessage: 'A KibanaRequest is required to get UI settings on the server. ' + 'Please provide a request object to the expression execution params.'
          }));
        }

        return request;
      });

      try {
        return {
          type: 'ui_setting',
          key: parameter,
          value: await uiSettings.get(parameter, defaultValue)
        };
      } catch {
        throw new Error(_i18n.i18n.translate('expressions.functions.uiSetting.error.parameter', {
          defaultMessage: 'Invalid parameter "{parameter}".',
          values: {
            parameter
          }
        }));
      }
    }

  };
}