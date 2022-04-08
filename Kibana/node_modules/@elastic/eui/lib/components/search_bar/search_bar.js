"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Query", {
  enumerable: true,
  get: function get() {
    return _query2.Query;
  }
});
Object.defineProperty(exports, "Ast", {
  enumerable: true,
  get: function get() {
    return _query2.AST;
  }
});
exports.EuiSearchBar = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _predicate = require("../../services/predicate");

var _flex = require("../flex");

var _search_box = require("./search_box");

var _search_filters = require("./search_filters");

var _query2 = require("./query");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var parseQuery = function parseQuery(query, props) {
  var schema = undefined;

  if (props.box && props.box.schema && _typeof(props.box.schema) === 'object') {
    schema = props.box.schema;
  }

  var dateFormat = props.dateFormat;
  var parseOptions = {
    schema: schema,
    dateFormat: dateFormat
  };

  if (!query) {
    return _query2.Query.parse('', parseOptions);
  }

  return (0, _predicate.isString)(query) ? _query2.Query.parse(query, parseOptions) : query;
};

var EuiSearchBar = /*#__PURE__*/function (_Component) {
  _inherits(EuiSearchBar, _Component);

  var _super = _createSuper(EuiSearchBar);

  function EuiSearchBar(props) {
    var _this;

    _classCallCheck(this, EuiSearchBar);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onSearch", function (queryText) {
      try {
        var query = parseQuery(queryText, _this.props);

        _this.notifyControllingParent({
          query: query,
          queryText: queryText,
          error: null
        });

        _this.setState({
          query: query,
          queryText: queryText,
          error: null
        });
      } catch (e) {
        var error = {
          name: e.name,
          message: e.message
        };

        _this.notifyControllingParent({
          query: null,
          queryText: queryText,
          error: error
        });

        _this.setState({
          queryText: queryText,
          error: error
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onFiltersChange", function (query) {
      _this.notifyControllingParent({
        query: query,
        queryText: query.text,
        error: null
      });

      _this.setState({
        query: query,
        queryText: query.text,
        error: null
      });
    });

    var _query = parseQuery(props.defaultQuery || props.query, props);

    _this.state = {
      query: _query,
      queryText: _query.text,
      error: null
    };
    return _this;
  }

  _createClass(EuiSearchBar, [{
    key: "notifyControllingParent",
    value: function notifyControllingParent(newState) {
      var onChange = this.props.onChange;

      if (!onChange) {
        return;
      }

      var oldState = this.state;
      var query = newState.query,
          queryText = newState.queryText,
          error = newState.error;
      var isQueryDifferent = oldState.queryText !== queryText;
      var oldError = oldState.error ? oldState.error.message : null;
      var newError = error ? error.message : null;
      var isErrorDifferent = oldError !== newError;

      if (isQueryDifferent || isErrorDifferent) {
        if (error == null) {
          onChange({
            query: query,
            queryText: queryText,
            error: error
          });
        } else {
          onChange({
            query: null,
            queryText: queryText,
            error: error
          });
        }
      }
    }
  }, {
    key: "renderTools",
    value: function renderTools(tools) {
      if (!tools) {
        return undefined;
      }

      if (Array.isArray(tools)) {
        return tools.map(function (tool) {
          return (0, _react2.jsx)(_flex.EuiFlexItem, {
            grow: false,
            key: tool.key == null ? undefined : tool.key
          }, tool);
        });
      }

      return (0, _react2.jsx)(_flex.EuiFlexItem, {
        grow: false
      }, tools);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          query = _this$state.query,
          queryText = _this$state.queryText,
          error = _this$state.error;
      var _this$props = this.props,
          _this$props$box = _this$props.box;
      _this$props$box = _this$props$box === void 0 ? {
        schema: ''
      } : _this$props$box;

      var schema = _this$props$box.schema,
          box = _objectWithoutProperties(_this$props$box, ["schema"]),
          filters = _this$props.filters,
          toolsLeft = _this$props.toolsLeft,
          toolsRight = _this$props.toolsRight;

      var toolsLeftEl = this.renderTools(toolsLeft);
      var filtersBar = !filters ? undefined : (0, _react2.jsx)(_flex.EuiFlexItem, {
        className: "euiSearchBar__filtersHolder",
        grow: false
      }, (0, _react2.jsx)(_search_filters.EuiSearchFilters, {
        filters: filters,
        query: query,
        onChange: this.onFiltersChange
      }));
      var toolsRightEl = this.renderTools(toolsRight);
      return (0, _react2.jsx)(_flex.EuiFlexGroup, {
        gutterSize: "m",
        alignItems: "center",
        wrap: true
      }, toolsLeftEl, (0, _react2.jsx)(_flex.EuiFlexItem, {
        className: "euiSearchBar__searchHolder",
        grow: true
      }, (0, _react2.jsx)(_search_box.EuiSearchBox, _extends({}, box, {
        query: queryText,
        onSearch: this.onSearch,
        isInvalid: error != null,
        title: error ? error.message : undefined
      }))), filtersBar, toolsRightEl);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if ((nextProps.query || nextProps.query === '') && (!prevState.query || typeof nextProps.query !== 'string' && nextProps.query.text !== prevState.query.text || typeof nextProps.query === 'string' && nextProps.query !== prevState.query.text)) {
        var query = parseQuery(nextProps.query, nextProps);
        return {
          query: query,
          queryText: query.text,
          error: null
        };
      }

      return null;
    }
  }]);

  return EuiSearchBar;
}(_react.Component);

exports.EuiSearchBar = EuiSearchBar;

_defineProperty(EuiSearchBar, "Query", _query2.Query);

EuiSearchBar.propTypes = {
  onChange: _propTypes.default.func,

  /**
     The initial query the bar will hold when first mounted
     */
  defaultQuery: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.string.isRequired]),

  /**
     If you wish to use the search bar as a controlled component, continuously pass the query via this prop.
     */
  query: _propTypes.default.oneOfType([_propTypes.default.any.isRequired, _propTypes.default.string.isRequired]),

  /**
     Configures the search box. Set `placeholder` to change the placeholder text in the box and `incremental` to support incremental (as you type) search.
     */
  box: _propTypes.default.shape({
    name: _propTypes.default.string,
    id: _propTypes.default.string,
    placeholder: _propTypes.default.string,
    value: _propTypes.default.string,
    isInvalid: _propTypes.default.bool,
    fullWidth: _propTypes.default.bool,
    isLoading: _propTypes.default.bool,

    /**
       * Called when the user presses [Enter] OR on change if the incremental prop is `true`.
       * If you don't need the on[Enter] functionality, prefer using onChange
       */
    onSearch: _propTypes.default.func,

    /**
       * When `true` the search will be executed (that is, the `onSearch` will be called) as the
       * user types.
       */
    incremental: _propTypes.default.bool,

    /**
       * when `true` creates a shorter height input
       */
    compressed: _propTypes.default.bool,
    inputRef: _propTypes.default.func,

    /**
       * Shows a button that quickly clears any input
       */
    isClearable: _propTypes.default.bool,

    /**
       * Creates an input group with element(s) coming before input
       * `string` | `ReactElement` or an array of these
       */
    prepend: _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.element.isRequired]).isRequired, _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.element.isRequired]).isRequired).isRequired]),

    /**
       * Creates an input group with element(s) coming after input.
       * `string` | `ReactElement` or an array of these
       */
    append: _propTypes.default.oneOfType([_propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.element.isRequired]).isRequired, _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.element.isRequired]).isRequired).isRequired]),
    className: _propTypes.default.string,
    "aria-label": _propTypes.default.string,
    "data-test-subj": _propTypes.default.string,
    // Boolean values are not meaningful to this EuiSearchBox, but are allowed so that other
    // components can use e.g. a true value to mean "auto-derive a schema". See EuiInMemoryTable.
    // Admittedly, this is a bit of a hack.
    schema: _propTypes.default.oneOfType([_propTypes.default.shape({
      strict: _propTypes.default.bool,
      fields: _propTypes.default.any,
      flags: _propTypes.default.arrayOf(_propTypes.default.string.isRequired)
    }).isRequired, _propTypes.default.bool.isRequired])
  }),

  /**
     An array of search filters. See #SearchFilterConfig.
     */
  filters: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({
    type: _propTypes.default.oneOf(["is"]).isRequired,
    field: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    negatedName: _propTypes.default.string,
    available: _propTypes.default.func
  }).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOf(["field_value_selection"]).isRequired,
    field: _propTypes.default.string,
    name: _propTypes.default.string.isRequired,

    /**
       * See #FieldValueOptionType
       */
    options: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.shape({
      field: _propTypes.default.string,
      value: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired, _propTypes.default.bool.isRequired, _propTypes.default.shape({
        type: _propTypes.default.oneOf(["date"]).isRequired,
        raw: _propTypes.default.any.isRequired,
        granularity: _propTypes.default.oneOfType([_propTypes.default.shape({
          es: _propTypes.default.oneOf(["d", "w", "M", "y"]).isRequired,
          js: _propTypes.default.oneOf(["day", "week", "month", "year"]).isRequired,
          isSame: _propTypes.default.func.isRequired,
          start: _propTypes.default.func.isRequired,
          startOfNext: _propTypes.default.func.isRequired,
          iso8601: _propTypes.default.func.isRequired
        }).isRequired, _propTypes.default.oneOf([undefined])]).isRequired,
        text: _propTypes.default.string.isRequired,
        resolve: _propTypes.default.func.isRequired
      }).isRequired]).isRequired,
      name: _propTypes.default.string,
      view: _propTypes.default.node
    }).isRequired).isRequired, _propTypes.default.func.isRequired]).isRequired,
    filterWith: _propTypes.default.oneOfType([_propTypes.default.oneOf(["prefix", "includes"]), _propTypes.default.func.isRequired]),
    cache: _propTypes.default.number,
    multiSelect: _propTypes.default.oneOfType([_propTypes.default.bool.isRequired, _propTypes.default.oneOf(["and", "or"])]),
    loadingMessage: _propTypes.default.string,
    noOptionsMessage: _propTypes.default.string,
    searchThreshold: _propTypes.default.number,
    available: _propTypes.default.func,
    autoClose: _propTypes.default.bool,
    operator: _propTypes.default.oneOf(["eq", "exact", "gt", "gte", "lt", "lte"])
  }).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOf(["field_value_toggle"]).isRequired,
    field: _propTypes.default.string.isRequired,
    value: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired, _propTypes.default.bool.isRequired, _propTypes.default.shape({
      type: _propTypes.default.oneOf(["date"]).isRequired,
      raw: _propTypes.default.any.isRequired,
      granularity: _propTypes.default.oneOfType([_propTypes.default.shape({
        es: _propTypes.default.oneOf(["d", "w", "M", "y"]).isRequired,
        js: _propTypes.default.oneOf(["day", "week", "month", "year"]).isRequired,
        isSame: _propTypes.default.func.isRequired,
        start: _propTypes.default.func.isRequired,
        startOfNext: _propTypes.default.func.isRequired,
        iso8601: _propTypes.default.func.isRequired
      }).isRequired, _propTypes.default.oneOf([undefined])]).isRequired,
      text: _propTypes.default.string.isRequired,
      resolve: _propTypes.default.func.isRequired
    }).isRequired]).isRequired,
    name: _propTypes.default.string.isRequired,
    negatedName: _propTypes.default.string,
    available: _propTypes.default.func,
    operator: _propTypes.default.oneOf(["eq", "exact", "gt", "gte", "lt", "lte"])
  }).isRequired, _propTypes.default.shape({
    type: _propTypes.default.oneOf(["field_value_toggle_group"]).isRequired,
    field: _propTypes.default.string.isRequired,

    /**
       * See #FieldValueToggleGroupFilterItemType
       */
    items: _propTypes.default.arrayOf(_propTypes.default.shape({
      value: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.number.isRequired, _propTypes.default.bool.isRequired]).isRequired,
      name: _propTypes.default.string.isRequired,
      negatedName: _propTypes.default.string,
      operator: _propTypes.default.oneOf(["eq", "exact", "gt", "gte", "lt", "lte"])
    }).isRequired).isRequired,
    available: _propTypes.default.func
  }).isRequired]).isRequired),

  /**
     * Tools which go to the left of the search bar.
     */
  toolsLeft: _propTypes.default.oneOfType([_propTypes.default.element.isRequired, _propTypes.default.arrayOf(_propTypes.default.element.isRequired).isRequired]),

  /**
     * Tools which go to the right of the search bar.
     */
  toolsRight: _propTypes.default.oneOfType([_propTypes.default.element.isRequired, _propTypes.default.arrayOf(_propTypes.default.element.isRequired).isRequired]),

  /**
     * Date formatter to use when parsing date values
     */
  dateFormat: _propTypes.default.any,
  className: _propTypes.default.string,
  "aria-label": _propTypes.default.string,
  "data-test-subj": _propTypes.default.string
};