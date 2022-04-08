"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = exports.setSearchResponse = exports.setIndexPatternFields = exports.getSearchCallMeta = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _constants = require("../../common/constants");

var _field_editor_flyout_content = require("../../public/components/field_editor_flyout_content");

var _helpers = require("./helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultProps = {
  onSave: () => {},
  onCancel: () => {},
  isSavingField: false
};
/**
 * This handler lets us mock the fields present on the index pattern during our test
 * @param fields The fields of the index pattern
 */

const setIndexPatternFields = fields => {
  _helpers.spyIndexPatternGetAllFields.mockReturnValue(fields);
};

exports.setIndexPatternFields = setIndexPatternFields;

const getSearchCallMeta = () => {
  var _spySearchQuery$mock$;

  const totalCalls = _helpers.spySearchQuery.mock.calls.length;
  const lastCall = (_spySearchQuery$mock$ = _helpers.spySearchQuery.mock.calls[totalCalls - 1]) !== null && _spySearchQuery$mock$ !== void 0 ? _spySearchQuery$mock$ : null;
  let lastCallParams = null;

  if (lastCall) {
    lastCallParams = lastCall[0];
  }

  return {
    totalCalls,
    lastCall,
    lastCallParams
  };
};

exports.getSearchCallMeta = getSearchCallMeta;

const setSearchResponse = documents => {
  _helpers.spySearchQueryResponse.mockResolvedValue({
    rawResponse: {
      hits: {
        total: documents.length,
        hits: documents
      }
    }
  });
};

exports.setSearchResponse = setSearchResponse;

const getActions = testBed => {
  const getWrapperRenderedIndexPatternFields = () => {
    if (testBed.find('indexPatternFieldList').length === 0) {
      return null;
    }

    return testBed.find('indexPatternFieldList.listItem');
  };

  const getRenderedIndexPatternFields = () => {
    const allFields = getWrapperRenderedIndexPatternFields();

    if (allFields === null) {
      return [];
    }

    return allFields.map(field => {
      const key = testBed.find('key', field).text();
      const value = testBed.find('value', field).text();
      return {
        key,
        value
      };
    });
  };

  const getRenderedFieldsPreview = () => {
    if (testBed.find('fieldPreviewItem').length === 0) {
      return [];
    }

    const previewFields = testBed.find('fieldPreviewItem.listItem');
    return previewFields.map(field => {
      const key = testBed.find('key', field).text();
      const value = testBed.find('value', field).text();
      return {
        key,
        value
      };
    });
  };

  const setFilterFieldsValue = async value => {
    await (0, _testUtils.act)(async () => {
      testBed.form.setInputValue('filterFieldsInput', value);
    });
    testBed.component.update();
  }; // Need to set "server: any" (instead of SinonFakeServer) to avoid a TS error :(
  // Error: Exported variable 'setup' has or is using name 'Document' from external module "/dev/shm/workspace/parallel/14/kibana/node_modules/@types/sinon/ts3.1/index"


  const getLatestPreviewHttpRequest = server => {
    let i = server.requests.length - 1;

    while (i >= 0) {
      const request = server.requests[i];

      if (request.method === 'POST' && request.url === `${_constants.API_BASE_PATH}/field_preview`) {
        return { ...request,
          requestBody: JSON.parse(JSON.parse(request.requestBody).body)
        };
      }

      i--;
    }

    throw new Error(`Can't access the latest preview HTTP request as it hasn't been called.`);
  };

  const goToNextDocument = async () => {
    await (0, _testUtils.act)(async () => {
      testBed.find('goToNextDocButton').simulate('click');
    });
    testBed.component.update();
  };

  const goToPreviousDocument = async () => {
    await (0, _testUtils.act)(async () => {
      testBed.find('goToPrevDocButton').simulate('click');
    });
    testBed.component.update();
  };

  const loadCustomDocument = docId => {};

  return { ...(0, _helpers.getCommonActions)(testBed),
    getWrapperRenderedIndexPatternFields,
    getRenderedIndexPatternFields,
    getRenderedFieldsPreview,
    setFilterFieldsValue,
    getLatestPreviewHttpRequest,
    goToNextDocument,
    goToPreviousDocument,
    loadCustomDocument
  };
};

const setup = async (props, deps) => {
  let testBed; // Setup testbed

  await (0, _testUtils.act)(async () => {
    testBed = await (0, _jest.registerTestBed)((0, _helpers.WithFieldEditorDependencies)(_field_editor_flyout_content.FieldEditorFlyoutContent, deps), {
      memoryRouter: {
        wrapComponent: false
      }
    })({ ...defaultProps,
      ...props
    });
  });
  testBed.component.update();
  return { ...testBed,
    actions: getActions(testBed)
  };
};

exports.setup = setup;