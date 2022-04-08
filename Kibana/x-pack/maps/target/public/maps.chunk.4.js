/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.maps_bundle_jsonpfunction=window.maps_bundle_jsonpfunction||[]).push([[4],{122:function(e,a,t){"use strict";t.d(a,"a",(function(){return u}));t(7);var s=t(21),i=t(53),l=t(2),n=t(6);function u(e){return Object(n.jsx)(s.EuiCallOut,{"data-test-subj":"deprecatedVisInfo",size:"s",title:l.i18n.translate("xpack.maps.legacyVisualizations.title",{defaultMessage:"{label} has transitioned to Maps.",values:{label:e.visualizationLabel}})},Object(n.jsx)("p",null,Object(n.jsx)(i.FormattedMessage,{id:"xpack.maps.legacyVisualizations.editMessage",defaultMessage:"Maps has replaced {label}. To edit, convert to Maps.",values:{label:e.visualizationLabel}})),Object(n.jsx)("p",null,Object(n.jsx)(i.FormattedMessage,{id:"xpack.maps.legacyVisualizations.useMapsMsg",defaultMessage:"With Maps, you can add multiple layers and indices, plot individual documents, symbolize features from data values, add heatmaps, grids, and clusters, and more."})),Object(n.jsx)("div",null,Object(n.jsx)(s.EuiButton,{onClick:e.onClick,size:"s"},Object(n.jsx)(i.FormattedMessage,{id:"xpack.maps.legacyVisualizations.openInMapsButtonLabel",defaultMessage:"View in Maps"}))))}},343:function(e,a,t){"use strict";t.r(a);t(7);var s=t(9),i=t(122),l=t(41),n=t(22),u=t(6);a.default=function(e){return Object(u.jsx)(i.a,{onClick:a=>{a.preventDefault();const t=Object(s.H)().url.locators.get("MAPS_APP_REGION_MAP_LOCATOR");if(!t)return;const i=Object(s.g)().query;t.navigate({...Object(l.a)(e.vis),filters:i.filterManager.getFilters(),query:i.queryString.getQuery(),timeRange:i.timefilter.timefilter.getTime()})},visualizationLabel:n.b})}}}]);