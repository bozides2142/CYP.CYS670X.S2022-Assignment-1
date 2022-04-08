"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentStream = void 0;
exports.getContentStream = getContentStream;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _stream = require("stream");

var _lodash = require("lodash");

var _puid = _interopRequireDefault(require("puid"));

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @note The Elasticsearch `http.max_content_length` is including the whole POST body.
 * But the update/index request also contains JSON-serialized query parameters.
 * 1Kb span should be enough for that.
 */


const REQUEST_SPAN_SIZE_IN_BYTES = 1024;

class ContentStream extends _stream.Duplex {
  /**
   * @see https://en.wikipedia.org/wiki/Base64#Output_padding
   */
  static getMaxBase64EncodedSize(max) {
    return Math.floor(max / 4) * 3;
  }
  /**
   * @note Raw data might be escaped during JSON serialization.
   * In the worst-case, every character is escaped, so the max raw data length is twice less.
   */


  static getMaxJsonEscapedSize(max) {
    return Math.floor(max / 2);
  }

  constructor(client, logger, document, {
    encoding = 'base64'
  } = {}) {
    super();
    (0, _defineProperty2.default)(this, "buffers", []);
    (0, _defineProperty2.default)(this, "bytesBuffered", 0);
    (0, _defineProperty2.default)(this, "bytesRead", 0);
    (0, _defineProperty2.default)(this, "chunksRead", 0);
    (0, _defineProperty2.default)(this, "chunksWritten", 0);
    (0, _defineProperty2.default)(this, "jobSize", void 0);
    (0, _defineProperty2.default)(this, "maxChunkSize", void 0);
    (0, _defineProperty2.default)(this, "parameters", void 0);
    (0, _defineProperty2.default)(this, "puid", new _puid.default());
    (0, _defineProperty2.default)(this, "primaryTerm", void 0);
    (0, _defineProperty2.default)(this, "seqNo", void 0);
    (0, _defineProperty2.default)(this, "bytesWritten", 0);
    this.client = client;
    this.logger = logger;
    this.document = document;
    this.parameters = {
      encoding
    };
  }

  decode(content) {
    return Buffer.from(content, this.parameters.encoding === 'base64' ? 'base64' : undefined);
  }

  encode(buffer) {
    return buffer.toString(this.parameters.encoding === 'base64' ? 'base64' : undefined);
  }

  async getMaxContentSize() {
    const {
      body
    } = await this.client.cluster.getSettings({
      include_defaults: true
    });
    const {
      persistent,
      transient,
      defaults: defaultSettings
    } = body;
    const settings = (0, _lodash.defaults)({}, persistent, transient, defaultSettings);
    const maxContentSize = (0, _lodash.get)(settings, 'http.max_content_length', '100mb');
    return _configSchema.ByteSizeValue.parse(maxContentSize).getValueInBytes();
  }

  async getMaxChunkSize() {
    if (!this.maxChunkSize) {
      const maxContentSize = (await this.getMaxContentSize()) - REQUEST_SPAN_SIZE_IN_BYTES;
      this.maxChunkSize = this.parameters.encoding === 'base64' ? ContentStream.getMaxBase64EncodedSize(maxContentSize) : ContentStream.getMaxJsonEscapedSize(maxContentSize);
      this.logger.debug(`Chunk size is ${this.maxChunkSize} bytes.`);
    }

    return this.maxChunkSize;
  }

  async readHead() {
    var _response$body$hits, _response$body$hits$h, _hits$_source, _hits$_source$output, _hits$_source2, _hits$_source2$output;

    const {
      id,
      index
    } = this.document;
    const body = {
      _source: {
        includes: ['output.content', 'output.size', 'jobtype']
      },
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [{
                term: {
                  _id: id
                }
              }]
            }
          }
        }
      },
      size: 1
    };
    this.logger.debug(`Reading report contents.`);
    const response = await this.client.search({
      body,
      index
    });
    const hits = response === null || response === void 0 ? void 0 : (_response$body$hits = response.body.hits) === null || _response$body$hits === void 0 ? void 0 : (_response$body$hits$h = _response$body$hits.hits) === null || _response$body$hits$h === void 0 ? void 0 : _response$body$hits$h[0];
    this.jobSize = hits === null || hits === void 0 ? void 0 : (_hits$_source = hits._source) === null || _hits$_source === void 0 ? void 0 : (_hits$_source$output = _hits$_source.output) === null || _hits$_source$output === void 0 ? void 0 : _hits$_source$output.size;
    return hits === null || hits === void 0 ? void 0 : (_hits$_source2 = hits._source) === null || _hits$_source2 === void 0 ? void 0 : (_hits$_source2$output = _hits$_source2.output) === null || _hits$_source2$output === void 0 ? void 0 : _hits$_source2$output.content;
  }

  async readChunk() {
    var _response$body$hits2, _response$body$hits2$, _hits$_source3;

    const {
      id,
      index
    } = this.document;
    const body = {
      _source: {
        includes: ['output.content']
      },
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [{
                term: {
                  parent_id: id
                }
              }, {
                term: {
                  'output.chunk': this.chunksRead
                }
              }]
            }
          }
        }
      },
      size: 1
    };
    this.logger.debug(`Reading chunk #${this.chunksRead}.`);
    const response = await this.client.search({
      body,
      index
    });
    const hits = response === null || response === void 0 ? void 0 : (_response$body$hits2 = response.body.hits) === null || _response$body$hits2 === void 0 ? void 0 : (_response$body$hits2$ = _response$body$hits2.hits) === null || _response$body$hits2$ === void 0 ? void 0 : _response$body$hits2$[0];
    return hits === null || hits === void 0 ? void 0 : (_hits$_source3 = hits._source) === null || _hits$_source3 === void 0 ? void 0 : _hits$_source3.output.content;
  }

  isRead() {
    return this.jobSize != null && this.bytesRead >= this.jobSize;
  }

  _read() {
    (this.chunksRead ? this.readChunk() : this.readHead()).then(content => {
      if (!content) {
        this.logger.debug(`Chunk is empty.`);
        this.push(null);
        return;
      }

      const buffer = this.decode(content);
      this.push(buffer);
      this.chunksRead++;
      this.bytesRead += buffer.byteLength;

      if (this.isRead()) {
        this.logger.debug(`Read ${this.bytesRead} of ${this.jobSize} bytes.`);
        this.push(null);
      }
    }).catch(err => this.destroy(err));
  }

  async removeChunks() {
    const {
      id,
      index
    } = this.document;
    await this.client.deleteByQuery({
      index,
      body: {
        query: {
          match: {
            parent_id: id
          }
        }
      }
    });
  }

  async writeHead(content) {
    this.logger.debug(`Updating report contents.`);
    const {
      body
    } = await this.client.update({ ...this.document,
      body: {
        doc: {
          output: {
            content
          }
        }
      }
    });
    ({
      _primary_term: this.primaryTerm,
      _seq_no: this.seqNo
    } = body);
  }

  async writeChunk(content) {
    const {
      id: parentId,
      index
    } = this.document;
    const id = this.puid.generate();
    this.logger.debug(`Writing chunk #${this.chunksWritten} (${id}).`);
    await this.client.index({
      id,
      index,
      body: {
        parent_id: parentId,
        output: {
          content,
          chunk: this.chunksWritten
        }
      }
    });
  }

  async flush(size = this.bytesBuffered) {
    const buffersToFlush = [];
    let bytesToFlush = 0;
    /*
     Loop over each buffer, keeping track of how many bytes we have added
     to the array of buffers to be flushed. The array of buffers to be flushed
     contains buffers by reference, not copies. This avoids putting pressure on
     the CPU for copying buffers or for gc activity. Please profile performance
     with a large byte configuration and a large number of records (900k+)
     before changing this code. Config used at time of writing:
       xpack.reporting:
        csv.maxSizeBytes: 500000000
        csv.scroll.size: 1000
      At the moment this can put memory pressure on Kibana. Up to 1,1 GB in a dev
     build. It is not recommended to have overly large max size bytes but we
     need this code to be as performant as possible.
    */

    while (this.buffers.length) {
      const remainder = size - bytesToFlush;

      if (remainder <= 0) {
        break;
      }

      const buffer = this.buffers.shift();
      const chunkedBuffer = buffer.slice(0, remainder);
      buffersToFlush.push(chunkedBuffer);
      bytesToFlush += chunkedBuffer.byteLength;

      if (buffer.byteLength > remainder) {
        this.buffers.unshift(buffer.slice(remainder));
      }
    } // We call Buffer.concat with the fewest number of buffers possible


    const chunk = Buffer.concat(buffersToFlush);
    const content = this.encode(chunk);

    if (!this.chunksWritten) {
      await this.removeChunks();
      await this.writeHead(content);
    } else if (chunk.byteLength) {
      await this.writeChunk(content);
    }

    if (chunk.byteLength) {
      this.chunksWritten++;
    }

    this.bytesWritten += chunk.byteLength;
    this.bytesBuffered -= bytesToFlush;
  }

  async flushAllFullChunks() {
    const maxChunkSize = await this.getMaxChunkSize();

    while (this.bytesBuffered >= maxChunkSize && this.buffers.length) {
      await this.flush(maxChunkSize);
    }
  }

  _write(chunk, encoding, callback) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.bytesBuffered += buffer.byteLength;
    this.buffers.push(buffer);
    this.flushAllFullChunks().then(() => callback()).catch(callback);
  }

  _final(callback) {
    this.flush().then(() => callback()).catch(callback);
  }

  getSeqNo() {
    return this.seqNo;
  }

  getPrimaryTerm() {
    return this.primaryTerm;
  }

}

exports.ContentStream = ContentStream;

async function getContentStream(reporting, document, parameters) {
  const {
    asInternalUser: client
  } = await reporting.getEsClient();
  const {
    logger
  } = reporting.getPluginSetupDeps();
  return new ContentStream(client, logger.clone(['content_stream', document.id]), document, parameters);
}