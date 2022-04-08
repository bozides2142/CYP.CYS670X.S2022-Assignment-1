"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esdocs = esdocs;

var _services = require("../../../public/services");

var _constants = require("../../../common/lib/constants");

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

function esdocs() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().esdocs;
  return {
    name: 'esdocs',
    type: 'datatable',
    context: {
      types: ['filter']
    },
    help,
    args: {
      query: {
        types: ['string'],
        aliases: ['_', 'q'],
        help: argHelp.query,
        default: '-_index:.kibana'
      },
      count: {
        types: ['number'],
        default: 1000,
        help: argHelp.count
      },
      fields: {
        help: argHelp.fields,
        types: ['string']
      },
      index: {
        types: ['string'],
        default: '_all',
        help: argHelp.index
      },
      // TODO: This arg isn't being used in the function.
      // We need to restore this functionality or remove it as an arg.
      metaFields: {
        help: argHelp.metaFields,
        types: ['string']
      },
      sort: {
        types: ['string'],
        help: argHelp.sort
      }
    },
    fn: async (input, args, handlers) => {
      const {
        count,
        index,
        fields,
        sort
      } = args;
      input.and = input.and.concat([{
        type: 'filter',
        filterType: 'luceneQueryString',
        query: args.query,
        and: []
      }]); // Load ad-hoc to avoid adding to the page load bundle size

      const squel = await Promise.resolve().then(() => _interopRequireWildcard(require('safe-squel')));
      let query = squel.select({
        autoQuoteTableNames: true,
        autoQuoteFieldNames: true,
        autoQuoteAliasNames: true,
        nameQuoteCharacter: '"'
      });

      if (index) {
        query.from(index);
      }

      if (fields) {
        const allFields = fields.split(',').map(field => field.trim());
        allFields.forEach(field => query = query.field(field));
      }

      if (sort) {
        const [sortField, sortOrder] = sort.split(',').map(str => str.trim());

        if (sortField) {
          query.order(`"${sortField}"`, sortOrder === 'asc');
        }
      }

      const search = _services.searchService.getService().search;

      const req = {
        count,
        query: query.toString(),
        filter: input.and
      }; // We're requesting the data using the ESSQL strategy because
      // the SQL routes return type information with the result set

      return search.search(req, {
        strategy: _constants.ESSQL_SEARCH_STRATEGY
      }).toPromise().then(resp => {
        return {
          type: 'datatable',
          meta: {
            type: 'essql'
          },
          ...resp
        };
      });
    }
  };
}