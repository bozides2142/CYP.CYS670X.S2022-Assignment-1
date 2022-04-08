"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateEndpointPackagePolicyToV7130 = void 0;

var _mappings = require("../../../services/artifacts/mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migrateEndpointPackagePolicyToV7130 = packagePolicyDoc => {
  var _packagePolicyDoc$att;

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    var _packagePolicyDoc$att2, _packagePolicyDoc$att3, _packagePolicyDoc$att4; // Adjust all artifact URLs so that they point at fleet-server


    const artifactList = (_packagePolicyDoc$att2 = packagePolicyDoc.attributes) === null || _packagePolicyDoc$att2 === void 0 ? void 0 : (_packagePolicyDoc$att3 = _packagePolicyDoc$att2.inputs[0]) === null || _packagePolicyDoc$att3 === void 0 ? void 0 : (_packagePolicyDoc$att4 = _packagePolicyDoc$att3.config) === null || _packagePolicyDoc$att4 === void 0 ? void 0 : _packagePolicyDoc$att4.artifact_manifest.value.artifacts;

    if (artifactList) {
      for (const [identifier, artifactManifest] of Object.entries(artifactList)) {
        artifactManifest.relative_url = (0, _mappings.relativeDownloadUrlFromArtifact)({
          identifier,
          decodedSha256: artifactManifest.decoded_sha256
        });
      }
    }
  }

  return packagePolicyDoc;
};

exports.migrateEndpointPackagePolicyToV7130 = migrateEndpointPackagePolicyToV7130;