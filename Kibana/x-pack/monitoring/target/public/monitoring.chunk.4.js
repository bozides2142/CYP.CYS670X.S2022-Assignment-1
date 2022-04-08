/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.monitoring_bundle_jsonpfunction=window.monitoring_bundle_jsonpfunction||[]).push([[4],{143:function(e,t,a){"use strict";a.r(t),a.d(t,"Expression",(function(){return i}));var s=a(5),n=a(6),r=a(36),u=a(4),l=a(37),o=a(2);const i=e=>{const{ruleParams:t,paramDetails:a,setRuleParams:i,errors:c}=e,m=Object.keys(t).map((e=>{const s=a[e],n=t[e];switch(null==s?void 0:s.type){case u.b.Duration:return Object(o.jsx)(r.a,{key:e,name:e,duration:n,label:s.label,errors:c[e],setRuleParams:i});case u.b.Percentage:return Object(o.jsx)(l.a,{key:e,name:e,label:s.label,percentage:n,errors:c[e],setRuleParams:i})}}));return Object(o.jsx)(s.Fragment,null,Object(o.jsx)(n.EuiForm,{component:"form"},m),Object(o.jsx)(n.EuiSpacer,null))};t.default=i},36:function(e,t,a){"use strict";a.d(t,"a",(function(){return m}));var s,n=a(5),r=a.n(n),u=a(0),l=a(6),o=a(2);function i(e=s.SECOND,t="0"){switch(e){case s.SECOND:return u.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.secondLabel",{defaultMessage:"{timeValue, plural, one {second} other {seconds}}",values:{timeValue:t}});case s.MINUTE:return u.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.minuteLabel",{defaultMessage:"{timeValue, plural, one {minute} other {minutes}}",values:{timeValue:t}});case s.HOUR:return u.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.hourLabel",{defaultMessage:"{timeValue, plural, one {hour} other {hours}}",values:{timeValue:t}});case s.DAY:return u.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.dayLabel",{defaultMessage:"{timeValue, plural, one {day} other {days}}",values:{timeValue:t}})}}!function(e){e.SECOND="s",e.MINUTE="m",e.HOUR="h",e.DAY="d"}(s||(s={}));const c=/(\d+)([smhd]{1})/,m=e=>{const{name:t,label:a,setRuleParams:n,errors:u}=e,m=c.exec(e.duration),b=m&&m[1]?parseInt(m[1],10):1,j=m&&m[2]?m[2]:s.MINUTE,[p,d]=r.a.useState(b),[x,g]=r.a.useState(j),E=Object.values(s).map((e=>({value:e,text:i(e)})));return r.a.useEffect((()=>{n(t,`${p}${x}`)}),[x,p]),Object(o.jsx)(l.EuiFormRow,{label:a,error:u,isInvalid:(null==u?void 0:u.length)>0},Object(o.jsx)(l.EuiFlexGroup,null,Object(o.jsx)(l.EuiFlexItem,{grow:2},Object(o.jsx)(l.EuiFieldNumber,{compressed:!0,value:p,onChange:e=>{let t=parseInt(e.target.value,10);isNaN(t)&&(t=0),d(t)}})),Object(o.jsx)(l.EuiFlexItem,{grow:4},Object(o.jsx)(l.EuiSelect,{compressed:!0,value:x,onChange:e=>g(e.target.value),options:E}))))}},37:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var s=a(5),n=a.n(s),r=a(6),u=a(2);const l=e=>{const{name:t,label:a,setRuleParams:s,errors:l}=e,[o,i]=n.a.useState(e.percentage);return Object(u.jsx)(r.EuiFormRow,{label:a,error:l,isInvalid:l.length>0},Object(u.jsx)(r.EuiFieldNumber,{compressed:!0,value:o,append:Object(u.jsx)(r.EuiText,{size:"xs"},Object(u.jsx)("strong",null,"%")),onChange:e=>{let a=parseInt(e.target.value,10);isNaN(a)&&(a=0),i(a),s(t,a)}}))}}}]);