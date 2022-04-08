"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.share = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _app = require("../components/app");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// All data attributes start with this prefix.


const PREFIX = 'kbn-canvas'; // The identifying data attribute for all shareable workpads.

const SHAREABLE = `${PREFIX}-shareable`; // Valid option attributes, preceded by `PREFIX` in markup.

const VALID_ATTRIBUTES = ['url', 'page', 'height', 'width', 'autoplay', 'interval', 'toolbar']; // Collect and then remove valid data attributes.

const getAttributes = (element, attributes) => {
  const result = {};
  attributes.forEach(attribute => {
    const key = `${PREFIX}-${attribute}`;
    const value = element.getAttribute(key);

    if (value) {
      result[attribute] = value;
      element.removeAttribute(key);
    }
  });
  return result;
};

const getWorkpad = async url => {
  const workpadResponse = await fetch(url);

  if (workpadResponse.ok) {
    return await workpadResponse.json();
  }

  return null;
};

const updateArea = async area => {
  const {
    url,
    page: pageAttr,
    height: heightAttr,
    width: widthAttr,
    autoplay,
    interval,
    toolbar
  } = getAttributes(area, VALID_ATTRIBUTES);

  if (url) {
    const workpad = await getWorkpad(url);

    if (workpad) {
      const page = pageAttr ? parseInt(pageAttr, 10) : null;
      let height = heightAttr ? parseInt(heightAttr, 10) : null;
      let width = widthAttr ? parseInt(widthAttr, 10) : null;

      if (height && !width) {
        // If we have a height but no width, the width should honor the workpad ratio.
        width = Math.round(workpad.width * (height / workpad.height));
      } else if (width && !height) {
        // If we have a width but no height, the height should honor the workpad ratio.
        height = Math.round(workpad.height * (width / workpad.width));
      }

      const stage = {
        height: height || workpad.height,
        width: width || workpad.width,
        page: page !== null ? page : workpad.page
      };
      const settings = {
        autoplay: {
          isEnabled: !!autoplay,
          interval: interval || '5s'
        },
        toolbar: {
          isAutohide: !!toolbar
        }
      };
      area.classList.add('kbnCanvas');
      area.removeAttribute(SHAREABLE);
      (0, _reactDom.render)([/*#__PURE__*/_react.default.createElement("style", {
        key: "style"
      }, `html body .kbnCanvas { height: ${stage.height}px; width: ${stage.width}px; }`), /*#__PURE__*/_react.default.createElement(_app.App, {
        key: "app",
        workpad: workpad,
        stage,
        settings
      })], area);
    }
  }
};
/**
 * This function processes all elements that have a valid share data attribute and
 * attempts to place the designated workpad within them.
 */


const share = () => {
  const shareAreas = document.querySelectorAll(`[${SHAREABLE}]`);
  const validAreas = Array.from(shareAreas).filter(area => area.getAttribute(SHAREABLE) === 'canvas');
  validAreas.forEach(updateArea);
};

exports.share = share;