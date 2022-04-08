"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _with_debounce_arg = require("../../../public/components/with_debounce_arg");

var _i18n = require("../../../i18n");

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
  String: strings
} = _i18n.ArgumentStrings;

const StringArgInput = ({
  argValue,
  typeInstance,
  onValueChange,
  argId
}) => {
  var _typeInstance$options;

  const [value, setValue] = (0, _react.useState)(argValue);
  const confirm = typeInstance === null || typeInstance === void 0 ? void 0 : (_typeInstance$options = typeInstance.options) === null || _typeInstance$options === void 0 ? void 0 : _typeInstance$options.confirm;
  (0, _react.useEffect)(() => {
    setValue(argValue);
  }, [argValue]);
  const onChange = (0, _react.useCallback)(ev => {
    const {
      value
    } = ev.target;
    setValue(value);

    if (!confirm) {
      onValueChange(value);
    }
  }, [confirm, onValueChange]);
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    gutterSize: "s"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFieldText, {
    compressed: true,
    id: argId,
    value: value,
    onChange: onChange
  })), confirm && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false,
    className: "canvasSidebar__panel-noMinWidth"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
    size: "s",
    onClick: () => onValueChange(value)
  }, confirm)));
};

StringArgInput.propTypes = {
  argId: _propTypes.default.string.isRequired,
  argValue: _propTypes.default.any.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired
};

const string = () => ({
  name: 'string',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)((0, _with_debounce_arg.withDebounceArg)(StringArgInput))
});

exports.string = string;