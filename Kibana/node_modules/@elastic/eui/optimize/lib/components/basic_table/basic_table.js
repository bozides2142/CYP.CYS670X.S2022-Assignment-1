"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItemId = getItemId;
exports.EuiBasicTable = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../services");

var _predicate = require("../../services/predicate");

var _objects = require("../../services/objects");

var _flex = require("../flex");

var _form = require("../form");

var _table = require("../table");

var _collapsed_item_actions = require("./collapsed_item_actions");

var _expanded_item_actions = require("./expanded_item_actions");

var _pagination_bar = require("./pagination_bar");

var _icon = require("../icon");

var _accessibility = require("../accessibility");

var _i18n = require("../i18n");

var _delay_render = require("../delay_render");

var _accessibility2 = require("../../services/accessibility");

var _react2 = require("@emotion/react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataTypesProfiles = {
  auto: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatAuto)(value);
    }
  },
  string: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatText)(value);
    }
  },
  number: {
    align: _services.RIGHT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatNumber)(value);
    }
  },
  boolean: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatBoolean)(value);
    }
  },
  date: {
    align: _services.LEFT_ALIGNMENT,
    render: function render(value) {
      return (0, _services.formatDate)(value);
    }
  }
};
var DATA_TYPES = Object.keys(dataTypesProfiles);

function getItemId(item, itemId) {
  if (itemId) {
    if ((0, _predicate.isFunction)(itemId)) {
      return itemId(item);
    } // @ts-ignore never mind about the index signature


    return item[itemId];
  }
}

function getRowProps(item, rowProps) {
  if (rowProps) {
    if ((0, _predicate.isFunction)(rowProps)) {
      return rowProps(item);
    }

    return rowProps;
  }

  return {};
}

function getCellProps(item, column, cellProps) {
  if (cellProps) {
    if ((0, _predicate.isFunction)(cellProps)) {
      return cellProps(item, column);
    }

    return cellProps;
  }

  return {};
}

function getColumnFooter(column, _ref) {
  var items = _ref.items,
      pagination = _ref.pagination;
  var _ref2 = column,
      footer = _ref2.footer;

  if (footer) {
    if ((0, _predicate.isFunction)(footer)) {
      return footer({
        items: items,
        pagination: pagination
      });
    }

    return footer;
  }

  return undefined;
}

function hasPagination(x) {
  return x.hasOwnProperty('pagination') && !!x.pagination;
}

var EuiBasicTable = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(EuiBasicTable, _Component);

  var _super = _createSuper(EuiBasicTable);

  (0, _createClass2.default)(EuiBasicTable, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (!nextProps.selection) {
        // next props doesn't have a selection, reset our state
        return {
          selection: []
        };
      }

      var itemId = nextProps.itemId;
      var selection = prevState.selection.filter(function (selectedItem) {
        return nextProps.items.findIndex(function (item) {
          return getItemId(item, itemId) === getItemId(selectedItem, itemId);
        }) !== -1;
      });

      if (selection.length !== prevState.selection.length) {
        if (nextProps.selection.onSelectionChange) {
          nextProps.selection.onSelectionChange(selection);
        }

        return {
          selection: selection
        };
      }

      return null;
    } // used for moving in & out of `loading` state

  }]);

  function EuiBasicTable(props) {
    var _this;

    (0, _classCallCheck2.default)(this, EuiBasicTable);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "cleanups", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "tbody", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setTbody", function (tbody) {
      // remove listeners from an existing element
      _this.removeLoadingListeners(); // update the ref


      _this.tbody = tbody; // if loading, add listeners

      if (_this.props.loading === true && tbody) {
        _this.addLoadingListeners(tbody);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addLoadingListeners", function (tbody) {
      var listener = function listener(event) {
        event.stopPropagation();
        event.preventDefault();
      };

      ['mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'click', 'dblclick', 'keydown', 'keyup', 'keypress'].forEach(function (event) {
        tbody.addEventListener(event, listener, true);

        _this.cleanups.push(function () {
          tbody.removeEventListener(event, listener, true);
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "removeLoadingListeners", function () {
      _this.cleanups.forEach(function (cleanup) {
        return cleanup();
      });

      _this.cleanups.length = 0;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "tableId", (0, _accessibility2.htmlIdGenerator)('__table')());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "selectAllIdGenerator", (0, _accessibility2.htmlIdGenerator)('_selection_column-checkbox'));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderSelectAll", function (isMobile) {
      var _this$props = _this.props,
          items = _this$props.items,
          selection = _this$props.selection;

      if (!selection) {
        return;
      }

      var selectableItems = items.filter(function (item) {
        return !selection.selectable || selection.selectable(item);
      });
      var checked = _this.state.selection && selectableItems.length > 0 && _this.state.selection.length === selectableItems.length;
      var disabled = selectableItems.length === 0;

      var onChange = function onChange(event) {
        if (event.target.checked) {
          _this.changeSelection(selectableItems);
        } else {
          _this.changeSelection([]);
        }
      };

      return (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiBasicTable.selectAllRows",
        default: "Select all rows"
      }, function (selectAllRows) {
        return (0, _react2.jsx)(_form.EuiCheckbox, {
          id: _this.selectAllIdGenerator(isMobile ? 'mobile' : 'desktop'),
          type: isMobile ? undefined : 'inList',
          checked: checked,
          disabled: disabled,
          onChange: onChange // Only add data-test-subj to one of the checkboxes
          ,
          "data-test-subj": isMobile ? undefined : 'checkboxSelectAll',
          "aria-label": selectAllRows,
          label: isMobile ? selectAllRows : null
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "resolveColumnSortDirection", function (column) {
      var sorting = _this.props.sorting;
      var _ref3 = column,
          sortable = _ref3.sortable,
          field = _ref3.field,
          name = _ref3.name;

      if (!sorting || !sorting.sort || !sortable) {
        return;
      }

      if (sorting.sort.field === field || sorting.sort.field === name) {
        return sorting.sort.direction;
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "resolveColumnOnSort", function (column) {
      var sorting = _this.props.sorting;
      var _ref4 = column,
          sortable = _ref4.sortable,
          name = _ref4.name;

      if (!sorting || !sortable) {
        return;
      }

      if (!_this.props.onChange) {
        throw new Error("BasicTable is configured to be sortable on column [".concat(name, "] but\n          [onChange] is not configured. This callback must be implemented to handle the sort requests"));
      }

      return function () {
        return _this.onColumnSortChange(column);
      };
    });
    _this.state = {
      // used for checking if  initial selection is rendered
      initialSelectionRendered: false,
      selection: []
    };
    return _this;
  }

  (0, _createClass2.default)(EuiBasicTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.loading && this.tbody) this.addLoadingListeners(this.tbody);
      this.getInitialSelection();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.loading !== this.props.loading) {
        if (this.props.loading && this.tbody) {
          this.addLoadingListeners(this.tbody);
        } else {
          this.removeLoadingListeners();
        }
      }

      this.getInitialSelection();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeLoadingListeners();
    }
  }, {
    key: "getInitialSelection",
    value: function getInitialSelection() {
      if (this.props.selection && this.props.selection.initialSelected && !this.state.initialSelectionRendered && this.props.items.length > 0) {
        this.setState({
          selection: this.props.selection.initialSelected
        });
        this.setState({
          initialSelectionRendered: true
        });
      }
    }
  }, {
    key: "setSelection",
    value: function setSelection(newSelection) {
      this.changeSelection(newSelection);
    }
  }, {
    key: "buildCriteria",
    value: function buildCriteria(props) {
      var criteria = {};

      if (hasPagination(props)) {
        criteria.page = {
          index: props.pagination.pageIndex,
          size: props.pagination.pageSize
        };
      }

      if (props.sorting) {
        criteria.sort = props.sorting.sort;
      }

      return criteria;
    }
  }, {
    key: "changeSelection",
    value: function changeSelection(selection) {
      if (!this.props.selection) {
        return;
      }

      this.setState({
        selection: selection
      });

      if (this.props.selection.onSelectionChange) {
        this.props.selection.onSelectionChange(selection);
      }
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this.changeSelection([]);
    }
  }, {
    key: "onPageSizeChange",
    value: function onPageSizeChange(size) {
      this.clearSelection();
      var currentCriteria = this.buildCriteria(this.props);

      var criteria = _objectSpread(_objectSpread({}, currentCriteria), {}, {
        page: {
          index: 0,
          // when page size changes, we take the user back to the first page
          size: size
        }
      });

      if (this.props.onChange) {
        this.props.onChange(criteria);
      }
    }
  }, {
    key: "onPageChange",
    value: function onPageChange(index) {
      this.clearSelection();
      var currentCriteria = this.buildCriteria(this.props);

      var criteria = _objectSpread(_objectSpread({}, currentCriteria), {}, {
        page: _objectSpread(_objectSpread({}, currentCriteria.page), {}, {
          index: index
        })
      });

      if (this.props.onChange) {
        this.props.onChange(criteria);
      }
    }
  }, {
    key: "onColumnSortChange",
    value: function onColumnSortChange(column) {
      this.clearSelection();
      var currentCriteria = this.buildCriteria(this.props);
      var direction = _services.SortDirection.ASC;

      if (currentCriteria && currentCriteria.sort && (currentCriteria.sort.field === column.field || currentCriteria.sort.field === column.name)) {
        direction = _services.SortDirection.reverse(currentCriteria.sort.direction);
      }

      var criteria = _objectSpread(_objectSpread({}, currentCriteria), {}, {
        // resetting the page if the criteria has one
        page: !currentCriteria.page ? undefined : {
          index: 0,
          size: currentCriteria.page.size
        },
        sort: {
          field: column.field || column.name,
          direction: direction
        }
      });

      if (this.props.onChange) {
        // @ts-ignore complex relationship between pagination's existence and criteria, the code logic ensures this is correctly maintained
        this.props.onChange(criteria);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          loading = _this$props2.loading,
          items = _this$props2.items,
          itemId = _this$props2.itemId,
          columns = _this$props2.columns,
          pagination = _this$props2.pagination,
          sorting = _this$props2.sorting,
          selection = _this$props2.selection,
          onChange = _this$props2.onChange,
          error = _this$props2.error,
          noItemsMessage = _this$props2.noItemsMessage,
          compressed = _this$props2.compressed,
          itemIdToExpandedRowMap = _this$props2.itemIdToExpandedRowMap,
          responsive = _this$props2.responsive,
          isSelectable = _this$props2.isSelectable,
          isExpandable = _this$props2.isExpandable,
          hasActions = _this$props2.hasActions,
          rowProps = _this$props2.rowProps,
          cellProps = _this$props2.cellProps,
          tableCaption = _this$props2.tableCaption,
          rowHeader = _this$props2.rowHeader,
          tableLayout = _this$props2.tableLayout,
          rest = (0, _objectWithoutProperties2.default)(_this$props2, ["className", "loading", "items", "itemId", "columns", "pagination", "sorting", "selection", "onChange", "error", "noItemsMessage", "compressed", "itemIdToExpandedRowMap", "responsive", "isSelectable", "isExpandable", "hasActions", "rowProps", "cellProps", "tableCaption", "rowHeader", "tableLayout"]);
      var classes = (0, _classnames.default)('euiBasicTable', {
        'euiBasicTable-loading': loading
      }, className);
      var table = this.renderTable();
      var paginationBar = this.renderPaginationBar();
      return (0, _react2.jsx)("div", (0, _extends2.default)({
        className: classes
      }, rest), table, paginationBar);
    }
  }, {
    key: "renderTable",
    value: function renderTable() {
      var _this$props3 = this.props,
          compressed = _this$props3.compressed,
          responsive = _this$props3.responsive,
          tableLayout = _this$props3.tableLayout;
      var mobileHeader = responsive ? (0, _react2.jsx)(_table.EuiTableHeaderMobile, null, (0, _react2.jsx)(_flex.EuiFlexGroup, {
        responsive: false,
        justifyContent: "spaceBetween",
        alignItems: "baseline"
      }, (0, _react2.jsx)(_flex.EuiFlexItem, {
        grow: false
      }, this.renderSelectAll(true)), (0, _react2.jsx)(_flex.EuiFlexItem, {
        grow: false
      }, this.renderTableMobileSort()))) : undefined;
      var caption = this.renderTableCaption();
      var head = this.renderTableHead();
      var body = this.renderTableBody();
      var footer = this.renderTableFooter();
      return (0, _react2.jsx)("div", null, mobileHeader, (0, _react2.jsx)(_table.EuiTable, {
        id: this.tableId,
        tableLayout: tableLayout,
        responsive: responsive,
        compressed: compressed
      }, caption, head, body, footer));
    }
  }, {
    key: "renderTableMobileSort",
    value: function renderTableMobileSort() {
      var _this2 = this;

      var _this$props4 = this.props,
          columns = _this$props4.columns,
          sorting = _this$props4.sorting;
      var items = [];

      if (!sorting) {
        return null;
      }

      columns.forEach(function (column, index) {
        var _column, _column$mobileOptions;

        if (column.field && sorting.sort && !!sorting.enableAllColumns && column.sortable == null) {
          column = _objectSpread(_objectSpread({}, column), {}, {
            sortable: true
          });
        }

        if (!column.sortable || ((_column = column) === null || _column === void 0 ? void 0 : (_column$mobileOptions = _column.mobileOptions) === null || _column$mobileOptions === void 0 ? void 0 : _column$mobileOptions.show) === false) {
          return;
        }

        var sortDirection = _this2.resolveColumnSortDirection(column);

        items.push({
          name: column.name,
          key: "_data_s_".concat(column.field, "_").concat(index),
          onSort: _this2.resolveColumnOnSort(column),
          isSorted: !!sortDirection,
          isSortAscending: sortDirection ? _services.SortDirection.isAsc(sortDirection) : undefined
        });
      });
      return items.length ? (0, _react2.jsx)(_table.EuiTableSortMobile, {
        items: items
      }) : null;
    }
  }, {
    key: "renderTableCaption",
    value: function renderTableCaption() {
      var _this$props5 = this.props,
          items = _this$props5.items,
          pagination = _this$props5.pagination,
          tableCaption = _this$props5.tableCaption;
      var captionElement;

      if (tableCaption) {
        if (pagination) {
          captionElement = (0, _react2.jsx)(_i18n.EuiI18n, {
            token: "euiBasicTable.tableCaptionWithPagination",
            default: "{tableCaption}; Page {page} of {pageCount}.",
            values: {
              tableCaption: tableCaption,
              page: pagination.pageIndex + 1,
              pageCount: Math.ceil(pagination.totalItemCount / pagination.pageSize)
            }
          });
        } else {
          captionElement = tableCaption;
        }
      } else {
        if (pagination) {
          if (pagination.totalItemCount > 0) {
            captionElement = (0, _react2.jsx)(_i18n.EuiI18n, {
              token: "euiBasicTable.tableAutoCaptionWithPagination",
              default: "This table contains {itemCount} rows out of {totalItemCount} rows; Page {page} of {pageCount}.",
              values: {
                totalItemCount: pagination.totalItemCount,
                itemCount: items.length,
                page: pagination.pageIndex + 1,
                pageCount: Math.ceil(pagination.totalItemCount / pagination.pageSize)
              }
            });
          } else {
            captionElement = (0, _react2.jsx)(_i18n.EuiI18n, {
              token: "euiBasicTable.tableSimpleAutoCaptionWithPagination",
              default: "This table contains {itemCount} rows; Page {page} of {pageCount}.",
              values: {
                itemCount: items.length,
                page: pagination.pageIndex + 1,
                pageCount: Math.ceil(pagination.totalItemCount / pagination.pageSize)
              }
            });
          }
        } else {
          captionElement = (0, _react2.jsx)(_i18n.EuiI18n, {
            token: "euiBasicTable.tableAutoCaptionWithoutPagination",
            default: "This table contains {itemCount} rows.",
            values: {
              itemCount: items.length
            }
          });
        }
      }

      return (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("caption", {
        className: "euiTableCaption"
      }, (0, _react2.jsx)(_delay_render.EuiDelayRender, null, captionElement)));
    }
  }, {
    key: "renderTableHead",
    value: function renderTableHead() {
      var _this3 = this;

      var _this$props6 = this.props,
          columns = _this$props6.columns,
          selection = _this$props6.selection;
      var headers = [];

      if (selection) {
        headers.push((0, _react2.jsx)(_table.EuiTableHeaderCellCheckbox, {
          key: "_selection_column_h"
        }, this.renderSelectAll(false)));
      }

      columns.forEach(function (column, index) {
        var _ref5 = column,
            field = _ref5.field,
            width = _ref5.width,
            name = _ref5.name,
            align = _ref5.align,
            dataType = _ref5.dataType,
            sortable = _ref5.sortable,
            mobileOptions = _ref5.mobileOptions,
            readOnly = _ref5.readOnly,
            description = _ref5.description;

        var columnAlign = align || _this3.getAlignForDataType(dataType); // actions column


        if (column.actions) {
          headers.push((0, _react2.jsx)(_table.EuiTableHeaderCell, {
            key: "_actions_h_".concat(index),
            align: "right",
            width: width,
            description: description,
            mobileOptions: mobileOptions
          }, name));
          return;
        } // computed column


        if (!column.field) {
          var _sorting = {}; // computed columns are only sortable if their `sortable` is a function

          if (_this3.props.sorting && typeof sortable === 'function') {
            var sortDirection = _this3.resolveColumnSortDirection(column);

            _sorting.isSorted = !!sortDirection;
            _sorting.isSortAscending = sortDirection ? _services.SortDirection.isAsc(sortDirection) : undefined;
            _sorting.onSort = _this3.resolveColumnOnSort(column);
            _sorting.readOnly = _this3.props.sorting.readOnly || readOnly;
          }

          headers.push((0, _react2.jsx)(_table.EuiTableHeaderCell, (0, _extends2.default)({
            key: "_computed_column_h_".concat(index),
            align: columnAlign,
            width: width,
            mobileOptions: mobileOptions,
            "data-test-subj": "tableHeaderCell_".concat(typeof name === 'string' ? name : '', "_").concat(index),
            description: description
          }, _sorting), name));
          return;
        } // field data column


        var sorting = {};

        if (_this3.props.sorting) {
          if (_this3.props.sorting.sort && !!_this3.props.sorting.enableAllColumns && column.sortable == null) {
            column = _objectSpread(_objectSpread({}, column), {}, {
              sortable: true
            });
          }

          var _ref6 = column,
              _sortable = _ref6.sortable;

          if (_sortable) {
            var _sortDirection = _this3.resolveColumnSortDirection(column);

            sorting.isSorted = !!_sortDirection;
            sorting.isSortAscending = _sortDirection ? _services.SortDirection.isAsc(_sortDirection) : undefined;
            sorting.onSort = _this3.resolveColumnOnSort(column);
            sorting.readOnly = _this3.props.sorting.readOnly || readOnly;
          }
        }

        headers.push((0, _react2.jsx)(_table.EuiTableHeaderCell, (0, _extends2.default)({
          key: "_data_h_".concat(field, "_").concat(index),
          align: columnAlign,
          width: width,
          mobileOptions: mobileOptions,
          "data-test-subj": "tableHeaderCell_".concat(field, "_").concat(index),
          description: description
        }, sorting), name));
      });
      return (0, _react2.jsx)(_table.EuiTableHeader, null, headers);
    }
  }, {
    key: "renderTableFooter",
    value: function renderTableFooter() {
      var _this$props7 = this.props,
          items = _this$props7.items,
          columns = _this$props7.columns,
          pagination = _this$props7.pagination,
          selection = _this$props7.selection;
      var footers = [];
      var hasDefinedFooter = false;

      if (selection) {
        // Create an empty cell to compensate for additional selection column
        footers.push((0, _react2.jsx)(_table.EuiTableFooterCell, {
          key: "_selection_column_f"
        }, undefined));
      }

      columns.forEach(function (column) {
        var footer = getColumnFooter(column, {
          items: items,
          pagination: pagination
        });
        var _ref7 = column,
            mobileOptions = _ref7.mobileOptions,
            field = _ref7.field,
            align = _ref7.align;

        if (mobileOptions === null || mobileOptions === void 0 ? void 0 : mobileOptions.only) {
          return; // exclude columns that only exist for mobile headers
        }

        if (footer) {
          footers.push((0, _react2.jsx)(_table.EuiTableFooterCell, {
            key: "footer_".concat(field, "_").concat(footers.length - 1),
            align: align
          }, footer));
          hasDefinedFooter = true;
        } else {
          // Footer is undefined, so create an empty cell to preserve layout
          footers.push((0, _react2.jsx)(_table.EuiTableFooterCell, {
            key: "footer_empty_".concat(footers.length - 1),
            align: align
          }, undefined));
        }
      });
      return footers.length && hasDefinedFooter ? (0, _react2.jsx)(_table.EuiTableFooter, null, footers) : null;
    }
  }, {
    key: "renderTableBody",
    value: function renderTableBody() {
      var _this4 = this;

      if (this.props.error) {
        return this.renderErrorBody(this.props.error);
      }

      var items = this.props.items;

      if (items.length === 0) {
        return this.renderEmptyBody();
      }

      var rows = items.map(function (item, index) {
        // if there's pagination the item's index must be adjusted to the where it is in the whole dataset
        var tableItemIndex = hasPagination(_this4.props) ? _this4.props.pagination.pageIndex * _this4.props.pagination.pageSize + index : index;
        return _this4.renderItemRow(item, tableItemIndex);
      });
      return (0, _react2.jsx)(_table.EuiTableBody, {
        bodyRef: this.setTbody
      }, rows);
    }
  }, {
    key: "renderErrorBody",
    value: function renderErrorBody(error) {
      var colSpan = this.props.columns.length + (this.props.selection ? 1 : 0);
      return (0, _react2.jsx)(_table.EuiTableBody, null, (0, _react2.jsx)(_table.EuiTableRow, null, (0, _react2.jsx)(_table.EuiTableRowCell, {
        align: "center",
        colSpan: colSpan,
        mobileOptions: {
          width: '100%'
        }
      }, (0, _react2.jsx)(_icon.EuiIcon, {
        type: "minusInCircle",
        color: "danger"
      }), " ", error)));
    }
  }, {
    key: "renderEmptyBody",
    value: function renderEmptyBody() {
      var _this$props8 = this.props,
          columns = _this$props8.columns,
          selection = _this$props8.selection,
          noItemsMessage = _this$props8.noItemsMessage;
      var colSpan = columns.length + (selection ? 1 : 0);
      return (0, _react2.jsx)(_table.EuiTableBody, null, (0, _react2.jsx)(_table.EuiTableRow, null, (0, _react2.jsx)(_table.EuiTableRowCell, {
        align: "center",
        colSpan: colSpan,
        mobileOptions: {
          width: '100%'
        }
      }, noItemsMessage)));
    }
  }, {
    key: "renderItemRow",
    value: function renderItemRow(item, rowIndex) {
      var _this5 = this;

      var _this$props9 = this.props,
          columns = _this$props9.columns,
          selection = _this$props9.selection,
          isSelectable = _this$props9.isSelectable,
          hasActions = _this$props9.hasActions,
          rowHeader = _this$props9.rowHeader,
          _this$props9$itemIdTo = _this$props9.itemIdToExpandedRowMap,
          itemIdToExpandedRowMap = _this$props9$itemIdTo === void 0 ? {} : _this$props9$itemIdTo,
          isExpandable = _this$props9.isExpandable;
      var cells = [];
      var itemIdCallback = this.props.itemId;
      var itemId = getItemId(item, itemIdCallback) != null ? getItemId(item, itemIdCallback) : rowIndex;
      var selected = !selection ? false : this.state.selection && !!this.state.selection.find(function (selectedItem) {
        return getItemId(selectedItem, itemIdCallback) === itemId;
      });
      var calculatedHasSelection;

      if (selection) {
        cells.push(this.renderItemSelectionCell(itemId, item, selected));
        calculatedHasSelection = true;
      }

      var calculatedHasActions;
      columns.forEach(function (column, columnIndex) {
        if (column.actions) {
          cells.push(_this5.renderItemActionsCell(itemId, item, column, columnIndex));
          calculatedHasActions = true;
        } else if (column.field) {
          var fieldDataColumn = column;
          cells.push(_this5.renderItemFieldDataCell(itemId, item, column, columnIndex, fieldDataColumn.field === rowHeader));
        } else {
          cells.push(_this5.renderItemComputedCell(itemId, item, column, columnIndex));
        }
      }); // Occupy full width of table, taking checkbox & mobile only columns into account.

      var expandedRowColSpan = selection ? columns.length + 1 : columns.length;
      var mobileOnlyCols = columns.reduce(function (num, column) {
        var _mobileOptions;

        return (column === null || column === void 0 ? void 0 : (_mobileOptions = column.mobileOptions) === null || _mobileOptions === void 0 ? void 0 : _mobileOptions.only) ? num + 1 : num + 0; // BWC only
      }, 0);
      expandedRowColSpan = expandedRowColSpan - mobileOnlyCols; // We'll use the ID to associate the expanded row with the original.

      var hasExpandedRow = itemIdToExpandedRowMap.hasOwnProperty(itemId);
      var expandedRowId = hasExpandedRow ? "row_".concat(itemId, "_expansion") : undefined;
      var expandedRow = hasExpandedRow ? (0, _react2.jsx)(_table.EuiTableRow, {
        id: expandedRowId,
        isExpandedRow: true,
        isSelectable: isSelectable
      }, (0, _react2.jsx)(_table.EuiTableRowCell, {
        colSpan: expandedRowColSpan,
        textOnly: false
      }, itemIdToExpandedRowMap[itemId])) : undefined;
      var rowPropsCallback = this.props.rowProps;
      var rowProps = getRowProps(item, rowPropsCallback);
      var row = (0, _react2.jsx)(_table.EuiTableRow, (0, _extends2.default)({
        "aria-owns": expandedRowId,
        isSelectable: isSelectable == null ? calculatedHasSelection : isSelectable,
        isSelected: selected,
        hasActions: hasActions == null ? calculatedHasActions : hasActions,
        isExpandable: isExpandable
      }, rowProps), cells);
      return (0, _react2.jsx)(_react.Fragment, {
        key: "row_".concat(itemId)
      }, row, expandedRow);
    }
  }, {
    key: "renderItemSelectionCell",
    value: function renderItemSelectionCell(itemId, item, selected) {
      var _this6 = this;

      var selection = this.props.selection;
      var key = "_selection_column_".concat(itemId);
      var checked = selected;
      var disabled = selection.selectable && !selection.selectable(item);
      var title = selection.selectableMessage && selection.selectableMessage(!disabled, item);

      var onChange = function onChange(event) {
        if (event.target.checked) {
          _this6.changeSelection([].concat((0, _toConsumableArray2.default)(_this6.state.selection), [item]));
        } else {
          var itemIdCallback = _this6.props.itemId;

          _this6.changeSelection(_this6.state.selection.reduce(function (selection, selectedItem) {
            if (getItemId(selectedItem, itemIdCallback) !== itemId) {
              selection.push(selectedItem);
            }

            return selection;
          }, []));
        }
      };

      return (0, _react2.jsx)(_table.EuiTableRowCellCheckbox, {
        key: key
      }, (0, _react2.jsx)(_i18n.EuiI18n, {
        token: "euiBasicTable.selectThisRow",
        default: "Select this row"
      }, function (selectThisRow) {
        return (0, _react2.jsx)(_form.EuiCheckbox, {
          id: "".concat(_this6.tableId).concat(key, "-checkbox"),
          type: "inList",
          disabled: disabled,
          checked: checked,
          onChange: onChange,
          title: title || selectThisRow,
          "aria-label": title || selectThisRow,
          "data-test-subj": "checkboxSelectRow-".concat(itemId)
        });
      }));
    }
  }, {
    key: "renderItemActionsCell",
    value: function renderItemActionsCell(itemId, item, column, columnIndex) {
      var _this7 = this;

      var actionEnabled = function actionEnabled(action) {
        return _this7.state.selection.length === 0 && (!action.enabled || action.enabled(item));
      };

      var actualActions = column.actions.filter(function (action) {
        return !action.available || action.available(item);
      });

      if (actualActions.length > 2) {
        // if any of the actions `isPrimary`, add them inline as well, but only the first 2
        var primaryActions = actualActions.filter(function (o) {
          return o.isPrimary;
        });
        actualActions = primaryActions.slice(0, 2); // if we have more than 1 action, we don't show them all in the cell, instead we
        // put them all in a popover tool. This effectively means we can only have a maximum
        // of one tool per row (it's either and normal action, or it's a popover that shows multiple actions)
        //
        // here we create a single custom action that triggers the popover with all the configured actions

        actualActions.push({
          name: 'All actions',
          render: function render(item) {
            return (0, _react2.jsx)(_collapsed_item_actions.CollapsedItemActions, {
              actions: column.actions,
              itemId: itemId,
              item: item,
              actionEnabled: actionEnabled
            });
          }
        });
      }

      var tools = (0, _react2.jsx)(_expanded_item_actions.ExpandedItemActions, {
        actions: actualActions,
        itemId: itemId,
        item: item,
        actionEnabled: actionEnabled
      });
      var key = "record_actions_".concat(itemId, "_").concat(columnIndex);
      return (0, _react2.jsx)(_table.EuiTableRowCell, {
        showOnHover: true,
        key: key,
        align: "right",
        textOnly: false,
        hasActions: true
      }, tools);
    }
  }, {
    key: "renderItemFieldDataCell",
    value: function renderItemFieldDataCell(itemId, item, column, columnIndex, setScopeRow) {
      var field = column.field,
          render = column.render,
          dataType = column.dataType;
      var key = "_data_column_".concat(field, "_").concat(itemId, "_").concat(columnIndex);
      var contentRenderer = render || this.getRendererForDataType(dataType);
      var value = (0, _objects.get)(item, field);
      var content = contentRenderer(value, item);
      return this.renderItemCell(item, column, key, content, setScopeRow);
    }
  }, {
    key: "renderItemComputedCell",
    value: function renderItemComputedCell(itemId, item, column, columnIndex) {
      var render = column.render;
      var key = "_computed_column_".concat(itemId, "_").concat(columnIndex);
      var contentRenderer = render || this.getRendererForDataType();
      var content = contentRenderer(item);
      return this.renderItemCell(item, column, key, content, false);
    }
  }, {
    key: "renderItemCell",
    value: function renderItemCell(item, column, key, content, setScopeRow) {
      var _ref8 = column,
          align = _ref8.align,
          render = _ref8.render,
          dataType = _ref8.dataType,
          isExpander = _ref8.isExpander,
          textOnly = _ref8.textOnly,
          name = _ref8.name,
          field = _ref8.field,
          description = _ref8.description,
          sortable = _ref8.sortable,
          footer = _ref8.footer,
          mobileOptions = _ref8.mobileOptions,
          rest = (0, _objectWithoutProperties2.default)(_ref8, ["align", "render", "dataType", "isExpander", "textOnly", "name", "field", "description", "sortable", "footer", "mobileOptions"]);
      var columnAlign = align || this.getAlignForDataType(dataType);
      var cellPropsCallback = this.props.cellProps;
      var cellProps = getCellProps(item, column, cellPropsCallback);
      return (0, _react2.jsx)(_table.EuiTableRowCell, (0, _extends2.default)({
        key: key,
        align: columnAlign,
        isExpander: isExpander,
        textOnly: textOnly || !render,
        setScopeRow: setScopeRow,
        mobileOptions: _objectSpread(_objectSpread({}, mobileOptions), {}, {
          render: mobileOptions && mobileOptions.render && mobileOptions.render(item),
          header: mobileOptions && mobileOptions.header === false ? false : name
        })
      }, cellProps, rest), content);
    }
  }, {
    key: "getRendererForDataType",
    value: function getRendererForDataType() {
      var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'auto';
      var profile = dataTypesProfiles[dataType];

      if (!profile) {
        throw new Error("Unknown dataType [".concat(dataType, "]. The supported data types are [").concat(DATA_TYPES.join(', '), "]"));
      }

      return profile.render;
    }
  }, {
    key: "getAlignForDataType",
    value: function getAlignForDataType() {
      var dataType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'auto';
      var profile = dataTypesProfiles[dataType];

      if (!profile) {
        throw new Error("Unknown dataType [".concat(dataType, "]. The supported data types are [").concat(DATA_TYPES.join(', '), "]"));
      }

      return profile.align;
    }
  }, {
    key: "renderPaginationBar",
    value: function renderPaginationBar() {
      var _this8 = this;

      var _this$props10 = this.props,
          error = _this$props10.error,
          pagination = _this$props10.pagination,
          tableCaption = _this$props10.tableCaption,
          onChange = _this$props10.onChange;

      if (!error && pagination && pagination.totalItemCount > 0) {
        if (!onChange) {
          throw new Error("The Basic Table is configured with pagination but [onChange] is\n        not configured. This callback must be implemented to handle pagination changes");
        }

        return (0, _react2.jsx)(_i18n.EuiI18n, {
          token: "euiBasicTable.tablePagination",
          default: "Pagination for table: {tableCaption}",
          values: {
            tableCaption: tableCaption
          }
        }, function (tablePagination) {
          return (0, _react2.jsx)(_pagination_bar.PaginationBar, {
            pagination: pagination,
            onPageSizeChange: _this8.onPageSizeChange.bind(_this8),
            onPageChange: _this8.onPageChange.bind(_this8),
            "aria-controls": _this8.tableId,
            "aria-label": tablePagination
          });
        });
      }
    }
  }]);
  return EuiBasicTable;
}(_react.Component);

exports.EuiBasicTable = EuiBasicTable;
(0, _defineProperty2.default)(EuiBasicTable, "defaultProps", {
  responsive: true,
  tableLayout: 'fixed',
  noItemsMessage: (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiBasicTable.noItemsMessage",
    default: "No items found"
  })
});