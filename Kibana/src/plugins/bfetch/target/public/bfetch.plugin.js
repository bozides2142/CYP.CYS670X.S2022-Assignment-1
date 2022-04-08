!function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=6)}([function(e,t,r){e.exports=r(8)(2)},function(e,t,r){r.r(t);var n=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(n))},function(e,t){e.exports=__kbnSharedDeps__.RxjsOperators},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t){e.exports=__kbnSharedDeps__.Fflate},function(e,t,r){"use strict";t.byteLength=function(e){var t=u(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,n=u(e),i=n[0],a=n[1],c=new o(function(e,t,r){return 3*(t+r)/4-r}(0,i,a)),l=0,f=a>0?i-4:i;for(r=0;r<f;r+=4)t=s[e.charCodeAt(r)]<<18|s[e.charCodeAt(r+1)]<<12|s[e.charCodeAt(r+2)]<<6|s[e.charCodeAt(r+3)],c[l++]=t>>16&255,c[l++]=t>>8&255,c[l++]=255&t;2===a&&(t=s[e.charCodeAt(r)]<<2|s[e.charCodeAt(r+1)]>>4,c[l++]=255&t);1===a&&(t=s[e.charCodeAt(r)]<<10|s[e.charCodeAt(r+1)]<<4|s[e.charCodeAt(r+2)]>>2,c[l++]=t>>8&255,c[l++]=255&t);return c},t.fromByteArray=function(e){for(var t,r=e.length,s=r%3,o=[],i=16383,a=0,c=r-s;a<c;a+=i)o.push(l(e,a,a+i>c?c:a+i));1===s?(t=e[r-1],o.push(n[t>>2]+n[t<<4&63]+"==")):2===s&&(t=(e[r-2]<<8)+e[r-1],o.push(n[t>>10]+n[t>>4&63]+n[t<<2&63]+"="));return o.join("")};for(var n=[],s=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,c=i.length;a<c;++a)n[a]=i[a],s[i.charCodeAt(a)]=a;function u(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function l(e,t,r){for(var s,o,i=[],a=t;a<r;a+=3)s=(e[a]<<16&16711680)+(e[a+1]<<8&65280)+(255&e[a+2]),i.push(n[(o=s)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return i.join("")}s["-".charCodeAt(0)]=62,s["_".charCodeAt(0)]=63},function(e,t,r){r(7),__kbnBundles__.define("plugin/bfetch/public",r,9)},function(e,t,r){r.p=window.__kbnPublicPath__.bfetch},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,r){"use strict";r.r(t),r.d(t,"split",(function(){return a})),r.d(t,"DISABLE_BFETCH",(function(){return c})),r.d(t,"plugin",(function(){return m}));var n=r(0),s=r.n(n),o=r(3),i=r(2);const a=(e="\n")=>t=>{const r=new o.Subject;let n="";return t.subscribe((t=>{const s=(n+t).split(e);s.slice(0,-1).forEach(r.next.bind(r)),n=s.length?s[s.length-1]:""}),r.error.bind(r),(()=>{r.next(n),r.complete()})),r.pipe(Object(i.filter)(Boolean))};class timed_item_buffer_TimedItemBuffer extends class item_buffer_ItemBuffer{constructor(e){s()(this,"list",[]),this.params=e}get length(){return this.list.length}write(e){this.list.push(e);const{flushOnMaxItems:t}=this.params;t&&this.list.length>=t&&this.flush()}clear(){this.list=[]}flush(){let e;[e,this.list]=[this.list,[]],this.params.onFlush(e)}}{constructor(e){super(e),s()(this,"timer",void 0),s()(this,"onTimeout",(()=>{this.flush()})),this.params=e}write(e){super.write(e),this.params.maxItemAge&&1===this.length&&(this.timer=setTimeout(this.onTimeout,this.params.maxItemAge))}clear(){clearTimeout(this.timer),super.clear()}flush(){clearTimeout(this.timer),super.flush()}}const c="bfetch:disable";function u({url:e,headers:t={},method:r="POST",body:n="",signal:s,getIsCompressionDisabled:c=(()=>!1)}){const u=new window.XMLHttpRequest,h=c();h||(e=((e,t,r)=>{const n=e.includes("?")?"&":"?";return`${e}${n}${t}=${r}`})(e,"compress","true")),u.open(r,e),u.withCredentials=!0,Object.entries(t).forEach((([e,t])=>u.setRequestHeader(e,t)));const p=((e,t)=>{const r=new o.Subject;let n=0,s=!1;const i=()=>0===e.status||e.status>=400,a=()=>{if(s)return;if(i())return;const{responseText:t}=e;n>=t.length||(r.next(t.substr(n)),n=t.length)};e.onprogress=a;const c=()=>{4!==e.readyState&&(s=!0,e.abort(),r.complete(),t&&t.removeEventListener("abort",c))};return t&&t.addEventListener("abort",c),e.onreadystatechange=()=>{s||(a(),4===e.readyState&&(t&&t.removeEventListener("abort",c),i()?r.error(new Error(`Batch request failed with status ${e.status}`)):r.complete()))},r})(u,s);u.send(n);const m=p.pipe(a("\n"),Object(i.map)((e=>h?e:function(e){const t=Object(f.toByteArray)(e),r=Object(l.unzlibSync)(t);return Object(l.strFromU8)(r)}(e))),Object(i.share)());return{xhr:u,stream:m}}var l=r(4),f=r(5);var h=r(1);const p=e=>{const{url:t,fetchStreaming:r=u,flushOnMaxItems:n=25,maxItemAge:s=10,getIsCompressionDisabled:o=(()=>!1)}=e,[i]=(e=>{const{onCall:t,onBatch:r,maxItemAge:n=10,flushOnMaxItems:s=25}=e,o=new timed_item_buffer_TimedItemBuffer({onFlush:r,maxItemAge:n,flushOnMaxItems:s});return[(...e)=>{const[r,n]=t(...e);return o.write(n),r},o]})({onCall:(e,t)=>{const r=Object(h.defer)(),n={payload:e,future:r,signal:t};return[r.promise,n]},onBatch:async e=>{try{const n=(e=e.filter((e=>{var t,r;return null!==(t=e.signal)&&void 0!==t&&t.aborted&&e.future.reject(new h.AbortError),!(null!==(r=e.signal)&&void 0!==r&&r.aborted)}))).map((e=>new Promise((t=>{const{promise:r,cleanup:n}=e.signal?Object(h.abortSignalToPromise)(e.signal):{promise:void 0,cleanup:()=>{}},s=()=>{t(),n()};r&&r.catch((()=>{e.future.reject(new h.AbortError),s()})),e.future.promise.then(s,s)})))),s=new AbortController;let i=!1;Promise.all(n).then((()=>{i=!0,s.abort()}));const a=e.map((e=>e.payload)),{stream:c}=r({url:t,body:JSON.stringify({batch:a}),method:"POST",signal:s.signal,getIsCompressionDisabled:o}),u=t=>{const r=(n=t)?n instanceof Error?{message:n.message}:"object"==typeof n?{...n,message:n.message||"Unknown error."}:{message:String(n)}:{message:"Unknown error."};var n;r.code="STREAM";for(const{future:t}of e)t.reject(r)};c.subscribe({next:t=>{try{const r=JSON.parse(t);r.error?e[r.id].future.reject(r.error):void 0!==r.result&&e[r.id].future.resolve(r.result)}catch(e){u(e)}},error:u,complete:()=>{if(!i){const t={message:"Connection terminated prematurely.",code:"CONNECTION"};for(const{future:r}of e)r.reject(t)}}}),await c.toPromise()}catch(t){for(const r of e)r.future.reject(t)}},flushOnMaxItems:n,maxItemAge:s});return i};class plugin_BfetchPublicPlugin{constructor(e){s()(this,"contract",void 0),s()(this,"fetchStreaming",((e,t,r)=>n=>{return u({...n,url:`${t}/${s=n.url,"/"===s[0]?s.substr(1):s}`,headers:{"Content-Type":"application/json","kbn-version":e,...n.headers||{}},getIsCompressionDisabled:r});var s})),s()(this,"batchedFunction",((e,t)=>r=>p({...r,getIsCompressionDisabled:t,fetchStreaming:r.fetchStreaming||e}))),this.initializerContext=e}setup(e,t){const{version:r}=this.initializerContext.env.packageInfo,n=e.http.basePath.get(),s=Object(h.createStartServicesGetter)(e.getStartServices),o=()=>s().core.uiSettings.get("bfetch:disableCompression"),i=this.fetchStreaming(r,n,o),a=this.batchedFunction(i,o);return this.contract={fetchStreaming:i,batchedFunction:a},this.contract}start(e,t){return this.contract}stop(){}}function m(e){return new plugin_BfetchPublicPlugin(e)}}]);