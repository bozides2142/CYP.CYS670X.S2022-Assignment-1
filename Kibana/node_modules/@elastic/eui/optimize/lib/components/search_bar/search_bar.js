"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _react = _interopRequireWildcard(require("react"));

var _predicate = require("../../services/predicate");

var _flex = require("../flex");

var _search_box = require("./search_box");

var _search_filters = require("./search_filters");

var _query2 = require("./query");

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var parseQuery = function parseQuery(query, props) {
  var schema = undefined;

  if (props.box && props.box.schema && (0, _typeof2.default)(props.box.schema) === 'object') {
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
  (0, _inherits2.default)(EuiSearchBar, _Component);

  var _super = _createSuper(EuiSearchBar);

  function EuiSearchBar(props) {
    var _this;

    (0, _classCallCheck2.default)(this, EuiSearchBar);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onSearch", function (queryText) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onFiltersChange", function (query) {
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

  (0, _createClass2.default)(EuiSearchBar, [{
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
          box = (0, _objectWithoutProperties2.default)(_this$props$box, ["schema"]),
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
      }, (0, _react2.jsx)(_search_box.EuiSearchBox, (0, _extends2.default)({}, box, {
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
(0, _defineProperty2.default)(EuiSearchBar, "Query", _query2.Query);