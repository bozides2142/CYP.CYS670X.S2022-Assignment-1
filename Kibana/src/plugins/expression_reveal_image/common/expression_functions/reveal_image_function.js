"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revealImageFunction = exports.errors = void 0;

var _i18n = require("@kbn/i18n");

var _lib = require("../../../presentation_util/common/lib");

var _types = require("../../common/types");

var _constants = require("../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const strings = {
  help: _i18n.i18n.translate('expressionRevealImage.functions.revealImageHelpText', {
    defaultMessage: 'Configures an image reveal element.'
  }),
  args: {
    image: _i18n.i18n.translate('expressionRevealImage.functions.revealImage.args.imageHelpText', {
      defaultMessage: 'The image to reveal. Provide an image asset as a {BASE64} data {URL}, ' + 'or pass in a sub-expression.',
      values: {
        BASE64: _constants.BASE64,
        URL: _constants.URL
      }
    }),
    emptyImage: _i18n.i18n.translate('expressionRevealImage.functions.revealImage.args.emptyImageHelpText', {
      defaultMessage: 'An optional background image to reveal over. ' + 'Provide an image asset as a `{BASE64}` data {URL}, or pass in a sub-expression.',
      values: {
        BASE64: _constants.BASE64,
        URL: _constants.URL
      }
    }),
    origin: _i18n.i18n.translate('expressionRevealImage.functions.revealImage.args.originHelpText', {
      defaultMessage: 'The position to start the image fill. For example, {list}, or {end}.',
      values: {
        list: Object.values(_types.Position).slice(0, -1).map(position => `\`"${position}"\``).join(', '),
        end: Object.values(_types.Position).slice(-1)[0]
      }
    })
  }
};
const errors = {
  invalidPercent: percent => new Error(_i18n.i18n.translate('expressionRevealImage.functions.revealImage.invalidPercentErrorMessage', {
    defaultMessage: "Invalid value: '{percent}'. Percentage must be between 0 and 1",
    values: {
      percent
    }
  })),
  invalidImageUrl: imageUrl => new Error(_i18n.i18n.translate('expressionRevealImage.functions.revealImage.invalidImageUrl', {
    defaultMessage: "Invalid image url: '{imageUrl}'.",
    values: {
      imageUrl
    }
  }))
};
exports.errors = errors;

const revealImageFunction = () => {
  const {
    help,
    args: argHelp
  } = strings;
  return {
    name: 'revealImage',
    aliases: [],
    type: 'render',
    inputTypes: ['number'],
    help,
    args: {
      image: {
        types: ['string', 'null'],
        help: argHelp.image,
        default: null
      },
      emptyImage: {
        types: ['string', 'null'],
        help: argHelp.emptyImage,
        default: null
      },
      origin: {
        types: ['string'],
        help: argHelp.origin,
        default: 'bottom',
        options: Object.values(_types.Origin)
      }
    },
    fn: async (percent, args) => {
      if (percent > 1 || percent < 0) {
        throw errors.invalidPercent(percent);
      }

      if (args.image && !(0, _lib.isValidUrl)(args.image)) {
        throw errors.invalidImageUrl(args.image);
      }

      const {
        elasticOutline
      } = await (0, _lib.getElasticOutline)();
      return {
        type: 'render',
        as: 'revealImage',
        value: {
          percent,
          ...args,
          image: (0, _lib.resolveWithMissingImage)(args.image, elasticOutline),
          emptyImage: (0, _lib.resolveWithMissingImage)(args.emptyImage)
        }
      };
    }
  };
};

exports.revealImageFunction = revealImageFunction;