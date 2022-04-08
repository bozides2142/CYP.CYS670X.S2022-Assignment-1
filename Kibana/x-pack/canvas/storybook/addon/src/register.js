"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _addons = require("@storybook/addons");

var _components = require("@storybook/components");

var _coreEvents = require("@storybook/core-events");

var _theming = require("@storybook/theming");

var _addonActions = require("@storybook/addon-actions");

var _constants = require("./constants");

var _panel = require("./panel");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


_addons.addons.register(_constants.ADDON_ID, api => {
  const channel = _addons.addons.getChannel();

  api.on(_coreEvents.STORY_CHANGED, storyId => {
    channel.emit(_constants.EVENTS.RESET, storyId);
  });

  _addons.addons.add(_constants.ACTIONS_PANEL_ID, {
    title: 'Redux Actions',
    type: _addons.types.PANEL,
    render: ({
      active,
      key
    }) => {
      return /*#__PURE__*/_react.default.createElement(_components.AddonPanel, {
        active: !!active,
        key: key
      }, /*#__PURE__*/_react.default.createElement(_panel.Panel, null));
    }
  });
});

_addons.addons.setConfig({
  theme: (0, _theming.create)({
    base: 'light',
    brandTitle: 'Canvas Storybook',
    brandUrl: 'https://github.com/elastic/kibana/tree/main/x-pack/plugins/canvas'
  }),
  showPanel: true,
  isFullscreen: false,
  panelPosition: 'bottom',
  isToolshown: true,
  selectedPanel: _addonActions.PANEL_ID
});