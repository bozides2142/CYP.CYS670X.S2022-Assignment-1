"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datacolumn = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _lodash = require("lodash");

var _interpreter = require("@kbn/interpreter");

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _i18n = require("../../../../i18n");

var _simple_math_function = require("./simple_math_function");

var _get_form_object = require("./get_form_object");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  DataColumn: strings
} = _i18n.ArgumentStrings;

const maybeQuoteValue = val => val.match(/\s/) ? `'${val}'` : val;

const valueNotSet = val => !val || val.length === 0;

const getMathValue = (argValue, columns) => {
  if ((0, _interpreter.getType)(argValue) !== 'string') {
    return {
      error: 'argValue is not a string type'
    };
  }

  try {
    const matchedCol = columns.find(({
      name
    }) => argValue === name);
    const val = matchedCol ? maybeQuoteValue(matchedCol.name) : argValue;
    const mathValue = (0, _get_form_object.getFormObject)(val);
    const validColumn = columns.some(({
      name
    }) => mathValue.column === name);
    return { ...mathValue,
      column: validColumn ? mathValue.column : ''
    };
  } catch (e) {
    return {
      error: e.message
    };
  }
}; // TODO: Garbage, we could make a much nicer math form that can handle way more.


const DatacolumnArgInput = ({
  onValueChange,
  resolved: {
    columns
  },
  argValue,
  renderError,
  argId,
  typeInstance
}) => {
  const [mathValue, setMathValue] = (0, _react.useState)(getMathValue(argValue, columns));
  (0, _react.useEffect)(() => {
    setMathValue(getMathValue(argValue, columns));
  }, [argValue, columns]);
  const allowedTypes = typeInstance.options.allowedTypes || false;
  const onlyShowMathFunctions = typeInstance.options.onlyMath || false;
  const updateFunctionValue = (0, _react.useCallback)((fn, column) => {
    // if setting size, auto-select the first column if no column is already set
    if (fn === 'size') {
      const col = column || columns[0] && columns[0].name || '';

      if (col) {
        return onValueChange(`${fn}(${maybeQuoteValue(col)})`);
      }
    } // if there is no column value, do nothing


    if (valueNotSet(column)) {
      return setMathValue({ ...mathValue,
        fn
      });
    } // if fn is not set, just use the value input


    if (valueNotSet(fn)) {
      return onValueChange(column);
    } // fn has a value, so use it as a math.js expression


    onValueChange(`${fn}(${maybeQuoteValue(column)})`);
  }, [mathValue, onValueChange, columns]);
  const onChangeFn = (0, _react.useCallback)(({
    target: {
      value
    }
  }) => updateFunctionValue(value, mathValue.column), [mathValue.column, updateFunctionValue]);
  const onChangeColumn = (0, _react.useCallback)(({
    target: {
      value
    }
  }) => updateFunctionValue(mathValue.fn, value), [mathValue.fn, updateFunctionValue]);

  if (mathValue.error) {
    renderError();
    return null;
  }

  const firstColumnOption = {
    value: '',
    text: 'select column',
    disabled: true
  };
  const options = (0, _lodash.sortBy)(columns, 'name').filter(column => !allowedTypes || allowedTypes.includes(column.type)).map(({
    name
  }) => ({
    value: name,
    text: name
  }));
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    gutterSize: "s",
    id: argId,
    direction: "row"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_simple_math_function.SimpleMathFunction, {
    id: argId,
    value: mathValue.fn,
    onlymath: onlyShowMathFunctions,
    onChange: onChangeFn
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    options: [firstColumnOption, ...options],
    value: mathValue.column,
    onChange: onChangeColumn
  })));
};

DatacolumnArgInput.propTypes = {
  resolved: _propTypes.default.shape({
    columns: _propTypes.default.array.isRequired
  }).isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired,
  renderError: _propTypes.default.func.isRequired,
  argId: _propTypes.default.string.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired
};

const datacolumn = () => ({
  name: 'datacolumn',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  default: '""',
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(DatacolumnArgInput)
});

exports.datacolumn = datacolumn;