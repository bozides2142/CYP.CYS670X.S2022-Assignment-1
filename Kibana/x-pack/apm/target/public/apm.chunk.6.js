/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.apm_bundle_jsonpfunction=window.apm_bundle_jsonpfunction||[]).push([[6],{105:function(e,t,a){"use strict";function n(e){const[,t="",a=""]=e.match(/(^-?\d+)?(\w+)?/)||[];return{amount:parseInt(t,10),unit:a}}function i({amount:e,unit:t}){return`${e}${t}`}a.d(t,"a",(function(){return n})),a.d(t,"b",(function(){return i}))},116:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a(26),i=a(0),s=a(105);function l(e,t){return Object(n.isFinite)(e)&&Object(n.isFinite)(t)?"between":Object(n.isFinite)(e)?"gt":Object(n.isFinite)(t)?"lt":void 0}function r(e,t){return i.i18n.translate("xpack.apm.agentConfig.range.errorText",{defaultMessage:"{rangeType, select,\n        between {Must be between {min} and {max}}\n        gt {Must be greater than {min}}\n        lt {Must be less than {max}}\n        other {Must be an integer}\n      }",values:{min:e,max:t,rangeType:l("string"==typeof e?Object(s.a)(e).amount:e,"string"==typeof t?Object(s.a)(t).amount:t)}})}},143:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var n=a(62),i=a(72),s=a(116);function l({min:e=-1/0,max:t=1/0}={}){const a=Object(s.a)(e,t);return new n.Type("integerRt",n.string.is,((s,l)=>i.either.chain(n.string.validate(s,l),(i=>{const r=parseInt(i,10);return r>=e&&r<=t?n.success(i):n.failure(s,l,a)}))),n.identity)}},144:function(e,t,a){"use strict";a.d(t,"a",(function(){return u}));var n=a(62),i=a(72),s=a(31),l=a.n(s),r=a(105),o=a(116);function p(e){if(e){const{amount:t,unit:a}=Object(r.a)(e);if(isFinite(t)&&a)return function({amount:e,unit:t}){return l.a.duration(e,t)}({amount:t,unit:a})}}function u({min:e,max:t}){var a,s;const l=null!==(a=p(e))&&void 0!==a?a:-1/0,r=null!==(s=p(t))&&void 0!==s?s:1/0,u=Object(o.a)(e,t);return new n.Type("durationRt",n.string.is,((e,t)=>i.either.chain(n.string.validate(e,t),(a=>{const i=p(a);return void 0!==i&&i>=l&&i<=r?n.success(a):n.failure(e,t,u)}))),n.identity)}},469:function(e,t,a){"use strict";a.d(t,"a",(function(){return P}));var n=a(8),i=a(0),s=a(1),l=a.n(s),r=a(143),o=a(72),p=a(131),u=a(26);const g=i.i18n.translate("xpack.apm.fleet_integration.settings.requiredLabel",{defaultMessage:"Required"}),c=i.i18n.translate("xpack.apm.fleet_integration.settings.optionalLabel",{defaultMessage:"Optional"}),m=i.i18n.translate("xpack.apm.fleet_integration.settings.requiredFieldLabel",{defaultMessage:"Required field"});function d(e,t){return function e(a){return!a.map((a=>{var n;if("advanced_setting"===a.type)return e(a.settings);if(a.settings)return e(a.settings);const{isValid:i}=f(a,null===(n=t[a.key])||void 0===n?void 0:n.value);return i})).flat().some((e=>!e))}(e)}function f(e,t){if(!Object(u.isFinite)(t)&&Object(u.isEmpty)(t))return{isValid:!e.required,message:m};if(e.validation){const a=e.validation.decode(String(t)),n=p.PathReporter.report(a)[0];return{isValid:Object(o.isRight)(a),message:n}}return{isValid:!0,message:""}}function b({isCloudPolicy:e}){return[{type:"boolean",key:"api_key_enabled",labelAppend:c,placeholder:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.apiKeyAuthenticationPlaceholder",{defaultMessage:"API key for agent authentication"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.apiKeyAuthenticationHelpText",{defaultMessage:"Enable API Key auth between APM Server and APM Agents."}),settings:[{key:"api_key_limit",type:"integer",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.apiKeyLimitLabel",{defaultMessage:"Number of keys"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.apiKeyLimitHelpText",{defaultMessage:"Might be used for security policy compliance."}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.apiKeyLimitTitle",{defaultMessage:"Maximum number of API keys of Agent authentication"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.apiKeyLimitDescription",{defaultMessage:"Restrict number of unique API keys per minute, used for auth between APM Agents and Server."}),validation:Object(r.a)({min:1})}]},{type:"text",key:"secret_token",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.secretTokenLabel",{defaultMessage:"Secret token"})},{type:"boolean",key:"anonymous_enabled",rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousEnabledTitle",{defaultMessage:"Anonymous Agent access"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousEnabledHelpText",{defaultMessage:"Enable anonymous access to APM Server for select APM Agents."}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousEnabledDescription",{defaultMessage:"Allow anonymous access only for specified agents and/or services. This is primarily intended to allow limited access for untrusted agents, such as Real User Monitoring. When anonymous auth is enabled, only agents matching the Allowed Agents and services matching the Allowed Services configuration are allowed. See below for details on default values."}),settings:[{type:"combo",key:"anonymous_allow_agent",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousAllowAgentLabel",{defaultMessage:"Allowed agents"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousAllowAgentHelpText",{defaultMessage:"Allowed agent names for anonymous access."})},{type:"combo",key:"anonymous_allow_service",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousAllowServiceLabel",{defaultMessage:"Allowed services"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousAllowServiceHelpText",{defaultMessage:"Allowed service names for anonymous access."})},{key:"anonymous_rate_limit_ip_limit",type:"integer",label:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousRateLimitIpLimitLabel",{defaultMessage:"Rate limit (IP limit)"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousRateLimitIpLimitHelpText",{defaultMessage:"Number of unique client IPs for which a distinct rate limit will be maintained."}),validation:Object(r.a)({min:1})},{key:"anonymous_rate_limit_event_limit",type:"integer",label:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousRateLimitEventLimitLabel",{defaultMessage:"Event rate limit (event limit)"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.anonymousRateLimitEventLimitHelpText",{defaultMessage:"Maximum number of events per client IP per second."}),validation:Object(r.a)({min:1})}]}]}var y=a(144);function x({isCloudPolicy:e}){return[{type:"text",key:"host",labelAppend:g,readOnly:e,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.hostLabel",{defaultMessage:"Host"}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.hostTitle",{defaultMessage:"Server configuration"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.hostDescription",{defaultMessage:"Host defines the host and port the server is listening on. URL is the unchangeable, publicly reachable server URL for deployments on Elastic Cloud or ECK."}),required:!0},{type:"text",key:"url",labelAppend:g,readOnly:e,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.urlLabel",{defaultMessage:"URL"}),required:!0},{type:"advanced_setting",settings:[{key:"max_header_bytes",type:"integer",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.maxHeaderBytesLabel",{defaultMessage:"Maximum size of a request's header (bytes)"}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.maxHeaderBytesTitle",{defaultMessage:"Limits"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.maxHeaderBytesDescription",{defaultMessage:"Set limits on request headers sizes and timing configurations."}),validation:Object(r.a)({min:1})},{key:"idle_timeout",type:"duration",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.idleTimeoutLabel",{defaultMessage:"Idle time before underlying connection is closed"}),validation:Object(y.a)({min:"1ms"})},{key:"read_timeout",type:"duration",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.readTimeoutLabel",{defaultMessage:"Maximum duration for reading an entire request"}),validation:Object(y.a)({min:"1ms"})},{key:"shutdown_timeout",type:"duration",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.shutdownTimeoutLabel",{defaultMessage:"Maximum duration before releasing resources when shutting down"}),validation:Object(y.a)({min:"1ms"})},{key:"write_timeout",type:"duration",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.writeTimeoutLabel",{defaultMessage:"Maximum duration for writing a response"}),validation:Object(y.a)({min:"1ms"})},{key:"max_event_bytes",type:"integer",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.maxEventBytesLabel",{defaultMessage:"Maximum size per event (bytes)"}),validation:Object(r.a)({min:1})},{key:"max_connections",type:"integer",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.maxConnectionsLabel",{defaultMessage:"Simultaneously accepted connections"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.maxConnectionsHelpText",{defaultMessage:"0 for unlimited"}),validation:Object(r.a)({min:0})},{key:"response_headers",type:"area",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.responseHeadersLabel",{defaultMessage:"Custom HTTP headers added to HTTP responses"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.responseHeadersHelpText",{defaultMessage:"Might be used for security policy compliance."}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.responseHeadersTitle",{defaultMessage:"Custom headers"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.responseHeadersDescription",{defaultMessage:"Custom HTTP headers added to HTTP responses"})},{key:"capture_personal_data",type:"boolean",rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.capturePersonalDataTitle",{defaultMessage:"Capture personal data"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.capturePersonalDataDescription",{defaultMessage:"Capture personal data such as IP or User Agent"})},{key:"default_service_environment",type:"text",labelAppend:c,label:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.defaultServiceEnvironmentLabel",{defaultMessage:"Default Service Environment"}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.defaultServiceEnvironmentTitle",{defaultMessage:"Service configuration"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.defaultServiceEnvironmentDescription",{defaultMessage:"Default service environment to record in events which have no service environment defined."})},{key:"expvar_enabled",type:"boolean",labelAppend:c,rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.expvarEnabledTitle",{defaultMessage:"Enable APM Server Golang expvar support"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.expvarEnabledDescription",{defaultMessage:"Exposed under /debug/vars"})}]}]}const _="enable_rum";const h="tail_sampling_enabled";const k="tls_enabled";var v=a(29),M=a.n(v),A=a(11);const T=M.a.div.withConfig({displayName:"FixedHeightDiv",componentId:"sc-ycdtce-0"})(["height:300px;"]),E=i.i18n.translate("xpack.apm.fleet_integration.settings.enabledLabel",{defaultMessage:"Enabled"}),w=i.i18n.translate("xpack.apm.fleet_integration.settings.disabledLabel",{defaultMessage:"Disabled"});function S({row:e,value:t,onChange:a}){switch(e.type){case"boolean":return l.a.createElement(n.EuiSwitch,{label:e.placeholder||(t?E:w),checked:t,onChange:t=>{a(e.key,t.target.checked)}});case"duration":case"text":return l.a.createElement(n.EuiFieldText,{readOnly:e.readOnly,value:t,prepend:e.readOnly?l.a.createElement(n.EuiIcon,{type:"lock"}):void 0,onChange:t=>{a(e.key,t.target.value)}});case"area":return l.a.createElement(n.EuiTextArea,{value:t,onChange:t=>{a(e.key,t.target.value)}});case"bytes":case"integer":return l.a.createElement(n.EuiFieldNumber,{value:t,onChange:t=>{a(e.key,t.target.value)}});case"combo":{const s=Array.isArray(t)?t.map((e=>({label:e}))):[];return l.a.createElement(n.EuiComboBox,{noSuggestions:!0,placeholder:i.i18n.translate("xpack.apm.fleet_integration.settings.selectOrCreateOptions",{defaultMessage:"Select or create options"}),options:s,selectedOptions:s,onChange:t=>{a(e.key,t.map((({label:e})=>e)))},onCreateOption:n=>{a(e.key,[...t,n])},isClearable:!0})}case"yaml":return l.a.createElement(T,null,l.a.createElement(A.CodeEditor,{languageId:"yaml",width:"100%",height:"300px",value:t,onChange:t=>{a(e.key,t)},options:{ariaLabel:i.i18n.translate("xpack.apm.fleet_integration.settings.yamlCodeEditor",{defaultMessage:"YAML Code Editor"}),wordWrap:"off",tabSize:2,lineNumbers:"off",lineNumbersMinChars:0,folding:!1,lineDecorationsWidth:0,overviewRulerBorder:!1}}));default:throw new Error(`Unknown type "${e.type}"`)}}function L({settingsSection:e,vars:t,onChange:a}){const{title:s,subtitle:r,settings:o,isBeta:p,isPlatinumLicence:u}=e;return l.a.createElement(n.EuiPanel,null,l.a.createElement(n.EuiFlexGroup,{direction:"column",gutterSize:"s"},l.a.createElement(n.EuiFlexItem,null,l.a.createElement(n.EuiTitle,{size:"s"},l.a.createElement("h3",null,s,"  ",u&&l.a.createElement(n.EuiBetaBadge,{label:i.i18n.translate("xpack.apm.fleet_integration.settings.platinumBadgeLabel",{defaultMessage:"Platinum"}),title:i.i18n.translate("xpack.apm.fleet_integration.settings.platinumBadgeTooltipTitle",{defaultMessage:"Platinum license required"}),tooltipContent:i.i18n.translate("xpack.apm.fleet_integration.settings.platinumBadgeTooltipDescription",{defaultMessage:"Configurations are saved but ignored if your Kibana licence is not Platinum."})})," ",p&&l.a.createElement(n.EuiBetaBadge,{color:"subdued",label:i.i18n.translate("xpack.apm.fleet_integration.settings.betaBadgeLabel",{defaultMessage:"Beta"}),tooltipContent:i.i18n.translate("xpack.apm.fleet_integration.settings.betaBadgeTooltip",{defaultMessage:"This module is not GA. Please help us by reporting any bugs."})})))),r&&l.a.createElement(n.EuiFlexItem,null,l.a.createElement(n.EuiText,{size:"s",color:"subdued"},r))),l.a.createElement(n.EuiHorizontalRule,{margin:"s"}),o.map((e=>function({initialSetting:e,vars:t,onChange:a}){return function e(i){if("advanced_setting"===i.type)return l.a.createElement(C,null,i.settings.map((t=>e(t))));const{key:s}=i,r=null==t?void 0:t[s];if(!r)return null;const{value:o}=r,{isValid:p,message:u}=f(i,o);return l.a.createElement(l.a.Fragment,{key:s},l.a.createElement(n.EuiDescribedFormGroup,{title:l.a.createElement("h3",null,i.rowTitle),description:i.rowDescription},l.a.createElement(n.EuiFormRow,{label:i.label,isInvalid:!p,error:p?void 0:u,helpText:l.a.createElement(n.EuiText,{size:"xs"},i.helpText),labelAppend:l.a.createElement(n.EuiText,{size:"xs",color:"subdued"},i.labelAppend)},l.a.createElement(S,{row:i,onChange:a,value:o}))),i.settings&&o&&i.settings.map((t=>e(t))))}(e)}({initialSetting:e,vars:t,onChange:a}))))}function C({children:e}){const[t,a]=Object(s.useState)(!1);return l.a.createElement(l.a.Fragment,null,l.a.createElement(n.EuiFlexGroup,null,l.a.createElement(n.EuiFlexItem,null),l.a.createElement(n.EuiFlexItem,null,l.a.createElement(n.EuiFlexGroup,null,l.a.createElement(n.EuiFlexItem,{grow:!1},l.a.createElement(n.EuiButtonEmpty,{iconType:t?"arrowDown":"arrowRight",onClick:()=>{a((e=>!e))}},i.i18n.translate("xpack.apm.fleet_integration.settings.advancedOptionsLavel",{defaultMessage:"Advanced options"})))))),t&&l.a.createElement(l.a.Fragment,null,l.a.createElement(n.EuiHorizontalRule,null),e))}function P({vars:e={},isCloudPolicy:t,updateAPMPolicy:a}){const{apmSettings:r,rumSettings:o,tlsSettings:p,agentAuthorizationSettings:u,tailSamplingSettings:m}=Object(s.useMemo)((()=>({apmSettings:x({isCloudPolicy:t}),rumSettings:[{key:_,type:"boolean",rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.enableRumTitle",{defaultMessage:"Enable RUM"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.enableRumDescription",{defaultMessage:"Enable Real User Monitoring (RUM)"}),settings:[{key:"rum_allow_origins",type:"combo",label:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumAllowOriginsLabel",{defaultMessage:"Origin Headers"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumAllowOriginsHelpText",{defaultMessage:"Allowed Origin headers to be sent by User Agents."})},{key:"rum_allow_headers",type:"combo",label:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumAllowHeaderLabel",{defaultMessage:"Access-Control-Allow-Headers"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumAllowHeaderHelpText",{defaultMessage:'Supported Access-Control-Allow-Headers in addition to "Content-Type", "Content-Encoding" and "Accept".'}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumAllowHeaderTitle",{defaultMessage:"Custom headers"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumAllowHeaderDescription",{defaultMessage:"Configure authentication for the agent"})},{key:"rum_response_headers",type:"area",label:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumResponseHeadersLabel",{defaultMessage:"Custom HTTP response headers"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumResponseHeadersHelpText",{defaultMessage:"Added to RUM responses, e.g. for security policy compliance."})},{type:"advanced_setting",settings:[{key:"rum_library_pattern",type:"text",label:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumLibraryPatternLabel",{defaultMessage:"Library Frame Pattern"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumLibraryPatternHelpText",{defaultMessage:"Identify library frames by matching a stacktrace frame's file_name and abs_path against this regexp."})},{key:"rum_exclude_from_grouping",type:"text",label:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumExcludeFromGroupingLabel",{defaultMessage:"Exclude from grouping"}),labelAppend:c,helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.rumExcludeFromGroupingHelpText",{defaultMessage:"Exclude stacktrace frames from error group calculations by matching a stacktrace frame's `file_name` against this regexp."})}]}]}],tlsSettings:[{key:k,rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsEnabledTitle",{defaultMessage:"Enable TLS"}),type:"boolean",settings:[{key:"tls_certificate",type:"text",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsCertificateLabel",{defaultMessage:"File path to server certificate"}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsCertificateTitle",{defaultMessage:"TLS certificate"}),labelAppend:g,required:!0},{key:"tls_key",type:"text",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsKeyLabel",{defaultMessage:"File path to server certificate key"}),labelAppend:g,required:!0},{key:"tls_supported_protocols",type:"combo",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsSupportedProtocolsLabel",{defaultMessage:"Supported protocol versions"}),labelAppend:c},{key:"tls_cipher_suites",type:"combo",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsCipherSuitesLabel",{defaultMessage:"Cipher suites for TLS connections"}),helpText:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsCipherSuitesHelpText",{defaultMessage:"Not configurable for TLS 1.3."}),labelAppend:c},{key:"tls_curve_types",type:"combo",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.tlsCurveTypesLabel",{defaultMessage:"Curve types for ECDHE based cipher suites"}),labelAppend:c}]}],agentAuthorizationSettings:b({isCloudPolicy:t}),tailSamplingSettings:[{key:h,rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingEnabledTitle",{defaultMessage:"Enable tail-based sampling"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.enableTailSamplingDescription",{defaultMessage:"Enable tail-based sampling."}),type:"boolean",settings:[{key:"tail_sampling_interval",type:"duration",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingInterval",{defaultMessage:"Tail sampling interval"}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingIntervalTitle",{defaultMessage:"Interval"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingIntervalDescription",{defaultMessage:"Interval for synchronization between multiple APM Servers. Should be in the order of tens of seconds or low minutes."}),labelAppend:c,required:!1,validation:Object(y.a)({min:"1s"})},{key:"tail_sampling_policies",type:"yaml",label:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingPolicies",{defaultMessage:"Tail sampling policies"}),rowTitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingPoliciesTitle",{defaultMessage:"Policies"}),rowDescription:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.tailSamplingPoliciesDescription",{defaultMessage:"Policies map trace events to a sample rate. Each policy must specify a sample rate. Trace events are matched to policies in the order specified. All policy conditions must be true for a trace event to match. Each policy list should conclude with a policy that only specifies a sample rate. This final policy is used to catch remaining trace events that don’t match a stricter policy."}),required:!0}]}]})),[t]);function f(t,n){const i=function(e,t,a){return{...e,[t]:{...e[t],value:a}}}(e,t,n),s=d(r,i)&&function(e,t){return!e.enable_rum.value||d(t,e)}(i,o)&&function(e,t){return!e.tls_enabled.value||d(t,e)}(i,p)&&d(u,i)&&function(e,t){return!e.tail_sampling_enabled.value||d(t,e)}(i,m);a(i,s)}const v=[{id:"apm",title:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.settings.title",{defaultMessage:"General"}),subtitle:i.i18n.translate("xpack.apm.fleet_integration.settings.apm.settings.subtitle",{defaultMessage:"Settings for the APM integration."}),settings:r},{id:"rum",title:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.settings.title",{defaultMessage:"Real User Monitoring"}),subtitle:i.i18n.translate("xpack.apm.fleet_integration.settings.rum.settings.subtitle",{defaultMessage:"Manage the configuration of the RUM JS agent."}),settings:o},{id:"tls",title:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.settings.title",{defaultMessage:"TLS Settings"}),subtitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tls.settings.subtitle",{defaultMessage:"Settings for TLS certification."}),settings:p},{id:"agentAuthorization",title:i.i18n.translate("xpack.apm.fleet_integration.settings.agentAuthorization.settings.title",{defaultMessage:"Agent authorization"}),settings:u},...e.tail_sampling_enabled?[{id:"tailSampling",title:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.settings.title",{defaultMessage:"Tail-based sampling"}),subtitle:i.i18n.translate("xpack.apm.fleet_integration.settings.tailSampling.settings.subtitle",{defaultMessage:"Manage tail-based sampling for services and traces."}),settings:m,isBeta:!1,isPlatinumLicence:!0}]:[]];return l.a.createElement(l.a.Fragment,null,v.map((t=>l.a.createElement(l.a.Fragment,{key:t.id},l.a.createElement(L,{settingsSection:t,vars:e,onChange:f}),l.a.createElement(n.EuiSpacer,null)))))}}}]);