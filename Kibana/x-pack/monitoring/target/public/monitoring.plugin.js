/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){function t(t){for(var n,i,r=t[0],s=t[1],o=0,c=[];o<r.length;o++)i=r[o],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&c.push(a[i][0]),a[i]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(l&&l(t);c.length;)c.shift()()}var n={},a={1:0};function i(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.e=function(e){var t=[],n=a[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise((function(t,i){n=a[e]=[t,i]}));t.push(n[2]=r);var s,o=document.createElement("script");o.charset="utf-8",o.timeout=120,i.nc&&o.setAttribute("nonce",i.nc),o.src=function(e){return i.p+"monitoring.chunk."+e+".js"}(e);var l=new Error;s=function(t){o.onerror=o.onload=null,clearTimeout(c);var n=a[e];if(0!==n){if(n){var i=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+i+": "+r+")",l.name="ChunkLoadError",l.type=i,l.request=r,n[1](l)}a[e]=void 0}};var c=setTimeout((function(){s({type:"timeout",target:o})}),12e4);o.onerror=o.onload=s,document.head.appendChild(o)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var r=window.monitoring_bundle_jsonpfunction=window.monitoring_bundle_jsonpfunction||[],s=r.push.bind(r);r.push=t,r=r.slice();for(var o=0;o<r.length;o++)t(r[o]);var l=s;i(i.s=12)}([function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t,n){"use strict";n.d(t,"Y",(function(){return r})),n.d(t,"r",(function(){return s})),n.d(t,"e",(function(){return o})),n.d(t,"f",(function(){return l})),n.d(t,"s",(function(){return c})),n.d(t,"t",(function(){return u})),n.d(t,"u",(function(){return d})),n.d(t,"c",(function(){return p})),n.d(t,"d",(function(){return g})),n.d(t,"F",(function(){return m})),n.d(t,"D",(function(){return f})),n.d(t,"p",(function(){return h})),n.d(t,"o",(function(){return b})),n.d(t,"X",(function(){return _})),n.d(t,"x",(function(){return x})),n.d(t,"y",(function(){return k})),n.d(t,"v",(function(){return v})),n.d(t,"w",(function(){return y})),n.d(t,"q",(function(){return M})),n.d(t,"z",(function(){return D})),n.d(t,"g",(function(){return C})),n.d(t,"l",(function(){return P})),n.d(t,"j",(function(){return j})),n.d(t,"i",(function(){return w})),n.d(t,"n",(function(){return A})),n.d(t,"h",(function(){return O})),n.d(t,"m",(function(){return E})),n.d(t,"k",(function(){return S})),n.d(t,"A",(function(){return U})),n.d(t,"b",(function(){return R})),n.d(t,"a",(function(){return N})),n.d(t,"E",(function(){return T})),n.d(t,"O",(function(){return L})),n.d(t,"H",(function(){return z})),n.d(t,"I",(function(){return I})),n.d(t,"K",(function(){return B})),n.d(t,"S",(function(){return q})),n.d(t,"L",(function(){return J})),n.d(t,"M",(function(){return K})),n.d(t,"P",(function(){return F})),n.d(t,"Q",(function(){return V})),n.d(t,"R",(function(){return $})),n.d(t,"V",(function(){return G})),n.d(t,"W",(function(){return H})),n.d(t,"G",(function(){return Q})),n.d(t,"N",(function(){return W})),n.d(t,"C",(function(){return Y})),n.d(t,"J",(function(){return Z})),n.d(t,"T",(function(){return X})),n.d(t,"B",(function(){return ee})),n.d(t,"U",(function(){return te})),n.d(t,"Z",(function(){return ne}));var a=n(0),i=n(4);const r="xpack.monitoring.data",s="asc",o="#d2d2d2",l="#9c9c9c",c="M [months] d [days]",u=" d [days] h [hrs] m [min]",d=" s [seconds]",p="since",g="until",m=["trial","platinum","enterprise"],f={MAJOR_VER_REQD_FOR_PIPELINES:6,QUEUE_TYPES:{MEMORY:"memory",PERSISTED:"persisted"}},h=17,b=10,_="__standalone_cluster__",x=".monitoring-kibana-*",k=".monitoring-logstash-*",v=".monitoring-beats-*",y=".monitoring-es-*",M="elasticsearch",D="internal-stack-monitoring",C="all",P="kibana",j="elasticsearch",w="beats",A="logstash",O="apm",E="license",S="enterprise_search",U="kibana",R="beats",N="apm",T="logstash",L="monitoring_alert_license_expiration",z="monitoring_alert_cluster_health",I="monitoring_alert_cpu_usage",B="monitoring_alert_disk_usage",q="monitoring_alert_nodes_changed",J="monitoring_alert_elasticsearch_version_mismatch",K="monitoring_alert_kibana_version_mismatch",F="monitoring_alert_logstash_version_mismatch",V="monitoring_alert_jvm_memory_usage",$="monitoring_alert_missing_monitoring_data",G="monitoring_alert_thread_pool_search_rejections",H="monitoring_alert_thread_pool_write_rejections",Q="monitoring_ccr_read_exceptions",W="monitoring_shard_size",Y={[z]:{label:a.i18n.translate("xpack.monitoring.alerts.clusterHealth.label",{defaultMessage:"Cluster health"}),description:a.i18n.translate("xpack.monitoring.alerts.clusterHealth.description",{defaultMessage:"Alert when the health of the cluster changes."})},[J]:{label:a.i18n.translate("xpack.monitoring.alerts.elasticsearchVersionMismatch.label",{defaultMessage:"Elasticsearch version mismatch"}),description:a.i18n.translate("xpack.monitoring.alerts.elasticsearchVersionMismatch.description",{defaultMessage:"Alert when the cluster has multiple versions of Elasticsearch."})},[K]:{label:a.i18n.translate("xpack.monitoring.alerts.kibanaVersionMismatch.label",{defaultMessage:"Kibana version mismatch"}),description:a.i18n.translate("xpack.monitoring.alerts.kibanaVersionMismatch.description",{defaultMessage:"Alert when the cluser has multiple versions of Kibana."})},[L]:{label:a.i18n.translate("xpack.monitoring.alerts.licenseExpiration.label",{defaultMessage:"License expiration"}),description:a.i18n.translate("xpack.monitoring.alerts.licenseExpiration.description",{defaultMessage:"Alert when the cluster license is about to expire."})},[F]:{label:a.i18n.translate("xpack.monitoring.alerts.logstashVersionMismatch.label",{defaultMessage:"Logstash version mismatch"}),description:a.i18n.translate("xpack.monitoring.alerts.logstashVersionMismatch.description",{defaultMessage:"Alert when the cluster has multiple versions of Logstash."})},[q]:{label:a.i18n.translate("xpack.monitoring.alerts.nodesChanged.label",{defaultMessage:"Nodes changed"}),description:a.i18n.translate("xpack.monitoring.alerts.nodesChanged.description",{defaultMessage:"Alert when adding, removing, or restarting a node."})}},Z={[I]:{label:a.i18n.translate("xpack.monitoring.alerts.cpuUsage.label",{defaultMessage:"CPU Usage"}),description:a.i18n.translate("xpack.monitoring.alerts.cpuUsage.description",{defaultMessage:"Alert when the CPU load for a node is consistently high."}),paramDetails:{threshold:{label:a.i18n.translate("xpack.monitoring.alerts.cpuUsage.paramDetails.threshold.label",{defaultMessage:"Notify when CPU is over"}),type:i.b.Percentage},duration:{label:a.i18n.translate("xpack.monitoring.alerts.cpuUsage.paramDetails.duration.label",{defaultMessage:"Look at the average over"}),type:i.b.Duration}}},[B]:{paramDetails:{threshold:{label:a.i18n.translate("xpack.monitoring.alerts.diskUsage.paramDetails.threshold.label",{defaultMessage:"Notify when disk capacity is over"}),type:i.b.Percentage},duration:{label:a.i18n.translate("xpack.monitoring.alerts.diskUsage.paramDetails.duration.label",{defaultMessage:"Look at the average over"}),type:i.b.Duration}},label:a.i18n.translate("xpack.monitoring.alerts.diskUsage.label",{defaultMessage:"Disk Usage"}),description:a.i18n.translate("xpack.monitoring.alerts.diskUsage.description",{defaultMessage:"Alert when the disk usage for a node is consistently high."})},[V]:{paramDetails:{threshold:{label:a.i18n.translate("xpack.monitoring.alerts.memoryUsage.paramDetails.threshold.label",{defaultMessage:"Notify when memory usage is over"}),type:i.b.Percentage},duration:{label:a.i18n.translate("xpack.monitoring.alerts.memoryUsage.paramDetails.duration.label",{defaultMessage:"Look at the average over"}),type:i.b.Duration}},label:a.i18n.translate("xpack.monitoring.alerts.memoryUsage.label",{defaultMessage:"Memory Usage (JVM)"}),description:a.i18n.translate("xpack.monitoring.alerts.memoryUsage.description",{defaultMessage:"Alert when a node reports high memory usage."})},[$]:{paramDetails:{duration:{label:a.i18n.translate("xpack.monitoring.alerts.missingData.paramDetails.duration.label",{defaultMessage:"Notify if monitoring data is missing for the last"}),type:i.b.Duration},limit:{label:a.i18n.translate("xpack.monitoring.alerts.missingData.paramDetails.limit.label",{defaultMessage:"looking back"}),type:i.b.Duration}},label:a.i18n.translate("xpack.monitoring.alerts.missingData.label",{defaultMessage:"Missing monitoring data"}),description:a.i18n.translate("xpack.monitoring.alerts.missingData.description",{defaultMessage:"Alert when monitoring data is missing."})},[G]:{paramDetails:{threshold:{label:a.i18n.translate("xpack.monitoring.alerts.rejection.paramDetails.threshold.label",{defaultMessage:"Notify when {type} rejection count is over",values:{type:"search"}}),type:i.b.Number},duration:{label:a.i18n.translate("xpack.monitoring.alerts.rejection.paramDetails.duration.label",{defaultMessage:"In the last"}),type:i.b.Duration}},label:a.i18n.translate("xpack.monitoring.alerts.threadPoolRejections.label",{defaultMessage:"Thread pool {type} rejections",values:{type:"search"}}),description:a.i18n.translate("xpack.monitoring.alerts.searchThreadPoolRejections.description",{defaultMessage:"Alert when the number of rejections in the search thread pool exceeds the threshold."})},[H]:{paramDetails:{threshold:{label:a.i18n.translate("xpack.monitoring.alerts.rejection.paramDetails.threshold.label",{defaultMessage:"Notify when {type} rejection count is over",values:{type:"write"}}),type:i.b.Number},duration:{label:a.i18n.translate("xpack.monitoring.alerts.rejection.paramDetails.duration.label",{defaultMessage:"In the last"}),type:i.b.Duration}},label:a.i18n.translate("xpack.monitoring.alerts.threadPoolRejections.label",{defaultMessage:"Thread pool {type} rejections",values:{type:"write"}}),description:a.i18n.translate("xpack.monitoring.alerts.writeThreadPoolRejections.description",{defaultMessage:"Alert when the number of rejections in the write thread pool exceeds the threshold."})},[Q]:{paramDetails:{duration:{label:a.i18n.translate("xpack.monitoring.alerts.ccrReadExceptions.paramDetails.duration.label",{defaultMessage:"In the last"}),type:i.b.Duration}},label:a.i18n.translate("xpack.monitoring.alerts.ccrReadExceptions.label",{defaultMessage:"CCR read exceptions"}),description:a.i18n.translate("xpack.monitoring.alerts.ccrReadExceptions.description",{defaultMessage:"Alert if any CCR read exceptions have been detected."})},[W]:{paramDetails:{threshold:{label:a.i18n.translate("xpack.monitoring.alerts.shardSize.paramDetails.threshold.label",{defaultMessage:"Notify when average shard size exceeds this value"}),type:i.b.Number,append:"GB"},indexPattern:{label:a.i18n.translate("xpack.monitoring.alerts.shardSize.paramDetails.indexPattern.label",{defaultMessage:"Check the following index patterns"}),placeholder:"eg: data-*, *prod-data, -.internal-data*",type:i.b.TextField}},label:a.i18n.translate("xpack.monitoring.alerts.shardSize.label",{defaultMessage:"Shard size"}),description:a.i18n.translate("xpack.monitoring.alerts.shardSize.description",{defaultMessage:"Alert if the average shard size is larger than the configured threshold."})}},X=[{label:a.i18n.translate("xpack.monitoring.alerts.badge.panelCategory.clusterHealth",{defaultMessage:"Cluster health"}),rules:[{ruleName:q},{ruleName:z},{ruleName:J},{ruleName:K},{ruleName:F}]},{label:a.i18n.translate("xpack.monitoring.alerts.badge.panelCategory.resourceUtilization",{defaultMessage:"Resource utilization"}),rules:[{ruleName:I},{ruleName:B},{ruleName:V},{ruleName:W}]},{label:a.i18n.translate("xpack.monitoring.alerts.badge.panelCategory.errors",{defaultMessage:"Errors and exceptions"}),rules:[{ruleName:$},{ruleName:L},{ruleName:G},{ruleName:H},{ruleName:Q}]}],ee=[L,z,q,J,K,F],te=!1,ne="btnclick__"},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t,n){e.exports=n(9)(3)},function(e,t,n){"use strict";let a,i,r,s,o;n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return s})),n.d(t,"d",(function(){return o})),function(e){e.Green="green",e.Red="red",e.Yellow="yellow"}(a||(a={})),function(e){e.Success="success",e.Danger="danger",e.Warning="warning"}(i||(i={})),function(e){e.Time="time",e.Link="link",e.DocLink="docLink"}(r||(r={})),function(e){e.TextField="textfield",e.Duration="duration",e.Percentage="percentage",e.Number="number"}(s||(s={})),function(e){e.MetricbeatMigration="metricbeatMigration",e.Alerts="alerts"}(o||(o={}))},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t,n){"use strict";n.d(t,"a",(function(){return Legacy}));var a=n(8),i=n.n(a);class Legacy{static init({core:e,data:t,isCloud:n,triggersActionsUi:a,usageCollection:i,appMountParameters:r}){this._shims={toastNotifications:e.notifications.toasts,capabilities:e.application.capabilities,getBasePath:()=>e.http.basePath.get(),getInjected:(t,n)=>e.injectedMetadata.getInjectedVar(t,n),breadcrumbs:{set:e=>this._shims.breadcrumbs.update(e),update:t=>{var n,a;if(!t){var i;const n=null===(i=e.chrome.getBreadcrumbs$())||void 0===i?void 0:i.source;t=null==n?void 0:n.value}const r=location.hash.split("?")[1];null!==(n=t)&&void 0!==n&&n.length&&0===(null==r?void 0:r.indexOf("_g"))&&(null===(a=t[0].href)||void 0===a?void 0:a.split("?")[1])!==r&&(t.forEach((e=>{var t;const n=null===(t=e.href)||void 0===t?void 0:t.split("?")[0];n&&!e.ignoreGlobalState&&(e.href=`${n}?${r}`),delete e.ignoreGlobalState})),e.chrome.setBreadcrumbs(t.slice(0)))}},I18nContext:e.i18n.Context,docLinks:e.docLinks,docTitle:e.chrome.docTitle,timefilter:t.query.timefilter.timefilter,actionTypeRegistry:null==a?void 0:a.actionTypeRegistry,ruleTypeRegistry:null==a?void 0:a.ruleTypeRegistry,uiSettings:e.uiSettings,http:e.http,kfetch:async({pathname:t,...n},a)=>await e.http.fetch(t,{prependBasePath:null==a?void 0:a.prependBasePath,...n}),isCloud:n,triggersActionsUi:a,usageCollection:i,kibanaServices:{...e,usageCollection:i},appMountParameters:r}}static get shims(){if(!Legacy._shims)throw new Error("Legacy needs to be initiated with Legacy.init(...) before use");return Legacy._shims}static isInitializated(){return Boolean(Legacy._shims)}}i()(Legacy,"_shims",void 0)},function(e,t,n){e.exports=n(9)(2)},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n.r(t);var a=__kbnBundles__.get("entry/core/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/home/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n(13),__kbnBundles__.define("plugin/monitoring/public",n,14)},function(e,t,n){n.p=window.__kbnPublicPath__.monitoring},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return M}));var a=n(0),i=n(10),r=n(11),s=n(1),o=n(3),l=n.n(o),c=n(5),u=n.n(c);const d=u.a.lazy((()=>Promise.all([n.e(0),n.e(3)]).then(n.bind(null,145))));var p=n(2);const g=e=>{const t={errors:{}},n={duration:[]};return e.duration||n.duration.push(a.i18n.translate("xpack.monitoring.alerts.validation.duration",{defaultMessage:"A valid duration is required."})),t.errors=n,t};function m(e){const t={errors:{}},n={duration:[],threshold:[]};return e.duration||n.duration.push(a.i18n.translate("xpack.monitoring.alerts.validation.duration",{defaultMessage:"A valid duration is required."})),isNaN(e.threshold)&&n.threshold.push(a.i18n.translate("xpack.monitoring.alerts.validation.threshold",{defaultMessage:"A valid number is required."})),t.errors=n,t}const f=e=>{const t={errors:{}},n={indexPattern:[]};return e.indexPattern||n.indexPattern.push(a.i18n.translate("xpack.monitoring.alerts.validation.indexPattern",{defaultMessage:"A valid index pattern/s is required."})),t.errors=n,t};const h=u.a.lazy((()=>Promise.all([n.e(0),n.e(5)]).then(n.bind(null,142))));const b=u.a.lazy((()=>n.e(4).then(n.bind(null,143))));function _(e){const t={errors:{}},n={duration:[],limit:[]};return e.duration||n.duration.push(a.i18n.translate("xpack.monitoring.alerts.missingData.validation.duration",{defaultMessage:"A valid duration is required."})),e.limit||n.limit.push(a.i18n.translate("xpack.monitoring.alerts.missingData.validation.limit",{defaultMessage:"A valid limit is required."})),t.errors=n,t}var x=n(6);function k(e,t,n){return{id:e,description:t.description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaThreadpoolRejections}`,ruleParamsExpression:e=>Object(p.jsx)(u.a.Fragment,null,Object(p.jsx)(x.EuiSpacer,null),Object(p.jsx)(d,l()({},e,{config:n,paramDetails:t.paramDetails}))),validate:e=>{const t={};if(e.threshold<0){const e=a.i18n.translate("xpack.monitoring.alerts.validation.lessThanZero",{defaultMessage:"This value can not be less than zero"});t.threshold=[e]}if(!e.duration){const e=a.i18n.translate("xpack.monitoring.alerts.validation.duration",{defaultMessage:"A valid duration is required."});t.duration=[e]}return{errors:t}},defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}}let v={};var y=n(7);class plugin_MonitoringPlugin{constructor(e){this.initializerContext=e}setup(e,t){const{home:s}=t,o="monitoring",l="monitoringApp",c=a.i18n.translate("xpack.monitoring.stackMonitoringTitle",{defaultMessage:"Stack Monitoring"}),u=this.initializerContext.config.get();if(!u.ui.enabled)return!1;s&&s.featureCatalogue.register({id:o,title:a.i18n.translate("xpack.monitoring.featureCatalogueTitle",{defaultMessage:"Monitor the stack"}),icon:l,path:"/app/monitoring",showOnHomePage:!0,category:r.FeatureCatalogueCategory.ADMIN,description:a.i18n.translate("xpack.monitoring.featureCatalogueDescription",{defaultMessage:"Track the real-time health and performance of your deployment."}),order:610}),this.registerAlerts(t,u);const d={id:o,title:c,order:9030,euiIconType:l,category:i.DEFAULT_APP_CATEGORIES.management,mount:async a=>{var i;const[r,s]=await e.getStartServices(),o=this.getExternalConfig(),l={navigation:s.navigation,element:a.element,core:r,data:s.data,isCloud:Boolean(null===(i=t.cloud)||void 0===i?void 0:i.isCloudEnabled),pluginInitializerContext:this.initializerContext,externalConfig:o,triggersActionsUi:s.triggersActionsUi,usageCollection:t.usageCollection,appMountParameters:a};y.a.init({core:l.core,element:l.element,data:l.data,navigation:l.navigation,isCloud:l.isCloud,pluginInitializerContext:l.pluginInitializerContext,externalConfig:l.externalConfig,triggersActionsUi:l.triggersActionsUi,usageCollection:l.usageCollection,appMountParameters:l.appMountParameters});const c=Object.fromEntries(o);(e=>{v=e})(c);const{renderApp:u}=await n.e(2).then(n.bind(null,144));return u(r,s,a,c)}};e.application.register(d)}start(e,t){}stop(){}getExternalConfig(){const e=this.initializerContext.config.get();return[["minIntervalSeconds",e.ui.min_interval_seconds],["showLicenseExpiration",e.ui.show_license_expiration],["showCgroupMetricsElasticsearch",e.ui.container.elasticsearch.enabled],["showCgroupMetricsLogstash",e.ui.container.logstash.enabled]]}registerAlerts(e,t){const{triggersActionsUi:{ruleTypeRegistry:n}}=e;n.register(function(e){return{id:s.I,description:s.J[s.I].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaCpuThreshold}`,ruleParamsExpression:t=>Object(p.jsx)(d,l()({},t,{config:e,paramDetails:s.J[s.I].paramDetails})),validate:m,defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}}(t)),n.register(function(e){return{id:s.K,description:s.J[s.K].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaDiskThreshold}`,ruleParamsExpression:t=>Object(p.jsx)(d,l()({},t,{config:e,paramDetails:s.J[s.K].paramDetails})),validate:m,defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}}(t)),n.register(function(e){return{id:s.Q,description:s.J[s.Q].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaJvmThreshold}`,ruleParamsExpression:t=>Object(p.jsx)(d,l()({},t,{config:e,paramDetails:s.J[s.Q].paramDetails})),validate:m,defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}}(t)),n.register({id:s.R,description:s.J[s.R].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaMissingData}`,ruleParamsExpression:e=>Object(p.jsx)(b,l()({},e,{paramDetails:s.J[s.R].paramDetails})),validate:_,defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}),n.register(k(s.V,s.J[s.V],t)),n.register(k(s.W,s.J[s.W],t)),n.register(function(e){return{id:s.G,description:s.J[s.G].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaCCRReadExceptions}`,ruleParamsExpression:t=>Object(p.jsx)(d,l()({},t,{config:e,paramDetails:s.J[s.G].paramDetails})),validate:g,defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}}(t)),n.register(function(e){return{id:s.N,description:s.J[s.N].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaLargeShardSize}`,ruleParamsExpression:t=>Object(p.jsx)(d,l()({},t,{config:e,paramDetails:s.J[s.N].paramDetails})),validate:f,defaultActionMessage:"{{context.internalFullMessage}}",requiresAppContext:s.U}}(t));const a=function(e){return s.B.map((t=>({id:t,description:s.C[t].description,iconClass:"bell",documentationUrl:e=>`${e.links.monitoring.alertsKibanaClusterAlerts}`,ruleParamsExpression:t=>Object(p.jsx)(h,l()({},t,{config:e})),defaultActionMessage:"{{context.internalFullMessage}}",validate:()=>({errors:{}}),requiresAppContext:s.U})))}(t);for(const e of a)n.register(e)}}function M(e){return new plugin_MonitoringPlugin(e)}},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.ReactRouterDom},function(e,t){e.exports=__kbnSharedDeps__.Moment},function(e,t){e.exports=__kbnSharedDeps__.ElasticNumeral},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/data/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.MomentTimezone},function(e,t){e.exports=__kbnSharedDeps__.Jquery},function(e,t){e.exports=__kbnSharedDeps__.History},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/observability/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaReact/common");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/data/common");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/alerting/common");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.SaferLodashSet},function(e,t){e.exports=__kbnSharedDeps__.ElasticEuiLibServices},function(e,t){e.exports=__kbnSharedDeps__.Classnames}]);