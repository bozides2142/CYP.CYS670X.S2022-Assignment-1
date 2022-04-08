"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageUpload = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _lodash = require("lodash");

var _asset_picker = require("../../../../public/components/asset_picker");

var _public = require("../../../../../../../src/plugins/presentation_util/public");

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _constants = require("../../../../common/lib/constants");

var _i18n = require("../../../../i18n");

var _forms = require("./forms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  ImageUpload: strings
} = _i18n.ArgumentStrings;

class ImageUpload extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "updateAST", assetId => {
      this.props.onValueChange({
        type: 'expression',
        chain: [{
          type: 'function',
          function: 'asset',
          arguments: {
            _: [assetId]
          }
        }]
      });
    });
    (0, _defineProperty2.default)(this, "handleUpload", files => {
      const {
        onAssetAdd
      } = this.props;
      const [file] = files;
      const [type, subtype] = (0, _lodash.get)(file, 'type', '').split('/');

      if (type === 'image' && _constants.VALID_IMAGE_TYPES.indexOf(subtype) >= 0) {
        this.setState({
          loading: true
        }); // start loading indicator

        (0, _public.encode)(file).then(dataurl => onAssetAdd('dataurl', dataurl)).then(assetId => {
          this.updateAST(assetId); // this component can go away when onValueChange is called, check for _isMounted

          this._isMounted && this.setState({
            loading: false
          }); // set loading state back to false
        });
      }
    });
    (0, _defineProperty2.default)(this, "changeUrlType", optionId => {
      this.setState({
        urlType: optionId
      });
    });
    (0, _defineProperty2.default)(this, "setSrcUrl", () => {
      const {
        value: srcUrl
      } = this.inputRefs.srcUrlText;
      this.setState({
        url: srcUrl
      });
      const {
        onValueChange
      } = this.props;
      onValueChange(srcUrl);
    });
    const url = props.resolvedArgValue || props.argValue || null;
    let urlType = Object.keys(props.assets).length ? 'asset' : 'file'; // if not a valid base64 string, will show as missing asset icon

    if ((0, _public.isValidHttpUrl)(url)) {
      urlType = 'link';
    }

    this.inputRefs = {};
    this.state = {
      loading: false,
      url,
      // what to show in preview / paste url text input
      urlType // what panel to show, fileupload or paste url

    };
  }

  componentDidMount() {
    // keep track of whether or not the component is mounted, to prevent rogue setState calls
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      loading,
      url,
      urlType
    } = this.state;
    const assets = Object.values(this.props.assets);
    let selectedAsset = {};
    const urlTypeOptions = [{
      id: 'file',
      label: strings.getFileUrlType()
    }, {
      id: 'link',
      label: strings.getLinkUrlType()
    }];

    if (assets.length) {
      urlTypeOptions.unshift({
        id: 'asset',
        label: strings.getAssetUrlType()
      });
      selectedAsset = assets.find(({
        value
      }) => value === url) || {};
    }

    const selectUrlType = /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
      display: "rowCompressed"
    }, /*#__PURE__*/_react.default.createElement(_eui.EuiButtonGroup, {
      buttonSize: "compressed",
      options: urlTypeOptions,
      idSelected: urlType,
      onChange: this.changeUrlType,
      isFullWidth: true,
      className: "canvasSidebar__buttonGroup",
      legend: strings.getUrlTypeChangeLegend()
    }));

    const forms = {
      file: /*#__PURE__*/_react.default.createElement(_forms.FileForm, {
        loading: loading,
        onChange: this.handleUpload
      }),
      link: /*#__PURE__*/_react.default.createElement(_forms.LinkForm, {
        url: selectedAsset.id ? '' : url,
        inputRef: ref => this.inputRefs.srcUrlText = ref,
        onSubmit: this.setSrcUrl
      }),
      asset: /*#__PURE__*/_react.default.createElement(_asset_picker.AssetPicker, {
        assets: assets,
        selected: selectedAsset.id,
        onChange: ({
          id
        }) => this.updateAST(id)
      })
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "canvasSidebar__panel-noMinWidth",
      style: {
        position: 'relative'
      }
    }, selectUrlType, /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
      size: "s"
    }), forms[urlType], /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
      size: "s"
    }));
  }

}

(0, _defineProperty2.default)(ImageUpload, "propTypes", {
  onAssetAdd: _propTypes.default.func.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired,
  resolvedArgValue: _propTypes.default.string,
  argValue: _propTypes.default.string,
  assets: _propTypes.default.object.isRequired
});

const imageUpload = () => {
  return {
    name: 'imageUpload',
    displayName: strings.getDisplayName(),
    help: strings.getHelp(),
    resolveArgValue: true,
    template: (0, _template_from_react_component.templateFromReactComponent)(ImageUpload),
    resolve: async ({
      args
    }) => {
      const {
        elasticOutline
      } = await (0, _public.getElasticOutline)();
      return {
        dataurl: (0, _public.resolveFromArgs)(args, elasticOutline)
      };
    }
  };
};

exports.imageUpload = imageUpload;