"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prettyPrintJobType = exports.isJobV2Params = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: Remove this code once everyone is using the new PDF format, then we can also remove the legacy
// export type entirely


const isJobV2Params = ({
  sharingData
}) => sharingData.locatorParams != null;

exports.isJobV2Params = isJobV2Params;

const prettyPrintJobType = type => {
  switch (type) {
    case _constants.PDF_JOB_TYPE:
    case _constants.PDF_JOB_TYPE_V2:
      return 'PDF';

    case _constants.CSV_JOB_TYPE:
    case _constants.CSV_JOB_TYPE_DEPRECATED:
      return 'CSV';

    case _constants.PNG_JOB_TYPE:
    case _constants.PNG_JOB_TYPE_V2:
      return 'PNG';

    default:
      return type;
  }
};

exports.prettyPrintJobType = prettyPrintJobType;