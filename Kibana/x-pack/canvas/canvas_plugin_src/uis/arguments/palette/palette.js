"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopsPalette = exports.palette = exports.StopsPaletteArgInput = exports.SimplePaletteArgInput = exports.PaletteArgInput = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _i18n = require("../../../../i18n");

var _utils = require("./utils");

var _palette_types = require("./palette_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Palette: strings,
  StopsPalette: stopsPaletteStrings
} = _i18n.ArgumentStrings;

const PaletteArgInput = ({
  onValueChange,
  argId,
  argValue,
  renderError,
  typeInstance
}) => {
  var _typeInstance$options;

  const handleChange = palette => {
    var _palette$stops;

    let colorStopsPaletteConfig = {};

    if ((_palette$stops = palette.stops) !== null && _palette$stops !== void 0 && _palette$stops.length) {
      colorStopsPaletteConfig = {
        stop: palette.stops,
        ...(palette.range ? {
          range: [palette.range]
        } : {}),
        ...(palette.continuity ? {
          continuity: [palette.continuity]
        } : {})
      };
    }

    const astObj = {
      type: 'expression',
      chain: [{
        type: 'function',
        function: 'palette',
        arguments: {
          _: palette.colors,
          gradient: [palette.gradient],
          ...colorStopsPaletteConfig
        }
      }]
    };
    onValueChange(astObj);
  };

  const palette = (0, _utils.astToPalette)(argValue, renderError);

  if (!palette) {
    renderError();
    return null;
  }

  const PalettePicker = (0, _palette_types.getPaletteType)((_typeInstance$options = typeInstance.options) === null || _typeInstance$options === void 0 ? void 0 : _typeInstance$options.type);
  return /*#__PURE__*/_react.default.createElement(PalettePicker, {
    id: argId,
    palette: palette,
    onChange: handleChange
  });
};

exports.PaletteArgInput = PaletteArgInput;

const SimplePaletteArgInput = props => {
  var _typeInstance$options2;

  const {
    typeInstance
  } = props;
  const {
    type,
    ...restOptions
  } = (_typeInstance$options2 = typeInstance.options) !== null && _typeInstance$options2 !== void 0 ? _typeInstance$options2 : {};
  return /*#__PURE__*/_react.default.createElement(PaletteArgInput, (0, _extends2.default)({}, props, {
    typeInstance: { ...props.typeInstance,
      options: restOptions
    }
  }));
};

exports.SimplePaletteArgInput = SimplePaletteArgInput;

const StopsPaletteArgInput = props => {
  var _props$typeInstance$o;

  return /*#__PURE__*/_react.default.createElement(PaletteArgInput, (0, _extends2.default)({}, props, {
    typeInstance: { ...props.typeInstance,
      options: { ...((_props$typeInstance$o = props.typeInstance.options) !== null && _props$typeInstance$o !== void 0 ? _props$typeInstance$o : {}),
        type: 'stops'
      }
    }
  }));
};

exports.StopsPaletteArgInput = StopsPaletteArgInput;
PaletteArgInput.propTypes = {
  argId: _propTypes.default.string,
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.any.isRequired,
  renderError: _propTypes.default.func
};
const defaultPaletteOptions = {
  default: '{palette #882E72 #B178A6 #D6C1DE #1965B0 #5289C7 #7BAFDE #4EB265 #90C987 #CAE0AB #F7EE55 #F6C141 #F1932D #E8601C #DC050C}'
};

const palette = () => ({
  name: 'palette',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(SimplePaletteArgInput),
  ...defaultPaletteOptions
});

exports.palette = palette;

const stopsPalette = () => ({
  name: 'stops_palette',
  help: stopsPaletteStrings.getHelp(),
  displayName: stopsPaletteStrings.getDisplayName(),
  template: (0, _template_from_react_component.templateFromReactComponent)(StopsPaletteArgInput),
  ...defaultPaletteOptions
});

exports.stopsPalette = stopsPalette;