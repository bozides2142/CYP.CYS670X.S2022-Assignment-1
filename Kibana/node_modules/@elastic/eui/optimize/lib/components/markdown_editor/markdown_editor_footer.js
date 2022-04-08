"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiMarkdownEditorFooter = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _loading = require("../loading");

var _button = require("../button");

var _title = require("../title");

var _modal = require("../modal");

var _i18n = require("../i18n");

var _popover = require("../popover");

var _text = require("../text");

var _spacer = require("../spacer");

var _tool_tip = require("../tool_tip");

var _markdown_logo = _interopRequireDefault(require("./icons/markdown_logo"));

var _horizontal_rule = require("../horizontal_rule");

var _link = require("../link");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore a react svg
var EuiMarkdownEditorFooter = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var uiPlugins = props.uiPlugins,
      isUploadingFiles = props.isUploadingFiles,
      openFiles = props.openFiles,
      errors = props.errors,
      hasUnacceptedItems = props.hasUnacceptedItems,
      dropHandlers = props.dropHandlers;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isShowingHelpModal = _useState2[0],
      setIsShowingHelpModal = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isShowingHelpPopover = _useState4[0],
      setIsShowingHelpPopover = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      isPopoverOpen = _useState6[0],
      setIsPopoverOpen = _useState6[1];

  var onButtonClick = function onButtonClick() {
    return setIsPopoverOpen(function (isPopoverOpen) {
      return !isPopoverOpen;
    });
  };

  var closePopover = function closePopover() {
    return setIsPopoverOpen(false);
  };

  var uploadButton;
  var supportedFileTypes = (0, _react.useMemo)(function () {
    return dropHandlers.map(function (_ref) {
      var supportedFiles = _ref.supportedFiles;
      return supportedFiles.join(', ');
    }).sort().join(', ');
  }, [dropHandlers]);
  var ariaLabels = {
    uploadingFiles: (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.uploadingFiles', 'Click to upload files'),
    openUploadModal: (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.openUploadModal', 'Open upload files modal'),
    unsupportedFileType: (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.unsupportedFileType', 'File type not supported'),
    supportedFileTypes: (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.supportedFileTypes', 'Supported files: {supportedFileTypes}', {
      supportedFileTypes: supportedFileTypes
    }),
    showSyntaxErrors: (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.showSyntaxErrors', 'Show errors'),
    showMarkdownHelp: (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.showMarkdownHelp', 'Show markdown help')
  };
  var syntaxTitle = (0, _i18n.useEuiI18n)('euiMarkdownEditorFooter.syntaxTitle', 'Syntax help');

  if (isUploadingFiles) {
    uploadButton = (0, _react2.jsx)(_button.EuiButtonIcon, {
      size: "s",
      iconType: _loading.EuiLoadingSpinner,
      "aria-label": ariaLabels.uploadingFiles
    });
  } else if (dropHandlers.length > 0 && hasUnacceptedItems) {
    uploadButton = (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      content: ariaLabels.supportedFileTypes
    }, (0, _react2.jsx)(_button.EuiButtonEmpty, {
      className: "euiMarkdownEditorFooter__uploadError",
      autoFocus: true,
      size: "s",
      iconType: "paperClip",
      color: "danger",
      "aria-label": "".concat(ariaLabels.unsupportedFileType, ". ").concat(ariaLabels.supportedFileTypes, ". ").concat(ariaLabels.uploadingFiles),
      onClick: openFiles
    }, ariaLabels.unsupportedFileType));
  } else if (dropHandlers.length > 0) {
    uploadButton = (0, _react2.jsx)(_button.EuiButtonIcon, {
      size: "s",
      iconType: "paperClip",
      color: "text",
      "aria-label": ariaLabels.openUploadModal,
      onClick: openFiles
    });
  }

  var errorsButton;

  if (errors && errors.length) {
    errorsButton = (0, _react2.jsx)(_popover.EuiPopover, {
      button: (0, _react2.jsx)(_button.EuiButtonEmpty, {
        iconType: "crossInACircleFilled",
        size: "s",
        color: "danger",
        "aria-label": ariaLabels.showSyntaxErrors,
        onClick: onButtonClick
      }, errors.length),
      isOpen: isPopoverOpen,
      closePopover: closePopover,
      panelPaddingSize: "s",
      anchorPosition: "upCenter"
    }, (0, _react2.jsx)("div", {
      className: "euiMarkdownEditorFooter__popover"
    }, (0, _react2.jsx)(_popover.EuiPopoverTitle, null, (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiMarkdownEditorFooter.errorsTitle",
      default: "Errors"
    })), errors.map(function (message, idx) {
      return (0, _react2.jsx)(_text.EuiText, {
        size: "s",
        key: idx
      }, message.toString());
    })));
  }

  var uiPluginsWithHelpText = uiPlugins.filter(function (_ref2) {
    var helpText = _ref2.helpText;
    return !!helpText;
  });
  var hasUiPluginsWithHelpText = uiPluginsWithHelpText.length > 0;
  var mdSyntaxHref = 'https://guides.github.com/features/mastering-markdown/';
  var mdSyntaxLink = (0, _react2.jsx)(_link.EuiLink, {
    href: mdSyntaxHref,
    target: "_blank"
  }, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiMarkdownEditorFooter.mdSyntaxLink",
    default: "GitHub flavored markdown"
  }));
  var helpSyntaxButton;

  if (hasUiPluginsWithHelpText) {
    helpSyntaxButton = (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      content: syntaxTitle
    }, (0, _react2.jsx)(_button.EuiButtonIcon, {
      size: "s",
      className: "euiMarkdownEditorFooter__helpButton",
      iconType: _markdown_logo.default,
      color: "text",
      "aria-label": ariaLabels.showMarkdownHelp,
      onClick: function onClick() {
        return setIsShowingHelpModal(!isShowingHelpModal);
      }
    })), isShowingHelpModal && (0, _react2.jsx)(_modal.EuiModal, {
      onClose: function onClose() {
        return setIsShowingHelpModal(false);
      }
    }, (0, _react2.jsx)(_modal.EuiModalHeader, null, (0, _react2.jsx)(_title.EuiTitle, null, (0, _react2.jsx)("h1", null, syntaxTitle))), (0, _react2.jsx)(_modal.EuiModalBody, null, (0, _react2.jsx)(_text.EuiText, null, (0, _react2.jsx)(_i18n.EuiI18n, {
      tokens: ['euiMarkdownEditorFooter.syntaxModalDescriptionPrefix', 'euiMarkdownEditorFooter.syntaxModalDescriptionSuffix'],
      defaults: ['This editor uses', 'You can also utilize these additional syntax plugins to add rich content to your text.']
    }, function (_ref3) {
      var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
          syntaxModalDescriptionPrefix = _ref4[0],
          syntaxModalDescriptionSuffix = _ref4[1];

      return (0, _react2.jsx)("p", null, syntaxModalDescriptionPrefix, " ", mdSyntaxLink, ".", ' ', syntaxModalDescriptionSuffix);
    })), (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, null), uiPluginsWithHelpText.map(function (_ref5) {
      var name = _ref5.name,
          helpText = _ref5.helpText;
      return (0, _react2.jsx)(_react.Fragment, {
        key: name
      }, (0, _react2.jsx)(_title.EuiTitle, {
        size: "xxs"
      }, (0, _react2.jsx)("p", null, (0, _react2.jsx)("strong", null, name))), (0, _react2.jsx)(_spacer.EuiSpacer, {
        size: "s"
      }), helpText, (0, _react2.jsx)(_spacer.EuiSpacer, {
        size: "l"
      }));
    }), (0, _react2.jsx)(_horizontal_rule.EuiHorizontalRule, null)), (0, _react2.jsx)(_modal.EuiModalFooter, null, (0, _react2.jsx)(_button.EuiButton, {
      onClick: function onClick() {
        return setIsShowingHelpModal(false);
      },
      fill: true
    }, (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiMarkdownEditorFooter.closeButton",
      default: "Close"
    })))));
  } else {
    helpSyntaxButton = (0, _react2.jsx)(_popover.EuiPopover, {
      button: (0, _react2.jsx)(_button.EuiButtonIcon, {
        title: syntaxTitle,
        size: "s",
        className: "euiMarkdownEditorFooter__helpButton",
        iconType: _markdown_logo.default,
        color: "text",
        "aria-label": ariaLabels.showMarkdownHelp,
        onClick: function onClick() {
          return setIsShowingHelpPopover(!isShowingHelpPopover);
        }
      }),
      isOpen: isShowingHelpPopover,
      closePopover: function closePopover() {
        return setIsShowingHelpPopover(false);
      },
      panelPaddingSize: "s",
      anchorPosition: "upCenter"
    }, (0, _react2.jsx)(_i18n.EuiI18n, {
      tokens: ['euiMarkdownEditorFooter.syntaxPopoverDescription'],
      defaults: ['This editor uses']
    }, function (_ref6) {
      var _ref7 = (0, _slicedToArray2.default)(_ref6, 1),
          syntaxPopoverDescription = _ref7[0];

      return (0, _react2.jsx)("p", null, syntaxPopoverDescription, " ", mdSyntaxLink, ".");
    }));
  }

  return (0, _react2.jsx)("div", {
    ref: ref,
    className: "euiMarkdownEditorFooter"
  }, (0, _react2.jsx)("div", {
    className: "euiMarkdownEditorFooter__actions"
  }, uploadButton, errorsButton), helpSyntaxButton);
});
exports.EuiMarkdownEditorFooter = EuiMarkdownEditorFooter;
EuiMarkdownEditorFooter.displayName = 'EuiMarkdownEditorFooter';