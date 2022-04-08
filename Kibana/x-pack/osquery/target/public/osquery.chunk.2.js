/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.osquery_bundle_jsonpfunction=window.osquery_bundle_jsonpfunction||[]).push([[2],{115:function(e,t,r){class Range{constructor(e,t){if(t&&"object"==typeof t||(t={loose:!!t,includePrerelease:!1}),e instanceof Range)return e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease?e:new Range(e.raw,t);if(e instanceof i)return this.raw=e.value,this.set=[[e]],this.format(),this;if(this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease,this.raw=e,this.set=e.split(/\s*\|\|\s*/).map((e=>this.parseRange(e.trim()))).filter((e=>e.length)),!this.set.length)throw new TypeError(`Invalid SemVer Range: ${e}`);this.format()}format(){return this.range=this.set.map((e=>e.join(" ").trim())).join("||").trim(),this.range}toString(){return this.range}parseRange(e){const t=this.options.loose;e=e.trim();const r=t?o[a.HYPHENRANGELOOSE]:o[a.HYPHENRANGE];e=e.replace(r,N(this.options.includePrerelease)),s("hyphen replace",e),e=e.replace(o[a.COMPARATORTRIM],l),s("comparator trim",e,o[a.COMPARATORTRIM]),e=(e=(e=e.replace(o[a.TILDETRIM],c)).replace(o[a.CARETTRIM],p)).split(/\s+/).join(" ");const n=t?o[a.COMPARATORLOOSE]:o[a.COMPARATOR];return e.split(" ").map((e=>E(e,this.options))).join(" ").split(/\s+/).map((e=>g(e,this.options))).filter(this.options.loose?e=>!!e.match(n):()=>!0).map((e=>new i(e,this.options)))}intersects(e,t){if(!(e instanceof Range))throw new TypeError("a Range is required");return this.set.some((r=>u(r,t)&&e.set.some((e=>u(e,t)&&r.every((r=>e.every((e=>r.intersects(e,t)))))))))}test(e){if(!e)return!1;if("string"==typeof e)try{e=new n(e,this.options)}catch(e){return!1}for(let t=0;t<this.set.length;t++)if(v(this.set[t],e,this.options))return!0;return!1}}e.exports=Range;const i=r(159),s=r(59),n=r(76),{re:o,t:a,comparatorTrimReplace:l,tildeTrimReplace:c,caretTrimReplace:p}=r(75),u=(e,t)=>{let r=!0;const i=e.slice();let s=i.pop();for(;r&&i.length;)r=i.every((e=>s.intersects(e,t))),s=i.pop();return r},E=(e,t)=>(s("comp",e,t),e=d(e,t),s("caret",e),e=m(e,t),s("tildes",e),e=$(e,t),s("xrange",e),e=O(e,t),s("stars",e),e),h=e=>!e||"x"===e.toLowerCase()||"*"===e,m=(e,t)=>e.trim().split(/\s+/).map((e=>I(e,t))).join(" "),I=(e,t)=>{const r=t.loose?o[a.TILDELOOSE]:o[a.TILDE];return e.replace(r,((t,r,i,n,o)=>{let a;return s("tilde",e,t,r,i,n,o),h(r)?a="":h(i)?a=`>=${r}.0.0 <${+r+1}.0.0-0`:h(n)?a=`>=${r}.${i}.0 <${r}.${+i+1}.0-0`:o?(s("replaceTilde pr",o),a=`>=${r}.${i}.${n}-${o} <${r}.${+i+1}.0-0`):a=`>=${r}.${i}.${n} <${r}.${+i+1}.0-0`,s("tilde return",a),a}))},d=(e,t)=>e.trim().split(/\s+/).map((e=>f(e,t))).join(" "),f=(e,t)=>{s("caret",e,t);const r=t.loose?o[a.CARETLOOSE]:o[a.CARET],i=t.includePrerelease?"-0":"";return e.replace(r,((t,r,n,o,a)=>{let l;return s("caret",e,t,r,n,o,a),h(r)?l="":h(n)?l=`>=${r}.0.0${i} <${+r+1}.0.0-0`:h(o)?l="0"===r?`>=${r}.${n}.0${i} <${r}.${+n+1}.0-0`:`>=${r}.${n}.0${i} <${+r+1}.0.0-0`:a?(s("replaceCaret pr",a),l="0"===r?"0"===n?`>=${r}.${n}.${o}-${a} <${r}.${n}.${+o+1}-0`:`>=${r}.${n}.${o}-${a} <${r}.${+n+1}.0-0`:`>=${r}.${n}.${o}-${a} <${+r+1}.0.0-0`):(s("no pr"),l="0"===r?"0"===n?`>=${r}.${n}.${o}${i} <${r}.${n}.${+o+1}-0`:`>=${r}.${n}.${o}${i} <${r}.${+n+1}.0-0`:`>=${r}.${n}.${o} <${+r+1}.0.0-0`),s("caret return",l),l}))},$=(e,t)=>(s("replaceXRanges",e,t),e.split(/\s+/).map((e=>R(e,t))).join(" ")),R=(e,t)=>{e=e.trim();const r=t.loose?o[a.XRANGELOOSE]:o[a.XRANGE];return e.replace(r,((r,i,n,o,a,l)=>{s("xRange",e,r,i,n,o,a,l);const c=h(n),p=c||h(o),u=p||h(a),E=u;return"="===i&&E&&(i=""),l=t.includePrerelease?"-0":"",c?r=">"===i||"<"===i?"<0.0.0-0":"*":i&&E?(p&&(o=0),a=0,">"===i?(i=">=",p?(n=+n+1,o=0,a=0):(o=+o+1,a=0)):"<="===i&&(i="<",p?n=+n+1:o=+o+1),"<"===i&&(l="-0"),r=`${i+n}.${o}.${a}${l}`):p?r=`>=${n}.0.0${l} <${+n+1}.0.0-0`:u&&(r=`>=${n}.${o}.0${l} <${n}.${+o+1}.0-0`),s("xRange return",r),r}))},O=(e,t)=>(s("replaceStars",e,t),e.trim().replace(o[a.STAR],"")),g=(e,t)=>(s("replaceGTE0",e,t),e.trim().replace(o[t.includePrerelease?a.GTE0PRE:a.GTE0],"")),N=e=>(t,r,i,s,n,o,a,l,c,p,u,E,m)=>`${r=h(i)?"":h(s)?`>=${i}.0.0${e?"-0":""}`:h(n)?`>=${i}.${s}.0${e?"-0":""}`:o?`>=${r}`:`>=${r}${e?"-0":""}`} ${l=h(c)?"":h(p)?`<${+c+1}.0.0-0`:h(u)?`<${c}.${+p+1}.0-0`:E?`<=${c}.${p}.${u}-${E}`:e?`<${c}.${p}.${+u+1}-0`:`<=${l}`}`.trim(),v=(e,t,r)=>{for(let r=0;r<e.length;r++)if(!e[r].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(let r=0;r<e.length;r++)if(s(e[r].semver),e[r].semver!==i.ANY&&e[r].semver.prerelease.length>0){const i=e[r].semver;if(i.major===t.major&&i.minor===t.minor&&i.patch===t.patch)return!0}return!1}return!0}},116:function(e,t){const r=Number.MAX_SAFE_INTEGER||9007199254740991;e.exports={SEMVER_SPEC_VERSION:"2.0.0",MAX_LENGTH:256,MAX_SAFE_INTEGER:r,MAX_SAFE_COMPONENT_LENGTH:16}},158:function(e,t,r){const i=r(115);e.exports=(e,t,r)=>{try{t=new i(t,r)}catch(e){return!1}return t.test(e)}},159:function(e,t,r){const i=Symbol("SemVer ANY");class Comparator{static get ANY(){return i}constructor(e,t){if(t&&"object"==typeof t||(t={loose:!!t,includePrerelease:!1}),e instanceof Comparator){if(e.loose===!!t.loose)return e;e=e.value}a("comparator",e,t),this.options=t,this.loose=!!t.loose,this.parse(e),this.semver===i?this.value="":this.value=this.operator+this.semver.version,a("comp",this)}parse(e){const t=this.options.loose?s[n.COMPARATORLOOSE]:s[n.COMPARATOR],r=e.match(t);if(!r)throw new TypeError(`Invalid comparator: ${e}`);this.operator=void 0!==r[1]?r[1]:"","="===this.operator&&(this.operator=""),r[2]?this.semver=new l(r[2],this.options.loose):this.semver=i}toString(){return this.value}test(e){if(a("Comparator.test",e,this.options.loose),this.semver===i||e===i)return!0;if("string"==typeof e)try{e=new l(e,this.options)}catch(e){return!1}return o(e,this.operator,this.semver,this.options)}intersects(e,t){if(!(e instanceof Comparator))throw new TypeError("a Comparator is required");if(t&&"object"==typeof t||(t={loose:!!t,includePrerelease:!1}),""===this.operator)return""===this.value||new c(e.value,t).test(this.value);if(""===e.operator)return""===e.value||new c(this.value,t).test(e.semver);const r=!(">="!==this.operator&&">"!==this.operator||">="!==e.operator&&">"!==e.operator),i=!("<="!==this.operator&&"<"!==this.operator||"<="!==e.operator&&"<"!==e.operator),s=this.semver.version===e.semver.version,n=!(">="!==this.operator&&"<="!==this.operator||">="!==e.operator&&"<="!==e.operator),a=o(this.semver,"<",e.semver,t)&&(">="===this.operator||">"===this.operator)&&("<="===e.operator||"<"===e.operator),l=o(this.semver,">",e.semver,t)&&("<="===this.operator||"<"===this.operator)&&(">="===e.operator||">"===e.operator);return r||i||s&&n||a||l}}e.exports=Comparator;const{re:s,t:n}=r(75),o=r(161),a=r(59),l=r(76),c=r(115)},160:function(e,t,r){e.exports=r(5)(954)},161:function(e,t,r){const i=r(162),s=r(164),n=r(165),o=r(166),a=r(167),l=r(168);e.exports=(e,t,r,c)=>{switch(t){case"===":return"object"==typeof e&&(e=e.version),"object"==typeof r&&(r=r.version),e===r;case"!==":return"object"==typeof e&&(e=e.version),"object"==typeof r&&(r=r.version),e!==r;case"":case"=":case"==":return i(e,r,c);case"!=":return s(e,r,c);case">":return n(e,r,c);case">=":return o(e,r,c);case"<":return a(e,r,c);case"<=":return l(e,r,c);default:throw new TypeError(`Invalid operator: ${t}`)}}},162:function(e,t,r){const i=r(46);e.exports=(e,t,r)=>0===i(e,t,r)},163:function(e,t){const r=/^[0-9]+$/,i=(e,t)=>{const i=r.test(e),s=r.test(t);return i&&s&&(e=+e,t=+t),e===t?0:i&&!s?-1:s&&!i?1:e<t?-1:1};e.exports={compareIdentifiers:i,rcompareIdentifiers:(e,t)=>i(t,e)}},164:function(e,t,r){const i=r(46);e.exports=(e,t,r)=>0!==i(e,t,r)},165:function(e,t,r){const i=r(46);e.exports=(e,t,r)=>i(e,t,r)>0},166:function(e,t,r){const i=r(46);e.exports=(e,t,r)=>i(e,t,r)>=0},167:function(e,t,r){const i=r(46);e.exports=(e,t,r)=>i(e,t,r)<0},168:function(e,t,r){const i=r(46);e.exports=(e,t,r)=>i(e,t,r)<=0},175:function(e,t,r){"use strict";r.r(t),r.d(t,"configProtectedKeysValidator",(function(){return A})),r.d(t,"packConfigFilesValidator",(function(){return S})),r.d(t,"OsqueryManagedPolicyCreateImportExtension",(function(){return C}));var i=r(14),s=r(158),n=r.n(s),o=r(11),a=r(0),l=r.n(a),c=r(55),p=r(12),u=r(67),E=r.n(u),h=r(15),m=r.n(h),I=r(22),d=r(21),f=r(34),$=r(77),R=r(78),O=r(13);const g=["application/json","text/plain"],N=l.a.memo((()=>l.a.createElement(o.EuiLink,{href:"https://github.com/osquery/osquery/blob/master/tools/deployment/osquery.example.conf",target:"_blank"},l.a.createElement(O.FormattedMessage,{id:"xpack.osquery.configUploader.exampleConfigLinkLabel",defaultMessage:"Example config"}))));N.displayName="ExampleOsqueryConfigLink";const v=({onChange:e})=>{const t=Object(a.useRef)(null),[r,i]=Object(a.useState)(null);let s;const n=()=>{var r;const n=s.result;let o;try{o=JSON.parse(n.replaceAll("\\\n",""),((e,t)=>"query"===e?t.replaceAll(/\s(?=\s)/gm,""):t)),i(null)}catch(e){var a;i(e),null===(a=t.current)||void 0===a||a.removeFiles(new Event("fake"))}e(o),null===(r=t.current)||void 0===r||r.removeFiles(new Event("fake"))},c=e=>{s=new FileReader,s.onloadend=n,s.readAsText(e)},u=Object(a.useCallback)((e=>{var r;if(e.length){var s;if(e.length&&(null!==(r=!!e[0].type.length&&!g.includes(e[0].type))&&void 0!==r?r:!e[0].name.endsWith(".conf")))return i(p.i18n.translate("xpack.osquery.configUploader.unsupportedFileTypeText",{defaultMessage:"File type {fileType} is not supported, please upload {supportedFileTypes} config file",values:{fileType:e[0].type,supportedFileTypes:g.join(" or ")}})),void(null===(s=t.current)||void 0===s||s.removeFiles(new Event("fake")));c(e[0])}}),[c]);return l.a.createElement(l.a.Fragment,null,l.a.createElement(o.EuiSpacer,{size:"xl"}),l.a.createElement(o.EuiFormRow,{fullWidth:!0,labelAppend:l.a.createElement(N,null),isInvalid:!!r,error:l.a.createElement(l.a.Fragment,null,`${r}`)},l.a.createElement(o.EuiFilePicker,{ref:t,id:"osquery_config_picker",initialPromptText:p.i18n.translate("xpack.osquery.configUploader.initialPromptTextLabel",{defaultMessage:"Select or drag and drop osquery config file"}),onChange:u,display:"large",fullWidth:!0,isInvalid:!!r,accept:g.join(",")})))},T=l.a.memo(v);var y=r(37);const L=["force","disable_watchdog","utc","events_expiry","extensions_socket","extensions_interval","extensions_timeout","pidfile","database_path","extensions_autoload","flagfile","config_plugin","logger_plugin","pack_delimiter","config_refresh"],A=(...e)=>{var t,r;const[{value:s}]=e;let n;try{n=JSON.parse(s)}catch(e){return}const o=Object(i.intersection)(Object.keys(null!==(t=null===(r=n)||void 0===r?void 0:r.options)&&void 0!==t?t:{}),L);if(o.length)return{code:"ERR_RESTRICTED_OPTIONS",message:p.i18n.translate("xpack.osquery.fleetIntegration.osqueryConfig.restrictedOptionsErrorMessage",{defaultMessage:"The following osquery options are not supported and must be removed: {restrictedFlags}.",values:{restrictedFlags:o.join(", ")}})}},S=(...e)=>{var t,r;const[{value:s}]=e;let n;try{n=JSON.parse(s)}catch(e){return}const o=Object.keys(Object(i.pickBy)(null!==(t=null===(r=n)||void 0===r?void 0:r.packs)&&void 0!==t?t:{},i.isString));if(o.length)return{code:"ERR_RESTRICTED_OPTIONS",message:p.i18n.translate("xpack.osquery.fleetIntegration.osqueryConfig.packConfigFilesErrorMessage",{defaultMessage:"Pack configuration files are not supported. These packs must be removed: {packNames}.",values:{packNames:o.join(", ")}})}},P=Object(y.k)({component:y.d}),b=m()(o.EuiAccordion).withConfig({displayName:"StyledEuiAccordion",componentId:"sc-cogd75-0"})([".euiAccordion__button{color:",";}"],(({theme:e})=>e.eui.euiColorPrimary)),C=l.a.memo((({onChange:e,policy:t,newPolicy:r})=>{var s;const[u,h]=Object(a.useState)(null),[m,O]=Object(a.useState)(null),[g]=Object(a.useState)(!!t),{application:{getUrlForApp:N},http:v}=Object(f.e)().services,{form:L}=Object(y.l)({defaultValue:{config:JSON.stringify(Object(i.get)(r,"inputs[0].config.osquery.value",{}),null,2)},schema:{config:{label:p.i18n.translate("xpack.osquery.fleetIntegration.osqueryConfig.configFieldLabel",{defaultMessage:"Osquery config"}),type:y.c.JSON,validations:[{validator:y.i.isJsonField(p.i18n.translate("xpack.osquery.fleetIntegration.osqueryConfig.configFieldError",{defaultMessage:"Invalid JSON"}),{allowEmptyString:!0})},{validator:S},{validator:A}]}}}),[{config:C}]=Object(y.m)({form:L,watch:"config"}),{isValid:F,setFieldValue:j}=L,w=Object(a.useMemo)((()=>null!=t&&t.policy_id?N(I.PLUGIN_ID,{path:d.pagePathGetters.policy_details({policyId:null==t?void 0:t.policy_id})[1]}):"#"),[N,null==t?void 0:t.policy_id]),D=Object(a.useCallback)((e=>{let t={};try{var r;t=null===(r=JSON.parse(C))||void 0===r?void 0:r.packs}catch(e){}e&&j("config",JSON.stringify({...e,...t||e.packs?{packs:{...e.packs,...t}}:{}},null,2))}),[C,j]);return E()((()=>{if(void 0===F)return;const t=Object(c.produce)(r,(e=>{let t;try{t=JSON.parse(C)}catch(e){}return Object(i.isEmpty)(t)?Object(i.unset)(e,"inputs[0].config"):Object(i.set)(e,"inputs[0].config.osquery.value",t),e}));e({isValid:!!F,updatedPolicy:F?t:r})}),500,[F,C]),Object(a.useEffect)((()=>{if(g&&null===u){const e=async()=>{if(null!=t&&t.policy_id)try{const e=await v.fetch(I.agentPolicyRouteService.getInfoPath(null==t?void 0:t.policy_id));e.item&&O(e.item)}catch(e){}};(async()=>{try{const e=await v.fetch(I.agentRouteService.getStatusPath(),{query:{policyId:null==t?void 0:t.policy_id}});e.results&&h(e.results.total)}catch(e){}})(),e()}}),[g,v,null==t?void 0:t.policy_id,u]),Object(a.useEffect)((()=>{var s;if(null!=r&&null!==(s=r.package)&&void 0!==s&&s.version){var o,a;if(!g&&n()(null==r||null===(o=r.package)||void 0===o?void 0:o.version,"<0.6.0")){const t=Object(c.produce)(r,(e=>{Object(i.set)(e,"inputs[0].streams",[])}));e({isValid:!0,updatedPolicy:t})}if(n()(null==r||null===(a=r.package)||void 0===a?void 0:a.version,">=0.6.0")){const s=Object(c.produce)(r,(e=>(g&&null!=t&&t.inputs.length?Object(i.set)(e,"inputs",t.inputs):Object(i.set)(e,"inputs[0]",{type:"osquery",enabled:!0,streams:[],policy_template:"osquery_manager"}),e)));null!=s&&s.inputs[0].config&&j("config",JSON.stringify(null==s?void 0:s.inputs[0].config.osquery.value,null,2)),e({isValid:!0,updatedPolicy:s})}}}),[]),l.a.createElement(l.a.Fragment,null,g?null:l.a.createElement(R.a,null),0===u?l.a.createElement(l.a.Fragment,null,l.a.createElement(o.EuiFlexGroup,null,l.a.createElement(o.EuiFlexItem,null,l.a.createElement(o.EuiCallOut,{title:"No agents in the policy",color:"warning",iconType:"help"},l.a.createElement("p",null,"Fleet has detected that you have not assigned yet any agent to the ",l.a.createElement(o.EuiLink,{href:w},null!==(s=null==m?void 0:m.name)&&void 0!==s?s:null==t?void 0:t.policy_id),". ",l.a.createElement("br",null),l.a.createElement("strong",null,"Only agents within the policy with active Osquery Manager integration support the functionality presented below."))))),l.a.createElement(o.EuiSpacer,null)):null,l.a.createElement($.a,{isDisabled:!g,agentPolicyId:null==t?void 0:t.policy_id}),l.a.createElement(o.EuiSpacer,{size:"xxl"}),l.a.createElement(b,{id:"advanced",buttonContent:p.i18n.translate("xpack.osquery.fleetIntegration.osqueryConfig.accordionFieldLabel",{defaultMessage:"Advanced"})},l.a.createElement(o.EuiSpacer,{size:"xs"}),l.a.createElement(y.e,{form:L},l.a.createElement(P,{path:"config"}),l.a.createElement(T,{onChange:D}))))}));C.displayName="OsqueryManagedPolicyCreateImportExtension"},46:function(e,t,r){const i=r(76);e.exports=(e,t,r)=>new i(e,r).compare(new i(t,r))},59:function(e,t,r){(function(t){const r="object"==typeof t&&Object({IS_KIBANA_DISTRIBUTABLE:"true"})&&Object({IS_KIBANA_DISTRIBUTABLE:"true"}).NODE_DEBUG&&/\bsemver\b/i.test(Object({IS_KIBANA_DISTRIBUTABLE:"true"}).NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};e.exports=r}).call(this,r(160))},75:function(e,t,r){const{MAX_SAFE_COMPONENT_LENGTH:i}=r(116),s=r(59),n=(t=e.exports={}).re=[],o=t.src=[],a=t.t={};let l=0;const c=(e,t,r)=>{const i=l++;s(i,t),a[e]=i,o[i]=t,n[i]=new RegExp(t,r?"g":void 0)};c("NUMERICIDENTIFIER","0|[1-9]\\d*"),c("NUMERICIDENTIFIERLOOSE","[0-9]+"),c("NONNUMERICIDENTIFIER","\\d*[a-zA-Z-][a-zA-Z0-9-]*"),c("MAINVERSION",`(${o[a.NUMERICIDENTIFIER]})\\.(${o[a.NUMERICIDENTIFIER]})\\.(${o[a.NUMERICIDENTIFIER]})`),c("MAINVERSIONLOOSE",`(${o[a.NUMERICIDENTIFIERLOOSE]})\\.(${o[a.NUMERICIDENTIFIERLOOSE]})\\.(${o[a.NUMERICIDENTIFIERLOOSE]})`),c("PRERELEASEIDENTIFIER",`(?:${o[a.NUMERICIDENTIFIER]}|${o[a.NONNUMERICIDENTIFIER]})`),c("PRERELEASEIDENTIFIERLOOSE",`(?:${o[a.NUMERICIDENTIFIERLOOSE]}|${o[a.NONNUMERICIDENTIFIER]})`),c("PRERELEASE",`(?:-(${o[a.PRERELEASEIDENTIFIER]}(?:\\.${o[a.PRERELEASEIDENTIFIER]})*))`),c("PRERELEASELOOSE",`(?:-?(${o[a.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[a.PRERELEASEIDENTIFIERLOOSE]})*))`),c("BUILDIDENTIFIER","[0-9A-Za-z-]+"),c("BUILD",`(?:\\+(${o[a.BUILDIDENTIFIER]}(?:\\.${o[a.BUILDIDENTIFIER]})*))`),c("FULLPLAIN",`v?${o[a.MAINVERSION]}${o[a.PRERELEASE]}?${o[a.BUILD]}?`),c("FULL",`^${o[a.FULLPLAIN]}$`),c("LOOSEPLAIN",`[v=\\s]*${o[a.MAINVERSIONLOOSE]}${o[a.PRERELEASELOOSE]}?${o[a.BUILD]}?`),c("LOOSE",`^${o[a.LOOSEPLAIN]}$`),c("GTLT","((?:<|>)?=?)"),c("XRANGEIDENTIFIERLOOSE",`${o[a.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),c("XRANGEIDENTIFIER",`${o[a.NUMERICIDENTIFIER]}|x|X|\\*`),c("XRANGEPLAIN",`[v=\\s]*(${o[a.XRANGEIDENTIFIER]})(?:\\.(${o[a.XRANGEIDENTIFIER]})(?:\\.(${o[a.XRANGEIDENTIFIER]})(?:${o[a.PRERELEASE]})?${o[a.BUILD]}?)?)?`),c("XRANGEPLAINLOOSE",`[v=\\s]*(${o[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[a.XRANGEIDENTIFIERLOOSE]})(?:${o[a.PRERELEASELOOSE]})?${o[a.BUILD]}?)?)?`),c("XRANGE",`^${o[a.GTLT]}\\s*${o[a.XRANGEPLAIN]}$`),c("XRANGELOOSE",`^${o[a.GTLT]}\\s*${o[a.XRANGEPLAINLOOSE]}$`),c("COERCE",`(^|[^\\d])(\\d{1,${i}})(?:\\.(\\d{1,${i}}))?(?:\\.(\\d{1,${i}}))?(?:$|[^\\d])`),c("COERCERTL",o[a.COERCE],!0),c("LONETILDE","(?:~>?)"),c("TILDETRIM",`(\\s*)${o[a.LONETILDE]}\\s+`,!0),t.tildeTrimReplace="$1~",c("TILDE",`^${o[a.LONETILDE]}${o[a.XRANGEPLAIN]}$`),c("TILDELOOSE",`^${o[a.LONETILDE]}${o[a.XRANGEPLAINLOOSE]}$`),c("LONECARET","(?:\\^)"),c("CARETTRIM",`(\\s*)${o[a.LONECARET]}\\s+`,!0),t.caretTrimReplace="$1^",c("CARET",`^${o[a.LONECARET]}${o[a.XRANGEPLAIN]}$`),c("CARETLOOSE",`^${o[a.LONECARET]}${o[a.XRANGEPLAINLOOSE]}$`),c("COMPARATORLOOSE",`^${o[a.GTLT]}\\s*(${o[a.LOOSEPLAIN]})$|^$`),c("COMPARATOR",`^${o[a.GTLT]}\\s*(${o[a.FULLPLAIN]})$|^$`),c("COMPARATORTRIM",`(\\s*)${o[a.GTLT]}\\s*(${o[a.LOOSEPLAIN]}|${o[a.XRANGEPLAIN]})`,!0),t.comparatorTrimReplace="$1$2$3",c("HYPHENRANGE",`^\\s*(${o[a.XRANGEPLAIN]})\\s+-\\s+(${o[a.XRANGEPLAIN]})\\s*$`),c("HYPHENRANGELOOSE",`^\\s*(${o[a.XRANGEPLAINLOOSE]})\\s+-\\s+(${o[a.XRANGEPLAINLOOSE]})\\s*$`),c("STAR","(<|>)?=?\\s*\\*"),c("GTE0","^\\s*>=\\s*0.0.0\\s*$"),c("GTE0PRE","^\\s*>=\\s*0.0.0-0\\s*$")},76:function(e,t,r){const i=r(59),{MAX_LENGTH:s,MAX_SAFE_INTEGER:n}=r(116),{re:o,t:a}=r(75),{compareIdentifiers:l}=r(163);class SemVer{constructor(e,t){if(t&&"object"==typeof t||(t={loose:!!t,includePrerelease:!1}),e instanceof SemVer){if(e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease)return e;e=e.version}else if("string"!=typeof e)throw new TypeError(`Invalid Version: ${e}`);if(e.length>s)throw new TypeError(`version is longer than ${s} characters`);i("SemVer",e,t),this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease;const r=e.trim().match(t.loose?o[a.LOOSE]:o[a.FULL]);if(!r)throw new TypeError(`Invalid Version: ${e}`);if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>n||this.major<0)throw new TypeError("Invalid major version");if(this.minor>n||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>n||this.patch<0)throw new TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map((e=>{if(/^[0-9]+$/.test(e)){const t=+e;if(t>=0&&t<n)return t}return e})):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(e){if(i("SemVer.compare",this.version,this.options,e),!(e instanceof SemVer)){if("string"==typeof e&&e===this.version)return 0;e=new SemVer(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}compareMain(e){return e instanceof SemVer||(e=new SemVer(e,this.options)),l(this.major,e.major)||l(this.minor,e.minor)||l(this.patch,e.patch)}comparePre(e){if(e instanceof SemVer||(e=new SemVer(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;let t=0;do{const r=this.prerelease[t],s=e.prerelease[t];if(i("prerelease compare",t,r,s),void 0===r&&void 0===s)return 0;if(void 0===s)return 1;if(void 0===r)return-1;if(r!==s)return l(r,s)}while(++t)}compareBuild(e){e instanceof SemVer||(e=new SemVer(e,this.options));let t=0;do{const r=this.build[t],s=e.build[t];if(i("prerelease compare",t,r,s),void 0===r&&void 0===s)return 0;if(void 0===s)return 1;if(void 0===r)return-1;if(r!==s)return l(r,s)}while(++t)}inc(e,t){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t),this.inc("pre",t);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",t),this.inc("pre",t);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":if(0===this.prerelease.length)this.prerelease=[0];else{let e=this.prerelease.length;for(;--e>=0;)"number"==typeof this.prerelease[e]&&(this.prerelease[e]++,e=-2);-1===e&&this.prerelease.push(0)}t&&(this.prerelease[0]===t?isNaN(this.prerelease[1])&&(this.prerelease=[t,0]):this.prerelease=[t,0]);break;default:throw new Error(`invalid increment argument: ${e}`)}return this.format(),this.raw=this.version,this}}e.exports=SemVer},77:function(e,t,r){"use strict";r.d(t,"a",(function(){return p}));var i=r(11),s=r(12),n=r(0),o=r.n(n),a=r(1),l=r(34);const c=({isDisabled:e=!1,agentPolicyId:t})=>{const{application:{getUrlForApp:r,navigateToApp:c}}=Object(l.e)().services,p=Object(n.useMemo)((()=>r(a.PLUGIN_ID,{path:t?`/live_queries/new?agentPolicyId=${t}`:"/live_queries/new"})),[t,r]),u=Object(n.useCallback)((e=>{!Object(l.d)(e)&&Object(l.c)(e)&&(e.preventDefault(),c(a.PLUGIN_ID,{path:t?`/live_queries/new?agentPolicyId=${t}`:"/live_queries/new"}))}),[t,c]),E=r(a.PLUGIN_ID,{path:"/packs"}),h=Object(n.useCallback)((e=>{!Object(l.d)(e)&&Object(l.c)(e)&&(e.preventDefault(),c(a.PLUGIN_ID,{path:"/packs"}))}),[c]);return o.a.createElement(i.EuiFlexGroup,{gutterSize:"l"},o.a.createElement(i.EuiFlexItem,null,o.a.createElement(i.EuiCard,{icon:o.a.createElement(i.EuiIcon,{size:"xl",type:"console"}),title:s.i18n.translate("xpack.osquery.fleetIntegration.runLiveQueriesButtonText",{defaultMessage:"Run live queries"}),href:p,onClick:u,description:"",isDisabled:e})),o.a.createElement(i.EuiFlexItem,null,o.a.createElement(i.EuiCard,{icon:o.a.createElement(i.EuiIcon,{size:"xl",type:"clock"}),title:s.i18n.translate("xpack.osquery.fleetIntegration.packsButtonText",{defaultMessage:"Packs"}),description:"",isDisabled:e,href:E,onClick:h})))};c.displayName="NavigationButtonsComponent";const p=o.a.memo(c)},78:function(e,t,r){"use strict";r.d(t,"a",(function(){return l}));var i=r(0),s=r.n(i),n=r(11),o=r(12);const a=()=>s.a.createElement(s.a.Fragment,null,s.a.createElement(n.EuiFlexGroup,null,s.a.createElement(n.EuiFlexItem,null,s.a.createElement(n.EuiCallOut,{title:o.i18n.translate("xpack.osquery.fleetIntegration.saveIntegrationCalloutTitle",{defaultMessage:"Save the integration to access the options below"}),iconType:"save"}))),s.a.createElement(n.EuiSpacer,null)),l=s.a.memo(a)}}]);