"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.essql = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _monaco = require("@kbn/monaco");

var _eui = require("@elastic/eui");

var _public = require("../../../../../../src/plugins/kibana_react/public");

var _arg_helpers = require("../../../public/lib/arg_helpers");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _i18n = require("../../../i18n");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Essql: strings
} = _i18n.DataSourceStrings;

class EssqlDatasource extends _react.PureComponent {
  constructor(..._args) {
    super(..._args);
    (0, _defineProperty2.default)(this, "defaultQuery", `SELECT * FROM "${this.props.defaultIndex}"`);
    (0, _defineProperty2.default)(this, "getQuery", () => (0, _arg_helpers.getSimpleArg)(this.getArgName(), this.props.args)[0]);
    (0, _defineProperty2.default)(this, "getArgName", () => {
      const {
        args
      } = this.props;

      if ((0, _arg_helpers.getSimpleArg)('_', args)[0]) {
        return '_';
      }

      if ((0, _arg_helpers.getSimpleArg)('q', args)[0]) {
        return 'q';
      }

      return 'query';
    });
    (0, _defineProperty2.default)(this, "setArg", (name, value) => {
      const {
        args,
        updateArgs
      } = this.props;
      updateArgs && updateArgs({ ...args,
        ...(0, _arg_helpers.setSimpleArg)(name, value)
      });
    });
    (0, _defineProperty2.default)(this, "onChange", value => {
      this.props.setInvalid(!value.trim());
      this.setArg(this.getArgName(), value);
    });
    (0, _defineProperty2.default)(this, "editorDidMount", editor => {
      const model = editor.getModel();
      model === null || model === void 0 ? void 0 : model.updateOptions({
        tabSize: 2
      });
    });
  }

  componentDidMount() {
    const query = this.getQuery();

    if (typeof query !== 'string') {
      this.setArg(this.getArgName(), this.defaultQuery);
    } else {
      this.props.setInvalid(!query.trim());
    }
  }

  render() {
    const {
      isInvalid
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
      isInvalid: isInvalid,
      label: strings.getLabel(),
      labelAppend: /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
        size: "xs"
      }, /*#__PURE__*/_react.default.createElement(_eui.EuiLink, {
        href: _i18n.SQL_URL,
        target: "_blank"
      }, strings.getLabelAppend()))
    }, /*#__PURE__*/_react.default.createElement(_public.CodeEditorField, {
      languageId: _monaco.EsqlLang.ID,
      value: this.getQuery(),
      onChange: this.onChange,
      className: "canvasTextArea__code",
      options: {
        fontSize: 14,
        scrollBeyondLastLine: false,
        quickSuggestions: true,
        minimap: {
          enabled: false
        },
        wordWrap: 'on',
        wrappingIndent: 'indent',
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false
      },
      height: "350px",
      editorDidMount: this.editorDidMount
    }));
  }

}

EssqlDatasource.propTypes = {
  args: _propTypes.default.object.isRequired,
  updateArgs: _propTypes.default.func,
  isInvalid: _propTypes.default.bool,
  setInvalid: _propTypes.default.func,
  defaultIndex: _propTypes.default.string
};

const essql = () => ({
  name: 'essql',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  image: 'database',
  template: (0, _template_from_react_component.templateFromReactComponent)(EssqlDatasource)
});

exports.essql = essql;