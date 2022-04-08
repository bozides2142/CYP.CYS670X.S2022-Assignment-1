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


const OSQUERY_COLUMN_SCHEMA_FIELDS = ['name', 'description', 'platforms', 'columns'];
const ELASTIC_OSQUERY_HOSTFS_TABLES = ['users', 'groups', 'processes'];
(0, _devUtils.run)(async ({
  flags
}) => {
  const schemaPath = _path.default.resolve(`../public/common/schemas/osquery/`);

  const schemaFile = _path.default.join(schemaPath, flags.schema_version);

  const schemaData = await require(schemaFile);
  const formattedSchema = (0, _lodash.map)(schemaData, (0, _lodash.partialRight)(_lodash.pick, OSQUERY_COLUMN_SCHEMA_FIELDS));
  const elasticTables = (0, _lodash.map)(ELASTIC_OSQUERY_HOSTFS_TABLES, tableName => ({ ...(0, _lodash.find)(formattedSchema, {
      name: tableName
    }),
    name: `host_${tableName}`
  }));
  formattedSchema.push(...elasticTables);
  await _fs.promises.writeFile(_path.default.join(schemaPath, `${flags.schema_version}`), JSON.stringify(formattedSchema));
}, {
  description: `
      Script for formatting generated osquery API schema JSON file.
    `,
  flags: {
    string: ['schema_version'],
    help: `
        --schema_version The semver string for the schema file located in public/common/schemas/osquery/
      `
  }
});