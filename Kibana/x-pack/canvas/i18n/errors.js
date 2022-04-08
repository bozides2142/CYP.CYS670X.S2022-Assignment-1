"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ErrorStrings = {
  actionsElements: {
    getInvalidArgIndexErrorMessage: index => _i18n.i18n.translate('xpack.canvas.error.actionsElements.invaludArgIndexErrorMessage', {
      defaultMessage: 'Invalid argument index: {index}',
      values: {
        index
      }
    })
  },
  esPersist: {
    getSaveFailureTitle: () => _i18n.i18n.translate('xpack.canvas.error.esPersist.saveFailureTitle', {
      defaultMessage: "Couldn't save your changes to Elasticsearch"
    }),
    getTooLargeErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.esPersist.tooLargeErrorMessage', {
      defaultMessage: 'The server gave a response that the workpad data was too large. This usually means uploaded image assets that are too large for Kibana or a proxy. Try removing some assets in the asset manager.'
    }),
    getUpdateFailureTitle: () => _i18n.i18n.translate('xpack.canvas.error.esPersist.updateFailureTitle', {
      defaultMessage: "Couldn't update workpad"
    })
  },
  esService: {
    getDefaultIndexFetchErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.esService.defaultIndexFetchErrorMessage', {
      defaultMessage: "Couldn't fetch default index"
    }),
    getFieldsFetchErrorMessage: index => _i18n.i18n.translate('xpack.canvas.error.esService.fieldsFetchErrorMessage', {
      defaultMessage: "Couldn't fetch Elasticsearch fields for '{index}'",
      values: {
        index
      }
    }),
    getIndicesFetchErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.esService.indicesFetchErrorMessage', {
      defaultMessage: "Couldn't fetch Elasticsearch indices"
    })
  },
  RenderWithFn: {
    getRenderErrorMessage: functionName => _i18n.i18n.translate('xpack.canvas.error.RenderWithFn.renderErrorMessage', {
      defaultMessage: "Rendering '{functionName}' failed",
      values: {
        functionName: functionName || 'function'
      }
    })
  },
  WorkpadDropzone: {
    getTooManyFilesErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadDropzone.tooManyFilesErrorMessage', {
      defaultMessage: 'One one file can be uploaded at a time'
    })
  },
  workpadRoutes: {
    getCreateFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadRoutes.createFailureErrorMessage', {
      defaultMessage: "Couldn't create workpad"
    }),
    getLoadFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadRoutes.loadFailureErrorMessage', {
      defaultMessage: "Couldn't load workpad with ID"
    })
  }
};
exports.ErrorStrings = ErrorStrings;