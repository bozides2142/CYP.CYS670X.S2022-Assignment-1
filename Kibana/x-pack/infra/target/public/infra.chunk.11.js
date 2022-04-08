/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.infra_bundle_jsonpfunction=window.infra_bundle_jsonpfunction||[]).push([[11],{116:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var r=a(4),n=a(70);function i(){const[e]=Object(r.useUiSetting$)(n.UI_SETTINGS.DATEFORMAT_TZ);return e&&"Browser"!==e?e:"local"}},132:function(e,t,a){"use strict";a.d(t,"i",(function(){return p})),a.d(t,"d",(function(){return g})),a.d(t,"f",(function(){return f})),a.d(t,"j",(function(){return b})),a.d(t,"k",(function(){return h})),a.d(t,"h",(function(){return y})),a.d(t,"g",(function(){return E})),a.d(t,"a",(function(){return v})),a.d(t,"e",(function(){return O})),a.d(t,"c",(function(){return T})),a.d(t,"b",(function(){return j}));var r=a(2),n=a.n(r),i=a(67),l=a(27),o=a(65),s=a.n(o),c=a(1),u=a(13),d=a(18),m=a(12);const p={headerFormatter:e=>s()(e.value).format("Y-MM-DD HH:mm:ss")},g=20,f={s:c.i18n.translate("xpack.infra.alerts.timeLabels.seconds",{defaultMessage:"seconds"}),m:c.i18n.translate("xpack.infra.alerts.timeLabels.minutes",{defaultMessage:"minutes"}),h:c.i18n.translate("xpack.infra.alerts.timeLabels.hours",{defaultMessage:"hours"}),d:c.i18n.translate("xpack.infra.alerts.timeLabels.days",{defaultMessage:"days"})},b=(e,t)=>Object(r.useMemo)((()=>"number"==typeof e&&"number"==typeof t?Object(i.niceTimeFormatter)([e,t]):e=>`${e}`),[e,t]),h=m.a,y=(e,t=!1)=>{let a=null,r=null;const n=e.reduce(((e,t)=>(t.points.forEach((t=>{const a=e[t.timestamp]||[];e[t.timestamp]=[...a,t.value]})),e)),{});Object.values(n).forEach((e=>{const n=t?Object(l.sum)(e):Object(l.max)(e),i=Object(l.min)(e);n&&(!r||n>r)&&(r=n),i&&(!a||i<a)&&(a=i)}));const i=Object.keys(n).map(Number),o=Object(l.min)(i)||0,s=Object(l.max)(i)||0;return{yMin:a||0,yMax:r||0,xMin:o,xMax:s}},E=e=>e?i.DARK_THEME:i.LIGHT_THEME,x=({children:e})=>n.a.createElement("div",{style:{width:"100%",height:150,display:"flex",justifyContent:"center",alignItems:"center"}},e),v=({children:e})=>n.a.createElement("div",{style:{width:"100%",height:150}},e),O=()=>n.a.createElement(x,null,n.a.createElement(u.EuiText,{color:"subdued","data-test-subj":"noChartData"},n.a.createElement(d.FormattedMessage,{id:"xpack.infra.alerts.charts.noDataMessage",defaultMessage:"No chart data available"}))),T=()=>n.a.createElement(x,null,n.a.createElement(u.EuiText,{color:"subdued","data-test-subj":"loadingData"},n.a.createElement(d.FormattedMessage,{id:"xpack.infra.alerts.charts.loadingMessage",defaultMessage:"Loading"}))),j=()=>n.a.createElement(x,null,n.a.createElement(u.EuiText,{color:"subdued","data-test-subj":"chartErrorState"},n.a.createElement(d.FormattedMessage,{id:"xpack.infra.alerts.charts.errorMessage",defaultMessage:"Uh oh, something went wrong"})))},173:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var r=a(13),n=a(1),i=a(2),l=a.n(i);const o=({options:e,onChange:t,fields:a,errorOptions:o})=>{const s=Object(i.useCallback)((e=>{const a=e.map((e=>e.label));t(a)}),[t]),c=Array.isArray(e.groupBy)?e.groupBy.map((e=>({label:e,color:null!=o&&o.includes(e)?"danger":void 0}))):e.groupBy?[{label:e.groupBy,color:null!=o&&o.includes(e.groupBy)?"danger":void 0}]:[];return l.a.createElement(r.EuiComboBox,{"data-test-subj":"metricsExplorer-groupBy",placeholder:n.i18n.translate("xpack.infra.metricsExplorer.groupByLabel",{defaultMessage:"Everything"}),"aria-label":n.i18n.translate("xpack.infra.metricsExplorer.groupByAriaLabel",{defaultMessage:"Graph per"}),fullWidth:!0,singleSelection:!1,selectedOptions:c,options:a.filter((e=>e.aggregatable&&"string"===e.type)).map((e=>({label:e.name}))),onChange:s,isClearable:!0})}},174:function(e,t,a){"use strict";a.d(t,"a",(function(){return m}));var r=a(10),n=a.n(r),i=a(2),l=a(27),o=a(98),s=a(112),c=a(4),u=a(19),d=a(84);function m(e,t,a,r,m,p,g=!0){var f;const b=null===(f=Object(c.useKibana)().services.http)||void 0===f?void 0:f.fetch,[h,y]=Object(i.useState)(null),[E,x]=Object(i.useState)(!0),[v,O]=Object(i.useState)(null),[T,j]=Object(i.useState)(null),[k,M]=Object(i.useState)(null),C=n.a.parse(r.from),F=n.a.parse(r.to,{roundUp:!0}),[,w]=Object(d.c)({cancelPreviousOn:"creation",createPromise:()=>(x(!0),C&&F?b?t?b?b("/api/infra/metrics_explorer",{method:"POST",body:JSON.stringify({forceInterval:e.forceInterval,dropLastBucket:null==e.dropLastBucket||e.dropLastBucket,metrics:"count"===e.aggregation?[{aggregation:"count"}]:e.metrics.map((e=>({aggregation:e.aggregation,field:e.field}))),groupBy:e.groupBy,afterKey:m,limit:e.limit,indexPattern:t.metricAlias,filterQuery:e.filterQuery&&Object(s.a)(e.filterQuery,a)||void 0,timerange:{...r,from:C.valueOf(),to:F.valueOf()}})}):Promise.reject(new Error("HTTP service is unavailable")):Promise.reject(new Error("Source is unavailable")):Promise.reject(new Error("HTTP service is unavailable")):Promise.reject(new Error("Unalble to parse timerange"))),onResolve:t=>{x(!1);const a=Object(u.b)(o.e)(t);if(a){if(v&&T&&v.pageInfo.afterKey!==a.pageInfo.afterKey&&(n=T,i=e,Object(l.isEqual)(n,i))&&Object(l.isEqual)(r,k)&&m){const{series:e}=v;O({...a,series:[...e,...a.series]})}else O(a);j(e),M(r),y(null)}var n,i},onReject:e=>{y(e),x(!1)}},[t,r,e,p,m]);return Object(i.useEffect)((()=>{g&&w()}),[w,g]),{error:h,loading:E,data:v,loadData:w}}},175:function(e,t,a){"use strict";a.d(t,"a",(function(){return u}));var r=a(67),n=a(27),i=a(2),l=a.n(i),o=a(6),s=a(90);const c=.3,u=({threshold:e,sortedThresholds:t,comparator:a,color:i,id:u,firstTimestamp:d,lastTimestamp:m,domain:p})=>{if(!a||!e)return null;const g=[o.b.GT,o.b.GT_OR_EQ].includes(a),f=[o.b.LT,o.b.LT_OR_EQ].includes(a);return l.a.createElement(l.a.Fragment,null,l.a.createElement(r.LineAnnotation,{id:`${u}-thresholds`,domainType:r.AnnotationDomainType.YDomain,"data-test-subj":"threshold-line",dataValues:t.map((e=>({dataValue:e}))),style:{line:{strokeWidth:2,stroke:Object(s.b)(i),opacity:1}}}),2===t.length&&a===o.b.BETWEEN?l.a.createElement(l.a.Fragment,null,l.a.createElement(r.RectAnnotation,{id:`${u}-lower-threshold`,"data-test-subj":"between-rect",style:{fill:Object(s.b)(i),opacity:c},dataValues:[{coordinates:{x0:d,x1:m,y0:Object(n.first)(e),y1:Object(n.last)(e)}}]})):null,2===t.length&&a===o.b.OUTSIDE_RANGE?l.a.createElement(l.a.Fragment,null,l.a.createElement(r.RectAnnotation,{id:`${u}-lower-threshold`,"data-test-subj":"outside-range-lower-rect",style:{fill:Object(s.b)(i),opacity:c},dataValues:[{coordinates:{x0:d,x1:m,y0:p.min,y1:Object(n.first)(e)}}]}),l.a.createElement(r.RectAnnotation,{id:`${u}-upper-threshold`,"data-test-subj":"outside-range-upper-rect",style:{fill:Object(s.b)(i),opacity:c},dataValues:[{coordinates:{x0:d,x1:m,y0:Object(n.last)(e),y1:p.max}}]})):null,f&&null!=Object(n.first)(e)?l.a.createElement(r.RectAnnotation,{id:`${u}-upper-threshold`,"data-test-subj":"below-rect",style:{fill:Object(s.b)(i),opacity:c},dataValues:[{coordinates:{x0:d,x1:m,y0:p.min,y1:Object(n.first)(e)}}]}):null,g&&null!=Object(n.first)(e)?l.a.createElement(r.RectAnnotation,{id:`${u}-upper-threshold`,"data-test-subj":"above-rect",style:{fill:Object(s.b)(i),opacity:c},dataValues:[{coordinates:{x0:d,x1:m,y0:Object(n.first)(e),y1:p.max}}]}):null)}},292:function(e,t,a){"use strict";a.r(t),a.d(t,"defaultExpression",(function(){return D})),a.d(t,"Expressions",(function(){return P}));var r=a(13),n=a(1),i=a(18),l=a(27),o=a(2),s=a.n(o),c=a(72),u=a(6),d=a(133),m=a(20),p=a(173),g=a(147),f=a(112),b=a(67),h=a(90),y=a(117),E=a(94),x=a(131),v=a(118),O=a(174);var T=a(146),j=a(132),k=a(175);const M=({expression:e,derivedIndexPattern:t,source:a,filterQuery:n,groupBy:c})=>{var u,d;const{loading:p,data:g}=((e,t,a,r,n)=>{const{timeSize:i,timeUnit:l}=e||{timeSize:1,timeUnit:"m"},s=Object(o.useMemo)((()=>({limit:1,forceInterval:!0,dropLastBucket:!1,groupBy:n,filterQuery:r,metrics:[{field:e.metric,aggregation:e.aggType}],aggregation:e.aggType||"avg"})),[e.aggType,e.metric,r,n]),c=Object(o.useMemo)((()=>({interval:`>=${i||1}${l}`,from:`now-${20*(i||1)}${l}`,to:"now"})),[i,l]);return Object(O.a)(s,null==a?void 0:a.configuration,t,c,null,null)})(e,t,a,n,c),{uiSettings:f}=Object(m.b)().services,M={field:e.metric,aggregation:e.aggType,color:h.a.color0},C=(null==f?void 0:f.get("theme:darkMode"))||!1,F=Object(o.useMemo)((()=>{var e,t;const a=Object(l.first)(null==g?void 0:g.series),r=null===(e=Object(l.first)(null==a?void 0:a.rows))||void 0===e?void 0:e.timestamp,n=null===(t=Object(l.last)(null==a?void 0:a.rows))||void 0===t?void 0:t.timestamp;return null==r||null==n?e=>`${e}`:Object(b.niceTimeFormatter)([r,n])}),[null==g?void 0:g.series]),w=Object(o.useCallback)(Object(x.a)(M),[e]);if(p||!g)return s.a.createElement(j.c,null);const S=e.threshold.slice().sort(),A=null!==(u=null===(d=e.warningThreshold)||void 0===d?void 0:d.slice().sort())&&void 0!==u?u:[],B=[...S,...A].sort(),R=Object(l.first)(g.series);if(!R||!R.rows||0===R.rows.length)return s.a.createElement(j.e,null);const L={...R,rows:R.rows.map((e=>{const t={...e};return B.forEach(((e,a)=>{t[Object(T.a)(M,`threshold_${a}`)]=e})),t}))},I=Object(l.first)(R.rows).timestamp,z=Object(l.last)(R.rows).timestamp,D=Object(v.a)(L,[M],!1),P={max:1.1*Math.max(D.max,Object(l.last)(B)||D.max),min:.9*Math.min(D.min,Object(l.first)(B)||D.min)};P.min===Object(l.first)(e.threshold)&&(P.min=.9*P.min);const{timeSize:N,timeUnit:G}=e,U=j.f[G];return s.a.createElement(s.a.Fragment,null,s.a.createElement(j.a,null,s.a.createElement(b.Chart,null,s.a.createElement(y.a,{type:E.b.bar,metric:M,id:"0",series:L,stack:!1}),s.a.createElement(k.a,{comparator:e.comparator,threshold:e.threshold,sortedThresholds:S,color:h.a.color1,id:"critical",firstTimestamp:I,lastTimestamp:z,domain:P}),e.warningComparator&&e.warningThreshold&&s.a.createElement(k.a,{comparator:e.warningComparator,threshold:e.warningThreshold,sortedThresholds:A,color:h.a.color5,id:"warning",firstTimestamp:I,lastTimestamp:z,domain:P}),s.a.createElement(b.Axis,{id:"timestamp",position:b.Position.Bottom,showOverlappingTicks:!0,tickFormat:F}),s.a.createElement(b.Axis,{id:"values",position:b.Position.Left,tickFormat:w,domain:P}),s.a.createElement(b.Settings,{tooltip:j.i,theme:Object(j.g)(C)}))),s.a.createElement("div",{style:{textAlign:"center"}},"ALL"!==L.id?s.a.createElement(r.EuiText,{size:"xs",color:"subdued"},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alerts.dataTimeRangeLabelWithGrouping",defaultMessage:"Last {lookback} {timeLabel} of data for {id}",values:{id:L.id,timeLabel:U,lookback:20*N}})):s.a.createElement(r.EuiText,{size:"xs",color:"subdued"},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alerts.dataTimeRangeLabel",defaultMessage:"Last {lookback} {timeLabel}",values:{timeLabel:U,lookback:20*N}}))))};var C=a(17);const F=(e,t)=>{const a=t?new RegExp(/0?\./):".",r=String(e).replace(a,"").length;return parseFloat((t?100*e:e/100).toPrecision(r))};let w;!function(e){e.COUNT="count",e.AVERAGE="avg",e.SUM="sum",e.MIN="min",e.MAX="max",e.RATE="rate",e.CARDINALITY="cardinality",e.P95="p95",e.P99="p99"}(w||(w={}));const S={...c.builtInComparators,[u.b.OUTSIDE_RANGE]:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.outsideRangeLabel",{defaultMessage:"Is not between"}),value:u.b.OUTSIDE_RANGE,requiredValues:2}},A=Object(C.euiStyled)(r.EuiFlexGroup)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 -4px;
`,B=C.euiStyled.div`
  padding: 0 4px;
`,R=Object(C.euiStyled)(r.EuiHealth)`
  margin-left: 4px;
`,L=e=>{var t,a;const[d,m]=Object(o.useState)(!0),p=Object(o.useCallback)((()=>m(!d)),[d]),{children:g,setRuleParams:f,expression:b,errors:h,expressionId:y,remove:E,fields:x,canDelete:v}=e,{aggType:O=w.MAX,metric:T,comparator:j=u.b.GT,threshold:k=[],warningThreshold:M=[],warningComparator:C}=b,[S,L]=Object(o.useState)(Boolean(null==M?void 0:M.length)),D=Object(o.useMemo)((()=>Boolean(T&&T.endsWith(".pct"))),[T]),P=Object(o.useCallback)((e=>{f(y,{...b,aggType:e,metric:"count"===e?void 0:b.metric})}),[y,b,f]),N=Object(o.useCallback)((e=>{f(y,{...b,metric:e})}),[y,b,f]),G=Object(o.useCallback)((e=>{f(y,{...b,comparator:e})}),[y,b,f]),U=Object(o.useCallback)((e=>{f(y,{...b,warningComparator:e})}),[y,b,f]),Q=Object(o.useCallback)((e=>D?e.map((e=>(e=>F(e,!1))(e))):e),[D]),$=Object(o.useCallback)((e=>{const t=Q(e);t.join()!==b.threshold.join()&&f(y,{...b,threshold:t})}),[y,b,Q,f]),W=Object(o.useCallback)((e=>{var t;const a=Q(e);a.join()!==(null===(t=b.warningThreshold)||void 0===t?void 0:t.join())&&f(y,{...b,warningThreshold:a})}),[y,b,Q,f]),q=Object(o.useCallback)((()=>{S?(L(!1),f(y,Object(l.omit)(b,"warningComparator","warningThreshold"))):(L(!0),f(y,{...b,warningComparator:j,warningThreshold:[]}))}),[S,L,f,j,b,y]),_=s.a.createElement(I,{comparator:j,threshold:k,updateComparator:G,updateThreshold:$,errors:null!==(t=h.critical)&&void 0!==t?t:{},isMetricPct:D}),H=S&&s.a.createElement(I,{comparator:C||j,threshold:M,updateComparator:U,updateThreshold:W,errors:null!==(a=h.warning)&&void 0!==a?a:{},isMetricPct:D});return s.a.createElement(s.a.Fragment,null,s.a.createElement(r.EuiFlexGroup,{gutterSize:"xs"},s.a.createElement(r.EuiFlexItem,{grow:!1},s.a.createElement(r.EuiButtonIcon,{iconType:d?"arrowDown":"arrowRight",onClick:p,"aria-label":n.i18n.translate("xpack.infra.metrics.alertFlyout.expandRowLabel",{defaultMessage:"Expand row."})})),s.a.createElement(r.EuiFlexItem,{grow:!0},s.a.createElement(A,null,s.a.createElement(B,null,s.a.createElement(c.WhenExpression,{customAggTypesOptions:z,aggType:O,onChangeSelectedAggType:P})),"count"!==O&&s.a.createElement(B,null,s.a.createElement(c.OfExpression,{customAggTypesOptions:z,aggField:T,fields:x.map((e=>({normalizedType:e.type,name:e.name}))),aggType:O,errors:h,onChangeSelectedAggField:N,helpText:s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.ofExpression.helpTextDetail",defaultMessage:"Can't find a metric? {documentationLink}.",values:{documentationLink:s.a.createElement(r.EuiLink,{href:"https://www.elastic.co/guide/en/observability/current/configure-settings.html",target:"BLANK"},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.ofExpression.popoverLinkLabel",defaultMessage:"Learn how to add more data"}))}}),"data-test-subj":"ofExpression"})),!S&&_),S&&s.a.createElement(s.a.Fragment,null,s.a.createElement(A,null,_,s.a.createElement(R,{color:"danger"},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.criticalThreshold",defaultMessage:"Alert"}))),s.a.createElement(A,null,H,s.a.createElement(R,{color:"warning"},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.warningThreshold",defaultMessage:"Warning"})),s.a.createElement(r.EuiButtonIcon,{"aria-label":n.i18n.translate("xpack.infra.metrics.alertFlyout.removeWarningThreshold",{defaultMessage:"Remove warningThreshold"}),iconSize:"s",color:"text",iconType:"crossInACircleFilled",onClick:q}))),!S&&s.a.createElement(s.a.Fragment,null," ",s.a.createElement(r.EuiSpacer,{size:"xs"}),s.a.createElement(A,null,s.a.createElement(r.EuiButtonEmpty,{color:"primary",flush:"left",size:"xs",iconType:"plusInCircleFilled",onClick:q},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.addWarningThreshold",defaultMessage:"Add warning threshold"}))))),v&&s.a.createElement(r.EuiFlexItem,{grow:!1},s.a.createElement(r.EuiButtonIcon,{"aria-label":n.i18n.translate("xpack.infra.metrics.alertFlyout.removeCondition",{defaultMessage:"Remove condition"}),color:"danger",iconType:"trash",onClick:()=>E(y)}))),d?s.a.createElement("div",{style:{padding:"0 0 0 28px"}},g):null,s.a.createElement(r.EuiSpacer,{size:"s"}))},I=({updateComparator:e,updateThreshold:t,threshold:a,isMetricPct:n,comparator:i,errors:l})=>{const d=Object(o.useMemo)((()=>n?a.map((e=>(e=>F(e,!0))(e))):a),[a,n]);return s.a.createElement(s.a.Fragment,null,s.a.createElement(B,null,s.a.createElement(c.ThresholdExpression,{thresholdComparator:i||u.b.GT,threshold:d,customComparators:S,onChangeSelectedThresholdComparator:e,onChangeSelectedThreshold:t,errors:l})),n&&s.a.createElement("div",{style:{alignSelf:"center"}},s.a.createElement(r.EuiText,{size:"s"},"%")))},z={avg:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.avg",{defaultMessage:"Average"}),fieldRequired:!0,validNormalizedTypes:["number"],value:w.AVERAGE},max:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.max",{defaultMessage:"Max"}),fieldRequired:!0,validNormalizedTypes:["number","date"],value:w.MAX},min:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.min",{defaultMessage:"Min"}),fieldRequired:!0,validNormalizedTypes:["number","date"],value:w.MIN},cardinality:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.cardinality",{defaultMessage:"Cardinality"}),fieldRequired:!1,value:w.CARDINALITY,validNormalizedTypes:["number"]},rate:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.rate",{defaultMessage:"Rate"}),fieldRequired:!1,value:w.RATE,validNormalizedTypes:["number"]},count:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.count",{defaultMessage:"Document count"}),fieldRequired:!1,value:w.COUNT,validNormalizedTypes:["number"]},sum:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.sum",{defaultMessage:"Sum"}),fieldRequired:!1,value:w.SUM,validNormalizedTypes:["number"]},p95:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.p95",{defaultMessage:"95th Percentile"}),fieldRequired:!1,value:w.P95,validNormalizedTypes:["number"]},p99:{text:n.i18n.translate("xpack.infra.metrics.alertFlyout.aggregationText.p99",{defaultMessage:"99th Percentile"}),fieldRequired:!1,value:w.P99,validNormalizedTypes:["number"]}},D={aggType:u.a.AVERAGE,comparator:u.b.GT,threshold:[],timeSize:1,timeUnit:"m"},P=e=>{const{setRuleParams:t,ruleParams:a,errors:b,metadata:h}=e,{http:y,notifications:E,docLinks:x}=Object(m.b)().services,{source:v,createDerivedIndexPattern:O}=Object(d.a)({sourceId:"default",fetch:y.fetch,toastWarning:E.toasts.addWarning}),[T,j]=Object(o.useState)(1),[k,C]=Object(o.useState)("m"),F=Object(o.useMemo)((()=>O()),[O]),w=Object(o.useMemo)((()=>{var e;return null!=h&&null!==(e=h.currentOptions)&&void 0!==e&&e.metrics?h.currentOptions:{metrics:[],aggregation:"avg"}}),[h]),S=Object(o.useCallback)(((e,r)=>{const n=a.criteria?a.criteria.slice():[];n[e]=r,t("criteria",n)}),[t,a.criteria]),A=Object(o.useCallback)((()=>{var e;const r=(null===(e=a.criteria)||void 0===e?void 0:e.slice())||[];r.push({...D,timeSize:null!=T?T:D.timeSize,timeUnit:null!=k?k:D.timeUnit}),t("criteria",r)}),[t,a.criteria,T,k]),B=Object(o.useCallback)((e=>{var r;const n=(null===(r=a.criteria)||void 0===r?void 0:r.slice())||[];n.length>1&&(n.splice(e,1),t("criteria",n))}),[t,a.criteria]),R=Object(o.useCallback)((e=>{t("filterQueryText",e);try{t("filterQuery",Object(f.a)(e,F,!1)||"")}catch(e){t("filterQuery",u.e)}}),[t,F]),I=Object(o.useCallback)(Object(l.debounce)(R,500),[R]),z=Object(o.useCallback)((e=>{t("groupBy",e&&e.length?e:"")}),[t]),P=Object(o.useMemo)((()=>({aggField:[],timeSizeUnit:[],timeWindowSize:[]})),[]),G=Object(o.useCallback)((e=>{var r;const n=(null===(r=a.criteria)||void 0===r?void 0:r.map((t=>({...t,timeSize:e}))))||[];j(e||void 0),t("criteria",n)}),[a.criteria,t]),U=Object(o.useCallback)((e=>{var r;const n=(null===(r=a.criteria)||void 0===r?void 0:r.map((t=>({...t,timeUnit:e}))))||[];C(e),t("criteria",n)}),[a.criteria,t]),Q=Object(o.useCallback)((()=>{var e,a;const r=h;null!=r&&null!==(e=r.currentOptions)&&void 0!==e&&null!==(a=e.metrics)&&void 0!==a&&a.length?t("criteria",r.currentOptions.metrics.map((e=>({metric:e.field,comparator:u.b.GT,threshold:[],timeSize:T,timeUnit:k,aggType:e.aggregation})))):t("criteria",[D])}),[h,t,T,k]),$=Object(o.useCallback)((()=>{var e,a;const r=h;if(r&&null!==(e=r.currentOptions)&&void 0!==e&&e.filterQuery)t("filterQueryText",r.currentOptions.filterQuery),t("filterQuery",Object(f.a)(r.currentOptions.filterQuery,F)||"");else if(r&&null!==(a=r.currentOptions)&&void 0!==a&&a.groupBy&&r.series){const{groupBy:e}=r.currentOptions,a=Array.isArray(e)?e.map(((e,t)=>{var a,n;return`${e}: "${null===(a=r.series)||void 0===a||null===(n=a.keys)||void 0===n?void 0:n[t]}"`})).join(" and "):`${e}: "${r.series.id}"`;t("filterQueryText",a),t("filterQuery",Object(f.a)(a,F)||"")}}),[h,F,t]),W=Object(o.useCallback)((()=>{var e;const a=h;a&&null!==(e=a.currentOptions)&&void 0!==e&&e.groupBy&&!a.series&&t("groupBy",a.currentOptions.groupBy)}),[h,t]);Object(o.useEffect)((()=>{a.criteria&&a.criteria.length?(j(a.criteria[0].timeSize),C(a.criteria[0].timeUnit)):Q(),a.filterQuery||$(),a.groupBy||W(),a.sourceId||t("sourceId",(null==v?void 0:v.id)||"default"),void 0===a.alertOnNoData&&t("alertOnNoData",!0),void 0===a.alertOnGroupDisappear&&t("alertOnGroupDisappear",!0)}),[h,v]);const q=Object(o.useCallback)((e=>R(e.target.value)),[R]),_=Object(o.useMemo)((()=>{var e;return null===(e=a.criteria)||void 0===e?void 0:e.every((e=>e.aggType===u.a.RATE))}),[a.criteria]),H=Object(o.useMemo)((()=>a.groupBy&&a.groupBy.length>0),[a.groupBy]),V=Object(o.useMemo)((()=>{var e;return null===(e=a.criteria)||void 0===e?void 0:e.every((e=>e.aggType===u.a.COUNT))}),[a.criteria]),K=Object(o.useMemo)((()=>{if(!a.groupBy)return null;return(Array.isArray(a.groupBy)?a.groupBy:[a.groupBy]).map((e=>({groupName:e,pattern:new RegExp(`{"match(_phrase)?":{"${e}":"(.*?)"}}`)})))}),[a.groupBy]),Y=Object(o.useMemo)((()=>{const{filterQuery:e}=a;return"string"==typeof e&&K?K.map((({groupName:t,pattern:a})=>{if(a.test(e))return t})).filter((e=>"string"==typeof e)):[]}),[a,K]);return s.a.createElement(s.a.Fragment,null,s.a.createElement(r.EuiSpacer,{size:"m"}),s.a.createElement(r.EuiText,{size:"xs"},s.a.createElement("h4",null,s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.conditions",defaultMessage:"Conditions"}))),s.a.createElement(r.EuiSpacer,{size:"xs"}),a.criteria&&a.criteria.map(((e,t)=>s.a.createElement(L,{canDelete:a.criteria&&a.criteria.length>1||!1,fields:F.fields,remove:B,addExpression:A,key:t,expressionId:t,setRuleParams:S,errors:b[t]||P,expression:e||{}},s.a.createElement(M,{expression:e,derivedIndexPattern:F,source:v,filterQuery:a.filterQueryText,groupBy:a.groupBy})))),s.a.createElement("div",{style:{marginLeft:28}},s.a.createElement(c.ForLastExpression,{timeWindowSize:T,timeWindowUnit:k,errors:P,onChangeWindowSize:G,onChangeWindowUnit:U})),s.a.createElement(r.EuiSpacer,{size:"m"}),s.a.createElement("div",null,s.a.createElement(r.EuiButtonEmpty,{color:"primary",iconSide:"left",flush:"left",iconType:"plusInCircleFilled",onClick:A},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.addCondition",defaultMessage:"Add condition"}))),s.a.createElement(r.EuiSpacer,{size:"m"}),s.a.createElement(r.EuiAccordion,{id:"advanced-options-accordion",buttonContent:n.i18n.translate("xpack.infra.metrics.alertFlyout.advancedOptions",{defaultMessage:"Advanced options"})},s.a.createElement(r.EuiPanel,{color:"subdued"},s.a.createElement(r.EuiCheckbox,{disabled:V,id:"metrics-alert-no-data-toggle",label:s.a.createElement(s.a.Fragment,null,n.i18n.translate("xpack.infra.metrics.alertFlyout.alertOnNoData",{defaultMessage:"Alert me if there's no data"})," ",s.a.createElement(r.EuiToolTip,{content:(V?`${N} `:"")+n.i18n.translate("xpack.infra.metrics.alertFlyout.noDataHelpText",{defaultMessage:"Enable this to trigger the action if the metric(s) do not report any data over the expected time period, or if the alert fails to query Elasticsearch"})},s.a.createElement(r.EuiIcon,{type:"questionInCircle",color:"subdued"}))),checked:a.alertOnNoData,onChange:e=>t("alertOnNoData",e.target.checked)}),s.a.createElement(r.EuiCheckbox,{id:"metrics-alert-partial-buckets-toggle",label:s.a.createElement(s.a.Fragment,null,n.i18n.translate("xpack.infra.metrics.alertFlyout.shouldDropPartialBuckets",{defaultMessage:"Drop partial buckets when evaluating data"})," ",s.a.createElement(r.EuiToolTip,{content:n.i18n.translate("xpack.infra.metrics.alertFlyout.dropPartialBucketsHelpText",{defaultMessage:"Enable this to drop the most recent bucket of evaluation data if it's less than {timeSize}{timeUnit}.",values:{timeSize:T,timeUnit:k}})},s.a.createElement(r.EuiIcon,{type:"questionInCircle",color:"subdued"}))),checked:_||a.shouldDropPartialBuckets,disabled:_,onChange:e=>t("shouldDropPartialBuckets",e.target.checked)}))),s.a.createElement(r.EuiSpacer,{size:"m"}),s.a.createElement(r.EuiFormRow,{label:n.i18n.translate("xpack.infra.metrics.alertFlyout.filterLabel",{defaultMessage:"Filter (optional)"}),helpText:n.i18n.translate("xpack.infra.metrics.alertFlyout.filterHelpText",{defaultMessage:"Use a KQL expression to limit the scope of your alert trigger."}),fullWidth:!0,display:"rowCompressed"},h&&s.a.createElement(g.a,{derivedIndexPattern:F,onChange:I,onSubmit:R,value:a.filterQueryText})||s.a.createElement(r.EuiFieldSearch,{onChange:q,value:a.filterQueryText,fullWidth:!0})),s.a.createElement(r.EuiSpacer,{size:"m"}),s.a.createElement(r.EuiFormRow,{label:n.i18n.translate("xpack.infra.metrics.alertFlyout.createAlertPerText",{defaultMessage:"Group alerts by (optional)"}),helpText:n.i18n.translate("xpack.infra.metrics.alertFlyout.createAlertPerHelpText",{defaultMessage:'Create an alert for every unique value. For example: "host.id" or "cloud.region".'}),fullWidth:!0,display:"rowCompressed"},s.a.createElement(p.a,{onChange:z,fields:F.fields,options:{...w,groupBy:a.groupBy||void 0},errorOptions:Y})),Y.length>0&&s.a.createElement(s.a.Fragment,null,s.a.createElement(r.EuiSpacer,{size:"s"}),s.a.createElement(r.EuiText,{size:"xs",color:"danger"},s.a.createElement(i.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.alertPerRedundantFilterError",defaultMessage:"This rule may alert on {matchedGroups} less than expected, because the filter query contains a match for {groupCount, plural, one {this field} other {these fields}}. For more information, refer to {filteringAndGroupingLink}.",values:{matchedGroups:s.a.createElement("strong",null,Y.join(", ")),groupCount:Y.length,filteringAndGroupingLink:s.a.createElement(r.EuiLink,{href:`${x.links.observability.metricsThreshold}#filtering-and-grouping`},n.i18n.translate("xpack.infra.metrics.alertFlyout.alertPerRedundantFilterError.docsLink",{defaultMessage:"the docs"}))}}))),s.a.createElement(r.EuiSpacer,{size:"s"}),s.a.createElement(r.EuiCheckbox,{id:"metrics-alert-group-disappear-toggle",label:s.a.createElement(s.a.Fragment,null,n.i18n.translate("xpack.infra.metrics.alertFlyout.alertOnGroupDisappear",{defaultMessage:"Alert me if a group stops reporting data"})," ",s.a.createElement(r.EuiToolTip,{content:(V?`${N} `:"")+n.i18n.translate("xpack.infra.metrics.alertFlyout.groupDisappearHelpText",{defaultMessage:"Enable this to trigger the action if a previously detected group begins to report no results. This is not recommended for dynamically scaling infrastructures that may rapidly start and stop nodes automatically."})},s.a.createElement(r.EuiIcon,{type:"questionInCircle",color:"subdued"}))),disabled:V||!H,checked:Boolean(H&&a.alertOnGroupDisappear),onChange:e=>t("alertOnGroupDisappear",e.target.checked)}),s.a.createElement(r.EuiSpacer,{size:"m"}))},N=n.i18n.translate("xpack.infra.metrics.alertFlyout.docCountNoDataDisabledHelpText",{defaultMessage:"[This setting is not applicable to the Document Count aggregator.]"});t.default=P},98:function(e,t,a){"use strict";a.d(t,"a",(function(){return n})),a.d(t,"c",(function(){return l})),a.d(t,"d",(function(){return c})),a.d(t,"b",(function(){return p})),a.d(t,"e",(function(){return x}));var r=a(0);const n=["avg","max","min","cardinality","rate","count","sum","p95","p99"],i=n.reduce(((e,t)=>({...e,[t]:null})),{}),l=r.keyof(i),o=r.type({aggregation:l}),s=r.partial({field:r.union([r.string,r[void 0]])}),c=r.intersection([o,s]),u=r.type({from:r.number,to:r.number,interval:r.string}),d=r.type({timerange:u,indexPattern:r.string,metrics:r.array(c)}),m=r.union([r.string,r.null,r[void 0]]),p=r.record(r.string,r.union([r.string,r.null])),g=r.partial({groupBy:r.union([m,r.array(m)]),afterKey:r.union([r.string,r.null,r[void 0],p]),limit:r.union([r.number,r.null,r[void 0]]),filterQuery:r.union([r.string,r.null,r[void 0]]),forceInterval:r.boolean,dropLastBucket:r.boolean}),f=(r.intersection([d,g]),r.type({total:r.number,afterKey:r.union([r.string,r.null,p])})),b=r.keyof({date:null,number:null,string:null}),h=r.type({name:r.string,type:b}),y=r.intersection([r.type({timestamp:r.number}),r.record(r.string,r.union([r.string,r.number,r.null,r[void 0],r.array(r.object)]))]),E=r.intersection([r.type({id:r.string,columns:r.array(h),rows:r.array(y)}),r.partial({keys:r.array(r.string)})]),x=r.type({series:r.array(E),pageInfo:f})}}]);