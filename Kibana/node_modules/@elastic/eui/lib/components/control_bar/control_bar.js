"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiControlBar = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _accessibility = require("../accessibility");

var _breadcrumbs = require("../breadcrumbs");

var _button = require("../button");

var _i18n = require("../i18n");

var _icon = require("../icon");

var _portal = require("../portal");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var EuiControlBar = /*#__PURE__*/function (_Component) {
  _inherits(EuiControlBar, _Component);

  var _super = _createSuper(EuiControlBar);

  function EuiControlBar() {
    var _this;

    _classCallCheck(this, EuiControlBar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "bar", null);

    _defineProperty(_assertThisInitialized(_this), "state", {
      selectedTab: ''
    });

    return _this;
  }

  _createClass(EuiControlBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.position === 'fixed') {
        var height = this.bar ? this.bar.clientHeight : -1;
        document.body.style.paddingBottom = "".concat(height, "px");

        if (this.props.bodyClassName) {
          document.body.classList.add(this.props.bodyClassName);
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.body.style.paddingBottom = '';

      if (this.props.bodyClassName) {
        document.body.classList.remove(this.props.bodyClassName);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          showContent = _this$props.showContent,
          controls = _this$props.controls,
          size = _this$props.size,
          leftOffset = _this$props.leftOffset,
          rightOffset = _this$props.rightOffset,
          maxHeight = _this$props.maxHeight,
          showOnMobile = _this$props.showOnMobile,
          style = _this$props.style,
          position = _this$props.position,
          bodyClassName = _this$props.bodyClassName,
          landmarkHeading = _this$props.landmarkHeading,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "showContent", "controls", "size", "leftOffset", "rightOffset", "maxHeight", "showOnMobile", "style", "position", "bodyClassName", "landmarkHeading"]);

      var styles = _objectSpread(_objectSpread({}, style), {}, {
        left: leftOffset,
        right: rightOffset,
        maxHeight: maxHeight
      });

      var classes = (0, _classnames.default)('euiControlBar', className, {
        'euiControlBar-isOpen': showContent,
        'euiControlBar--large': size === 'l',
        'euiControlBar--medium': size === 'm',
        'euiControlBar--small': size === 's',
        'euiControlBar--fixed': position === 'fixed',
        'euiControlBar--absolute': position === 'absolute',
        'euiControlBar--relative': position === 'relative',
        'euiControlBar--showOnMobile': showOnMobile
      });

      var handleTabClick = function handleTabClick(control, e) {
        _this2.setState({
          selectedTab: control.id
        }, function () {
          control.onClick(e);
        });
      };

      var controlItem = function controlItem(control, index) {
        switch (control.controlType) {
          case 'button':
            {
              var controlType = control.controlType,
                  id = control.id,
                  _control$color = control.color,
                  color = _control$color === void 0 ? 'ghost' : _control$color,
                  label = control.label,
                  _className = control.className,
                  _rest = _objectWithoutProperties(control, ["controlType", "id", "color", "label", "className"]);

              return (0, _react2.jsx)(_button.EuiButton, _extends({
                key: id + index,
                className: (0, _classnames.default)('euiControlBar__button', _className),
                color: color
              }, _rest, {
                size: "s"
              }), label);
            }

          case 'icon':
            {
              var _controlType = control.controlType,
                  _id = control.id,
                  iconType = control.iconType,
                  _className2 = control.className,
                  _control$color2 = control.color,
                  _color = _control$color2 === void 0 ? 'ghost' : _control$color2,
                  onClick = control.onClick,
                  href = control.href,
                  _rest2 = _objectWithoutProperties(control, ["controlType", "id", "iconType", "className", "color", "onClick", "href"]);

              return onClick || href ? (0, _react2.jsx)(_button.EuiButtonIcon, _extends({
                key: _id + index,
                className: (0, _classnames.default)('euiControlBar__buttonIcon', _className2),
                onClick: onClick,
                href: href,
                color: _color
              }, _rest2, {
                iconType: iconType
              })) : (0, _react2.jsx)(_icon.EuiIcon, _extends({
                key: _id + index,
                className: (0, _classnames.default)('euiControlBar__icon', _className2),
                type: iconType,
                color: _color
              }, _rest2));
            }

          case 'divider':
            return (0, _react2.jsx)("div", {
              key: control.controlType + index,
              className: "euiControlBar__divider"
            });

          case 'spacer':
            return (0, _react2.jsx)("div", {
              key: control.controlType + index,
              className: "euiControlBar__spacer"
            });

          case 'text':
            {
              var _controlType2 = control.controlType,
                  _id2 = control.id,
                  text = control.text,
                  _className3 = control.className,
                  _rest3 = _objectWithoutProperties(control, ["controlType", "id", "text", "className"]);

              return (0, _react2.jsx)("div", _extends({
                key: _id2,
                className: (0, _classnames.default)('euiControlBar__text', _className3)
              }, _rest3), text);
            }

          case 'tab':
            {
              var _controlType3 = control.controlType,
                  _id3 = control.id,
                  _label = control.label,
                  _onClick = control.onClick,
                  _className4 = control.className,
                  _rest4 = _objectWithoutProperties(control, ["controlType", "id", "label", "onClick", "className"]);

              var tabClasses = (0, _classnames.default)('euiControlBar__tab', {
                'euiControlBar__tab--active': showContent && _id3 === _this2.state.selectedTab
              }, _className4);
              return (0, _react2.jsx)("button", _extends({
                key: _id3 + index,
                className: tabClasses,
                onClick: function onClick(event) {
                  return handleTabClick(control, event);
                }
              }, _rest4), _label);
            }

          case 'breadcrumbs':
            {
              var _controlType4 = control.controlType,
                  _id4 = control.id,
                  _rest5 = _objectWithoutProperties(control, ["controlType", "id"]);

              return (0, _react2.jsx)(_breadcrumbs.EuiBreadcrumbs, _extends({
                className: "euiControlBar__breadcrumbs",
                key: control.id
              }, _rest5));
            }
        }
      };

      var controlBar = (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiControlBar.screenReaderHeading",
        default: "Page level controls"
      }, function (screenReaderHeading) {
        return (// Though it would be better to use aria-labelledby than aria-label and not repeat the same string twice
          // A bug in voiceover won't list some landmarks in the rotor without an aria-label
          (0, _react2.jsx)("section", _extends({
            className: classes,
            "aria-label": landmarkHeading ? landmarkHeading : screenReaderHeading
          }, rest, {
            style: styles
          }), (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("h2", null, landmarkHeading ? landmarkHeading : screenReaderHeading)), (0, _react2.jsx)("div", {
            className: "euiControlBar__controls",
            ref: function ref(node) {
              _this2.bar = node;
            }
          }, controls.map(function (control, index) {
            return controlItem(control, index);
          })), _this2.props.showContent ? (0, _react2.jsx)("div", {
            className: "euiControlBar__content"
          }, children) : null)
        );
      });
      return position === 'fixed' ? (0, _react2.jsx)(_portal.EuiPortal, null, controlBar, (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("p", {
        "aria-live": "assertive"
      }, landmarkHeading ? (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiControlBar.customScreenReaderAnnouncement",
        default: "There is a new region landmark called {landmarkHeading} with page level controls at the end of the document.",
        values: {
          landmarkHeading: landmarkHeading
        }
      }) : (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiControlBar.screenReaderAnnouncement",
        default: "There is a new region landmark with page level controls at the end of the document."
      })))) : controlBar;
    }
  }]);

  return EuiControlBar;
}(_react.Component);

exports.EuiControlBar = EuiControlBar;

_defineProperty(EuiControlBar, "defaultProps", {
  leftOffset: 0,
  rightOffset: 0,
  position: 'fixed',
  size: 'l',
  showContent: false,
  showOnMobile: false
});

EuiControlBar.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

  /**
       * Show or hide the content area containing the `children`
       */
  showContent: _propTypes.default.bool,

  /**
       * An array of controls, actions, and layout spacers to display.
       * Accepts `'button' | 'tab' | 'breadcrumbs' | 'text' | 'icon' | 'spacer' | 'divider'`
       */
  controls: _propTypes.default.arrayOf(_propTypes.default.shape({
    href: _propTypes.default.string,
    onClick: _propTypes.default.func,
    id: _propTypes.default.string,
    label: _propTypes.default.oneOfType([_propTypes.default.node.isRequired, _propTypes.default.node]),
    buttonRef: _propTypes.default.any,
    controlType: _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.oneOf(["button"]).isRequired, _propTypes.default.oneOfType([_propTypes.default.oneOf(["breadcrumbs"]).isRequired, _propTypes.default.oneOf(["tab"]).isRequired]).isRequired]).isRequired, _propTypes.default.oneOf(["text"]).isRequired]).isRequired, _propTypes.default.oneOf(["icon"]).isRequired]).isRequired, _propTypes.default.oneOf(["divider"]).isRequired]).isRequired, _propTypes.default.oneOf(["spacer"]).isRequired]).isRequired,
    className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.string]),
    "aria-label": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.string]),
    "data-test-subj": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.string]),

    /**
       * Hides extra (above the max) breadcrumbs under a collapsed item as the window gets smaller.
       * Pass a custom #EuiBreadcrumbResponsiveMaxCount object to change the number of breadcrumbs to show at the particular breakpoints.
       *
       * Pass `false` to turn this behavior off.
       *
       * Default: `{ xs: 1, s: 2, m: 4 }`
       */
    responsive: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.any.isRequired]),

    /**
       * Forces all breadcrumbs to single line and
       * truncates each breadcrumb to a particular width,
       * except for the last item
       */
    truncate: _propTypes.default.bool,

    /**
       * Collapses the inner items past the maximum set here
       * into a single ellipses item.
       * Omitting or passing a `0` value will show all breadcrumbs.
       */
    max: _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.oneOf([null])]),

    /**
       * The array of individual #EuiBreadcrumb items
       */
    breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
      className: _propTypes.default.string,
      "aria-label": _propTypes.default.string,
      "data-test-subj": _propTypes.default.string,

      /**
         * Visible label of the breadcrumb
         */
      text: _propTypes.default.node.isRequired,
      href: _propTypes.default.string,
      onClick: _propTypes.default.func,

      /**
         * Force a max-width on the breadcrumb text
         */
      truncate: _propTypes.default.bool,

      /**
         * Override the existing `aria-current` which defaults to `page` for the last breadcrumb
         */
      "aria-current": _propTypes.default.any
    }).isRequired),
    text: _propTypes.default.node,
    iconType: _propTypes.default.string
  }).isRequired).isRequired,

  /**
       * The default height of the content area.
       */
  size: _propTypes.default.oneOf(["s", "m", "l"]),

  /**
       * Customize the max height.
       * Best when used with `size=l` as this will ensure the actual height equals the max height set.
       */
  maxHeight: _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired]),

  /**
       * Set the offset from the left side of the screen.
       */
  leftOffset: _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired]),

  /**
       * Set the offset from the left side of the screen.
       */
  rightOffset: _propTypes.default.oneOfType([_propTypes.default.number.isRequired, _propTypes.default.string.isRequired]),

  /**
       * The control bar is hidden on mobile by default. Use the `showOnMobile` prop to force it's display on mobile screens.
       * You'll need to ensure that the content you place into the bar renders as expected on mobile.
       */
  showOnMobile: _propTypes.default.bool,

  /**
       * By default EuiControlBar will live in a portal, fixed position to the browser window.
       * Change the position of the bar to live inside a container and be positioned against its parent.
       */
  position: _propTypes.default.oneOf(["fixed", "relative", "absolute"]),

  /**
       * Optional class applied to the body used when `position = fixed`
       */
  bodyClassName: _propTypes.default.string,

  /**
       * Customize the screen reader heading that helps users find this control. Default is "Page level controls".
       */
  landmarkHeading: _propTypes.default.string
};