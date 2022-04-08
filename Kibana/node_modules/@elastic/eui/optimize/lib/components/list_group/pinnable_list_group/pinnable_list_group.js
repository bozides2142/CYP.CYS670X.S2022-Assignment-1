"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPinnableListGroup = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../i18n");

var _list_group = require("../list_group");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var pinExtraAction = {
  color: 'primary',
  iconType: 'pinFilled',
  iconSize: 's',
  className: 'euiPinnableListGroup__itemExtraAction'
};
var pinnedExtraAction = {
  color: 'primary',
  iconType: 'pinFilled',
  iconSize: 's',
  className: 'euiPinnableListGroup__itemExtraAction euiPinnableListGroup__itemExtraAction-pinned',
  alwaysShow: true
};

var EuiPinnableListGroup = function EuiPinnableListGroup(_ref) {
  var className = _ref.className,
      listItems = _ref.listItems,
      pinTitle = _ref.pinTitle,
      unpinTitle = _ref.unpinTitle,
      onPinClick = _ref.onPinClick,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "listItems", "pinTitle", "unpinTitle", "onPinClick"]);
  var classes = (0, _classnames.default)('euiPinnableListGroup', className); // Alter listItems object with extra props

  var getNewListItems = function getNewListItems(pinExtraActionLabel, pinnedExtraActionLabel) {
    return listItems.map(function (item) {
      var pinned = item.pinned,
          _item$pinnable = item.pinnable,
          pinnable = _item$pinnable === void 0 ? true : _item$pinnable,
          itemProps = (0, _objectWithoutProperties2.default)(item, ["pinned", "pinnable"]); // Make some declarations of props for the nav implementation

      itemProps.className = (0, _classnames.default)('euiPinnableListGroup__item', item.className); // Add the pinning action unless the item has it's own extra action

      if (onPinClick && !itemProps.extraAction && pinnable) {
        // Different displays for pinned vs unpinned
        if (pinned) {
          itemProps.extraAction = _objectSpread(_objectSpread({}, pinnedExtraAction), {}, {
            title: unpinTitle ? unpinTitle(item) : pinnedExtraActionLabel,
            'aria-label': unpinTitle ? unpinTitle(item) : pinnedExtraActionLabel
          });
        } else {
          itemProps.extraAction = _objectSpread(_objectSpread({}, pinExtraAction), {}, {
            title: pinTitle ? pinTitle(item) : pinExtraActionLabel,
            'aria-label': pinTitle ? pinTitle(item) : pinExtraActionLabel
          });
        } // Return the item on click


        itemProps.extraAction.onClick = function () {
          return onPinClick(item);
        };
      }

      return itemProps;
    });
  };

  return (0, _react2.jsx)(_i18n.EuiI18n, {
    tokens: ['euiPinnableListGroup.pinExtraActionLabel', 'euiPinnableListGroup.pinnedExtraActionLabel'],
    defaults: ['Pin item', 'Unpin item']
  }, function (_ref2) {
    var _ref3 = (0, _slicedToArray2.default)(_ref2, 2),
        pinExtraActionLabel = _ref3[0],
        pinnedExtraActionLabel = _ref3[1];

    var newListItems = getNewListItems(pinExtraActionLabel, pinnedExtraActionLabel);
    return (0, _react2.jsx)(_list_group.EuiListGroup, (0, _extends2.default)({
      className: classes,
      listItems: newListItems
    }, rest));
  });
};

exports.EuiPinnableListGroup = EuiPinnableListGroup;