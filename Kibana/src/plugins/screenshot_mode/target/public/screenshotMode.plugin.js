!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){e.exports=n(3)(2)},function(e,t,n){n(2),__kbnBundles__.define("plugin/screenshotMode/public",n,4)},function(e,t,n){n.p=window.__kbnPublicPath__.screenshotMode},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return s})),n.d(t,"KBN_SCREENSHOT_MODE_HEADER",(function(){return l})),n.d(t,"setScreenshotModeEnabled",(function(){return i})),n.d(t,"KBN_SCREENSHOT_MODE_ENABLED_KEY",(function(){return u}));var r=n(0),o=n.n(r);const u="__KBN_SCREENSHOT_MODE_ENABLED_KEY__",i=()=>{Object.defineProperty(window,"__KBN_SCREENSHOT_MODE_ENABLED_KEY__",{enumerable:!0,writable:!0,configurable:!1,value:!0})},c="__KBN_SCREENSHOT_MODE_LAYOUT_KEY__",_=()=>window[c]||window.localStorage.getItem(c),l="x-kbn-screenshot-mode".toLowerCase();class plugin_ScreenshotModePlugin{constructor(){o()(this,"publicContract",Object.freeze({isScreenshotMode:()=>!0==(!0===window[u]||"true"===window.localStorage.getItem(u)),getScreenshotLayout:_}))}setup(e){return this.publicContract}start(e){return this.publicContract}stop(){}}function s(){return new plugin_ScreenshotModePlugin}}]);