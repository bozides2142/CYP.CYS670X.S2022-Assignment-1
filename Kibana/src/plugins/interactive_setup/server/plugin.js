"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InteractiveSetupPlugin = void 0;

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _chalk = _interopRequireDefault(require("chalk"));

var _utils = require("@kbn/utils");

var _common = require("../common");

var _elasticsearch_service = require("./elasticsearch_service");

var _kibana_config_writer = require("./kibana_config_writer");

var _routes = require("./routes");

var _verification_service = require("./verification_service");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

// List of the Elasticsearch hosts Kibana uses by default.
const DEFAULT_ELASTICSEARCH_HOSTS = ['http://localhost:9200', // It's a default host we use in the official Kibana Docker image (see `kibana_yml.template.ts`).
...(process.env.ELASTIC_CONTAINER ? ['http://elasticsearch:9200'] : [])];

var _logger = /*#__PURE__*/new WeakMap();

var _elasticsearch = /*#__PURE__*/new WeakMap();

var _verification = /*#__PURE__*/new WeakMap();

var _elasticsearchConnectionStatusSubscription = /*#__PURE__*/new WeakMap();

var _configSubscription = /*#__PURE__*/new WeakMap();

var _config = /*#__PURE__*/new WeakMap();

var _getConfig = /*#__PURE__*/new WeakMap();

class InteractiveSetupPlugin {
  constructor(initializerContext) {
    _classPrivateFieldInitSpec(this, _logger, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _elasticsearch, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _verification, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _elasticsearchConnectionStatusSubscription, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _configSubscription, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _config, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _getConfig, {
      writable: true,
      value: () => {
        if (!(0, _classPrivateFieldGet2.default)(this, _config)) {
          throw new Error('Config is not available.');
        }

        return (0, _classPrivateFieldGet2.default)(this, _config);
      }
    });

    this.initializerContext = initializerContext;
    (0, _classPrivateFieldSet2.default)(this, _logger, this.initializerContext.logger.get());
    (0, _classPrivateFieldSet2.default)(this, _elasticsearch, new _elasticsearch_service.ElasticsearchService(this.initializerContext.logger.get('elasticsearch'), initializerContext.env.packageInfo.version));
    (0, _classPrivateFieldSet2.default)(this, _verification, new _verification_service.VerificationService(this.initializerContext.logger.get('verification')));
  }

  setup(core) {
    var _this$initializerCont;

    (0, _classPrivateFieldSet2.default)(this, _configSubscription, this.initializerContext.config.create().subscribe(config => {
      (0, _classPrivateFieldSet2.default)(this, _config, config);
    })); // We shouldn't activate interactive setup mode if we detect that user has already configured
    // Elasticsearch connection manually: either if Kibana system user credentials are specified or
    // user specified non-default host for the Elasticsearch.

    const shouldActiveSetupMode = !core.elasticsearch.config.credentialsSpecified && core.elasticsearch.config.hosts.length === 1 && DEFAULT_ELASTICSEARCH_HOSTS.includes(core.elasticsearch.config.hosts[0]);

    if (!shouldActiveSetupMode) {
      const reason = core.elasticsearch.config.credentialsSpecified ? 'Kibana system user credentials are specified' : core.elasticsearch.config.hosts.length > 1 ? 'more than one Elasticsearch host is specified' : 'non-default Elasticsearch host is used';
      (0, _classPrivateFieldGet2.default)(this, _logger).debug(`Interactive setup mode will not be activated since Elasticsearch connection is already configured: ${reason}.`);
      return;
    }

    const verificationCode = (0, _classPrivateFieldGet2.default)(this, _verification).setup();

    if (!verificationCode) {
      (0, _classPrivateFieldGet2.default)(this, _logger).error('Interactive setup mode could not be activated. Ensure Kibana has permission to write to its config folder.');
      return;
    }

    let completeSetup;
    core.preboot.holdSetupUntilResolved('Validating Elasticsearch connection configuration…', new Promise(resolve => {
      completeSetup = resolve;
    })); // If preliminary checks above indicate that user didn't alter default Elasticsearch connection
    // details, it doesn't mean Elasticsearch connection isn't configured. There is a chance that
    // user has already disabled security features in Elasticsearch and everything should work by
    // default. We should check if we can connect to Elasticsearch with default configuration to
    // know if we need to activate interactive setup. This check can take some time, so we should
    // register our routes to let interactive setup UI to handle user requests until the check is
    // complete. Moreover Elasticsearch may be just temporarily unavailable and we should poll its
    // status until we can connect or use configures connection via interactive setup mode.

    const elasticsearch = (0, _classPrivateFieldGet2.default)(this, _elasticsearch).setup({
      elasticsearch: core.elasticsearch,
      connectionCheckInterval: (0, _classPrivateFieldGet2.default)(this, _getConfig).call(this).connectionCheck.interval
    });
    (0, _classPrivateFieldSet2.default)(this, _elasticsearchConnectionStatusSubscription, elasticsearch.connectionStatus$.subscribe(status => {
      if (status === _common.ElasticsearchConnectionStatus.Configured) {
        (0, _classPrivateFieldGet2.default)(this, _logger).debug('Skipping interactive setup mode since Kibana is already properly configured to connect to Elasticsearch at http://localhost:9200.');
        completeSetup({
          shouldReloadConfig: false
        });
      } else {
        (0, _classPrivateFieldGet2.default)(this, _logger).debug('Starting interactive setup mode since Kibana cannot to connect to Elasticsearch at http://localhost:9200.');
        const pathname = core.http.basePath.prepend('/');
        const {
          protocol,
          hostname,
          port
        } = core.http.getServerInfo();
        const url = `${protocol}://${hostname}:${port}${pathname}?code=${verificationCode.code}`; // eslint-disable-next-line no-console

        console.log(`

${_chalk.default.whiteBright.bold(`${_chalk.default.cyanBright('i')} Kibana has not been configured.`)}

Go to ${_chalk.default.cyanBright.underline(url)} to get started.

`);
      }
    })); // If possible, try to use `*.dev.yml` config when Kibana is run in development mode.

    const configPath = this.initializerContext.env.mode.dev ? (_this$initializerCont = this.initializerContext.env.configs.find(config => config.endsWith('.dev.yml'))) !== null && _this$initializerCont !== void 0 ? _this$initializerCont : this.initializerContext.env.configs[0] : this.initializerContext.env.configs[0];
    core.http.registerRoutes('', router => {
      (0, _routes.defineRoutes)({
        router,
        basePath: core.http.basePath,
        logger: (0, _classPrivateFieldGet2.default)(this, _logger).get('routes'),
        preboot: { ...core.preboot,
          completeSetup
        },
        kibanaConfigWriter: new _kibana_config_writer.KibanaConfigWriter(configPath, (0, _utils.getDataPath)(), (0, _classPrivateFieldGet2.default)(this, _logger).get('kibana-config')),
        elasticsearch,
        verificationCode,
        getConfig: (0, _classPrivateFieldGet2.default)(this, _getConfig).bind(this)
      });
    });
  }

  stop() {
    (0, _classPrivateFieldGet2.default)(this, _logger).debug('Stopping plugin');

    if ((0, _classPrivateFieldGet2.default)(this, _configSubscription)) {
      (0, _classPrivateFieldGet2.default)(this, _configSubscription).unsubscribe();
      (0, _classPrivateFieldSet2.default)(this, _configSubscription, undefined);
    }

    if ((0, _classPrivateFieldGet2.default)(this, _elasticsearchConnectionStatusSubscription)) {
      (0, _classPrivateFieldGet2.default)(this, _elasticsearchConnectionStatusSubscription).unsubscribe();
      (0, _classPrivateFieldSet2.default)(this, _elasticsearchConnectionStatusSubscription, undefined);
    }

    (0, _classPrivateFieldGet2.default)(this, _elasticsearch).stop();
    (0, _classPrivateFieldGet2.default)(this, _verification).stop();
  }

}

exports.InteractiveSetupPlugin = InteractiveSetupPlugin;