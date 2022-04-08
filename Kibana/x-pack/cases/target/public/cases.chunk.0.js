/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.cases_bundle_jsonpfunction=window.cases_bundle_jsonpfunction||[]).push([[0],{114:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(27),i=n(2),s=a.__importDefault(n(115));t.default=function(e,t,n){void 0===t&&(t=0),void 0===n&&(n=[]);var a=s.default(e,t),r=a[0],o=a[1],l=a[2];return i.useEffect(l,n),[r,o]}},115:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2);t.default=function(e,t){void 0===t&&(t=0);var n=a.useRef(!1),i=a.useRef(),s=a.useRef(e),r=a.useCallback((function(){return n.current}),[]),o=a.useCallback((function(){n.current=!1,i.current&&clearTimeout(i.current),i.current=setTimeout((function(){n.current=!0,s.current()}),t)}),[t]),l=a.useCallback((function(){n.current=null,i.current&&clearTimeout(i.current)}),[]);return a.useEffect((function(){s.current=e}),[e]),a.useEffect((function(){return o(),l}),[t]),[r,l,o]}},45:function(e,t,n){"use strict";var a=n(35);n.d(t,"i",(function(){return a.getUseField})),n.d(t,"h",(function(){return a.getFieldValidityAndErrorMessage})),n.d(t,"a",(function(){return a.FIELD_TYPES})),n.d(t,"c",(function(){return a.Form})),n.d(t,"d",(function(){return a.FormDataProvider})),n.d(t,"e",(function(){return a.UseField})),n.d(t,"j",(function(){return a.useForm})),n.d(t,"k",(function(){return a.useFormContext})),n.d(t,"l",(function(){return a.useFormData})),n.d(t,"f",(function(){return a.VALIDATION_TYPES}));var i=n(39);n.d(t,"b",(function(){return i.Field}));var s=n(40);n.d(t,"g",(function(){return s.fieldValidators}))},46:function(e,t,n){"use strict";n.d(t,"o",(function(){return d})),n.d(t,"f",(function(){return p})),n.d(t,"h",(function(){return m})),n.d(t,"g",(function(){return g})),n.d(t,"c",(function(){return b})),n.d(t,"d",(function(){return f})),n.d(t,"e",(function(){return h})),n.d(t,"l",(function(){return v})),n.d(t,"i",(function(){return O})),n.d(t,"j",(function(){return E})),n.d(t,"m",(function(){return j})),n.d(t,"k",(function(){return y})),n.d(t,"a",(function(){return k})),n.d(t,"n",(function(){return w})),n.d(t,"b",(function(){return P}));var a=n(7),i=n(23),s=n(3),r=n(4),o=n(19),l=n(13),c=n(67),u=n(24);const d=async(e,t=!0,n)=>{const a=await l.a.get().http.fetch(`${Object(s.u)(e)}/resolve`,{method:"GET",query:{includeComments:t},signal:n});return Object(u.c)(Object(u.h)(a))},p=async(e,t)=>{const n=await l.a.get().http.fetch(r.n,{method:"GET",signal:e,query:{...t.length>0?{owner:t}:{}}});return Object(u.c)(Object(u.m)(n))},m=async(e,t)=>{const n=await l.a.get().http.fetch(r.o,{method:"GET",signal:e,query:{...t.length>0?{owner:t}:{}}});return null!=n?n:[]},g=async(e,t)=>{const n=await l.a.get().http.fetch(r.m,{method:"GET",signal:e,query:{...t.length>0?{owner:t}:{}}});return null!=n?n:[]},b=async(e,t,n)=>{const a=await l.a.get().http.fetch(Object(s.t)(e),{method:"GET",signal:n,query:{features:JSON.stringify(t)}});return Object(u.c)(Object(u.g)(a))},f=async(e,t)=>{const n=await l.a.get().http.fetch(Object(s.w)(e),{method:"GET",signal:t});return Object(u.b)(Object(u.j)(n))},h=async({filterOptions:e={search:"",reporters:[],status:i.b,tags:[],owner:[]},queryParams:t={page:1,perPage:20,sortField:c.a.createdAt,sortOrder:"desc"},signal:n})=>{const s={reporters:e.reporters.map((e=>{var t;return null!==(t=e.username)&&void 0!==t?t:""})).filter((e=>""!==e)),tags:e.tags,status:e.status,...e.search.length>0?{search:e.search}:{},...e.owner.length>0?{owner:e.owner}:{},...t},o=await l.a.get().http.fetch(`${r.c}/_find`,{method:"GET",query:s.status===i.b?Object(a.omit)(s,["status"]):s,signal:n});return Object(u.a)(Object(u.k)(o))},v=async(e,t)=>{const n=await l.a.get().http.fetch(r.c,{method:"POST",body:JSON.stringify(e),signal:t});return Object(u.c)(Object(u.i)(n))},O=async(e,t,n,a)=>{const i=await l.a.get().http.fetch(r.c,{method:"PATCH",body:JSON.stringify({cases:[{...t,id:e,version:n}]}),signal:a});return Object(u.c)(Object(u.l)(i))},E=async(e,t)=>{const n=await l.a.get().http.fetch(r.c,{method:"PATCH",body:JSON.stringify({cases:e}),signal:t});return Object(u.c)(Object(u.l)(n))},j=async(e,t,n)=>{const a=await l.a.get().http.fetch(`${r.c}/${t}/comments`,{method:"POST",body:JSON.stringify(e),signal:n});return Object(u.c)(Object(u.i)(a))},y=async({caseId:e,commentId:t,commentUpdate:n,version:a,signal:i,owner:r})=>{const o=await l.a.get().http.fetch(Object(s.r)(e),{method:"PATCH",body:JSON.stringify({comment:n,type:s.m.user,id:t,version:a,owner:r}),signal:i});return Object(u.c)(Object(u.i)(o))},k=async(e,t)=>await l.a.get().http.fetch(r.c,{method:"DELETE",query:{ids:JSON.stringify(e)},signal:t}),w=async(e,t,n)=>{const a=await l.a.get().http.fetch(Object(s.v)(e,t),{method:"POST",body:JSON.stringify({}),signal:n});return Object(u.c)(Object(u.i)(a))},P=async e=>{const t=await l.a.get().http.fetch(Object(o.a)(),{method:"GET",signal:e});return Object(u.b)(t)}},53:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"d",(function(){return i})),n.d(t,"c",(function(){return s})),n.d(t,"a",(function(){return r}));const a="lens",i=`!{${a}`,s=200,r="xpack.cases.commentDraft"},58:function(e,t,n){e.exports=n(26)(3)},63:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var a=n(1);const i=a.i18n.translate("xpack.cases.markdownEditor.plugins.lens.visualizationButtonLabel",{defaultMessage:"Visualization"})},66:function(e,t,n){"use strict";n.d(t,"b",(function(){return q})),n.d(t,"a",(function(){return Y}));var a=n(58),i=n.n(a),s=n(2),r=n.n(s),o=n(22),l=n(11);const c=({disableLinks:e,href:t,target:n,children:a,...i})=>r.a.createElement(l.EuiToolTip,{content:t},r.a.createElement(l.EuiLink,{href:e?void 0:t,"data-test-subj":"markdown-link",rel:"nofollow",target:"_blank"},a));c.displayName="MarkdownLink";const u=Object(s.memo)(c);var d=n(79),p=n(13),m=n(41),g=n(1),b=n(36),f=n(15),h=n(34),v=n.n(h),O=n(53);const E=r.a.createContext(null),j=v()(l.EuiFlexGroup).withConfig({displayName:"ModalContainer",componentId:"sc-4107jc-0"})(["width:",";height:100%;.euiModalBody{min-height:300px;}"],(({theme:e})=>e.eui.euiBreakpoints.m));var y=n(12),k=n.n(y),w=n(7),P=n(44);class saved_objects_finder_SavedObjectFinderUi extends r.a.Component{constructor(e){super(e),k()(this,"isComponentMounted",!1),k()(this,"debouncedFetch",Object(w.debounce)((async e=>{const t=this.getSavedObjectMetaDataMap(),n=Object.values(t).map((e=>e.includeFields||[])).reduce(((e,t)=>e.concat(t)),["title"]),a=this.props.uiSettings.get(P.LISTING_LIMIT_SETTING),i=await this.props.savedObjects.client.find({type:Object.keys(t),fields:[...new Set(n)],search:e?`${e}*`:void 0,page:1,perPage:a,searchFields:["title^3","description"],defaultSearchOperator:"AND"});i.savedObjects=i.savedObjects.filter((e=>{const n=t[e.type];return!n.showSavedObject||n.showSavedObject(e)})),this.isComponentMounted&&e===this.state.query&&this.setState({isFetchingItems:!1,page:0,items:i.savedObjects.map((e=>{const{attributes:{title:t},id:n,type:a}=e;return{title:"string"==typeof t?t:"",id:n,type:a,savedObject:e}}))})}),300)),k()(this,"getPageOfItems",(()=>{const e=this.state.items.slice(),{sortDirection:t}=this.state;!t&&this.state.query||e.sort((({title:e},{title:n})=>{let a=1;return"desc"===t&&(a=-1),a*(e||"").toLowerCase().localeCompare((n||"").toLowerCase())}));const n=this.state.page*this.state.perPage,a=n+this.state.perPage;return e.filter((e=>0===this.state.filteredTypes.length||this.state.filteredTypes.includes(e.type))).slice(n,a)})),k()(this,"fetchItems",(()=>{this.setState({isFetchingItems:!0},this.debouncedFetch.bind(null,this.state.query))})),this.state={items:[],isFetchingItems:!1,page:0,perPage:e.initialPageSize||e.fixedPageSize||10,query:"",filterOpen:!1,filteredTypes:[],sortOpen:!1}}componentWillUnmount(){this.isComponentMounted=!1,this.debouncedFetch.cancel()}componentDidMount(){this.isComponentMounted=!0,this.fetchItems()}render(){return r.a.createElement(r.a.Fragment,null,this.renderSearchBar(),this.renderListing())}getSavedObjectMetaDataMap(){return this.props.savedObjectMetaData.reduce(((e,t)=>({...e,[t.type]:t})),{})}getPageCount(){return Math.ceil((0===this.state.filteredTypes.length?this.state.items.length:this.state.items.filter((e=>0===this.state.filteredTypes.length||this.state.filteredTypes.includes(e.type))).length)/this.state.perPage)}getAvailableSavedObjectMetaData(){const e=new Set;return this.state.items.forEach((t=>{e.add(t.type)})),this.props.savedObjectMetaData.filter((t=>e.has(t.type)))}getSortOptions(){const e=[r.a.createElement(l.EuiContextMenuItem,{key:"asc",icon:"asc"===this.state.sortDirection||""===this.state.query&&"desc"!==this.state.sortDirection?"check":"empty",onClick:()=>{this.setState({sortDirection:"asc"})}},g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.sortAsc",{defaultMessage:"Ascending"})),r.a.createElement(l.EuiContextMenuItem,{key:"desc",icon:"desc"===this.state.sortDirection?"check":"empty",onClick:()=>{this.setState({sortDirection:"desc"})}},g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.sortDesc",{defaultMessage:"Descending"}))];return this.state.query&&e.push(r.a.createElement(l.EuiContextMenuItem,{key:"auto",icon:this.state.sortDirection?"empty":"check",onClick:()=>{this.setState({sortDirection:void 0})}},g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.sortAuto",{defaultMessage:"Best match"}))),e}renderSearchBar(){const e=this.getAvailableSavedObjectMetaData();return r.a.createElement(l.EuiFormRow,i()({fullWidth:!0},this.props.euiFormRowProps||{}),r.a.createElement(l.EuiFlexGroup,{gutterSize:"m"},r.a.createElement(l.EuiFlexItem,{grow:!0},r.a.createElement(l.EuiFieldSearch,i()({placeholder:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.searchPlaceholder",{defaultMessage:"Search…"}),"aria-label":g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.searchPlaceholder",{defaultMessage:"Search…"}),fullWidth:!0,value:this.state.query,onChange:e=>{this.setState({query:e.target.value},this.fetchItems)},"data-test-subj":"savedObjectFinderSearchInput",isLoading:this.state.isFetchingItems},this.props.euiFieldSearchProps||{}))),r.a.createElement(l.EuiFlexItem,{grow:!1},r.a.createElement(l.EuiFilterGroup,null,r.a.createElement(l.EuiPopover,{id:"addPanelSortPopover",panelClassName:"euiFilterGroup__popoverPanel",panelPaddingSize:"none",isOpen:this.state.sortOpen,closePopover:()=>this.setState({sortOpen:!1}),button:r.a.createElement(l.EuiFilterButton,{onClick:()=>this.setState((({sortOpen:e})=>({sortOpen:!e}))),iconType:"arrowDown",isSelected:this.state.sortOpen,"data-test-subj":"savedObjectFinderSortButton"},g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.sortButtonLabel",{defaultMessage:"Sort"}))},r.a.createElement(l.EuiContextMenuPanel,{watchedItemProps:["icon","disabled"],items:this.getSortOptions()})),this.props.showFilter&&r.a.createElement(l.EuiPopover,{id:"addPanelFilterPopover",panelClassName:"euiFilterGroup__popoverPanel",panelPaddingSize:"none",isOpen:this.state.filterOpen,closePopover:()=>this.setState({filterOpen:!1}),button:r.a.createElement(l.EuiFilterButton,{onClick:()=>this.setState((({filterOpen:e})=>({filterOpen:!e}))),iconType:"arrowDown","data-test-subj":"savedObjectFinderFilterButton",isSelected:this.state.filterOpen,numFilters:this.props.savedObjectMetaData.length,hasActiveFilters:this.state.filteredTypes.length>0,numActiveFilters:this.state.filteredTypes.length},g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.filterButtonLabel",{defaultMessage:"Types"}))},r.a.createElement(l.EuiContextMenuPanel,{watchedItemProps:["icon","disabled"],items:this.props.savedObjectMetaData.map((t=>r.a.createElement(l.EuiContextMenuItem,{key:t.type,disabled:!e.includes(t),icon:this.state.filteredTypes.includes(t.type)?"check":"empty","data-test-subj":`savedObjectFinderFilter-${t.type}`,onClick:()=>{this.setState((({filteredTypes:e})=>({filteredTypes:e.includes(t.type)?e.filter((e=>e!==t.type)):[...e,t.type],page:0})))}},t.name)))})))),this.props.children?r.a.createElement(l.EuiFlexItem,{grow:!1},this.props.children):null))}renderListing(){const e=0===this.state.items.length?[]:this.getPageOfItems(),{onChoose:t,savedObjectMetaData:n}=this.props;return r.a.createElement(r.a.Fragment,null,this.state.isFetchingItems&&0===this.state.items.length&&r.a.createElement(l.EuiFlexGroup,{justifyContent:"center"},r.a.createElement(l.EuiFlexItem,{grow:!1},r.a.createElement(l.EuiSpacer,null),r.a.createElement(l.EuiLoadingSpinner,{"data-test-subj":"savedObjectFinderLoadingIndicator"}))),e.length>0?r.a.createElement(r.a.Fragment,null,r.a.createElement(l.EuiSpacer,{size:"s"}),r.a.createElement(l.EuiListGroup,{"data-test-subj":"savedObjectFinderItemList",maxWidth:!1,flush:!0},e.map((e=>{const a=n.find((t=>t.type===e.type));if(null==a)return null;const i=a.getTooltipForSavedObject?a.getTooltipForSavedObject(e.savedObject):`${e.title} (${a.name})`,s=(a||{getIconForSavedObject:()=>"document"}).getIconForSavedObject(e.savedObject);return r.a.createElement(l.EuiListGroupItem,{key:e.id,iconType:s,label:e.title,onClick:t?()=>{t(e.id,e.type,i,e.savedObject)}:void 0,title:i,"data-test-subj":`savedObjectTitle${(e.title||"").split(" ").join("-")}`})})))):!this.state.isFetchingItems&&r.a.createElement(l.EuiEmptyPrompt,{body:this.props.noItemsMessage}),this.getPageCount()>1&&(this.props.fixedPageSize?r.a.createElement(l.EuiPagination,{activePage:this.state.page,pageCount:this.getPageCount(),onPageClick:e=>{this.setState({page:e})}}):r.a.createElement(l.EuiTablePagination,{activePage:this.state.page,pageCount:this.getPageCount(),onChangePage:e=>{this.setState({page:e})},onChangeItemsPerPage:e=>{this.setState({perPage:e})},itemsPerPage:this.state.perPage,itemsPerPageOptions:[5,10,15,25]})))}}var S=n(80),M=n(63);const C=v.a.span.withConfig({displayName:"BetaBadgeWrapper",componentId:"sc-ubq95a-0"})(["display:inline-flex;.euiToolTipAnchor{display:inline-flex;}"]),T={from:"now-7d",to:"now",mode:"relative"},F=({node:e,onCancel:t,onSave:n})=>{const a=Object(f.useLocation)(),{application:{currentAppId$:i},embeddable:o,lens:c,storage:u,savedObjects:d,uiSettings:h,data:{query:{timefilter:{timefilter:v}}}}=Object(p.d)().services,[y,k]=Object(s.useState)(void 0),{draftComment:w,clearDraftComment:P}=Object(S.a)(),M=Object(s.useContext)(E),F=Object(s.useContext)(l.EuiMarkdownContext),I=Object(s.useCallback)((()=>{y&&(null==o||o.getStateTransfer().getIncomingEmbeddablePackage(y,!0),P()),t()}),[P,y,o,t]),x=Object(s.useCallback)(((e,t)=>{n(`!{${O.b}${JSON.stringify({timeRange:t,attributes:e})}}`,{block:!0}),I()}),[I,n]),L=Object(s.useCallback)(((e,t,n)=>{F.replaceNode(n,`!{${O.b}${JSON.stringify({timeRange:t,attributes:e})}}`),I()}),[I,F]),D=Object(s.useMemo)((()=>`${a.pathname}${a.search}`),[a.pathname,a.search]),N=Object(s.useCallback)((()=>{u.set(O.a,{commentId:null==M?void 0:M.editorId,comment:null==M?void 0:M.value,position:null==e?void 0:e.position,caseTitle:null==M?void 0:M.caseTitle,caseTags:null==M?void 0:M.caseTags}),null==c||c.navigateToPrefilledEditor(void 0,{originatingApp:y,originatingPath:D})}),[u,null==M?void 0:M.editorId,null==M?void 0:M.value,null==M?void 0:M.caseTitle,null==M?void 0:M.caseTags,null==e?void 0:e.position,c,y,D]),A=Object(s.useCallback)(((t,n=T)=>{u.set(O.a,{commentId:null==M?void 0:M.editorId,comment:null==M?void 0:M.value,position:null==e?void 0:e.position,caseTitle:null==M?void 0:M.caseTitle,caseTags:null==M?void 0:M.caseTags}),null==c||c.navigateToPrefilledEditor(t||null!=e&&e.attributes?{id:"",timeRange:n,attributes:t||(null==e?void 0:e.attributes)}:void 0,{originatingApp:y,originatingPath:D})}),[u,null==M?void 0:M.editorId,null==M?void 0:M.value,null==M?void 0:M.caseTitle,null==M?void 0:M.caseTags,null==e?void 0:e.position,null==e?void 0:e.attributes,c,y,D]),R=Object(s.useCallback)(((e,t,n,a)=>{A({...a.attributes,title:"",references:a.references})}),[A]),_=Object(s.useMemo)((()=>[{type:"lens",getIconForSavedObject:()=>"lensApp",name:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.insertLensSavedObjectModal.searchSelection.savedObjectType.lens",{defaultMessage:"Lens"}),includeFields:["*"]}]),[]),B=Object(s.useMemo)((()=>({prepend:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.searchInputPrependLabel",{defaultMessage:"Template"})})),[]),$=Object(s.useMemo)((()=>({label:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.searchInputLabel",{defaultMessage:"Select lens"}),labelAppend:r.a.createElement(l.EuiButtonEmpty,{onClick:N,color:"primary",size:"xs"},r.a.createElement(b.FormattedMessage,{id:"xpack.cases.markdownEditor.plugins.lens.createVisualizationButtonLabel",defaultMessage:"Create visualization"})),helpText:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.savedObjects.finder.searchInputHelpText",{defaultMessage:"Insert lens from existing templates or creating a new one. You will only create lens for this comment and won’t change Visualize Library."})})),[N]);return Object(s.useEffect)((()=>{null!=e&&e.attributes&&y&&A(e.attributes,e.timeRange)}),[A,e,y]),Object(s.useEffect)((()=>{(async()=>{const e=await i.pipe(Object(m.first)()).toPromise();k(e)})()}),[i]),Object(s.useEffect)((()=>{var e,t,n;let a;if(y&&(a=null==o?void 0:o.getStateTransfer().getIncomingEmbeddablePackage(y,!0)),"lens"===(null===(e=a)||void 0===e?void 0:e.type)&&null!==(t=a)&&void 0!==t&&null!==(n=t.input)&&void 0!==n&&n.attributes){const e=v.getTime(),t=null!=e&&e.from&&null!=e&&e.to?{from:e.from,to:e.to,mode:[e.from,e.to].join("").includes("now")?"relative":"absolute"}:void 0;var i,s;if(null!=w&&w.position)return void L(null===(i=a)||void 0===i?void 0:i.input.attributes,t,w.position);if(w)x(null===(s=a)||void 0===s?void 0:s.input.attributes,t)}}),[o,u,v,y,x,L,w]),r.a.createElement(j,{direction:"column",gutterSize:"none"},r.a.createElement(l.EuiModalHeader,null,r.a.createElement(l.EuiModalHeaderTitle,null,r.a.createElement(l.EuiFlexGroup,{gutterSize:"s",alignItems:"center"},r.a.createElement(l.EuiFlexItem,{grow:!1},r.a.createElement(b.FormattedMessage,{id:"xpack.cases.markdownEditor.plugins.lens.addVisualizationModalTitle",defaultMessage:"Add visualization"})),r.a.createElement(l.EuiFlexItem,{grow:!1},r.a.createElement(C,null,r.a.createElement(l.EuiBetaBadge,{label:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.betaLabel",{defaultMessage:"Beta"}),tooltipContent:g.i18n.translate("xpack.cases.markdownEditor.plugins.lens.betaDescription",{defaultMessage:"This module is not GA. You can only insert one lens per comment for now. Please help us by reporting bugs."})})))))),r.a.createElement(l.EuiModalBody,null,r.a.createElement(saved_objects_finder_SavedObjectFinderUi,{key:"searchSavedObjectFinder",onChoose:R,showFilter:!1,noItemsMessage:r.a.createElement(b.FormattedMessage,{id:"xpack.cases.markdownEditor.plugins.lens.insertLensSavedObjectModal.searchSelection.notFoundLabel",defaultMessage:"No matching lens found."}),savedObjectMetaData:_,fixedPageSize:10,uiSettings:h,savedObjects:d,euiFieldSearchProps:B,euiFormRowProps:$})),r.a.createElement(l.EuiModalFooter,null,r.a.createElement(l.EuiButton,{onClick:I,fill:!0},r.a.createElement(b.FormattedMessage,{id:"xpack.cases.markdownEditor.plugins.lens.closeButtonLabel",defaultMessage:"Close"}))))};F.displayName="LensEditor";const I=r.a.memo(F),x={name:O.b,button:{label:M.a,iconType:"lensApp"},helpText:r.a.createElement(l.EuiCodeBlock,{language:"md",paddingSize:"s",fontSize:"l"},"!{lens<config>}"),editor:I},L=function(){const e=this.Parser,t=e.prototype.blockTokenizers,n=e.prototype.blockMethods;t.lens=function(e,t,n){if(!1===t.startsWith(O.d))return!1;const a=t[6];if("{"!==a&&"}"!==a)return!1;if(n)return!0;const i="{"===a;let s=O.d,r={};if(i){let n="",a=0;for(let e=6;e<t.length;e++){const i=t[e];if("{"===i)a++,n+=i;else if("}"===i){if(a--,-1===a)break;n+=i}else n+=i}s+=n;try{r=JSON.parse(n)}catch(t){const n=e.now();this.file.fail(`Unable to parse lens JSON configuration: ${t}`,{line:n.line,column:n.column+6})}}return s+="}",e(s)({type:O.b,...r})},n.splice(n.indexOf("text"),0,O.b)};var D=n(37);const N=v.a.div.withConfig({displayName:"Container",componentId:"sc-1q3wldf-0"})(["min-height:","px;"],O.c),A=D.createGlobalStyle`
  div.euiOverlayMask.euiOverlayMask--aboveHeader ~ [id^='echTooltipPortal'] {
    z-index: ${({theme:e})=>e.eui.euiZLevel7} !important;
  }
`,R=({attributes:e,timeRange:t})=>{const{lens:{EmbeddableComponent:n}}=Object(p.d)().services;return e?r.a.createElement(N,null,r.a.createElement(n,{id:"",style:{height:O.c},timeRange:t,attributes:e,renderMode:"view",disableTriggers:!0}),r.a.createElement(A,null)):null};R.displayName="LensMarkDownRenderer";const _=r.a.memo(R),B=e=>{var t,n;const a=p.a.getConfig(),i=null===(t=Object(d.a)())||void 0===t?void 0:t.editor_plugins;return Object(s.useMemo)((()=>{var t;const n=Object(l.getDefaultEuiMarkdownUiPlugins)(),s=Object(l.getDefaultEuiMarkdownParsingPlugins)(),r=Object(l.getDefaultEuiMarkdownProcessingPlugins)();return i&&(n.push(i.uiPlugin),s.push(i.parsingPlugin),r[1][1].components.timeline=i.processingPluginRenderer),null==a||null===(t=a.markdownPlugins)||void 0===t||!t.lens||null!=e&&e.includes(O.b)||n.push(x),s.push(L),r[1][1].components.lens=_,{uiPlugins:n,parsingPlugins:s,processingPlugins:r}}),[e,null==a||null===(n=a.markdownPlugins)||void 0===n?void 0:n.lens,i])},$=({children:e,disableLinks:t})=>{const{processingPlugins:n,parsingPlugins:a}=B(),c=Object(o.cloneDeep)(n);return c[1][1].components.a=Object(s.useMemo)((()=>(e=>{const t=Object(s.memo)((t=>r.a.createElement(u,i()({},t,{disableLinks:e}))));return t.displayName="MarkdownLinkProcessingComponent",t})(t)),[t]),r.a.createElement(l.EuiMarkdownFormat,{parsingPluginList:a,processingPluginList:c,grow:!1},e)};$.displayName="MarkdownRenderer";const q=Object(s.memo)($);var z=n(114),G=n.n(z);const J="euiButtonIcon-isDisabled",U=Object(s.forwardRef)((({ariaLabel:e,dataTestSubj:t,editorId:n,height:a,onChange:i,value:o,disabledUiPlugins:c},u)=>{const d=Object(s.useRef)(void 0),[p,m]=Object(s.useState)([]),g=Object(s.useCallback)(((e,{messages:t,ast:n})=>{m(e?[e]:t),d.current=n}),[]),{parsingPlugins:b,processingPlugins:f,uiPlugins:h}=B(c),v=Object(s.useRef)(null);return(({astRef:e,editorRef:t,uiPlugins:n,value:a})=>{const i=Object(s.useRef)(!1),[r,o]=Object(s.useState)(!1),l=Object(s.useCallback)((()=>{var e,n;if(null!=t&&null!==(e=t.current)&&void 0!==e&&e.textarea&&null!==(n=t.current)&&void 0!==n&&n.toolbar){var a,i;const e=null===(a=t.current)||void 0===a||null===(i=a.toolbar)||void 0===i?void 0:i.querySelector(`[aria-label="${M.a}"]`);if(e){const t=e.className.includes(J),n=e.getAttribute("style");t&&n&&(e.className=e.className.replace(J,""),e.setAttribute("style",n.replace("pointer-events: none;","")))}}}),[t]),c=Object(s.useCallback)((()=>{var e;if(null!=t&&null!==(e=t.current)&&void 0!==e&&e.textarea&&t.current.toolbar){var n;const e=null===(n=t.current.toolbar)||void 0===n?void 0:n.querySelector(`[aria-label="${M.a}"]`);e&&(e.className.includes(J)||(e.className+=` ${J}`,e.setAttribute("style","pointer-events: none;")))}}),[t]);Object(s.useEffect)((()=>{i.current=Object(w.some)(n,["name","lens"])}),[n]),G()((()=>{r||null==a||!a.includes(O.d)?l():c()}),100,[a,r]),Object(s.useEffect)((()=>{var n,a;if(null==(null==t||null===(n=t.current)||void 0===n?void 0:n.textarea)||null==(null==e?void 0:e.current)||!i.current)return;const s=()=>{var n;const{selectionStart:a}=null===(n=t.current)||void 0===n?void 0:n.textarea;let i=e.current;e:for(;;){if(i.children)for(let e=0;e<i.children.length;e++){const t=i.children[e];if(t.position.start.offset<a&&a<t.position.end.offset){if("text"===t.type)break e;i=t;continue e}}break}o("lens"===i.type)},r=null===(a=t.current)||void 0===a?void 0:a.textarea;return r.addEventListener("keyup",s),r.addEventListener("mouseup",s),()=>{r.removeEventListener("keyup",s),r.removeEventListener("mouseup",s)}}),[e,t])})({astRef:d,uiPlugins:h,editorRef:u,value:o}),Object(s.useImperativeHandle)(u,(()=>{var e,t;if(!v.current)return null;const n=null===(e=v.current)||void 0===e||null===(t=e.textarea)||void 0===t?void 0:t.closest(".euiMarkdownEditor");return{...v.current,toolbar:null==n?void 0:n.querySelector(".euiMarkdownEditorToolbar")}})),r.a.createElement(l.EuiMarkdownEditor,{ref:v,"aria-label":e,editorId:n,onChange:i,value:o,uiPlugins:h,parsingPluginList:b,processingPluginList:f,onParse:g,errors:p,"data-test-subj":t,height:a})}));U.displayName="MarkdownEditorComponent";const H=Object(s.memo)(U);var V=n(45);const W=v()(l.EuiFlexGroup).withConfig({displayName:"BottomContentWrapper",componentId:"sc-aza0tp-0"})(["",""],(({theme:e})=>`\n    padding: ${e.eui.ruleMargins.marginSmall} 0;\n  `)),Y=r.a.memo(Object(s.forwardRef)((({id:e,field:t,dataTestSubj:n,idAria:a,bottomRightContent:i,caseTitle:o,caseTags:c,disabledUiPlugins:u},d)=>{const{isInvalid:p,errorMessage:m}=Object(V.h)(t),g=Object(s.useMemo)((()=>({editorId:e,value:t.value,caseTitle:o,caseTags:c})),[e,t.value,o,c]);return r.a.createElement(E.Provider,{value:g},r.a.createElement(l.EuiFormRow,{"data-test-subj":n,describedByIds:a?[a]:void 0,fullWidth:!0,error:m,helpText:t.helpText,isInvalid:p,label:t.label,labelAppend:t.labelAppend},r.a.createElement(H,{ref:d,ariaLabel:a,editorId:e,onChange:t.setValue,value:t.value,disabledUiPlugins:u,"data-test-subj":`${n}-markdown-editor`})),i&&r.a.createElement(W,{justifyContent:"flexEnd"},r.a.createElement(l.EuiFlexItem,{grow:!1},i)))})));Y.displayName="MarkdownEditorForm"},67:function(e,t,n){"use strict";n.d(t,"b",(function(){return a.b})),n.d(t,"a",(function(){return a.a}));var a=n(23)},78:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return r}));var a=n(2),i=n.n(a);const s=i.a.createContext(null),r=({children:e,timelineIntegration:t})=>{const[n]=Object(a.useState)(null!=t?t:null);return i.a.createElement(s.Provider,{value:n},e)}},79:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var a=n(2),i=n(78);const s=()=>Object(a.useContext)(i.a)},80:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(2),i=n(41),s=n(13),r=n(53),o=n(63);const l=()=>{const{application:{currentAppId$:e},embeddable:t,storage:n}=Object(s.d)().services,[l,c]=Object(a.useState)(null),[u,d]=Object(a.useState)(!1);Object(a.useEffect)((()=>{(async()=>{const a=await e.pipe(Object(i.first)()).toPromise();if(!a)return;const s=null==t?void 0:t.getStateTransfer().getIncomingEmbeddablePackage(a),o=n.get(r.a);d(!!s),o&&c(o)})()}),[e,t,n]);return{draftComment:l,hasIncomingLensState:u,openLensModal:Object(a.useCallback)((({editorRef:e})=>{if(e&&e.textarea&&e.toolbar){var t;const n=null===(t=e.toolbar)||void 0===t?void 0:t.querySelector(`[aria-label="${o.a}"]`);n&&n.click()}}),[]),clearDraftComment:Object(a.useCallback)((()=>{n.remove(r.a),c(null)}),[n])}}}}]);