"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiBreadcrumbs = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../i18n");

var _inner_text = require("../inner_text");

var _link = require("../link");

var _popover = require("../popover");

var _icon = require("../icon");

var _services = require("../../services");

var _breakpoint = require("../../services/breakpoint");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var CONTENT_CLASSNAME = 'euiBreadcrumb__content';
var responsiveDefault = {
  xs: 1,
  s: 2,
  m: 4
};

var limitBreadcrumbs = function limitBreadcrumbs(breadcrumbs, max, allBreadcrumbs) {
  var breadcrumbsAtStart = [];
  var breadcrumbsAtEnd = [];
  var limit = Math.min(max, breadcrumbs.length);
  var start = Math.floor(limit / 2);
  var overflowBreadcrumbs = allBreadcrumbs.slice(start, start + breadcrumbs.length - limit);

  if (overflowBreadcrumbs.length) {
    overflowBreadcrumbs[overflowBreadcrumbs.length - 1]['aria-current'] = 'false';
  }

  for (var i = 0; i < limit; i++) {
    // We'll alternate with displaying breadcrumbs at the end and at the start, but be biased
    // towards breadcrumbs the end so that if max is an odd number, we'll have one more
    // breadcrumb visible at the end than at the beginning.
    var isEven = i % 2 === 0; // We're picking breadcrumbs from the front AND the back, so we treat each iteration as a
    // half-iteration.

    var normalizedIndex = Math.floor(i * 0.5);
    var indexOfBreadcrumb = isEven ? breadcrumbs.length - 1 - normalizedIndex : normalizedIndex;
    var breadcrumb = breadcrumbs[indexOfBreadcrumb];

    if (isEven) {
      breadcrumbsAtEnd.unshift(breadcrumb);
    } else {
      breadcrumbsAtStart.push(breadcrumb);
    }
  }

  var EuiBreadcrumbCollapsed = function EuiBreadcrumbCollapsed() {
    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isPopoverOpen = _useState2[0],
        setIsPopoverOpen = _useState2[1];

    var ariaLabel = (0, _i18n.useEuiI18n)('euiBreadcrumbs.collapsedBadge.ariaLabel', 'See collapsed breadcrumbs');
    var ellipsisButton = (0, _react2.jsx)(_link.EuiLink, {
      className: CONTENT_CLASSNAME,
      color: "subdued",
      "aria-label": ariaLabel,
      title: ariaLabel,
      onClick: function onClick() {
        return setIsPopoverOpen(!isPopoverOpen);
      }
    }, "\u2026 ", (0, _react2.jsx)(_icon.EuiIcon, {
      type: "arrowDown",
      size: "s"
    }));
    return (0, _react2.jsx)("li", {
      className: "euiBreadcrumb euiBreadcrumb--collapsed"
    }, (0, _react2.jsx)(_popover.EuiPopover, {
      button: ellipsisButton,
      isOpen: isPopoverOpen,
      closePopover: function closePopover() {
        return setIsPopoverOpen(false);
      }
    }, (0, _react2.jsx)(EuiBreadcrumbs, {
      className: "euiBreadcrumbs__inPopover",
      breadcrumbs: overflowBreadcrumbs,
      responsive: false,
      truncate: false,
      max: 0
    })));
  };

  if (max < breadcrumbs.length) {
    breadcrumbsAtStart.push((0, _react2.jsx)(EuiBreadcrumbCollapsed, {
      key: "collapsed"
    }));
  }

  return [].concat(breadcrumbsAtStart, breadcrumbsAtEnd);
};

var EuiBreadcrumbs = function EuiBreadcrumbs(_ref) {
  var breadcrumbs = _ref.breadcrumbs,
      className = _ref.className,
      _ref$responsive = _ref.responsive,
      responsive = _ref$responsive === void 0 ? responsiveDefault : _ref$responsive,
      _ref$truncate = _ref.truncate,
      truncate = _ref$truncate === void 0 ? true : _ref$truncate,
      _ref$max = _ref.max,
      max = _ref$max === void 0 ? 5 : _ref$max,
      rest = _objectWithoutProperties(_ref, ["breadcrumbs", "className", "responsive", "truncate", "max"]);

  var ariaLabel = (0, _i18n.useEuiI18n)('euiBreadcrumbs.nav.ariaLabel', 'Breadcrumbs');

  var _useState3 = (0, _react.useState)((0, _breakpoint.getBreakpoint)(typeof window === 'undefined' ? -Infinity : window.innerWidth)),
      _useState4 = _slicedToArray(_useState3, 2),
      currentBreakpoint = _useState4[0],
      setCurrentBreakpoint = _useState4[1];

  var functionToCallOnWindowResize = (0, _services.throttle)(function () {
    var newBreakpoint = (0, _breakpoint.getBreakpoint)(window.innerWidth);

    if (newBreakpoint !== currentBreakpoint) {
      setCurrentBreakpoint(newBreakpoint);
    } // reacts every 50ms to resize changes and always gets the final update

  }, 50); // Add window resize handlers

  (0, _react.useEffect)(function () {
    window.addEventListener('resize', functionToCallOnWindowResize);
    return function () {
      window.removeEventListener('resize', functionToCallOnWindowResize);
    };
  }, [responsive, functionToCallOnWindowResize]);
  var breadcrumbElements = breadcrumbs.map(function (breadcrumb, index) {
    var text = breadcrumb.text,
        href = breadcrumb.href,
        onClick = breadcrumb.onClick,
        truncate = breadcrumb.truncate,
        breadcrumbClassName = breadcrumb.className,
        breadcrumbRest = _objectWithoutProperties(breadcrumb, ["text", "href", "onClick", "truncate", "className"]);

    var isLastBreadcrumb = index === breadcrumbs.length - 1;
    var className = (0, _classnames.default)('euiBreadcrumb', {
      'euiBreadcrumb--last': isLastBreadcrumb,
      'euiBreadcrumb--truncate': truncate
    });
    var linkProps = {
      className: (0, _classnames.default)(CONTENT_CLASSNAME, breadcrumbClassName),
      'aria-current': isLastBreadcrumb ? 'page' : undefined
    };
    var link = (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
      var title = innerText === '' ? undefined : innerText;

      if (!href && !onClick) {
        return (0, _react2.jsx)("span", _extends({
          ref: ref,
          title: title
        }, linkProps, breadcrumbRest), text);
      }

      return (0, _react2.jsx)(_link.EuiLink, _extends({
        ref: ref,
        color: isLastBreadcrumb ? 'text' : 'subdued',
        onClick: onClick,
        href: href,
        title: title
      }, linkProps, breadcrumbRest), text);
    });
    return (0, _react2.jsx)("li", {
      className: className,
      key: index
    }, link);
  }); // Use the default object if they simply passed `true` for responsive

  var responsiveObject = _typeof(responsive) === 'object' ? responsive : responsiveDefault; // The max property collapses any breadcrumbs past the max quantity.
  // This is the same behavior we want for responsiveness.
  // So calculate the max value based on the combination of `max` and `responsive`

  var calculatedMax = max; // Set the calculated max to the number associated with the currentBreakpoint key if it exists

  if (responsive && responsiveObject[currentBreakpoint]) {
    calculatedMax = responsiveObject[currentBreakpoint];
  } // Final check is to make sure max is used over a larger breakpoint value


  if (max && calculatedMax) {
    calculatedMax = max < calculatedMax ? max : calculatedMax;
  }

  var limitedBreadcrumbs = calculatedMax ? limitBreadcrumbs(breadcrumbElements, calculatedMax, breadcrumbs) : breadcrumbElements;
  var classes = (0, _classnames.default)('euiBreadcrumbs', className, {
    'euiBreadcrumbs--truncate': truncate
  });
  return (0, _react2.jsx)("nav", _extends({
    "aria-label": ariaLabel,
    className: classes
  }, rest), (0, _react2.jsx)("ol", {
    className: "euiBreadcrumbs__list"
  }, limitedBreadcrumbs));
};

exports.EuiBreadcrumbs = EuiBreadcrumbs;
EuiBreadcrumbs.propTypes = {
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