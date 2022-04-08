"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOptionsListInject = exports.createOptionsListExtract = void 0;

var _common = require("../../../../data_views/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dataViewReferenceName = 'optionsListDataView';

const createOptionsListInject = () => {
  return (state, references) => {
    const workingState = { ...state
    };
    references.forEach(reference => {
      if (reference.name === dataViewReferenceName) {
        workingState.dataViewId = reference.id;
      }
    });
    return workingState;
  };
};

exports.createOptionsListInject = createOptionsListInject;

const createOptionsListExtract = () => {
  return state => {
    const workingState = { ...state
    };
    const references = [];

    if ('dataViewId' in workingState) {
      references.push({
        name: dataViewReferenceName,
        type: _common.DATA_VIEW_SAVED_OBJECT_TYPE,
        id: workingState.dataViewId
      });
      delete workingState.dataViewId;
    }

    return {
      state: workingState,
      references
    };
  };
};

exports.createOptionsListExtract = createOptionsListExtract;