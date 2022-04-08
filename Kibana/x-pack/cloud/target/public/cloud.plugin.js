/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){function t(t){for(var n,o,i=t[0],s=t[1],u=0,c=[];u<i.length;u++)o=i[u],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&c.push(r[o][0]),r[o]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(a&&a(t);c.length;)c.shift()()}var n={},r={0:0};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise((function(t,o){n=r[e]=[t,o]}));t.push(n[2]=i);var s,u=document.createElement("script");u.charset="utf-8",u.timeout=120,o.nc&&u.setAttribute("nonce",o.nc),u.src=function(e){return o.p+"cloud.chunk."+e+".js"}(e);var a=new Error;s=function(t){u.onerror=u.onload=null,clearTimeout(c);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;a.message="Loading chunk "+e+" failed.\n("+o+": "+i+")",a.name="ChunkLoadError",a.type=o,a.request=i,n[1](a)}r[e]=void 0}};var c=setTimeout((function(){s({type:"timeout",target:u})}),12e4);u.onerror=u.onload=s,document.head.appendChild(u)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o.oe=function(e){throw console.error(e),e};var i=window.cloud_bundle_jsonpfunction=window.cloud_bundle_jsonpfunction||[],s=i.push.bind(i);i.push=t,i=i.slice();for(var u=0;u<i.length;u++)t(i[u]);var a=s;o(o.s=10)}([function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t,n){e.exports=n(9)(2)},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return u}));var r=n(0),o=n(1);const i=Object(r.createContext)({chat:{enabled:!1}}),s=({children:e,...t})=>Object(o.jsx)(i.Provider,{value:t},e);function u(){const{chat:e}=Object(r.useContext)(i);return e}},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(12),o=n(0),i=r.__importDefault(n(13));t.default=function(e,t){var n=o.useState(t),r=n[0],s=n[1];return i.default((function(){var t=e.subscribe(s);return function(){return t.unsubscribe()}}),[e]),r}},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n(11),__kbnBundles__.define("plugin/cloud/public",n,14)},function(e,t,n){n.p=window.__kbnPublicPath__.cloud},function(e,t){e.exports=__kbnSharedDeps__.TsLib},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o="undefined"!=typeof window?r.useLayoutEffect:r.useEffect;t.default=o},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return v})),n.d(t,"Chat",(function(){return y}));var r=n(3),o=n.n(r),i=n(0),s=n.n(i),u=n(2),a=n(8),c=n.n(a),l=n(7),d=n(4);function p(e,t){return e&&t?`${e}${t}`:""}var f=n(5),h=n(1);class plugin_CloudPlugin{constructor(e){o()(this,"config",void 0),o()(this,"isCloudEnabled",void 0),o()(this,"appSubscription",void 0),o()(this,"chatConfig$",new l.BehaviorSubject({enabled:!1})),this.initializerContext=e,this.config=this.initializerContext.config.get(),this.isCloudEnabled=!1}setup(e,{home:t,security:n}){const r=e.getStartServices().then((([e])=>e.executionContext));this.setupFullstory({basePath:e.http.basePath,security:n,executionContextPromise:r,esOrgId:this.config.id}).catch((e=>console.debug(`Error setting up FullStory: ${e.toString()}`)));const{id:o,cname:i,profile_url:s,organization_url:u,deployment_url:a,base_url:c}=this.config;this.isCloudEnabled="string"==typeof o,this.setupChat({http:e.http,security:n}).catch((e=>console.debug(`Error setting up Chat: ${e.toString()}`))),t&&(t.environment.update({cloud:this.isCloudEnabled}),this.isCloudEnabled&&t.tutorials.setVariable("cloud",{id:o,baseUrl:c,profileUrl:s,deploymentUrl:a}));const l=p(c,a);return{cloudId:o,cname:i,baseUrl:c,deploymentUrl:l,profileUrl:p(c,s),organizationUrl:p(c,u),snapshotsUrl:`${l}/elasticsearch/snapshots/`,isCloudEnabled:this.isCloudEnabled}}start(e,{security:t}){const{deployment_url:n,base_url:r}=this.config;e.chrome.setHelpSupportUrl("https://cloud.elastic.co/support");const o=o=>{if(o&&(r&&n&&e.chrome.setCustomNavLink({title:u.i18n.translate("xpack.cloud.deploymentLinkLabel",{defaultMessage:"Manage this deployment"}),euiIconType:"logoCloud",href:p(r,n)}),t&&this.isCloudEnabled)){const e=(e=>{const{profile_url:t,organization_url:n,base_url:r}=e,o=[];return r&&t&&o.push({label:u.i18n.translate("xpack.cloud.userMenuLinks.profileLinkText",{defaultMessage:"Profile"}),iconType:"user",href:p(r,t),order:100,setAsProfile:!0}),r&&n&&o.push({label:u.i18n.translate("xpack.cloud.userMenuLinks.accountLinkText",{defaultMessage:"Account & Billing"}),iconType:"gear",href:p(r,n),order:200}),o})(this.config);t.navControlService.addUserMenuLinks(e)}};this.checkIfAuthorizedForLinks({http:e.http,security:t}).then(o).catch((()=>o(!0)));return{CloudContextProvider:({children:e})=>{const t=c()(this.chatConfig$,{enabled:!1});return Object(h.jsx)(f.a,{chat:t},e)}}}stop(){var e;null===(e=this.appSubscription)||void 0===e||e.unsubscribe()}async checkIfAuthorizedForLinks({http:e,security:t}){var n;if(e.anonymousPaths.isAnonymous(window.location.pathname))return!1;if(!t)return!0;const r=await t.authc.getCurrentUser().catch((()=>null));return null===(n=null==r?void 0:r.roles.includes("superuser"))||void 0===n||n}async setupFullstory({basePath:e,security:t,executionContextPromise:r,esOrgId:o}){const{enabled:i,org_id:s}=this.config.full_story;if(!i||!s)return;const u=n.e(1).then(n.bind(null,21)),a=t?_({getCurrentUser:t.authc.getCurrentUser}):Promise.resolve(void 0),[{initializeFullStory:c},l]=await Promise.all([u,a]),{fullStory:p,sha256:f}=c({basePath:e,orgId:s,packageInfo:this.initializerContext.env.packageInfo});try{if(l){var h,b,g;const e=f(o?`${o}:${l}`:`${l}`);null==r||r.then((async e=>{this.appSubscription=e.context$.subscribe((e=>{const{name:t,page:n,id:r}=e;p.setVars("page",Object(d.omitBy)({pageName:`${Object(d.compact)([t,n]).join(":")}`,app_id_str:null!=t?t:"unknown",page_str:n,ent_id_str:r},d.isUndefined))}))})).catch((e=>{console.error(`[cloud.full_story] Could not retrieve application service due to error: ${e.toString()}`,e)}));const t=this.initializerContext.env.packageInfo.version,n=(t.indexOf(".")>-1?t.split("."):[]).map((e=>parseInt(e,10)));p.identify(e,{version_str:t,version_major_int:null!==(h=n[0])&&void 0!==h?h:-1,version_minor_int:null!==(b=n[1])&&void 0!==b?b:-1,version_patch_int:null!==(g=n[2])&&void 0!==g?g:-1,org_id_str:o})}}catch(e){console.error(`[cloud.full_story] Could not call FS.identify due to error: ${e.toString()}`,e)}const y=window.performance.memory;let v={};y&&(v={memory_js_heap_size_limit_int:y.jsHeapSizeLimit,memory_js_heap_size_total_int:y.totalJSHeapSize,memory_js_heap_size_used_int:y.usedJSHeapSize}),p.event("Loaded Kibana",{kibana_version_str:this.initializerContext.env.packageInfo.version,...v})}async setupChat({http:e,security:t}){if(!this.isCloudEnabled)return;const{enabled:n,chatURL:r}=this.config.chat;if(t&&n&&r)try{const{email:t,id:o,token:i}=await e.get("/internal/cloud/chat_user");if(!t||!o||!i)return;this.chatConfig$.next({enabled:n,chatURL:r,user:{email:t,id:o,jwt:i}})}catch(e){console.debug(`[cloud.chat] Could not retrieve chat config: ${e.res.status} ${e.message}`,e)}}}const _=async({getCurrentUser:e})=>{try{const t=await e().catch((()=>{}));if(!t)return;return t.username||console.debug(`[cloud.full_story] username not specified. User metadata: ${JSON.stringify(t.metadata)}`),t.username}catch(e){return void console.error(`[cloud.full_story] Error loading the current user: ${e.toString()}`,e)}};var b=n(6);const g=s.a.lazy((()=>n.e(2).then(n.bind(null,22)).then((({Chat:e})=>({default:e}))))),y=()=>Object(h.jsx)(b.EuiErrorBoundary,null,Object(h.jsx)(i.Suspense,{fallback:Object(h.jsx)("div",null)},Object(h.jsx)(g,null)));function v(e){return new plugin_CloudPlugin(e)}},function(e,t){e.exports=__kbnSharedDeps__.KbnUiTheme}]);