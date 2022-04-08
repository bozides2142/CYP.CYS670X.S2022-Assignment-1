"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

var _i18n = require("@kbn/i18n");

var _lib = require("../../../../common/lib");

var _index = require("../index");

var _schema_validation = require("./schema_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerCreateRoute = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  router.post({
    path: (0, _index.addBasePath)('/component_templates'),
    validate: {
      body: _schema_validation.componentTemplateSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const serializedComponentTemplate = (0, _lib.serializeComponentTemplate)(request.body);
    const {
      name
    } = request.body;

    try {
      // Check that a component template with the same name doesn't already exist
      const {
        body: {
          component_templates: componentTemplates
        }
      } = await client.asCurrentUser.cluster.getComponentTemplate({
        name
      });

      if (componentTemplates.length) {
        return response.conflict({
          body: new Error(_i18n.i18n.translate('xpack.idxMgmt.componentTemplates.createRoute.duplicateErrorMessage', {
            defaultMessage: "There is already a component template with name '{name}'.",
            values: {
              name
            }
          }))
        });
      }
    } catch (e) {// Silently swallow error
    }

    try {
      const {
        body: responseBody
      } = await client.asCurrentUser.cluster.putComponentTemplate({
        name,
        // @ts-expect-error ComponentTemplateSerialized conflicts with @elastic/elasticsearch ClusterPutComponentTemplateRequest
        body: serializedComponentTemplate
      });
      return response.ok({
        body: responseBody
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
};

exports.registerCreateRoute = registerCreateRoute;