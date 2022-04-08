/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.reporting_bundle_jsonpfunction=window.reporting_bundle_jsonpfunction||[]).push([[3],{34:function(e,t,n){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},i=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),a=[];function c(e){for(var t=-1,n=0;n<a.length;n++)if(a[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},r=[],o=0;o<e.length;o++){var i=e[o],s=t.base?i[0]+t.base:i[0],u=n[s]||0,l="".concat(s," ").concat(u);n[s]=u+1;var d=c(l),f={css:i[1],media:i[2],sourceMap:i[3]};-1!==d?(a[d].references++,a[d].updater(f)):a.push({identifier:l,updater:g(f,t),references:1}),r.push(l)}return r}function u(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var a=i(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var l,d=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function f(e,t,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=d(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function p(e,t,n){var r=n.css,o=n.media,i=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var v=null,h=0;function g(e,t){var n,r,o;if(t.singleton){var i=h++;n=v||(v=u(t)),r=f.bind(null,n,i,!1),o=f.bind(null,n,i,!0)}else n=u(t),r=p.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=o());var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var o=c(n[r]);a[o].references--}for(var i=s(e,t),u=0;u<n.length;u++){var l=c(n[u]);0===a[l].references&&(a[l].updater(),a.splice(l,1))}n=i}}}},35:function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(a=r,c=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(s," */")),i=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(i).concat([o]).join("\n")}var a,c,s;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<e.length;c++){var s=[].concat(e[c]);r&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s))}},t}},42:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(43);case"v8light":return n(45)}},43:function(e,t,n){var r=n(34),o=n(44);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};r(o,i);e.exports=o.locals||{}},44:function(e,t,n){(t=n(35)(!1)).push([e.i,".reportingRedirectApp__interstitialPage{margin:40px auto}\n",""]),e.exports=t},45:function(e,t,n){var r=n(34),o=n(46);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};r(o,i);e.exports=o.locals||{}},46:function(e,t,n){(t=n(35)(!1)).push([e.i,".reportingRedirectApp__interstitialPage{margin:40px auto}\n",""]),e.exports=t},58:function(e,t,n){"use strict";n.r(t),n.d(t,"mountRedirectApp",(function(){return f}));var r=n(32),o=n(4),i=n(5),a=n(15),c=n(3),s=n(2),u=(n(42),n(0));const l={errorTitle:c.i18n.translate("xpack.reporting.redirectApp.errorTitle",{defaultMessage:"Redirect error"}),consoleMessagePrefix:c.i18n.translate("xpack.reporting.redirectApp.redirectConsoleErrorPrefixLabel",{defaultMessage:"Redirect page error:"})},d=({apiClient:e,screenshotting:t,share:n})=>{const[r,c]=Object(o.useState)();return Object(o.useEffect)((()=>{(async()=>{try{let i;const{jobId:c}=Object(a.parse)(window.location.search);if(c){var r;const t=await e.getInfo(c);i=null==t||null===(r=t.locatorParams)||void 0===r?void 0:r[0]}else{var o;i=null===(o=t.getContext())||void 0===o?void 0:o[s.w]}if(!i)throw new Error("Could not find locator params for report");n.navigate(i)}catch(e){throw c(e),console.error(l.consoleMessagePrefix,e.message),e}})()}),[e,t,n]),Object(u.jsx)("div",{className:"reportingRedirectApp__interstitialPage"},r?Object(u.jsx)(i.EuiCallOut,{title:l.errorTitle,color:"danger"},Object(u.jsx)("p",null,r.message),r.stack&&Object(u.jsx)(i.EuiCodeBlock,null,r.stack)):Object(u.jsx)("div",null))},f=({element:e,apiClient:t,history:n,screenshotting:o,share:a})=>(Object(r.render)(Object(u.jsx)(i.EuiErrorBoundary,null,Object(u.jsx)(d,{apiClient:t,history:n,screenshotting:o,share:a})),e),()=>{Object(r.unmountComponentAtNode)(e)})}}]);