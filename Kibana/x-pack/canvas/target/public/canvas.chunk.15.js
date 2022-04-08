/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.canvas_bundle_jsonpfunction=window.canvas_bundle_jsonpfunction||[]).push([[15],{150:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));a(17);var n=a(19),l=a(18);const s=()=>Object(l.jsx)(n.EuiFlexGroup,{justifyContent:"spaceAround",alignItems:"center",style:{minHeight:600}},Object(l.jsx)(n.EuiFlexItem,{grow:!1},Object(l.jsx)(n.EuiLoadingSpinner,{size:"xl"})))},413:function(e,t,a){"use strict";a.r(t),a.d(t,"WorkpadTemplates",(function(){return g}));var n=a(17),l=a(83),s=a(20),i=a(3),o=a(19),r=a(122),c=a(228),p=a(18);const m=({templates:e,onCreateWorkpad:t})=>{const a=[{field:"name",name:u.getTableNameColumnTitle(),sortable:!0,width:"30%",dataType:"string",render:(e,a)=>{const n=e.length?e:"Unnamed Template";return Object(p.jsx)(o.EuiButtonEmpty,{onClick:()=>t(a),"aria-label":u.getCloneTemplateLinkAriaLabel(n),type:"button"},n)}},{field:"help",name:u.getTableDescriptionColumnTitle(),sortable:!1,dataType:"string",width:"30%"},{field:"tags",name:u.getTableTagsColumnTitle(),sortable:!1,dataType:"string",width:"30%",render:e=>Object(p.jsx)(c.a,{tags:e,tagType:"health"})}];let n=[];e.forEach((e=>{const{tags:t}=e;t.forEach((e=>n.push(e))),n=Object(s.uniq)(n)}));const l={box:{incremental:!0,schema:!0},filters:[{type:"field_value_selection",field:"tags",name:"Tags",multiSelect:!0,options:n.map((e=>r.a.get(e)||{color:void 0,name:e})).map((e=>({value:e.name,name:e.name,view:Object(p.jsx)(c.a,{tags:[e.name],tagType:"health"})})))}]};return Object(p.jsx)(o.EuiInMemoryTable,{itemId:"id",items:e,columns:a,search:l,sorting:{sort:{field:"name",direction:"asc"}},pagination:!0,"data-test-subj":"canvasTemplatesTable"})},u={getCloneTemplateLinkAriaLabel:e=>i.i18n.translate("xpack.canvas.workpadTemplates.cloneTemplateLinkAriaLabel",{defaultMessage:"Clone workpad template '{templateName}'",values:{templateName:e}}),getTableDescriptionColumnTitle:()=>i.i18n.translate("xpack.canvas.workpadTemplates.table.descriptionColumnTitle",{defaultMessage:"Description"}),getTableNameColumnTitle:()=>i.i18n.translate("xpack.canvas.workpadTemplates.table.nameColumnTitle",{defaultMessage:"Template name"}),getTableTagsColumnTitle:()=>i.i18n.translate("xpack.canvas.workpadTemplates.table.tagsColumnTitle",{defaultMessage:"Tags",description:'This column contains relevant tags that indicate what type of template is displayed. For example: "report", "presentation", etc.'}),getTemplateSearchPlaceholder:()=>i.i18n.translate("xpack.canvas.workpadTemplates.searchPlaceholder",{defaultMessage:"Find template"}),getCreatingTemplateLabel:e=>i.i18n.translate("xpack.canvas.workpadTemplates.creatingTemplateLabel",{defaultMessage:"Creating from template '{templateName}'",values:{templateName:e}})};var d=a(150);const g=()=>{const e=Object(l.e)(),[t,a]=Object(n.useState)(!1),[s,i]=Object(n.useState)([]);Object(n.useEffect)((()=>{(async()=>{const t=await e();a(!0),i((null==t?void 0:t.templates)||[])})()}),[a,e]);const o=Object(l.b)();return t?Object(p.jsx)(m,{templates:s,onCreateWorkpad:o}):Object(p.jsx)(d.a,null)};t.default=g}}]);