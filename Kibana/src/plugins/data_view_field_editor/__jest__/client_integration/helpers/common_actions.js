"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForUpdates = exports.waitForDocumentsAndPreviewUpdate = exports.getCommonActions = void 0;

var _testUtils = require("react-dom/test-utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * We often need to wait for both the documents & the preview to be fetched.
 * We can't increase the `jest.advanceTimersByTime()` time
 * as those are 2 different operations that occur in sequence.
 */
const waitForDocumentsAndPreviewUpdate = async testBed => {
  // Wait for documents to be fetched
  await (0, _testUtils.act)(async () => {
    jest.advanceTimersByTime(5000);
  }); // Wait for the syntax validation debounced

  await (0, _testUtils.act)(async () => {
    jest.advanceTimersByTime(1000);
  });
  testBed === null || testBed === void 0 ? void 0 : testBed.component.update();
};
/**
 * Handler to bypass the debounce time in our tests
 */


exports.waitForDocumentsAndPreviewUpdate = waitForDocumentsAndPreviewUpdate;

const waitForUpdates = async testBed => {
  await (0, _testUtils.act)(async () => {
    jest.advanceTimersByTime(5000);
  });
  testBed === null || testBed === void 0 ? void 0 : testBed.component.update();
};

exports.waitForUpdates = waitForUpdates;

const getCommonActions = testBed => {
  const toggleFormRow = async (row, value = 'on') => {
    const testSubj = `${row}Row.toggle`;
    const toggle = testBed.find(testSubj);
    const isOn = toggle.props()['aria-checked'];

    if (value === 'on' && isOn || value === 'off' && isOn === false) {
      return;
    }

    await (0, _testUtils.act)(async () => {
      testBed.form.toggleEuiSwitch(testSubj);
    });
    testBed.component.update();
  }; // Fields


  const updateName = async value => {
    await (0, _testUtils.act)(async () => {
      testBed.form.setInputValue('nameField.input', value);
    });
    testBed.component.update();
  };

  const updateScript = async value => {
    await (0, _testUtils.act)(async () => {
      testBed.form.setInputValue('scriptField', value);
    });
    testBed.component.update();
  };

  const updateType = async (value, label) => {
    await (0, _testUtils.act)(async () => {
      testBed.find('typeField').simulate('change', [{
        value,
        label: label !== null && label !== void 0 ? label : value
      }]);
    });
    testBed.component.update();
  };

  const updateFormat = async (value, label) => {
    await (0, _testUtils.act)(async () => {
      testBed.find('editorSelectedFormatId').simulate('change', {
        target: {
          value
        }
      });
    });
    testBed.component.update();
  };

  const getScriptError = () => {
    const scriptError = testBed.component.find('#runtimeFieldScript-error-0');

    if (scriptError.length === 0) {
      return null;
    } else if (scriptError.length > 1) {
      return scriptError.at(0).text();
    }

    return scriptError.text();
  };

  return {
    toggleFormRow,
    waitForUpdates: waitForUpdates.bind(null, testBed),
    waitForDocumentsAndPreviewUpdate: waitForDocumentsAndPreviewUpdate.bind(null, testBed),
    fields: {
      updateName,
      updateType,
      updateScript,
      updateFormat,
      getScriptError
    }
  };
};

exports.getCommonActions = getCommonActions;