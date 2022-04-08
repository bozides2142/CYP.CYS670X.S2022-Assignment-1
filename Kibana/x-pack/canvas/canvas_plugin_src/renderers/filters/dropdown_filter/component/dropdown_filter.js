"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownFilter = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _i18n = require("@kbn/i18n");

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


const strings = {
  getMatchAllOptionLabel: () => _i18n.i18n.translate('xpack.canvas.renderer.dropdownFilter.matchAllOptionLabel', {
    defaultMessage: 'ANY',
    description: 'The dropdown filter option to match any value in the field.'
  })
};

const DropdownFilter = ({
  initialValue = '',
  commit,
  choices = []
}) => {
  const [value, setValue] = (0, _react.useState)(initialValue);
  (0, _react.useEffect)(() => {
    setValue(initialValue);
  }, [initialValue]);
  let options = [{
    value: '%%CANVAS_MATCH_ALL%%',
    text: `-- ${strings.getMatchAllOptionLabel()} --`
  }];
  options = options.concat(choices.map(choice => ({
    value: choice[0],
    text: choice[1]
  })));

  const changeHandler = e => {
    if (e && e.target) {
      const target = e.target;
      setValue(target.value);
      commit(target.value);
    }
  };

  const dropdownOptions = options.map(option => {
    const {
      text
    } = option;
    const optionValue = option.value;
    const selected = optionValue === value;
    return {
      text,
      selected,
      value: optionValue
    };
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "canvasDropdownFilter"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    className: "canvasDropdownFilter__select",
    value: value,
    onChange: changeHandler,
    "data-test-subj": "canvasDropdownFilter__select",
    options: dropdownOptions,
    fullWidth: true,
    compressed: true
  }));
};

exports.DropdownFilter = DropdownFilter;
DropdownFilter.propTypes = {
  choices: _propTypes.default.array,
  initialValue: _propTypes.default.string,
  commit: _propTypes.default.func.isRequired
};