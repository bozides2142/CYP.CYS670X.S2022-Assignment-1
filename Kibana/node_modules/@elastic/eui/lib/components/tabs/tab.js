"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTab = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _href_validator = require("../../services/security/href_validator");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiTab = function EuiTab(_ref) {
  var isSelected = _ref.isSelected,
      children = _ref.children,
      className = _ref.className,
      _disabled = _ref.disabled,
      href = _ref.href,
      target = _ref.target,
      rel = _ref.rel,
      prepend = _ref.prepend,
      append = _ref.append,
      rest = _objectWithoutProperties(_ref, ["isSelected", "children", "className", "disabled", "href", "target", "rel", "prepend", "append"]);

  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var disabled = _disabled || !isHrefValid;
  var classes = (0, _classnames.default)('euiTab', className, {
    'euiTab-isSelected': isSelected,
    'euiTab-isDisabled': disabled
  });
  var prependNode = prepend && (0, _react2.jsx)("span", {
    className: "euiTab__prepend"
  }, prepend);
  var appendNode = append && (0, _react2.jsx)("span", {
    className: "euiTab__append"
  }, append); //  <a> elements don't respect the `disabled` attribute. So if we're disabled, we'll just pretend
  //  this is a button and piggyback off its disabled styles.

  if (href && !disabled) {
    var secureRel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
    return (0, _react2.jsx)("a", _extends({
      role: "tab",
      "aria-selected": !!isSelected,
      className: classes,
      href: href,
      target: target,
      rel: secureRel
    }, rest), prependNode, (0, _react2.jsx)("span", {
      className: "euiTab__content"
    }, children), appendNode);
  }

  return (0, _react2.jsx)("button", _extends({
    role: "tab",
    "aria-selected": !!isSelected,
    type: "button",
    className: classes,
    disabled: disabled
  }, rest), prependNode, (0, _react2.jsx)("span", {
    className: "euiTab__content"
  }, children), appendNode);
};

exports.EuiTab = EuiTab;
EuiTab.propTypes = {
  isSelected: _propTypes.default.bool,
  disabled: _propTypes.default.bool,

  /**
     * Places content before the tab content/children.
     * Will be excluded from interactive effects.
     */

  /**
     * Places content before the tab content/children.
     * Will be excluded from interactive effects.
     */
  prepend: _propTypes.default.node,

  /**
     * Places content after the tab content/children.
     * Will be excluded from interactive effects.
     */

  /**
     * Places content after the tab content/children.
     * Will be excluded from interactive effects.
     */
  append: _propTypes.default.node,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,
  href: _propTypes.default.string,
  onClick: _propTypes.default.func
};