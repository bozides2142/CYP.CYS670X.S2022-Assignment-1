"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMonitoringTelemetryCollection = registerMonitoringTelemetryCollection;

var _get_all_stats = require("./get_all_stats");

var _get_cluster_uuids = require("./get_cluster_uuids");

var _get_licenses = require("./get_licenses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerMonitoringTelemetryCollection(usageCollection, getClient, maxBucketSize) {
  const monitoringStatsCollector = usageCollection.makeStatsCollector({
    type: 'monitoringTelemetry',
    isReady: () => true,
    extendFetchContext: {
      kibanaRequest: true
    },
    schema: {
      stats: {
        type: 'array',
        items: {
          timestamp: {
            type: 'date'
          },
          cluster_uuid: {
            type: 'keyword'
          },
          cluster_name: {
            type: 'keyword'
          },
          version: {
            type: 'keyword'
          },
          cluster_stats: {},
          stack_stats: {
            logstash: {
              versions: {
                type: 'array',
                items: {
                  version: {
                    type: 'keyword'
                  },
                  count: {
                    type: 'long'
                  }
                }
              },
              count: {
                type: 'long'
              },
              cluster_stats: {
                collection_types: {
                  DYNAMIC_KEY: {
                    type: 'long'
                  }
                },
                queues: {
                  DYNAMIC_KEY: {
                    type: 'long'
                  }
                },
                plugins: {
                  type: 'array',
                  items: {
                    name: {
                      type: 'keyword'
                    },
                    count: {
                      type: 'long'
                    }
                  }
                },
                pipelines: {
                  count: {
                    type: 'long'
                  },
                  batch_size_max: {
                    type: 'long'
                  },
                  batch_size_avg: {
                    type: 'long'
                  },
                  batch_size_min: {
                    type: 'long'
                  },
                  batch_size_total: {
                    type: 'long'
                  },
                  workers_max: {
                    type: 'long'
                  },
                  workers_avg: {
                    type: 'long'
                  },
                  workers_min: {
                    type: 'long'
                  },
                  workers_total: {
                    type: 'long'
                  },
                  sources: {
                    DYNAMIC_KEY: {
                      type: 'boolean'
                    }
                  }
                }
              }
            },
            beats: {
              versions: {
                DYNAMIC_KEY: {
                  type: 'long'
                }
              },
              types: {
                DYNAMIC_KEY: {
                  type: 'long'
                }
              },
              outputs: {
                DYNAMIC_KEY: {
                  type: 'long'
                }
              },
              queue: {
                DYNAMIC_KEY: {
                  type: 'long'
                }
              },
              count: {
                type: 'long'
              },
              eventsPublished: {
                type: 'long'
              },
              hosts: {
                type: 'long'
              },
              input: {
                count: {
                  type: 'long'
                },
                names: {
                  type: 'array',
                  items: {
                    type: 'keyword'
                  }
                }
              },
              module: {
                count: {
                  type: 'long'
                },
                names: {
                  type: 'array',
                  items: {
                    type: 'keyword'
                  }
                }
              },
              architecture: {
                count: {
                  type: 'long'
                },
                architectures: {
                  type: 'array',
                  items: {
                    name: {
                      type: 'keyword'
                    },
                    architecture: {
                      type: 'keyword'
                    },
                    count: {
                      type: 'long'
                    }
                  }
                }
              },
              heartbeat: {
                monitors: {
                  type: 'long'
                },
                endpoints: {
                  type: 'long'
                },
                DYNAMIC_KEY: {
                  monitors: {
                    type: 'long'
                  },
                  endpoints: {
                    type: 'long'
                  }
                }
              },
              functionbeat: {
                functions: {
                  count: {
                    type: 'long'
                  }
                }
              }
            }
          },
          collection: {
            type: 'keyword'
          },
          collectionSource: {
            type: 'keyword'
          }
        }
      }
    },
    fetch: async ({
      kibanaRequest,
      esClient
    }) => {
      const timestamp = Date.now(); // Collect the telemetry from the monitoring indices for this moment.
      // NOTE: Usually, the monitoring indices index stats for each product every 10s (by default).
      // However, some data may be delayed up-to 24h because monitoring only collects extended Kibana stats in that interval
      // to avoid overloading of the system when retrieving data from the collectors (that delay is dealt with in the Kibana Stats getter inside the `getAllStats` method).
      // By 8.x, we expect to stop collecting the Kibana extended stats and keep only the monitoring-related metrics.

      const callCluster = kibanaRequest ? esClient : getClient().asInternalUser;
      const clusterDetails = await (0, _get_cluster_uuids.getClusterUuids)(callCluster, timestamp, maxBucketSize);
      const [licenses, stats] = await Promise.all([(0, _get_licenses.getLicenses)(clusterDetails, callCluster, timestamp, maxBucketSize), (0, _get_all_stats.getAllStats)(clusterDetails, callCluster, timestamp, maxBucketSize)]);
      return {
        stats: stats.map(stat => {
          const license = licenses[stat.cluster_uuid];
          return { ...(license ? {
              license
            } : {}),
            ...stat,
            collectionSource: 'monitoring'
          };
        })
      };
    }
  });
  usageCollection.registerCollector(monitoringStatsCollector);
}