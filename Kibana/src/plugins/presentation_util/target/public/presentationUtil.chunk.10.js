(window.presentationUtil_bundle_jsonpfunction=window.presentationUtil_bundle_jsonpfunction||[]).push([[10],{137:function(e,t,a){"use strict";a.r(t),a.d(t,"DataViewPicker",(function(){return u}));var i=a(6),n=a.n(i),s=a(7),o=a(1),l=a.n(o),c=a(3),r=a(48),d=a(0);function u({dataViews:e,selectedDataViewId:t,onChangeDataViewId:a,trigger:i,selectableProps:u}){const[p,b]=Object(o.useState)(!1),j=!e.some((({id:e})=>e===t))?{color:"danger"}:{};return Object(d.jsx)(l.a.Fragment,null,Object(d.jsx)(c.EuiPopover,{button:function(){const{label:e,title:t,...a}=i;return Object(d.jsx)(r.ToolbarButton,n()({title:t,"data-test-subj":"open-data-view-picker",onClick:()=>b(!p),fullWidth:!0},j,a),e)}(),isOpen:p,closePopover:()=>b(!1),display:"block",panelPaddingSize:"s",ownFocus:!0},Object(d.jsx)("div",{style:{width:368}},Object(d.jsx)(c.EuiPopoverTitle,{"data-test-subj":"data-view-picker-title"},s.i18n.translate("presentationUtil.dataViewPicker.changeDataViewTitle",{defaultMessage:"Data view"})),Object(d.jsx)(c.EuiSelectable,n()({},u,{searchable:!0,singleSelection:"always",options:e.map((({title:e,id:a})=>({key:a,label:e,value:a,"data-test-subj":`data-view-picker-${e}`,checked:a===t?"on":void 0}))),onChange:e=>{const t=e.find((({checked:e})=>e));a(t.value),b(!1)},searchProps:{compressed:!0,...u?u.searchProps:void 0}}),((e,t)=>Object(d.jsx)(l.a.Fragment,null,t,e))))))}t.default=u}}]);