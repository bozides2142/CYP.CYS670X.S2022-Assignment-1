/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.apm_bundle_jsonpfunction=window.apm_bundle_jsonpfunction||[]).push([[10],{1045:function(e,r,t){"use strict";t.r(r),t.d(r,"EditAPMPolicyForm",(function(){return o}));var s=t(1),E=t.n(s),i=t(469),n=t(85);function o({newPolicy:e,onChange:r}){const[t,...s]=null==e?void 0:e.inputs,o=null==t?void 0:t.vars;return E.a.createElement(i.a,{vars:o,updateAPMPolicy:function(e,E){r({isValid:E,updatedPolicy:{inputs:[{...t,vars:e},...s]}})},isCloudPolicy:e.policy_id===n.a})}},68:function(e,r){const t=Number.MAX_SAFE_INTEGER||9007199254740991;e.exports={SEMVER_SPEC_VERSION:"2.0.0",MAX_LENGTH:256,MAX_SAFE_INTEGER:t,MAX_SAFE_COMPONENT_LENGTH:16}},74:function(e,r,t){e.exports=t(25)(954)},75:function(e,r,t){const{MAX_SAFE_COMPONENT_LENGTH:s}=t(68),E=t(76),i=(r=e.exports={}).re=[],n=r.src=[],o=r.t={};let I=0;const a=(e,r,t)=>{const s=I++;E(s,r),o[e]=s,n[s]=r,i[s]=new RegExp(r,t?"g":void 0)};a("NUMERICIDENTIFIER","0|[1-9]\\d*"),a("NUMERICIDENTIFIERLOOSE","[0-9]+"),a("NONNUMERICIDENTIFIER","\\d*[a-zA-Z-][a-zA-Z0-9-]*"),a("MAINVERSION",`(${n[o.NUMERICIDENTIFIER]})\\.(${n[o.NUMERICIDENTIFIER]})\\.(${n[o.NUMERICIDENTIFIER]})`),a("MAINVERSIONLOOSE",`(${n[o.NUMERICIDENTIFIERLOOSE]})\\.(${n[o.NUMERICIDENTIFIERLOOSE]})\\.(${n[o.NUMERICIDENTIFIERLOOSE]})`),a("PRERELEASEIDENTIFIER",`(?:${n[o.NUMERICIDENTIFIER]}|${n[o.NONNUMERICIDENTIFIER]})`),a("PRERELEASEIDENTIFIERLOOSE",`(?:${n[o.NUMERICIDENTIFIERLOOSE]}|${n[o.NONNUMERICIDENTIFIER]})`),a("PRERELEASE",`(?:-(${n[o.PRERELEASEIDENTIFIER]}(?:\\.${n[o.PRERELEASEIDENTIFIER]})*))`),a("PRERELEASELOOSE",`(?:-?(${n[o.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${n[o.PRERELEASEIDENTIFIERLOOSE]})*))`),a("BUILDIDENTIFIER","[0-9A-Za-z-]+"),a("BUILD",`(?:\\+(${n[o.BUILDIDENTIFIER]}(?:\\.${n[o.BUILDIDENTIFIER]})*))`),a("FULLPLAIN",`v?${n[o.MAINVERSION]}${n[o.PRERELEASE]}?${n[o.BUILD]}?`),a("FULL",`^${n[o.FULLPLAIN]}$`),a("LOOSEPLAIN",`[v=\\s]*${n[o.MAINVERSIONLOOSE]}${n[o.PRERELEASELOOSE]}?${n[o.BUILD]}?`),a("LOOSE",`^${n[o.LOOSEPLAIN]}$`),a("GTLT","((?:<|>)?=?)"),a("XRANGEIDENTIFIERLOOSE",`${n[o.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),a("XRANGEIDENTIFIER",`${n[o.NUMERICIDENTIFIER]}|x|X|\\*`),a("XRANGEPLAIN",`[v=\\s]*(${n[o.XRANGEIDENTIFIER]})(?:\\.(${n[o.XRANGEIDENTIFIER]})(?:\\.(${n[o.XRANGEIDENTIFIER]})(?:${n[o.PRERELEASE]})?${n[o.BUILD]}?)?)?`),a("XRANGEPLAINLOOSE",`[v=\\s]*(${n[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${n[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${n[o.XRANGEIDENTIFIERLOOSE]})(?:${n[o.PRERELEASELOOSE]})?${n[o.BUILD]}?)?)?`),a("XRANGE",`^${n[o.GTLT]}\\s*${n[o.XRANGEPLAIN]}$`),a("XRANGELOOSE",`^${n[o.GTLT]}\\s*${n[o.XRANGEPLAINLOOSE]}$`),a("COERCE",`(^|[^\\d])(\\d{1,${s}})(?:\\.(\\d{1,${s}}))?(?:\\.(\\d{1,${s}}))?(?:$|[^\\d])`),a("COERCERTL",n[o.COERCE],!0),a("LONETILDE","(?:~>?)"),a("TILDETRIM",`(\\s*)${n[o.LONETILDE]}\\s+`,!0),r.tildeTrimReplace="$1~",a("TILDE",`^${n[o.LONETILDE]}${n[o.XRANGEPLAIN]}$`),a("TILDELOOSE",`^${n[o.LONETILDE]}${n[o.XRANGEPLAINLOOSE]}$`),a("LONECARET","(?:\\^)"),a("CARETTRIM",`(\\s*)${n[o.LONECARET]}\\s+`,!0),r.caretTrimReplace="$1^",a("CARET",`^${n[o.LONECARET]}${n[o.XRANGEPLAIN]}$`),a("CARETLOOSE",`^${n[o.LONECARET]}${n[o.XRANGEPLAINLOOSE]}$`),a("COMPARATORLOOSE",`^${n[o.GTLT]}\\s*(${n[o.LOOSEPLAIN]})$|^$`),a("COMPARATOR",`^${n[o.GTLT]}\\s*(${n[o.FULLPLAIN]})$|^$`),a("COMPARATORTRIM",`(\\s*)${n[o.GTLT]}\\s*(${n[o.LOOSEPLAIN]}|${n[o.XRANGEPLAIN]})`,!0),r.comparatorTrimReplace="$1$2$3",a("HYPHENRANGE",`^\\s*(${n[o.XRANGEPLAIN]})\\s+-\\s+(${n[o.XRANGEPLAIN]})\\s*$`),a("HYPHENRANGELOOSE",`^\\s*(${n[o.XRANGEPLAINLOOSE]})\\s+-\\s+(${n[o.XRANGEPLAINLOOSE]})\\s*$`),a("STAR","(<|>)?=?\\s*\\*"),a("GTE0","^\\s*>=\\s*0.0.0\\s*$"),a("GTE0PRE","^\\s*>=\\s*0.0.0-0\\s*$")},76:function(e,r,t){(function(r){const t="object"==typeof r&&Object({IS_KIBANA_DISTRIBUTABLE:"true"})&&Object({IS_KIBANA_DISTRIBUTABLE:"true"}).NODE_DEBUG&&/\bsemver\b/i.test(Object({IS_KIBANA_DISTRIBUTABLE:"true"}).NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};e.exports=t}).call(this,t(74))},85:function(e,r,t){"use strict";t.d(r,"a",(function(){return i})),t.d(r,"b",(function(){return n})),t.d(r,"c",(function(){return o}));var s=t(89),E=t.n(s);const i="policy-elastic-agent-on-cloud",n="8.1.0";function o(e){var r,t,s;return null!==(r=null===(t=E()(e))||void 0===t||null===(s=t.prerelease)||void 0===s?void 0:s.length)&&void 0!==r&&r}},88:function(e,r,t){const s=t(76),{MAX_LENGTH:E,MAX_SAFE_INTEGER:i}=t(68),{re:n,t:o}=t(75),{compareIdentifiers:I}=t(90);class SemVer{constructor(e,r){if(r&&"object"==typeof r||(r={loose:!!r,includePrerelease:!1}),e instanceof SemVer){if(e.loose===!!r.loose&&e.includePrerelease===!!r.includePrerelease)return e;e=e.version}else if("string"!=typeof e)throw new TypeError(`Invalid Version: ${e}`);if(e.length>E)throw new TypeError(`version is longer than ${E} characters`);s("SemVer",e,r),this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease;const t=e.trim().match(r.loose?n[o.LOOSE]:n[o.FULL]);if(!t)throw new TypeError(`Invalid Version: ${e}`);if(this.raw=e,this.major=+t[1],this.minor=+t[2],this.patch=+t[3],this.major>i||this.major<0)throw new TypeError("Invalid major version");if(this.minor>i||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>i||this.patch<0)throw new TypeError("Invalid patch version");t[4]?this.prerelease=t[4].split(".").map((e=>{if(/^[0-9]+$/.test(e)){const r=+e;if(r>=0&&r<i)return r}return e})):this.prerelease=[],this.build=t[5]?t[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(e){if(s("SemVer.compare",this.version,this.options,e),!(e instanceof SemVer)){if("string"==typeof e&&e===this.version)return 0;e=new SemVer(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}compareMain(e){return e instanceof SemVer||(e=new SemVer(e,this.options)),I(this.major,e.major)||I(this.minor,e.minor)||I(this.patch,e.patch)}comparePre(e){if(e instanceof SemVer||(e=new SemVer(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;let r=0;do{const t=this.prerelease[r],E=e.prerelease[r];if(s("prerelease compare",r,t,E),void 0===t&&void 0===E)return 0;if(void 0===E)return 1;if(void 0===t)return-1;if(t!==E)return I(t,E)}while(++r)}compareBuild(e){e instanceof SemVer||(e=new SemVer(e,this.options));let r=0;do{const t=this.build[r],E=e.build[r];if(s("prerelease compare",r,t,E),void 0===t&&void 0===E)return 0;if(void 0===E)return 1;if(void 0===t)return-1;if(t!==E)return I(t,E)}while(++r)}inc(e,r){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",r);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",r);break;case"prepatch":this.prerelease.length=0,this.inc("patch",r),this.inc("pre",r);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",r),this.inc("pre",r);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":if(0===this.prerelease.length)this.prerelease=[0];else{let e=this.prerelease.length;for(;--e>=0;)"number"==typeof this.prerelease[e]&&(this.prerelease[e]++,e=-2);-1===e&&this.prerelease.push(0)}r&&(this.prerelease[0]===r?isNaN(this.prerelease[1])&&(this.prerelease=[r,0]):this.prerelease=[r,0]);break;default:throw new Error(`invalid increment argument: ${e}`)}return this.format(),this.raw=this.version,this}}e.exports=SemVer},89:function(e,r,t){const{MAX_LENGTH:s}=t(68),{re:E,t:i}=t(75),n=t(88);e.exports=(e,r)=>{if(r&&"object"==typeof r||(r={loose:!!r,includePrerelease:!1}),e instanceof n)return e;if("string"!=typeof e)return null;if(e.length>s)return null;if(!(r.loose?E[i.LOOSE]:E[i.FULL]).test(e))return null;try{return new n(e,r)}catch(e){return null}}},90:function(e,r){const t=/^[0-9]+$/,s=(e,r)=>{const s=t.test(e),E=t.test(r);return s&&E&&(e=+e,r=+r),e===r?0:s&&!E?-1:E&&!s?1:e<r?-1:1};e.exports={compareIdentifiers:s,rcompareIdentifiers:(e,r)=>s(r,e)}}}]);