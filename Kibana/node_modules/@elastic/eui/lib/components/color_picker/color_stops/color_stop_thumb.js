"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiColorStopThumb = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("./utils");

var _utils2 = require("../utils");

var _services = require("../../../services");

var _button = require("../../button");

var _color_picker = require("../color_picker");

var _flex = require("../../flex");

var _form = require("../../form");

var _i18n = require("../../i18n");

var _popover = require("../../popover");

var _accessibility = require("../../accessibility");

var _spacer = require("../../spacer");

var _range_thumb = require("../../form/range/range_thumb");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EuiColorStopThumb = function EuiColorStopThumb(_ref) {
  var className = _ref.className,
      stop = _ref.stop,
      color = _ref.color,
      onChange = _ref.onChange,
      onFocus = _ref.onFocus,
      onRemove = _ref.onRemove,
      globalMin = _ref.globalMin,
      globalMax = _ref.globalMax,
      localMin = _ref.localMin,
      localMax = _ref.localMax,
      min = _ref.min,
      max = _ref.max,
      _ref$isRangeMin = _ref.isRangeMin,
      isRangeMin = _ref$isRangeMin === void 0 ? false : _ref$isRangeMin,
      _ref$isRangeMax = _ref.isRangeMax,
      isRangeMax = _ref$isRangeMax === void 0 ? false : _ref$isRangeMax,
      parentRef = _ref.parentRef,
      colorPickerMode = _ref.colorPickerMode,
      colorPickerShowAlpha = _ref.colorPickerShowAlpha,
      colorPickerSwatches = _ref.colorPickerSwatches,
      disabled = _ref.disabled,
      readOnly = _ref.readOnly,
      isPopoverOpen = _ref.isPopoverOpen,
      openPopover = _ref.openPopover,
      closePopover = _ref.closePopover,
      dataIndex = _ref['data-index'],
      ariaValueText = _ref['aria-valuetext'],
      _ref$valueInputProps = _ref.valueInputProps,
      valueInputProps = _ref$valueInputProps === void 0 ? {} : _ref$valueInputProps;
  var background = (0, _react.useMemo)(function () {
    var chromaColor = (0, _utils2.getChromaColor)(color, colorPickerShowAlpha);
    return chromaColor ? chromaColor.css() : undefined;
  }, [color, colorPickerShowAlpha]);

  var _useState = (0, _react.useState)(isPopoverOpen),
      _useState2 = _slicedToArray(_useState, 2),
      hasFocus = _useState2[0],
      setHasFocus = _useState2[1];

  var _useState3 = (0, _react.useState)((0, _utils.isColorInvalid)(color, colorPickerShowAlpha)),
      _useState4 = _slicedToArray(_useState3, 2),
      colorIsInvalid = _useState4[0],
      setColorIsInvalid = _useState4[1];

  var _useState5 = (0, _react.useState)((0, _utils.isStopInvalid)(stop)),
      _useState6 = _slicedToArray(_useState5, 2),
      stopIsInvalid = _useState6[0],
      setStopIsInvalid = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = _slicedToArray(_useState7, 2),
      numberInputRef = _useState8[0],
      setNumberInputRef = _useState8[1];

  var popoverRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (isPopoverOpen && popoverRef && popoverRef.current) {
      popoverRef.current.positionPopoverFixed();
    }
  }, [isPopoverOpen, stop]);

  var getStopFromMouseLocationFn = function getStopFromMouseLocationFn(location) {
    // Guard against `null` ref in usage
    return (0, _utils.getStopFromMouseLocation)(location, parentRef, globalMin, globalMax);
  };

  var getPositionFromStopFn = function getPositionFromStopFn(stop) {
    // Guard against `null` ref in usage
    return (0, _utils.getPositionFromStop)(stop, parentRef, globalMin, globalMax);
  };

  var handleOnRemove = function handleOnRemove() {
    if (onRemove) {
      closePopover();
      onRemove();
    }
  };

  var handleFocus = function handleFocus() {
    setHasFocus(true);

    if (onFocus) {
      onFocus();
    }
  };

  var setHasFocusTrue = function setHasFocusTrue() {
    return setHasFocus(true);
  };

  var setHasFocusFalse = function setHasFocusFalse() {
    return setHasFocus(false);
  };

  var handleColorChange = function handleColorChange(value) {
    setColorIsInvalid((0, _utils.isColorInvalid)(value, colorPickerShowAlpha));
    onChange({
      stop: stop,
      color: value
    });
  };

  var handleStopChange = function handleStopChange(value) {
    var willBeInvalid = value > localMax || value < localMin;

    if (willBeInvalid) {
      if (value > localMax) {
        value = localMax;
      }

      if (value < localMin) {
        value = localMin;
      }
    }

    setStopIsInvalid((0, _utils.isStopInvalid)(value));
    onChange({
      stop: value,
      color: color
    });
  };

  var handleStopInputChange = function handleStopInputChange(e) {
    var value = parseFloat(e.target.value);
    var willBeInvalid = value > globalMax || value < globalMin;

    if (willBeInvalid) {
      if (value > globalMax && max != null) {
        value = globalMax;
      }

      if (value < globalMin && min != null) {
        value = globalMin;
      }
    }

    setStopIsInvalid((0, _utils.isStopInvalid)(value));
    onChange({
      stop: value,
      color: color
    });
  };

  var handlePointerChange = function handlePointerChange(location, isFirstInteraction) {
    if (isFirstInteraction) return; // Prevents change on the initial MouseDown event

    if (parentRef == null) {
      return;
    }

    var newStop = getStopFromMouseLocationFn(location);
    handleStopChange(newStop);
  };

  var handleKeyDown = function handleKeyDown(event) {
    switch (event.key) {
      case _services.keys.ENTER:
        event.preventDefault();
        openPopover();
        break;

      case _services.keys.ARROW_LEFT:
        event.preventDefault();
        if (readOnly) return;
        handleStopChange(stop - 1);
        break;

      case _services.keys.ARROW_RIGHT:
        event.preventDefault();
        if (readOnly) return;
        handleStopChange(stop + 1);
        break;
    }
  };

  var _useMouseMove = (0, _services.useMouseMove)(handlePointerChange),
      _useMouseMove2 = _slicedToArray(_useMouseMove, 2),
      handleMouseDown = _useMouseMove2[0],
      handleInteraction = _useMouseMove2[1];

  var handleOnMouseDown = function handleOnMouseDown(e) {
    if (!readOnly) {
      handleMouseDown(e);
    }

    openPopover();
  };

  var handleTouchInteraction = function handleTouchInteraction(e) {
    if (!readOnly) {
      handleInteraction(e);
    }
  };

  var handleTouchStart = function handleTouchStart(e) {
    handleTouchInteraction(e);

    if (!isPopoverOpen) {
      openPopover();
    }
  };

  var classes = (0, _classnames.default)('euiColorStopPopover', {
    'euiColorStopPopover-hasFocus': hasFocus || isPopoverOpen
  }, className);
  return (0, _react2.jsx)(_popover.EuiPopover, {
    ref: popoverRef,
    className: classes,
    anchorClassName: "euiColorStopPopover__anchor",
    panelPaddingSize: "s",
    isOpen: isPopoverOpen,
    closePopover: closePopover,
    initialFocus: numberInputRef || undefined,
    focusTrapProps: {
      clickOutsideDisables: false
    },
    panelClassName: numberInputRef ? undefined : 'euiColorStopPopover-isLoadingPanel',
    style: {
      left: "".concat(getPositionFromStopFn(stop), "%")
    },
    button: (0, _react2.jsx)(_i18n.EuiI18n, {
      tokens: ['euiColorStopThumb.buttonAriaLabel', 'euiColorStopThumb.buttonTitle'],
      defaults: ['Press the Enter key to modify this stop. Press Escape to focus the group', 'Click to edit, drag to reposition']
    }, function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          buttonAriaLabel = _ref3[0],
          buttonTitle = _ref3[1];

      var ariaLabel = buttonAriaLabel;
      var title = buttonTitle;
      return (0, _react2.jsx)(_range_thumb.EuiRangeThumb, {
        "data-test-subj": "euiColorStopThumb",
        "data-index": dataIndex,
        min: localMin,
        max: localMax,
        value: stop,
        onFocus: handleFocus,
        onBlur: setHasFocusFalse,
        onMouseOver: setHasFocusTrue,
        onMouseOut: setHasFocusFalse,
        onKeyDown: handleKeyDown,
        onMouseDown: handleOnMouseDown,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchInteraction,
        "aria-valuetext": ariaValueText,
        "aria-label": ariaLabel,
        title: title,
        className: "euiColorStopThumb",
        tabIndex: -1,
        style: {
          background: background
        },
        disabled: disabled
      });
    })
  }, (0, _react2.jsx)("div", {
    className: "euiColorStop",
    "data-test-subj": "euiColorStopPopover"
  }, (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("p", {
    "aria-live": "polite"
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiColorStopThumb.screenReaderAnnouncement",
    default: "A popup with a color stop edit form opened. Tab forward to cycle through form controls or press escape to close this popup."
  }))), (0, _react2.jsx)(_flex.EuiFlexGroup, {
    gutterSize: "s",
    responsive: false
  }, (0, _react2.jsx)(_flex.EuiFlexItem, null, (0, _react2.jsx)(_i18n.EuiI18n, {
    tokens: ['euiColorStopThumb.stopLabel', 'euiColorStopThumb.stopErrorMessage'],
    defaults: ['Stop value', 'Value is out of range']
  }, function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        stopLabel = _ref5[0],
        stopErrorMessage = _ref5[1];

    return (0, _react2.jsx)(_form.EuiFormRow, {
      label: stopLabel,
      display: "rowCompressed",
      isInvalid: stopIsInvalid,
      error: stopIsInvalid ? stopErrorMessage : null
    }, (0, _react2.jsx)(_form.EuiFieldNumber, _extends({}, valueInputProps, {
      inputRef: setNumberInputRef,
      compressed: true,
      readOnly: readOnly,
      min: isRangeMin || min == null ? undefined : localMin,
      max: isRangeMax || max == null ? undefined : localMax,
      value: (0, _utils.isStopInvalid)(stop) ? '' : stop,
      isInvalid: stopIsInvalid,
      onChange: handleStopInputChange
    })));
  })), !readOnly && (0, _react2.jsx)(_flex.EuiFlexItem, {
    grow: false
  }, (0, _react2.jsx)(_form.EuiFormRow, {
    display: "rowCompressed",
    hasEmptyLabelSpace: true
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiColorStopThumb.removeLabel",
    default: "Remove this stop"
  }, function (removeLabel) {
    return (0, _react2.jsx)(_button.EuiButtonIcon, {
      iconType: "trash",
      color: "danger",
      "aria-label": removeLabel,
      title: removeLabel,
      disabled: !onRemove,
      onClick: handleOnRemove
    });
  })))), !readOnly && (0, _react2.jsx)(_spacer.EuiSpacer, {
    size: "s"
  }), (0, _react2.jsx)(_color_picker.EuiColorPicker, {
    readOnly: readOnly,
    onChange: handleColorChange,
    color: color,
    mode: readOnly ? 'secondaryInput' : colorPickerMode,
    swatches: colorPickerSwatches,
    display: "inline",
    showAlpha: colorPickerShowAlpha,
    isInvalid: colorIsInvalid,
    secondaryInputDisplay: colorPickerMode === 'swatch' ? 'none' : 'bottom'
  })));
};

exports.EuiColorStopThumb = EuiColorStopThumb;
EuiColorStopThumb.propTypes = {
  className: _propTypes.default.string,
  onChange: _propTypes.default.func.isRequired,
  onFocus: _propTypes.default.func,
  onRemove: _propTypes.default.func,
  globalMin: _propTypes.default.number.isRequired,
  globalMax: _propTypes.default.number.isRequired,
  localMin: _propTypes.default.number.isRequired,
  localMax: _propTypes.default.number.isRequired,
  min: _propTypes.default.number,
  max: _propTypes.default.number,
  isRangeMin: _propTypes.default.bool,
  isRangeMax: _propTypes.default.bool,
  parentRef: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.oneOf([null])]),
  colorPickerMode: _propTypes.default.oneOf(["default", "swatch", "picker", "secondaryInput"]).isRequired,
  colorPickerShowAlpha: _propTypes.default.bool,
  colorPickerSwatches: _propTypes.default.arrayOf(_propTypes.default.string.isRequired),
  disabled: _propTypes.default.bool,
  readOnly: _propTypes.default.bool,
  isPopoverOpen: _propTypes.default.bool.isRequired,
  openPopover: _propTypes.default.func.isRequired,
  closePopover: _propTypes.default.func.isRequired,
  "data-index": _propTypes.default.string,
  "aria-valuetext": _propTypes.default.string,
  valueInputProps: _propTypes.default.any,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  stop: _propTypes.default.number.isRequired,
  color: _propTypes.default.string.isRequired
};