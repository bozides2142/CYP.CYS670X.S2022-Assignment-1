"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPageTemplate = exports.TEMPLATES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _page = require("./page");

var _page_side_bar = require("./page_side_bar");

var _page_body = require("./page_body");

var _page_header = require("./page_header");

var _page_content = require("./page_content");

var _bottom_bar = require("../bottom_bar");

var _services = require("../../services");

var _flex = require("../flex");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var TEMPLATES = ['default', 'centeredBody', 'centeredContent', 'empty'];
exports.TEMPLATES = TEMPLATES;

var EuiPageTemplate = function EuiPageTemplate(_ref) {
  var _pageBodyProps2;

  var _ref$template = _ref.template,
      template = _ref$template === void 0 ? 'default' : _ref$template,
      _ref$restrictWidth = _ref.restrictWidth,
      restrictWidth = _ref$restrictWidth === void 0 ? true : _ref$restrictWidth,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? true : _ref$grow,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'l' : _ref$paddingSize,
      fullHeight = _ref.fullHeight,
      children = _ref.children,
      className = _ref.className,
      pageSideBar = _ref.pageSideBar,
      pageSideBarProps = _ref.pageSideBarProps,
      pageHeader = _ref.pageHeader,
      pageBodyProps = _ref.pageBodyProps,
      pageContentProps = _ref.pageContentProps,
      pageContentBodyProps = _ref.pageContentBodyProps,
      bottomBar = _ref.bottomBar,
      bottomBarProps = _ref.bottomBarProps,
      _ref$minHeight = _ref.minHeight,
      minHeight = _ref$minHeight === void 0 ? 460 : _ref$minHeight,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["template", "restrictWidth", "grow", "paddingSize", "fullHeight", "children", "className", "pageSideBar", "pageSideBarProps", "pageHeader", "pageBodyProps", "pageContentProps", "pageContentBodyProps", "bottomBar", "bottomBarProps", "minHeight"]);

  /**
   * Full height ~madness~ logic
   */
  var canFullHeight = (0, _services.useIsWithinBreakpoints)(['m', 'l', 'xl']) && (template === 'default' || template === 'empty');
  var fullHeightClass = {
    'eui-fullHeight': fullHeight && canFullHeight
  };
  var yScrollClass = {
    'eui-yScroll': fullHeight && canFullHeight
  };

  if (canFullHeight && fullHeight) {
    var _pageBodyProps, _pageContentProps, _pageContentBodyProps;

    // By using flex group it will also fix the negative margin issues for nested flex groups
    children = (0, _react2.jsx)(_flex.EuiFlexGroup, {
      className: "eui-fullHeight",
      gutterSize: "none",
      direction: "column",
      responsive: false
    }, (0, _react2.jsx)(_flex.EuiFlexItem, {
      className: (0, _classnames.default)({
        'eui-yScroll': fullHeight === true,
        'eui-fullHeight': fullHeight === 'noscroll'
      }),
      grow: true
    }, children));
    pageBodyProps = _objectSpread(_objectSpread({}, pageBodyProps), {}, {
      className: (0, _classnames.default)(fullHeightClass, (_pageBodyProps = pageBodyProps) === null || _pageBodyProps === void 0 ? void 0 : _pageBodyProps.className)
    });
    pageContentProps = _objectSpread(_objectSpread({}, pageContentProps), {}, {
      className: (0, _classnames.default)(yScrollClass, (_pageContentProps = pageContentProps) === null || _pageContentProps === void 0 ? void 0 : _pageContentProps.className)
    });
    pageContentBodyProps = _objectSpread(_objectSpread({}, pageContentBodyProps), {}, {
      className: (0, _classnames.default)(fullHeightClass, (_pageContentBodyProps = pageContentBodyProps) === null || _pageContentBodyProps === void 0 ? void 0 : _pageContentBodyProps.className)
    });
  }

  var classes = (0, _classnames.default)('euiPageTemplate', fullHeightClass, className);

  var pageStyle = _objectSpread({
    minHeight: minHeight
  }, rest.style);
  /**
   * This seems very repetitious but it's the most readable, scalable, and maintainable
   */


  switch (template) {
    /**
     * CENTERED BODY
     * The panelled content is centered
     */
    case 'centeredBody':
      return pageSideBar ? (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: "none",
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_side_bar.EuiPageSideBar, (0, _extends2.default)({
        sticky: true,
        paddingSize: paddingSize
      }, pageSideBarProps), pageSideBar), (0, _react2.jsx)(_page_body.EuiPageBody, (0, _extends2.default)({
        paddingSize: paddingSize
      }, pageBodyProps), pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        verticalPosition: "center",
        horizontalPosition: "center",
        paddingSize: paddingSize
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageContentBodyProps), children)))) : (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: paddingSize,
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_body.EuiPageBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageBodyProps), pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        paddingSize: "none",
        restrictWidth: false,
        bottomBorder: true
      }, pageHeader)), (0, _react2.jsx)(_page_body.EuiPageBody, null, (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        verticalPosition: "center",
        horizontalPosition: "center",
        paddingSize: paddingSize
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        paddingSize: "none",
        restrictWidth: restrictWidth
      }, pageContentBodyProps), children)))));

    /**
     * CENTERED CONTENT
     * The content inside the panel is centered
     */

    case 'centeredContent':
      return pageSideBar ? (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: "none",
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_side_bar.EuiPageSideBar, (0, _extends2.default)({
        sticky: true,
        paddingSize: paddingSize
      }, pageSideBarProps), pageSideBar), (0, _react2.jsx)(_page_body.EuiPageBody, (0, _extends2.default)({
        panelled: true,
        paddingSize: paddingSize
      }, pageBodyProps), pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        verticalPosition: "center",
        horizontalPosition: "center",
        hasShadow: false,
        color: "subdued",
        paddingSize: paddingSize
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageContentBodyProps), children)))) : (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: "none",
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_body.EuiPageBody, pageBodyProps, pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        paddingSize: paddingSize,
        restrictWidth: restrictWidth
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, {
        role: null,
        borderRadius: "none",
        hasShadow: false,
        paddingSize: paddingSize,
        style: {
          display: 'flex'
        }
      }, (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        verticalPosition: "center",
        horizontalPosition: "center",
        hasShadow: false,
        color: "subdued",
        paddingSize: paddingSize
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageContentBodyProps), children)))));

    /**
     * EMPTY
     * No panelling at all
     */

    case 'empty':
      return pageSideBar ? (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: "none",
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_side_bar.EuiPageSideBar, (0, _extends2.default)({
        sticky: true,
        paddingSize: paddingSize
      }, pageSideBarProps), pageSideBar), (0, _react2.jsx)(_page_body.EuiPageBody, (0, _extends2.default)({
        paddingSize: paddingSize
      }, pageBodyProps), pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        hasBorder: false,
        hasShadow: false,
        paddingSize: 'none',
        color: 'transparent',
        borderRadius: 'none'
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageContentBodyProps), children)))) : (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: paddingSize,
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_body.EuiPageBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageBodyProps), pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        paddingSize: "none",
        restrictWidth: false,
        bottomBorder: true
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        hasBorder: false,
        hasShadow: false,
        paddingSize: 'none',
        color: 'transparent',
        borderRadius: 'none'
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        paddingSize: "none"
      }, pageContentBodyProps), children))));

    /**
     * DEFAULT
     * Typical layout with nothing "centered"
     */

    default:
      // Only the default template can display a bottom bar
      var bottomBarNode = bottomBar ? (0, _react2.jsx)(_bottom_bar.EuiBottomBar, (0, _extends2.default)({
        paddingSize: paddingSize,
        position: canFullHeight && fullHeight ? 'static' : 'sticky' // Using uknown here because of the possible conflict with overriding props and position `sticky`

      }, bottomBarProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, {
        paddingSize: 'none',
        restrictWidth: restrictWidth
      }, bottomBar)) : undefined;
      return pageSideBar ? (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: "none",
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_side_bar.EuiPageSideBar, (0, _extends2.default)({
        sticky: true,
        paddingSize: paddingSize
      }, pageSideBarProps), pageSideBar), (0, _react2.jsx)(_page_body.EuiPageBody, (0, _extends2.default)({
        panelled: true,
        paddingSize: "none"
      }, pageBodyProps), (0, _react2.jsx)(_page_body.EuiPageBody, {
        component: "div",
        paddingSize: paddingSize,
        className: (_pageBodyProps2 = pageBodyProps) === null || _pageBodyProps2 === void 0 ? void 0 : _pageBodyProps2.className
      }, pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        bottomBorder: true,
        restrictWidth: restrictWidth
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        hasShadow: false,
        hasBorder: false,
        color: 'transparent',
        borderRadius: 'none',
        paddingSize: "none"
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        restrictWidth: restrictWidth
      }, pageContentBodyProps), children))), bottomBarNode)) : (0, _react2.jsx)(_page.EuiPage, (0, _extends2.default)({
        className: classes,
        paddingSize: "none",
        grow: grow
      }, rest, {
        style: pageStyle
      }), (0, _react2.jsx)(_page_body.EuiPageBody, pageBodyProps, pageHeader && (0, _react2.jsx)(_page_header.EuiPageHeader, (0, _extends2.default)({
        restrictWidth: restrictWidth,
        paddingSize: paddingSize
      }, pageHeader)), (0, _react2.jsx)(_page_content.EuiPageContent, (0, _extends2.default)({
        hasBorder: pageHeader === undefined ? false : undefined,
        hasShadow: false,
        paddingSize: 'none',
        color: 'plain',
        borderRadius: 'none'
      }, pageContentProps), (0, _react2.jsx)(_page_content.EuiPageContentBody, (0, _extends2.default)({
        restrictWidth: restrictWidth,
        paddingSize: paddingSize
      }, pageContentBodyProps), children)), bottomBarNode));
  }
};

exports.EuiPageTemplate = EuiPageTemplate;