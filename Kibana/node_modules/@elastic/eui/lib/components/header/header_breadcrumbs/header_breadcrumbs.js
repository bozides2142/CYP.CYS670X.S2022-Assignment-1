"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiHeaderBreadcrumbs = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _breadcrumbs = require("../../breadcrumbs");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var EuiHeaderBreadcrumbs = function EuiHeaderBreadcrumbs(_ref) {
  var className = _ref.className,
      breadcrumbs = _ref.breadcrumbs,
      rest = _objectWithoutProperties(_ref, ["className", "breadcrumbs"]);

  var classes = (0, _classnames.default)('euiHeaderBreadcrumbs', className);
  return (0, _react2.jsx)(_breadcrumbs.EuiBreadcrumbs, _extends({
    max: 4,
    truncate: true,
    breadcrumbs: breadcrumbs,
    className: classes
  }, rest));
};

exports.EuiHeaderBreadcrumbs = EuiHeaderBreadcrumbs;
EuiHeaderBreadcrumbs.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string,

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
  }).isRequired).isRequired
};