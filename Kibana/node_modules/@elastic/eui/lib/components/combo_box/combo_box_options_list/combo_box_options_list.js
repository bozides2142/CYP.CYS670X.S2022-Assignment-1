"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiComboBoxOptionsList = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactWindow = require("react-window");

var _flex = require("../../flex");

var _highlight = require("../../highlight");

var _panel = require("../../panel");

var _text = require("../../text");

var _loading = require("../../loading");

var _combo_box_title = require("./combo_box_title");

var _i18n = require("../../i18n");

var _filter_select_item = require("../../filter_group/filter_select_item");

var _badge = require("../../badge/");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var OPTION_CONTENT_CLASSNAME = 'euiComboBoxOption__content';
var hitEnterBadge = (0, _react2.jsx)(_badge.EuiBadge, {
  className: "euiComboBoxOption__enterBadge",
  color: "hollow",
  iconType: "returnKey",
  "aria-hidden": "true"
});

var EuiComboBoxOptionsList = /*#__PURE__*/function (_Component) {
  _inherits(EuiComboBoxOptionsList, _Component);

  var _super = _createSuper(EuiComboBoxOptionsList);

  function EuiComboBoxOptionsList() {
    var _this;

    _classCallCheck(this, EuiComboBoxOptionsList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "listRefInstance", null);

    _defineProperty(_assertThisInitialized(_this), "listRef", null);

    _defineProperty(_assertThisInitialized(_this), "listBoxRef", null);

    _defineProperty(_assertThisInitialized(_this), "updatePosition", function () {
      // Wait a beat for the DOM to update, since we depend on DOM elements' bounds.
      requestAnimationFrame(function () {
        _this.props.updatePosition(_this.listRefInstance);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeListOnScroll", function (event) {
      // Close the list when a scroll event happens, but not if the scroll happened in the options list.
      // This mirrors Firefox's approach of auto-closing `select` elements onscroll.
      if (_this.listRefInstance && event.target && _this.listRefInstance.contains(event.target) === false) {
        _this.props.onCloseList(event);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "listRefCallback", function (ref) {
      _this.props.listRef(ref);

      _this.listRefInstance = ref;
    });

    _defineProperty(_assertThisInitialized(_this), "setListRef", function (ref) {
      _this.listRef = ref;
    });

    _defineProperty(_assertThisInitialized(_this), "setListBoxRef", function (ref) {
      _this.listBoxRef = ref;

      if (ref) {
        ref.setAttribute('id', _this.props.rootId('listbox'));
        ref.setAttribute('role', 'listBox');
        ref.setAttribute('tabIndex', '0');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "ListRow", function (_ref) {
      var _option$key;

      var data = _ref.data,
          index = _ref.index,
          style = _ref.style;
      var option = data[index];

      var key = option.key,
          isGroupLabelOption = option.isGroupLabelOption,
          label = option.label,
          value = option.value,
          rest = _objectWithoutProperties(option, ["key", "isGroupLabelOption", "label", "value"]);

      var _this$props = _this.props,
          singleSelection = _this$props.singleSelection,
          selectedOptions = _this$props.selectedOptions,
          onOptionClick = _this$props.onOptionClick,
          optionRef = _this$props.optionRef,
          activeOptionIndex = _this$props.activeOptionIndex,
          renderOption = _this$props.renderOption,
          searchValue = _this$props.searchValue,
          rootId = _this$props.rootId;

      if (isGroupLabelOption) {
        return (0, _react2.jsx)("div", {
          key: key !== null && key !== void 0 ? key : label.toLowerCase(),
          style: style
        }, (0, _react2.jsx)(_combo_box_title.EuiComboBoxTitle, null, label));
      }

      var checked = undefined;

      if (singleSelection && selectedOptions.length && selectedOptions[0].label === label && selectedOptions[0].key === key) {
        checked = 'on';
      }

      var optionIsFocused = activeOptionIndex === index;
      var optionIsDisabled = option.hasOwnProperty('disabled') && option.disabled === true;
      return (0, _react2.jsx)(_filter_select_item.EuiFilterSelectItem, _extends({
        style: style,
        key: (_option$key = option.key) !== null && _option$key !== void 0 ? _option$key : option.label.toLowerCase(),
        onClick: function onClick() {
          if (onOptionClick) {
            onOptionClick(option);
          }
        },
        ref: optionRef.bind(_assertThisInitialized(_this), index),
        isFocused: optionIsFocused,
        checked: checked,
        showIcons: singleSelection ? true : false,
        id: rootId("_option-".concat(index)),
        title: label
      }, rest), (0, _react2.jsx)("span", {
        className: "euiComboBoxOption__contentWrapper"
      }, renderOption ? (0, _react2.jsx)("span", {
        className: OPTION_CONTENT_CLASSNAME
      }, renderOption(option, searchValue, 'euiComboBoxOption__renderOption')) : (0, _react2.jsx)(_highlight.EuiHighlight, {
        search: searchValue,
        className: OPTION_CONTENT_CLASSNAME
      }, label), optionIsFocused && !optionIsDisabled ? hitEnterBadge : null));
    });

    return _this;
  }

  _createClass(EuiComboBoxOptionsList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Wait a frame, otherwise moving focus from one combo box to another will result in the class
      // being removed from the body.
      requestAnimationFrame(function () {
        document.body.classList.add('euiBody-hasPortalContent');
      });
      this.updatePosition();
      window.addEventListener('resize', this.updatePosition); // Firefox will trigger a scroll event in many common situations when the options list div is appended
      // to the DOM; in testing it was always within 100ms, but setting a timeout here for 500ms to be safe

      setTimeout(function () {
        window.addEventListener('scroll', _this2.closeListOnScroll, {
          passive: true,
          // for better performance as we won't call preventDefault
          capture: true // scroll events don't bubble, they must be captured instead

        });
      }, 500);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var options = prevProps.options,
          selectedOptions = prevProps.selectedOptions,
          searchValue = prevProps.searchValue; // We don't compare matchingOptions because that will result in a loop.

      if (searchValue !== this.props.searchValue || options !== this.props.options || selectedOptions !== this.props.selectedOptions) {
        this.updatePosition();
      }

      if (this.listRef && typeof this.props.activeOptionIndex !== 'undefined' && this.props.activeOptionIndex !== prevProps.activeOptionIndex) {
        this.listRef.scrollToItem(this.props.activeOptionIndex, 'auto');
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.body.classList.remove('euiBody-hasPortalContent');
      window.removeEventListener('resize', this.updatePosition);
      window.removeEventListener('scroll', this.closeListOnScroll, {
        capture: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          dataTestSubj = _this$props2['data-test-subj'],
          activeOptionIndex = _this$props2.activeOptionIndex,
          areAllOptionsSelected = _this$props2.areAllOptionsSelected,
          customOptionText = _this$props2.customOptionText,
          fullWidth = _this$props2.fullWidth,
          getSelectedOptionForSearchValue = _this$props2.getSelectedOptionForSearchValue,
          isLoading = _this$props2.isLoading,
          listRef = _this$props2.listRef,
          matchingOptions = _this$props2.matchingOptions,
          onCloseList = _this$props2.onCloseList,
          onCreateOption = _this$props2.onCreateOption,
          onOptionClick = _this$props2.onOptionClick,
          onOptionEnterKey = _this$props2.onOptionEnterKey,
          onScroll = _this$props2.onScroll,
          optionRef = _this$props2.optionRef,
          options = _this$props2.options,
          _this$props2$position = _this$props2.position,
          position = _this$props2$position === void 0 ? 'bottom' : _this$props2$position,
          renderOption = _this$props2.renderOption,
          rootId = _this$props2.rootId,
          rowHeight = _this$props2.rowHeight,
          scrollToIndex = _this$props2.scrollToIndex,
          searchValue = _this$props2.searchValue,
          selectedOptions = _this$props2.selectedOptions,
          singleSelection = _this$props2.singleSelection,
          updatePosition = _this$props2.updatePosition,
          width = _this$props2.width,
          delimiter = _this$props2.delimiter,
          zIndex = _this$props2.zIndex,
          style = _this$props2.style,
          rest = _objectWithoutProperties(_this$props2, ["data-test-subj", "activeOptionIndex", "areAllOptionsSelected", "customOptionText", "fullWidth", "getSelectedOptionForSearchValue", "isLoading", "listRef", "matchingOptions", "onCloseList", "onCreateOption", "onOptionClick", "onOptionEnterKey", "onScroll", "optionRef", "options", "position", "renderOption", "rootId", "rowHeight", "scrollToIndex", "searchValue", "selectedOptions", "singleSelection", "updatePosition", "width", "delimiter", "zIndex", "style"]);

      var emptyStateContent;

      if (isLoading) {
        emptyStateContent = (0, _react2.jsx)(_flex.EuiFlexGroup, {
          gutterSize: "s",
          justifyContent: "center"
        }, (0, _react2.jsx)(_flex.EuiFlexItem, {
          grow: false
        }, (0, _react2.jsx)(_loading.EuiLoadingSpinner, {
          size: "m"
        })), (0, _react2.jsx)(_flex.EuiFlexItem, {
          grow: false
        }, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiComboBoxOptionsList.loadingOptions",
          default: "Loading options"
        })));
      } else if (searchValue && matchingOptions && matchingOptions.length === 0) {
        if (onCreateOption && getSelectedOptionForSearchValue) {
          if (delimiter && searchValue.includes(delimiter)) {
            emptyStateContent = (0, _react2.jsx)("div", {
              className: "euiComboBoxOption__contentWrapper"
            }, (0, _react2.jsx)("p", {
              className: "euiComboBoxOption__emptyStateText"
            }, (0, _react2.jsx)(_i18n.EuiI18n, {
              token: "euiComboBoxOptionsList.delimiterMessage",
              default: "Add each item separated by {delimiter}",
              values: {
                delimiter: (0, _react2.jsx)("strong", null, delimiter)
              }
            })), hitEnterBadge);
          } else {
            var selectedOptionForValue = getSelectedOptionForSearchValue(searchValue, selectedOptions);

            if (selectedOptionForValue) {
              // Disallow duplicate custom options.
              emptyStateContent = (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
                token: "euiComboBoxOptionsList.alreadyAdded",
                default: "{label} has already been added",
                values: {
                  label: (0, _react2.jsx)("strong", null, selectedOptionForValue.label)
                }
              }));
            } else {
              var highlightSearchValue = function highlightSearchValue(text, searchValue) {
                var reg = new RegExp(/(\{searchValue})/, 'gi');
                var parts = text.split(reg);
                return (0, _react2.jsx)("p", {
                  className: "euiComboBoxOption__emptyStateText"
                }, parts.map(function (part, idx) {
                  return part.match(reg) ? (0, _react2.jsx)("strong", {
                    key: idx
                  }, searchValue) : part;
                }));
              };

              emptyStateContent = (0, _react2.jsx)("div", {
                className: "euiComboBoxOption__contentWrapper"
              }, customOptionText ? highlightSearchValue(customOptionText, searchValue) : (0, _react2.jsx)("p", {
                className: "euiComboBoxOption__emptyStateText"
              }, (0, _react2.jsx)(_i18n.EuiI18n, {
                token: "euiComboBoxOptionsList.createCustomOption",
                default: "Add {searchValue} as a custom option",
                values: {
                  searchValue: (0, _react2.jsx)("strong", null, searchValue)
                }
              })), hitEnterBadge);
            }
          }
        } else {
          emptyStateContent = (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
            token: "euiComboBoxOptionsList.noMatchingOptions",
            default: "{searchValue} doesn't match any options",
            values: {
              searchValue: (0, _react2.jsx)("strong", null, searchValue)
            }
          }));
        }
      } else if (!options.length) {
        emptyStateContent = (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiComboBoxOptionsList.noAvailableOptions",
          default: "There aren't any options available"
        }));
      } else if (areAllOptionsSelected) {
        emptyStateContent = (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiComboBoxOptionsList.allOptionsSelected",
          default: "You've selected all available options"
        }));
      }

      var emptyState = emptyStateContent ? (0, _react2.jsx)(_text.EuiText, {
        size: "xs",
        className: "euiComboBoxOptionsList__empty"
      }, emptyStateContent) : undefined;
      var numVisibleOptions = matchingOptions.length < 7 ? matchingOptions.length : 7;
      var height = numVisibleOptions * (rowHeight + 1); // Add one for the border
      // bounded by max-height of euiComboBoxOptionsList__rowWrap

      var boundedHeight = height > 200 ? 200 : height;
      var optionsList = (0, _react2.jsx)(_reactWindow.FixedSizeList, {
        height: boundedHeight,
        onScroll: onScroll,
        itemCount: matchingOptions.length,
        itemSize: rowHeight,
        itemData: matchingOptions,
        ref: this.setListRef,
        innerRef: this.setListBoxRef,
        width: width
      }, this.ListRow);
      /**
       * Reusing the EuiPopover__panel classes to help with consistency/maintenance.
       * But this should really be converted to user the popover component.
       */

      var classes = (0, _classnames.default)('euiComboBoxOptionsList', 'euiPopover__panel', 'euiPopover__panel-isAttached', 'euiPopover__panel-noArrow', 'euiPopover__panel-isOpen', "euiPopover__panel--".concat(position));
      return (0, _react2.jsx)(_panel.EuiPanel, _extends({
        paddingSize: "none",
        hasShadow: false,
        className: classes,
        panelRef: this.listRefCallback,
        "data-test-subj": "comboBoxOptionsList ".concat(dataTestSubj),
        style: _objectSpread(_objectSpread({}, style), {}, {
          zIndex: zIndex
        })
      }, rest), (0, _react2.jsx)("div", {
        className: "euiComboBoxOptionsList__rowWrap"
      }, emptyState || optionsList));
    }
  }]);

  return EuiComboBoxOptionsList;
}(_react.Component);

exports.EuiComboBoxOptionsList = EuiComboBoxOptionsList;

_defineProperty(EuiComboBoxOptionsList, "defaultProps", {
  'data-test-subj': '',
  rowHeight: 29 // row height of default option renderer

});

EuiComboBoxOptionsList.propTypes = {
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.string.isRequired]),
  activeOptionIndex: _propTypes.default.number,
  areAllOptionsSelected: _propTypes.default.bool,

  /**
       * Creates a custom text option. You can use `{searchValue}` inside your string to better customize your text.
       * It won't show if there's no onCreateOption.
       */
  customOptionText: _propTypes.default.string,
  fullWidth: _propTypes.default.bool,
  getSelectedOptionForSearchValue: _propTypes.default.func,
  isLoading: _propTypes.default.bool,
  listRef: _propTypes.default.any.isRequired,
  matchingOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
    isGroupLabelOption: _propTypes.default.bool,
    label: _propTypes.default.string.isRequired,
    key: _propTypes.default.string,
    options: _propTypes.default.arrayOf(_propTypes.default.shape({
      isGroupLabelOption: _propTypes.default.bool,
      label: _propTypes.default.string.isRequired,
      key: _propTypes.default.string,
      options: _propTypes.default.arrayOf(_propTypes.default.any.isRequired),
      value: _propTypes.default.any,
      className: _propTypes.default.string,
      "aria-label": _propTypes.default.string,
      "data-test-subj": _propTypes.default.string
    }).isRequired),
    value: _propTypes.default.any,
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  }).isRequired).isRequired,
  onCloseList: _propTypes.default.func.isRequired,
  onCreateOption: _propTypes.default.func,
  onOptionClick: _propTypes.default.func,
  onOptionEnterKey: _propTypes.default.func,
  onScroll: _propTypes.default.any,
  optionRef: _propTypes.default.func.isRequired,

  /**
       * Array of EuiComboBoxOptionOption objects. See #EuiComboBoxOptionOption
       */
  options: _propTypes.default.arrayOf(_propTypes.default.shape({
    isGroupLabelOption: _propTypes.default.bool,
    label: _propTypes.default.string.isRequired,
    key: _propTypes.default.string,
    options: _propTypes.default.arrayOf(_propTypes.default.shape({
      isGroupLabelOption: _propTypes.default.bool,
      label: _propTypes.default.string.isRequired,
      key: _propTypes.default.string,
      options: _propTypes.default.arrayOf(_propTypes.default.any.isRequired),
      value: _propTypes.default.any,
      className: _propTypes.default.string,
      "aria-label": _propTypes.default.string,
      "data-test-subj": _propTypes.default.string
    }).isRequired),
    value: _propTypes.default.any,
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  }).isRequired).isRequired,
  position: _propTypes.default.oneOf(["top", "bottom"]),
  renderOption: _propTypes.default.func,
  rootId: _propTypes.default.any.isRequired,
  rowHeight: _propTypes.default.number.isRequired,
  scrollToIndex: _propTypes.default.number,
  searchValue: _propTypes.default.string.isRequired,
  selectedOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
    isGroupLabelOption: _propTypes.default.bool,
    label: _propTypes.default.string.isRequired,
    key: _propTypes.default.string,
    options: _propTypes.default.arrayOf(_propTypes.default.shape({
      isGroupLabelOption: _propTypes.default.bool,
      label: _propTypes.default.string.isRequired,
      key: _propTypes.default.string,
      options: _propTypes.default.arrayOf(_propTypes.default.any.isRequired),
      value: _propTypes.default.any,
      className: _propTypes.default.string,
      "aria-label": _propTypes.default.string,
      "data-test-subj": _propTypes.default.string
    }).isRequired),
    value: _propTypes.default.any,
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string
  }).isRequired).isRequired,
  updatePosition: _propTypes.default.func.isRequired,
  width: _propTypes.default.number.isRequired,
  singleSelection: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.shape({
    asPlainText: _propTypes.default.bool
  }).isRequired]),
  delimiter: _propTypes.default.string,
  zIndex: _propTypes.default.number
};