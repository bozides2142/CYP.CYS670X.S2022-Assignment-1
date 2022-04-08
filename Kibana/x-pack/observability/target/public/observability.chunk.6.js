/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.observability_bundle_jsonpfunction=window.observability_bundle_jsonpfunction||[]).push([[6],{155:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(77),i=a(1),l=n.__importDefault(a(156));t.default=function(e,t){var a=i.useState(t),n=a[0],o=a[1];return l.default((function(){var t=e.subscribe(o);return function(){return t.unsubscribe()}}),[e]),n}},156:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(1),i="undefined"!=typeof window?n.useLayoutEffect:n.useEffect;t.default=i},159:function(e,t,a){"use strict";a.r(t),a.d(t,"ObservabilityPageTemplate",(function(){return h}));var n=a(17),i=a.n(n),l=a(0),o=a(1),r=a.n(o),c=a(33),s=a(155),u=a.n(s),d=a(15),p=a(7),f=a(20),b=a.n(f);const m=b.a.span.withConfig({displayName:"LabelContainer",componentId:"sc-34h2fv-0"})(["max-width:72%;float:left;&:hover,&:focus{text-decoration:underline;}"]),v=b()(p.EuiBadge).withConfig({displayName:"StyledBadge",componentId:"sc-34h2fv-1"})(["margin-left:8px;"]);function g({label:e,localStorageId:t}){const a=function(e){const t=window.localStorage.getItem(e);return!t||JSON.parse(t)}(t);return r.a.createElement(r.a.Fragment,null,r.a.createElement(m,{className:"eui-textTruncate"},r.a.createElement("span",null,e)),a&&r.a.createElement(v,{color:"accent"},l.i18n.translate("xpack.observability.navigation.newBadge",{defaultMessage:"NEW"})))}function h({children:e,currentAppId$:t,getUrlForApp:a,navigateToApp:n,navigationSections$:l,showSolutionNav:s=!0,...p}){const f=u()(l,[]),b=u()(t,void 0),{pathname:m}=Object(c.useLocation)(),v=Object(o.useMemo)((()=>f.map((({label:e,entries:t},i)=>({id:`${i}`,name:e,items:t.map(((e,t)=>{const l=a(e.app,{path:e.path}),o=e.app===b&&null!=Object(c.matchPath)(m,{path:e.path,exact:!!e.matchFullPath,strict:!e.ignoreTrailingSlash}),s=`observability.nav_item_badge_visible_${e.app}${e.path}`;return{id:`${i}.${t}`,name:e.isNewFeature?r.a.createElement(g,{label:e.label,localStorageId:s}):e.label,href:l,isSelected:o,onClick:t=>{var a;e.onClick&&e.onClick(t),e.isNewFeature&&(a=s,window.localStorage.setItem(a,JSON.stringify(!1))),0!==t.button||t.defaultPrevented||t.metaKey||t.altKey||t.ctrlKey||t.shiftKey||(t.preventDefault(),n(e.app,{path:e.path}))}}}))})))),[b,m,a,n,f]);return r.a.createElement(d.KibanaPageTemplate,i()({restrictWidth:!1},p,{solutionNav:s?{icon:"logoObservability",items:v,name:y}:void 0}),e)}t.default=h;const y=l.i18n.translate("xpack.observability.pageLayout.sideNavTitle",{defaultMessage:"Observability"})}}]);