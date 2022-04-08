"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = exports.defaultProps = void 0;
Object.defineProperty(exports, "waitForDocumentsAndPreviewUpdate", {
  enumerable: true,
  get: function () {
    return _helpers.waitForDocumentsAndPreviewUpdate;
  }
});
Object.defineProperty(exports, "waitForUpdates", {
  enumerable: true,
  get: function () {
    return _helpers.waitForUpdates;
  }
});

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _field_editor = require("../../public/components/field_editor/field_editor");

var _helpers = require("./helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultProps = {
  onChange: jest.fn()
};
exports.defaultProps = defaultProps;

const setup = async (props, deps) => {
  let testBed;
  await (0, _testUtils.act)(async () => {
    testBed = await (0, _jest.registerTestBed)((0, _helpers.WithFieldEditorDependencies)(_field_editor.FieldEditor, deps), {
      memoryRouter: {
        wrapComponent: false
      }
    })({ ...defaultProps,
      ...props
    });
  });
  testBed.component.update();
  const actions = { ...(0, _helpers.getCommonActions)(testBed)
  };
  return { ...testBed,
    actions
  };
};

exports.setup = setup;