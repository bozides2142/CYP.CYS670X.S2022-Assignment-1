"use strict";

var _react = _interopRequireWildcard(require("react"));

var _rxjs = require("rxjs");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const mockUseEffect = _react.useEffect;
const mockOf = _rxjs.of;
const EDITOR_ID = 'testEditor';
jest.mock('@elastic/eui', () => {
  const original = jest.requireActual('@elastic/eui');
  return { ...original,
    EuiComboBox: props => {
      var _props$selectedOption;

      return /*#__PURE__*/_react.default.createElement("input", {
        "data-test-subj": props['data-test-subj'] || 'mockComboBox',
        "data-currentvalue": props.selectedOptions,
        value: (_props$selectedOption = props.selectedOptions[0]) === null || _props$selectedOption === void 0 ? void 0 : _props$selectedOption.value,
        onChange: async syntheticEvent => {
          props.onChange([syntheticEvent['0']]);
        }
      });
    },
    EuiResizeObserver: ({
      onResize,
      children
    }) => {
      onResize({
        height: 1000
      });
      return children();
    }
  };
});
jest.mock('@kbn/monaco', () => {
  const original = jest.requireActual('@kbn/monaco');
  const originalMonaco = original.monaco;
  return { ...original,
    PainlessLang: {
      ID: 'painless',
      getSuggestionProvider: () => undefined,
      getSyntaxErrors: () => ({
        [EDITOR_ID]: []
      }),

      validation$() {
        return mockOf({
          isValid: true,
          isValidating: false,
          errors: []
        });
      }

    },
    monaco: { ...originalMonaco,
      editor: { ...originalMonaco.editor,

        setModelMarkers() {}

      }
    }
  };
});
jest.mock('react-use/lib/useDebounce', () => {
  return (cb, ms, deps) => {
    mockUseEffect(() => {
      cb();
    }, deps);
  };
});
jest.mock('../../../../kibana_react/public', () => {
  const original = jest.requireActual('../../../../kibana_react/public');
  /**
   * We mock the CodeEditor because it requires the <KibanaReactContextProvider>
   * with the uiSettings passed down. Let's use a simple <input /> in our tests.
   */

  const CodeEditorMock = props => {
    const {
      editorDidMount
    } = props;
    mockUseEffect(() => {
      // Forward our deterministic ID to the consumer
      // We need below for the PainlessLang.getSyntaxErrors mock
      editorDidMount({
        getModel() {
          return {
            id: EDITOR_ID
          };
        }

      });
    }, [editorDidMount]);
    return /*#__PURE__*/_react.default.createElement("input", {
      "data-test-subj": props['data-test-subj'] || 'mockCodeEditor',
      "data-value": props.value,
      value: props.value,
      onChange: e => {
        props.onChange(e.target.value);
      }
    });
  };

  return { ...original,
    toMountPoint: node => node,
    CodeEditor: CodeEditorMock
  };
});