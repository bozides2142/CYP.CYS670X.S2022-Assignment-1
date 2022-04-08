"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSelectableTemplateSitewide = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../../services");

var _selectable = require("../selectable");

var _popover = require("../../popover");

var _popover2 = require("../../popover/popover");

var _i18n = require("../../i18n");

var _selectable_message = require("../selectable_message");

var _loading = require("../../loading");

var _selectable_template_sitewide_option = require("./selectable_template_sitewide_option");

var _breakpoint = require("../../../services/breakpoint");

var _spacer = require("../../spacer");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EuiSelectableTemplateSitewide = function EuiSelectableTemplateSitewide(_ref) {
  var children = _ref.children,
      className = _ref.className,
      options = _ref.options,
      popoverProps = _ref.popoverProps,
      popoverTitle = _ref.popoverTitle,
      popoverFooter = _ref.popoverFooter,
      searchProps = _ref.searchProps,
      listProps = _ref.listProps,
      isLoading = _ref.isLoading,
      popoverButton = _ref.popoverButton,
      popoverButtonBreakpoints = _ref.popoverButtonBreakpoints,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "options", "popoverProps", "popoverTitle", "popoverFooter", "searchProps", "listProps", "isLoading", "popoverButton", "popoverButtonBreakpoints"]);

  /**
   * Breakpoint management
   */
  var _useState = (0, _react.useState)(typeof window !== 'undefined' && popoverButtonBreakpoints ? (0, _breakpoint.isWithinBreakpoints)(window.innerWidth, popoverButtonBreakpoints) : true),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      canShowPopoverButton = _useState2[0],
      setCanShowPopoverButton = _useState2[1];

  var functionToCallOnWindowResize = (0, _services.throttle)(function () {
    var newWidthIsWithinBreakpoint = popoverButtonBreakpoints ? (0, _breakpoint.isWithinBreakpoints)(window.innerWidth, popoverButtonBreakpoints) : true;

    if (newWidthIsWithinBreakpoint !== canShowPopoverButton) {
      setCanShowPopoverButton(newWidthIsWithinBreakpoint);
    } // reacts every 50ms to resize changes and always gets the final update

  }, 50); // Add window resize handlers

  (0, _react.useEffect)(function () {
    window.addEventListener('resize', functionToCallOnWindowResize);
    return function () {
      window.removeEventListener('resize', functionToCallOnWindowResize);
    };
  }, [functionToCallOnWindowResize]);
  /**
   * i18n text
   */

  var _useEuiI18n = (0, _i18n.useEuiI18n)(['euiSelectableTemplateSitewide.searchPlaceholder'], ['Search for anything...']),
      _useEuiI18n2 = (0, _slicedToArray2.default)(_useEuiI18n, 1),
      searchPlaceholder = _useEuiI18n2[0];
  /**
   * Popover helpers
   */


  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      popoverRef = _useState4[0],
      setPopoverRef = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      popoverIsOpen = _useState6[0],
      setPopoverIsOpen = _useState6[1];

  var _popoverProps = _objectSpread({}, popoverProps),
      _closePopover = _popoverProps.closePopover,
      panelRef = _popoverProps.panelRef,
      width = _popoverProps.width,
      popoverRest = (0, _objectWithoutProperties2.default)(_popoverProps, ["closePopover", "panelRef", "width"]);

  var closePopover = function closePopover() {
    setPopoverIsOpen(false);
    _closePopover && _closePopover();
  };

  var togglePopover = function togglePopover() {
    setPopoverIsOpen(!popoverIsOpen);
  }; // Width applied to the internal div


  var popoverWidth = width || 600;
  var setPanelRef = (0, _services.useCombinedRefs)([setPopoverRef, panelRef]);
  /**
   * Search helpers
   */

  var searchOnFocus = function searchOnFocus(e) {
    searchProps && searchProps.onFocus && searchProps.onFocus(e);
    if (canShowPopoverButton) return;
    setPopoverIsOpen(true);
  };

  var onSearchInput = function onSearchInput(e) {
    searchProps && searchProps.onInput && searchProps.onInput(e);
    setPopoverIsOpen(true);
  };

  var searchOnBlur = function searchOnBlur(e) {
    searchProps && searchProps.onBlur && searchProps.onBlur(e);
    if (canShowPopoverButton) return;

    if (!(popoverRef === null || popoverRef === void 0 ? void 0 : popoverRef.contains(e.relatedTarget))) {
      setPopoverIsOpen(false);
    }
  };
  /**
   * Classes
   */


  var classes = (0, _classnames.default)('euiSelectableTemplateSitewide', className);
  var searchClasses = (0, _classnames.default)('euiSelectableTemplateSitewide__search', searchProps && searchProps.className);
  var listClasses = (0, _classnames.default)('euiSelectableTemplateSitewide__list', listProps && listProps.className);
  /**
   * List options
   */

  var formattedOptions = (0, _selectable_template_sitewide_option.euiSelectableTemplateSitewideFormatOptions)(options);
  var loadingMessage = (0, _react2.jsx)(_selectable_message.EuiSelectableMessage, {
    style: {
      minHeight: 300
    }
  }, (0, _react2.jsx)(_loading.EuiLoadingSpinner, {
    size: "l"
  }), (0, _react2.jsx)("br", null), (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiSelectableTemplateSitewide.loadingResults",
    default: "Loading results"
  })));
  var emptyMessage = (0, _react2.jsx)(_selectable_message.EuiSelectableMessage, {
    style: {
      minHeight: 300
    }
  }, (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiSelectableTemplateSitewide.noResults",
    default: "No results available"
  })));
  /**
   * Changes based on showing the `popoverButton` if provided.
   * This will move the search input into the popover
   * and use the passed `popoverButton` as the popover trigger.
   */

  var popoverTrigger;

  if (popoverButton && canShowPopoverButton) {
    popoverTrigger = /*#__PURE__*/_react.default.cloneElement(popoverButton, _objectSpread(_objectSpread({}, popoverButton.props), {}, {
      onClick: togglePopover,
      onKeyDown: function onKeyDown(e) {
        // Selectable preventsDefault on Enter which kills browser controls for pressing the button
        e.stopPropagation();
      }
    }));
  }

  return (0, _react2.jsx)(_selectable.EuiSelectable, (0, _extends2.default)({
    isLoading: isLoading,
    options: formattedOptions,
    renderOption: _selectable_template_sitewide_option.euiSelectableTemplateSitewideRenderOptions,
    singleSelection: true,
    searchProps: _objectSpread(_objectSpread({
      placeholder: searchPlaceholder,
      isClearable: true
    }, searchProps), {}, {
      onFocus: searchOnFocus,
      onBlur: searchOnBlur,
      onInput: onSearchInput,
      className: searchClasses
    }),
    listProps: _objectSpread(_objectSpread({
      rowHeight: 68,
      showIcons: false,
      onFocusBadge: {
        iconSide: 'right',
        children: (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiSelectableTemplateSitewide.onFocusBadgeGoTo",
          default: "Go to"
        })
      }
    }, listProps), {}, {
      className: listClasses
    }),
    loadingMessage: loadingMessage,
    emptyMessage: emptyMessage,
    noMatchesMessage: emptyMessage
  }, rest, {
    className: classes,
    searchable: true
  }), function (list, search) {
    return (0, _react2.jsx)(_popover2.EuiPopover, (0, _extends2.default)({
      panelPaddingSize: "none",
      isOpen: popoverIsOpen,
      ownFocus: !!popoverTrigger,
      display: popoverTrigger ? 'inlineBlock' : 'block'
    }, popoverRest, {
      panelRef: setPanelRef,
      button: popoverTrigger ? popoverTrigger : search,
      closePopover: closePopover
    }), (0, _react2.jsx)("div", {
      style: {
        width: popoverWidth,
        maxWidth: '100%'
      }
    }, popoverTitle || popoverTrigger ? (0, _react2.jsx)(_popover.EuiPopoverTitle, {
      paddingSize: "s"
    }, popoverTitle, popoverTitle && search && (0, _react2.jsx)(_spacer.EuiSpacer, null), search) : undefined, list, popoverFooter && (0, _react2.jsx)(_popover.EuiPopoverFooter, {
      paddingSize: "s"
    }, popoverFooter)));
  });
};

exports.EuiSelectableTemplateSitewide = EuiSelectableTemplateSitewide;