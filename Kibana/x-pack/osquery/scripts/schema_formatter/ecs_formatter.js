"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _lodash = require("lodash");

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _devUtils = require("@kbn/dev-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ECS_COLUMN_SCHEMA_FIELDS = ['field', 'type', 'normalization', 'example', 'description'];
const RESTRICTED_FIELDS = ['agent.name', 'agent.id', 'agent.ephemeral_id', 'agent.type', 'agent.version', 'ecs.version', 'event.agent_id_status', 'event.ingested', 'event.module', 'host.hostname', 'host.os.build', 'host.os.kernel', 'host.os.name', 'host.os.family', 'host.os.type', 'host.os.version', 'host.platform', 'host.ip', 'host.id', 'host.mac', 'host.architecture', '@timestamp'];
(0, _devUtils.run)(async ({
  flags
}) => {
  const schemaPath = _path.default.resolve(`public/common/schemas/ecs/`);

  const schemaFile = _path.default.join(schemaPath, flags.schema_version);

  const schemaData = await require(schemaFile);
  const filteredSchemaData = (0, _lodash.filter)(schemaData, field => !RESTRICTED_FIELDS.includes(field.field));
  const formattedSchema = (0, _lodash.map)(filteredSchemaData, (0, _lodash.partialRight)(_lodash.pick, ECS_COLUMN_SCHEMA_FIELDS));
  await _fs.promises.writeFile(_path.default.join(schemaPath, `v${flags.schema_version}-formatted.json`), JSON.stringify(formattedSchema));
}, {
  description: `
      Script for formatting generated osquery API schema JSON file.
    `,
  flags: {
    string: ['schema_version'],
    help: `
        --schema_version The semver string for the schema file located in public/common/schemas/ecs/
      `
  }
});