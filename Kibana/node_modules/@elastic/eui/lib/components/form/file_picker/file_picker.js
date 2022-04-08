"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFilePicker = exports.DISPLAYS = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _validatable_control = require("../validatable_control");

var _button = require("../../button");

var _progress = require("../../progress");

var _icon = require("../../icon");

var _i18n = require("../../i18n");

var _loading = require("../../loading");

var _accessibility = require("../../../services/accessibility");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var displayToClassNameMap = {
  default: null,
  large: 'euiFilePicker--large'
};
var DISPLAYS = (0, _common.keysOf)(displayToClassNameMap);
exports.DISPLAYS = DISPLAYS;

var EuiFilePicker = /*#__PURE__*/function (_Component) {
  _inherits(EuiFilePicker, _Component);

  var _super = _createSuper(EuiFilePicker);

  function EuiFilePicker() {
    var _this;

    _classCallCheck(this, EuiFilePicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      promptText: null,
      isHoveringDrop: false
    });

    _defineProperty(_assertThisInitialized(_this), "fileInput", null);

    _defineProperty(_assertThisInitialized(_this), "generatedId", (0, _accessibility.htmlIdGenerator)()());

    _defineProperty(_assertThisInitialized(_this), "handleChange", function () {
      if (!_this.fileInput) return;

      if (_this.fileInput.files && _this.fileInput.files.length > 1) {
        _this.setState({
          promptText: (0, _react2.jsx)(_i18n.EuiI18n, {
            token: "euiFilePicker.filesSelected",
            default: "{fileCount} files selected",
            values: {
              fileCount: _this.fileInput.files.length
            }
          })
        });
      } else if (_this.fileInput.files && _this.fileInput.files.length === 0) {
        _this.setState({
          promptText: null
        });
      } else {
        _this.setState({
          promptText: _this.fileInput.value.split('\\').pop()
        });
      }

      var onChange = _this.props.onChange;

      if (onChange) {
        onChange(_this.fileInput.files);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "removeFiles", function (e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      if (!_this.fileInput) return;
      _this.fileInput.value = '';

      _this.handleChange();
    });

    _defineProperty(_assertThisInitialized(_this), "showDrop", function () {
      if (!_this.props.disabled) {
        _this.setState({
          isHoveringDrop: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "hideDrop", function () {
      _this.setState({
        isHoveringDrop: false
      });
    });

    return _this;
  }

  _createClass(EuiFilePicker, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiFilePicker.clearSelectedFiles",
        default: "Clear selected files"
      }, function (clearSelectedFiles) {
        var _this2$props = _this2.props,
            id = _this2$props.id,
            name = _this2$props.name,
            initialPromptText = _this2$props.initialPromptText,
            className = _this2$props.className,
            disabled = _this2$props.disabled,
            compressed = _this2$props.compressed,
            onChange = _this2$props.onChange,
            isInvalid = _this2$props.isInvalid,
            fullWidth = _this2$props.fullWidth,
            isLoading = _this2$props.isLoading,
            display = _this2$props.display,
            rest = _objectWithoutProperties(_this2$props, ["id", "name", "initialPromptText", "className", "disabled", "compressed", "onChange", "isInvalid", "fullWidth", "isLoading", "display"]);

        var promptId = "".concat(id || _this2.generatedId, "-filePicker__prompt");
        var isOverridingInitialPrompt = _this2.state.promptText != null;
        var normalFormControl = display === 'default';
        var classes = (0, _classnames.default)('euiFilePicker', displayToClassNameMap[display], {
          euiFilePicker__showDrop: _this2.state.isHoveringDrop,
          'euiFilePicker--compressed': compressed,
          'euiFilePicker--fullWidth': fullWidth,
          'euiFilePicker-isInvalid': isInvalid,
          'euiFilePicker-isLoading': isLoading,
          'euiFilePicker-hasFiles': isOverridingInitialPrompt
        }, className);
        var clearButton;

        if (isLoading && normalFormControl) {
          // Override clear button with loading spinner if it is in loading state
          clearButton = (0, _react2.jsx)(_loading.EuiLoadingSpinner, {
            className: "euiFilePicker__loadingSpinner"
          });
        } else if (isOverridingInitialPrompt) {
          if (normalFormControl) {
            clearButton = (0, _react2.jsx)("button", {
              type: "button",
              "aria-label": clearSelectedFiles,
              className: "euiFilePicker__clearButton",
              onClick: _this2.removeFiles
            }, (0, _react2.jsx)(_icon.EuiIcon, {
              className: "euiFilePicker__clearIcon",
              type: "cross"
            }));
          } else {
            clearButton = (0, _react2.jsx)(_button.EuiButtonEmpty, {
              "aria-label": clearSelectedFiles,
              className: "euiFilePicker__clearButton",
              size: "xs",
              onClick: _this2.removeFiles
            }, (0, _react2.jsx)(_i18n.EuiI18n, {
              token: "euiFilePicker.removeSelected",
              default: "Remove"
            }));
          }
        } else {
          clearButton = null;
        }

        var loader = !normalFormControl && isLoading && (0, _react2.jsx)(_progress.EuiProgress, {
          size: "xs",
          color: "accent",
          position: "absolute"
        });
        return (0, _react2.jsx)("div", {
          className: classes
        }, (0, _react2.jsx)("div", {
          className: "euiFilePicker__wrap"
        }, (0, _react2.jsx)(_validatable_control.EuiValidatableControl, {
          isInvalid: isInvalid
        }, (0, _react2.jsx)("input", _extends({
          type: "file",
          id: id,
          name: name,
          className: "euiFilePicker__input",
          onChange: _this2.handleChange,
          ref: function ref(input) {
            _this2.fileInput = input;
          },
          onDragOver: _this2.showDrop,
          onDragLeave: _this2.hideDrop,
          onDrop: _this2.hideDrop,
          disabled: disabled,
          "aria-describedby": promptId
        }, rest))), (0, _react2.jsx)("div", {
          className: "euiFilePicker__prompt",
          id: promptId
        }, (0, _react2.jsx)(_icon.EuiIcon, {
          className: "euiFilePicker__icon",
          type: "importAction",
          size: normalFormControl ? 'm' : 'l',
          "aria-hidden": "true"
        }), (0, _react2.jsx)("div", {
          className: "euiFilePicker__promptText"
        }, _this2.state.promptText || initialPromptText), clearButton, loader)));
      });
    }
  }]);

  return EuiFilePicker;
}(_react.Component);

exports.EuiFilePicker = EuiFilePicker;

_defineProperty(EuiFilePicker, "defaultProps", {
  initialPromptText: (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiFilePicker.promptText",
    default: "Select or drag and drop a file"
  }),
  compressed: false,
  display: 'large'
});

EuiFilePicker.propTypes = {
  id: _propTypes.default.string,
  name: _propTypes.default.string,
  className: _propTypes.default.string,

  /**
     * The content that appears in the dropzone if no file is attached
     */
  initialPromptText: _propTypes.default.node,

  /**
     * Use as a callback to access the HTML FileList API
     */
  onChange: _propTypes.default.func,

  /**
     * Reduces the size to a typical (compressed) input
     */
  compressed: _propTypes.default.bool,

  /**
     * Size or type of display;
     * `default` for normal height, similar to other controls;
     * `large` for taller size
     */
  display: _propTypes.default.oneOf(["default", "large"]),
  fullWidth: _propTypes.default.bool,
  isInvalid: _propTypes.default.bool,
  isLoading: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};