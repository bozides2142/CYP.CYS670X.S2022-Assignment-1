!function(e){function n(n){for(var t,r,a=n[0],o=n[1],c=0,p=[];c<a.length;c++)r=a[c],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&p.push(i[r][0]),i[r]=0;for(t in o)Object.prototype.hasOwnProperty.call(o,t)&&(e[t]=o[t]);for(d&&d(n);p.length;)p.shift()()}var t={},i={0:0};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.e=function(e){var n=[],t=i[e];if(0!==t)if(t)n.push(t[2]);else{var a=new Promise((function(n,r){t=i[e]=[n,r]}));n.push(t[2]=a);var o,c=document.createElement("script");c.charset="utf-8",c.timeout=120,r.nc&&c.setAttribute("nonce",r.nc),c.src=function(e){return r.p+"kibanaOverview.chunk."+e+".js"}(e);var d=new Error;o=function(n){c.onerror=c.onload=null,clearTimeout(p);var t=i[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",d.name="ChunkLoadError",d.type=r,d.request=a,t[1](d)}i[e]=void 0}};var p=setTimeout((function(){o({type:"timeout",target:c})}),12e4);c.onerror=c.onload=o,document.head.appendChild(c)}return Promise.all(n)},r.m=e,r.c=t,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)r.d(t,i,function(n){return e[n]}.bind(null,i));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r.oe=function(e){throw console.error(e),e};var a=window.kibanaOverview_bundle_jsonpfunction=window.kibanaOverview_bundle_jsonpfunction||[],o=a.push.bind(a);a.push=n,a=a.slice();for(var c=0;c<a.length;c++)n(a[c]);var d=o;r(r.s=9)}([function(e,n,t){"use strict";t.d(n,"b",(function(){return i})),t.d(n,"c",(function(){return r})),t.d(n,"d",(function(){return a})),t.d(n,"a",(function(){return o}));const i="kibanaOverview",r="Overview",a="/app/kibana_overview",o="logoKibana"},function(e,n,t){t.r(n);var i=__kbnBundles__.get("entry/core/public");Object.defineProperties(n,Object.getOwnPropertyDescriptors(i))},function(e,n){e.exports=__kbnSharedDeps__.RxjsOperators},function(e,n){e.exports=__kbnSharedDeps__.KbnI18n},function(e,n,t){"use strict";t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return o}));var i=t(7);let r;function a(e){r=e}function o(e,n){r&&r("kibana_overview",e,n)}t.d(n,"a",(function(){return i.METRIC_TYPE}))},function(e,n,t){"use strict";var i,r=function(){return void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i},a=function(){var e={};return function(n){if(void 0===e[n]){var t=document.querySelector(n);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[n]=t}return e[n]}}(),o=[];function c(e){for(var n=-1,t=0;t<o.length;t++)if(o[t].identifier===e){n=t;break}return n}function d(e,n){for(var t={},i=[],r=0;r<e.length;r++){var a=e[r],d=n.base?a[0]+n.base:a[0],p=t[d]||0,s="".concat(d," ").concat(p);t[d]=p+1;var l=c(s),u={css:a[1],media:a[2],sourceMap:a[3]};-1!==l?(o[l].references++,o[l].updater(u)):o.push({identifier:s,updater:b(u,n),references:1}),i.push(s)}return i}function p(e){var n=document.createElement("style"),i=e.attributes||{};if(void 0===i.nonce){var r=t.nc;r&&(i.nonce=r)}if(Object.keys(i).forEach((function(e){n.setAttribute(e,i[e])})),"function"==typeof e.insert)e.insert(n);else{var o=a(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(n)}return n}var s,l=(s=[],function(e,n){return s[e]=n,s.filter(Boolean).join("\n")});function u(e,n,t,i){var r=t?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(e.styleSheet)e.styleSheet.cssText=l(n,r);else{var a=document.createTextNode(r),o=e.childNodes;o[n]&&e.removeChild(o[n]),o.length?e.insertBefore(a,o[n]):e.appendChild(a)}}function v(e,n,t){var i=t.css,r=t.media,a=t.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),a&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}var m=null,w=0;function b(e,n){var t,i,r;if(n.singleton){var a=w++;t=m||(m=p(n)),i=u.bind(null,t,a,!1),r=u.bind(null,t,a,!0)}else t=p(n),i=v.bind(null,t,n),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return i(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;i(e=n)}else r()}}e.exports=function(e,n){(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=r());var t=d(e=e||[],n);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var i=0;i<t.length;i++){var r=c(t[i]);o[r].references--}for(var a=d(e,n),p=0;p<t.length;p++){var s=c(t[p]);0===o[s].references&&(o[s].updater(),o.splice(s,1))}t=a}}}},function(e,n,t){"use strict";e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t=function(e,n){var t=e[1]||"",i=e[3];if(!i)return t;if(n&&"function"==typeof btoa){var r=(o=i,c=btoa(unescape(encodeURIComponent(JSON.stringify(o)))),d="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(d," */")),a=i.sources.map((function(e){return"/*# sourceURL=".concat(i.sourceRoot||"").concat(e," */")}));return[t].concat(a).concat([r]).join("\n")}var o,c,d;return[t].join("\n")}(n,e);return n[2]?"@media ".concat(n[2]," {").concat(t,"}"):t})).join("")},n.i=function(e,t,i){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(i)for(var a=0;a<this.length;a++){var o=this[a][0];null!=o&&(r[o]=!0)}for(var c=0;c<e.length;c++){var d=[].concat(e[c]);i&&r[d[0]]||(t&&(d[2]?d[2]="".concat(t," and ").concat(d[2]):d[2]=t),n.push(d))}},n}},function(e,n){e.exports=__kbnSharedDeps__.KbnAnalytics},function(e,n){e.exports=__kbnSharedDeps__.Rxjs},function(e,n,t){t(10),__kbnBundles__.define("plugin/kibanaOverview/public",t,16)},function(e,n,t){t.p=window.__kbnPublicPath__.kibanaOverview},function(e,n,t){switch(window.__kbnThemeTag__){case"v8dark":return t(12);case"v8light":return t(14)}},function(e,n,t){var i=t(5),r=t(13);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var a={insert:"head",singleton:!1};i(r,a);e.exports=r.locals||{}},function(e,n,t){(n=t(6)(!1)).push([e.i,".kbnOverviewApps__item .kbnRedirectCrossAppLinks,.kbnOverviewMore__item .kbnRedirectCrossAppLinks{align-items:flex-start;display:flex;flex:1;flex-direction:column}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewApps__group--primary .kbnOverviewApps__item{max-width:calc(50% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewApps__group--primary .kbnOverviewApps__item{max-width:calc(50% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewApps__group--primary .kbnOverviewApps__item{max-width:calc(50% - 24px)}}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewApps__group--secondary .kbnOverviewApps__item{max-width:calc(25% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewApps__group--secondary .kbnOverviewApps__item{max-width:calc(25% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewApps__group--secondary .kbnOverviewApps__item{max-width:calc(25% - 24px)}}.kbnOverviewNews__content article+article{margin-top:24px}.kbnOverviewNews__content article>*+*,.kbnOverviewNews__content article header>*+*{margin-top:4px}.kbnOverviewNews__content article h3{font-weight:inherit}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewMore__item{max-width:calc(33.333333333333333% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewMore__item{max-width:calc(33.333333333333333% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewMore__item{max-width:calc(33.333333333333333% - 24px)}}.kbnOverviewSolution.enterpriseSearch .euiCard__image{background-color:#F3D371}.kbnOverviewSolution.observability .euiCard__image{background-color:#F68FBE}.kbnOverviewSolution.securitySolution .euiCard__image{background-color:#7DDED8}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewSupplements--noNews .kbnOverviewMore h2{text-align:center}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewSupplements--noNews .kbnOverviewMore h2{text-align:center}}@media only screen and (min-width: 1200px){.kbnOverviewSupplements--noNews .kbnOverviewMore h2{text-align:center}}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewSupplements--noNews .kbnOverviewMore .kbnOverviewMore__content{justify-content:center}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewSupplements--noNews .kbnOverviewMore .kbnOverviewMore__content{justify-content:center}}@media only screen and (min-width: 1200px){.kbnOverviewSupplements--noNews .kbnOverviewMore .kbnOverviewMore__content{justify-content:center}}.kbnOverviewData--expanded{flex-direction:column}.kbnOverviewData--expanded,.kbnOverviewData--expanded>*{margin-bottom:0 !important;margin-top:0 !important}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewDataManage__item:not(:only-child){flex:0 0 calc(50% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewDataManage__item:not(:only-child){flex:0 0 calc(50% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewDataManage__item:not(:only-child){flex:0 0 calc(50% - 24px)}}\n",""]),e.exports=n},function(e,n,t){var i=t(5),r=t(15);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var a={insert:"head",singleton:!1};i(r,a);e.exports=r.locals||{}},function(e,n,t){(n=t(6)(!1)).push([e.i,".kbnOverviewApps__item .kbnRedirectCrossAppLinks,.kbnOverviewMore__item .kbnRedirectCrossAppLinks{align-items:flex-start;display:flex;flex:1;flex-direction:column}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewApps__group--primary .kbnOverviewApps__item{max-width:calc(50% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewApps__group--primary .kbnOverviewApps__item{max-width:calc(50% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewApps__group--primary .kbnOverviewApps__item{max-width:calc(50% - 24px)}}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewApps__group--secondary .kbnOverviewApps__item{max-width:calc(25% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewApps__group--secondary .kbnOverviewApps__item{max-width:calc(25% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewApps__group--secondary .kbnOverviewApps__item{max-width:calc(25% - 24px)}}.kbnOverviewNews__content article+article{margin-top:24px}.kbnOverviewNews__content article>*+*,.kbnOverviewNews__content article header>*+*{margin-top:4px}.kbnOverviewNews__content article h3{font-weight:inherit}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewMore__item{max-width:calc(33.333333333333333% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewMore__item{max-width:calc(33.333333333333333% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewMore__item{max-width:calc(33.333333333333333% - 24px)}}.kbnOverviewSolution.enterpriseSearch .euiCard__image{background-color:#FEC514}.kbnOverviewSolution.observability .euiCard__image{background-color:#F04E98}.kbnOverviewSolution.securitySolution .euiCard__image{background-color:#00BFB3}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewSupplements--noNews .kbnOverviewMore h2{text-align:center}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewSupplements--noNews .kbnOverviewMore h2{text-align:center}}@media only screen and (min-width: 1200px){.kbnOverviewSupplements--noNews .kbnOverviewMore h2{text-align:center}}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewSupplements--noNews .kbnOverviewMore .kbnOverviewMore__content{justify-content:center}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewSupplements--noNews .kbnOverviewMore .kbnOverviewMore__content{justify-content:center}}@media only screen and (min-width: 1200px){.kbnOverviewSupplements--noNews .kbnOverviewMore .kbnOverviewMore__content{justify-content:center}}.kbnOverviewData--expanded{flex-direction:column}.kbnOverviewData--expanded,.kbnOverviewData--expanded>*{margin-bottom:0 !important;margin-top:0 !important}@media only screen and (min-width: 768px) and (max-width: 991px){.kbnOverviewDataManage__item:not(:only-child){flex:0 0 calc(50% - 24px)}}@media only screen and (min-width: 992px) and (max-width: 1199px){.kbnOverviewDataManage__item:not(:only-child){flex:0 0 calc(50% - 24px)}}@media only screen and (min-width: 1200px){.kbnOverviewDataManage__item:not(:only-child){flex:0 0 calc(50% - 24px)}}\n",""]),e.exports=n},function(e,n,t){"use strict";t.r(n),t.d(n,"plugin",(function(){return p}));t(11);var i=t(3),r=t(8),a=t(2),o=t(1),c=t(0),d=t(4);class plugin_KibanaOverviewPlugin{setup(e,{home:n,usageCollection:p}){p&&Object(d.b)(p.reportUiCounter);const s=Object(r.from)(e.getStartServices()).pipe(Object(a.switchMap)((([e])=>e.chrome.navLinks.getNavLinks$())),Object(a.map)((e=>Boolean(e.find((({id:e,category:n,hidden:t})=>!t&&"kibana"===(null==n?void 0:n.id)&&e!==c.b))))),Object(a.distinct)(),Object(a.map)((e=>()=>e?{status:o.AppStatus.accessible,navLinkStatus:o.AppNavLinkStatus.default}:{status:o.AppStatus.inaccessible,navLinkStatus:o.AppNavLinkStatus.hidden})));return e.application.register({category:o.DEFAULT_APP_CATEGORIES.kibana,id:c.b,title:c.c,euiIconType:c.a,order:1,updater$:s,appRoute:c.d,async mount(n){const{renderApp:i}=await t.e(1).then(t.bind(null,28)),[r,a]=await e.getStartServices();return i(r,a,n)}}),n&&n.featureCatalogue.registerSolution({id:"kibana",title:i.i18n.translate("kibanaOverview.kibana.solution.title",{defaultMessage:"Analytics"}),description:i.i18n.translate("kibanaOverview.kibana.solution.description",{defaultMessage:"Explore, visualize, and analyze your data using a powerful suite of analytical tools and applications."}),icon:"logoKibana",path:c.d,order:400}),{}}start(e){return{}}stop(){}}function p(){return new plugin_KibanaOverviewPlugin}},function(e,n){e.exports=__kbnSharedDeps__.React},function(e,n){e.exports=__kbnSharedDeps__.EmotionReact},function(e,n){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,n){e.exports=__kbnSharedDeps__.ElasticEui},function(e,n,t){t.r(n);var i=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(n,Object.getOwnPropertyDescriptors(i))},function(e,n){e.exports=__kbnSharedDeps__.ReactDom},function(e,n,t){t.r(n);var i=__kbnBundles__.get("plugin/newsfeed/public");Object.defineProperties(n,Object.getOwnPropertyDescriptors(i))},function(e,n){e.exports=__kbnSharedDeps__.ReactRouterDom},function(e,n){e.exports=__kbnSharedDeps__.Lodash},function(e,n,t){t.r(n);var i=__kbnBundles__.get("plugin/home/public");Object.defineProperties(n,Object.getOwnPropertyDescriptors(i))},function(e,n){e.exports=__kbnSharedDeps__.Classnames}]);