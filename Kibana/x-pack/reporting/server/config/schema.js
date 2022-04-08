"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _ipaddr = _interopRequireDefault(require("ipaddr.js"));

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const KibanaServerSchema = _configSchema.schema.object({
  hostname: _configSchema.schema.maybe(_configSchema.schema.string({
    hostname: true,

    validate(value) {
      if (_ipaddr.default.isValid(value) && !(0, _lodash.sum)(_ipaddr.default.parse(value).toByteArray())) {
        // prevent setting a hostname that fails in Chromium on Windows
        return `cannot use '0.0.0.0' as Kibana host name, consider using the default (localhost) instead`;
      }
    }

  })),
  port: _configSchema.schema.maybe(_configSchema.schema.number()),
  protocol: _configSchema.schema.maybe(_configSchema.schema.string({
    validate(value) {
      if (!/^https?$/.test(value)) {
        return 'must be "http" or "https"';
      }
    }

  }))
}); // default values are all dynamic in createConfig$


const QueueSchema = _configSchema.schema.object({
  indexInterval: _configSchema.schema.string({
    defaultValue: 'week'
  }),
  pollEnabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  pollInterval: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
    defaultValue: _moment.default.duration({
      seconds: 3
    })
  }),
  pollIntervalErrorMultiplier: _configSchema.schema.number({
    defaultValue: 10
  }),
  timeout: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
    defaultValue: _moment.default.duration({
      minutes: 2
    })
  })
});

const CaptureSchema = _configSchema.schema.object({
  timeouts: _configSchema.schema.object({
    openUrl: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
      defaultValue: _moment.default.duration({
        minutes: 1
      })
    }),
    waitForElements: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
      defaultValue: _moment.default.duration({
        seconds: 30
      })
    }),
    renderComplete: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
      defaultValue: _moment.default.duration({
        seconds: 30
      })
    })
  }),
  zoom: _configSchema.schema.number({
    defaultValue: 2
  }),
  loadDelay: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
    defaultValue: _moment.default.duration({
      seconds: 3
    })
  }),
  maxAttempts: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), true, _configSchema.schema.number({
    defaultValue: 3
  }), _configSchema.schema.number({
    defaultValue: 1
  }))
});

const CsvSchema = _configSchema.schema.object({
  checkForFormulas: _configSchema.schema.boolean({
    defaultValue: true
  }),
  escapeFormulaValues: _configSchema.schema.boolean({
    defaultValue: false
  }),
  enablePanelActionDownload: _configSchema.schema.boolean({
    defaultValue: true
  }),
  maxSizeBytes: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.byteSize()], {
    defaultValue: _configSchema.ByteSizeValue.parse('10mb')
  }),
  useByteOrderMarkEncoding: _configSchema.schema.boolean({
    defaultValue: false
  }),
  scroll: _configSchema.schema.object({
    duration: _configSchema.schema.string({
      defaultValue: '30s',

      // this value is passed directly to ES, so string only format is preferred
      validate(value) {
        if (!/^[0-9]+(d|h|m|s|ms|micros|nanos)$/.test(value)) {
          return 'must be a duration string';
        }
      }

    }),
    size: _configSchema.schema.number({
      defaultValue: 500
    })
  })
});

const EncryptionKeySchema = _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), true, _configSchema.schema.maybe(_configSchema.schema.string()), // default value is dynamic in createConfig$
_configSchema.schema.string({
  defaultValue: 'a'.repeat(32)
}));

const RolesSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  // true: use ES API for access control (deprecated in 7.x). false: use Kibana API for application features (8.0)
  allow: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: ['reporting_user']
  })
}); // Browser side polling: job completion notifier, management table auto-refresh
// NOTE: can not use schema.duration, a bug prevents it being passed to the browser correctly


const PollSchema = _configSchema.schema.object({
  jobCompletionNotifier: _configSchema.schema.object({
    interval: _configSchema.schema.number({
      defaultValue: 10000
    }),
    intervalErrorMultiplier: _configSchema.schema.number({
      defaultValue: 5
    }) // deprecated as unused since 7.10

  }),
  jobsRefresh: _configSchema.schema.object({
    interval: _configSchema.schema.number({
      defaultValue: 5000
    }),
    intervalErrorMultiplier: _configSchema.schema.number({
      defaultValue: 5
    }) // deprecated as unused since 7.10

  })
});

const ConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  kibanaServer: KibanaServerSchema,
  queue: QueueSchema,
  capture: CaptureSchema,
  csv: CsvSchema,
  encryptionKey: EncryptionKeySchema,
  roles: RolesSchema,
  poll: PollSchema
});

exports.ConfigSchema = ConfigSchema;