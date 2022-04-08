/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.canvas_bundle_jsonpfunction=window.canvas_bundle_jsonpfunction||[]).push([[11],{150:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));n(17);var o=n(19),r=n(18);const a=()=>Object(r.jsx)(o.EuiFlexGroup,{justifyContent:"spaceAround",alignItems:"center",style:{minHeight:600}},Object(r.jsx)(o.EuiFlexItem,{grow:!1},Object(r.jsx)(o.EuiLoadingSpinner,{size:"xl"})))},398:function(e,t,n){var o,r;e.exports=(o=n(17),r=n(67),function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function a(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),p=o(n(1)),d=o(n(2)),f=n(3),g=o(n(5)),b=function(e){function t(e,n){i(this,t);var o=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return o.renderChildren=function(e,t,n,r){return"function"==typeof e?e(c({},o.state,{isDragActive:t,isDragAccept:n,isDragReject:r})):e},o.composeHandlers=o.composeHandlers.bind(o),o.onClick=o.onClick.bind(o),o.onDocumentDrop=o.onDocumentDrop.bind(o),o.onDragEnter=o.onDragEnter.bind(o),o.onDragLeave=o.onDragLeave.bind(o),o.onDragOver=o.onDragOver.bind(o),o.onDragStart=o.onDragStart.bind(o),o.onDrop=o.onDrop.bind(o),o.onFileDialogCancel=o.onFileDialogCancel.bind(o),o.onInputElementClick=o.onInputElementClick.bind(o),o.setRef=o.setRef.bind(o),o.setRefs=o.setRefs.bind(o),o.isFileDialogActive=!1,o.state={draggedFiles:[],acceptedFiles:[],rejectedFiles:[]},o}return l(t,e),u(t,[{key:"componentDidMount",value:function(){var e=this.props.preventDropOnDocument;this.dragTargets=[],e&&(document.addEventListener("dragover",f.onDocumentDragOver,!1),document.addEventListener("drop",this.onDocumentDrop,!1)),this.fileInputEl.addEventListener("click",this.onInputElementClick,!1),window.addEventListener("focus",this.onFileDialogCancel,!1)}},{key:"componentWillUnmount",value:function(){this.props.preventDropOnDocument&&(document.removeEventListener("dragover",f.onDocumentDragOver),document.removeEventListener("drop",this.onDocumentDrop)),null!=this.fileInputEl&&this.fileInputEl.removeEventListener("click",this.onInputElementClick,!1),window.removeEventListener("focus",this.onFileDialogCancel,!1)}},{key:"composeHandlers",value:function(e){return this.props.disabled?null:e}},{key:"onDocumentDrop",value:function(e){this.node&&this.node.contains(e.target)||(e.preventDefault(),this.dragTargets=[])}},{key:"onDragStart",value:function(e){this.props.onDragStart&&this.props.onDragStart.call(this,e)}},{key:"onDragEnter",value:function(e){var t=this;e.preventDefault(),-1===this.dragTargets.indexOf(e.target)&&this.dragTargets.push(e.target),Promise.resolve(this.props.getDataTransferItems(e)).then((function(e){t.setState({isDragActive:!0,draggedFiles:e})})),this.props.onDragEnter&&this.props.onDragEnter.call(this,e)}},{key:"onDragOver",value:function(e){e.preventDefault(),e.stopPropagation();try{e.dataTransfer.dropEffect=this.isFileDialogActive?"none":"copy"}catch(e){}return this.props.onDragOver&&this.props.onDragOver.call(this,e),!1}},{key:"onDragLeave",value:function(e){var t=this;e.preventDefault(),this.dragTargets=this.dragTargets.filter((function(n){return n!==e.target&&t.node.contains(n)})),this.dragTargets.length>0||(this.setState({isDragActive:!1,draggedFiles:[]}),this.props.onDragLeave&&this.props.onDragLeave.call(this,e))}},{key:"onDrop",value:function(e){var t=this,n=this.props,o=n.onDrop,r=n.onDropAccepted,i=n.onDropRejected,s=n.multiple,l=n.disablePreview,c=n.accept,u=n.getDataTransferItems;e.preventDefault(),this.dragTargets=[],this.isFileDialogActive=!1,this.draggedFiles=null,this.setState({isDragActive:!1,draggedFiles:[]}),Promise.resolve(u(e)).then((function(n){var u=[],p=[];n.forEach((function(e){if(!l)try{e.preview=window.URL.createObjectURL(e)}catch(e){}(0,f.fileAccepted)(e,c)&&(0,f.fileMatchSize)(e,t.props.maxSize,t.props.minSize)?u.push(e):p.push(e)})),s||p.push.apply(p,a(u.splice(1))),o&&o.call(t,u,p,e),p.length>0&&i&&i.call(t,p,e),u.length>0&&r&&r.call(t,u,e)}))}},{key:"onClick",value:function(e){var t=this.props,n=t.onClick;t.disableClick||(e.stopPropagation(),n&&n.call(this,e),(0,f.isIeOrEdge)()?setTimeout(this.open.bind(this),0):this.open())}},{key:"onInputElementClick",value:function(e){e.stopPropagation(),this.props.inputProps&&this.props.inputProps.onClick&&this.props.inputProps.onClick()}},{key:"onFileDialogCancel",value:function(){var e=this,t=this.props.onFileDialogCancel;this.isFileDialogActive&&setTimeout((function(){null!=e.fileInputEl&&(e.fileInputEl.files.length||(e.isFileDialogActive=!1)),"function"==typeof t&&t()}),300)}},{key:"setRef",value:function(e){this.node=e}},{key:"setRefs",value:function(e){this.fileInputEl=e}},{key:"open",value:function(){this.isFileDialogActive=!0,this.fileInputEl.value=null,this.fileInputEl.click()}},{key:"render",value:function(){var e=this.props,t=e.accept,n=e.acceptClassName,o=e.activeClassName,a=e.children,i=e.disabled,s=e.disabledClassName,l=e.inputProps,u=e.multiple,d=e.name,b=e.rejectClassName,m=r(e,["accept","acceptClassName","activeClassName","children","disabled","disabledClassName","inputProps","multiple","name","rejectClassName"]),v=m.acceptStyle,h=m.activeStyle,k=m.className,x=void 0===k?"":k,j=m.disabledStyle,y=m.rejectStyle,T=m.style,D=r(m,["acceptStyle","activeStyle","className","disabledStyle","rejectStyle","style"]),O=this.state,w=O.isDragActive,E=O.draggedFiles,C=E.length,S=u||C<=1,P=C>0&&(0,f.allFilesAccepted)(E,this.props.accept),W=C>0&&(!P||!S),M=!(x||T||h||v||y||j);w&&o&&(x+=" "+o),P&&n&&(x+=" "+n),W&&b&&(x+=" "+b),i&&s&&(x+=" "+s),M&&(T=g.default.default,h=g.default.active,v=g.default.active,y=g.default.rejected,j=g.default.disabled);var _=c({position:"relative"},T);h&&w&&(_=c({},_,h)),v&&P&&(_=c({},_,v)),y&&W&&(_=c({},_,y)),j&&i&&(_=c({},_,j));var F={accept:t,disabled:i,type:"file",style:c({position:"absolute",top:0,right:0,bottom:0,left:0,opacity:1e-5,pointerEvents:"none"},l.style),multiple:f.supportMultiple&&u,ref:this.setRefs,onChange:this.onDrop,autoComplete:"off"};d&&d.length&&(F.name=d);var A=(D.acceptedFiles,D.preventDropOnDocument,D.disablePreview,D.disableClick,D.onDropAccepted,D.onDropRejected,D.onFileDialogCancel,D.maxSize,D.minSize,D.getDataTransferItems,r(D,["acceptedFiles","preventDropOnDocument","disablePreview","disableClick","onDropAccepted","onDropRejected","onFileDialogCancel","maxSize","minSize","getDataTransferItems"]));return p.default.createElement("div",c({className:x,style:_},A,{onClick:this.composeHandlers(this.onClick),onDragStart:this.composeHandlers(this.onDragStart),onDragEnter:this.composeHandlers(this.onDragEnter),onDragOver:this.composeHandlers(this.onDragOver),onDragLeave:this.composeHandlers(this.onDragLeave),onDrop:this.composeHandlers(this.onDrop),ref:this.setRef,"aria-disabled":i}),this.renderChildren(a,w,P,W),p.default.createElement("input",c({},l,F)))}}]),t}(p.default.Component);t.default=b,b.propTypes={accept:d.default.oneOfType([d.default.string,d.default.arrayOf(d.default.string)]),children:d.default.oneOfType([d.default.node,d.default.func]),disableClick:d.default.bool,disabled:d.default.bool,disablePreview:d.default.bool,preventDropOnDocument:d.default.bool,inputProps:d.default.object,multiple:d.default.bool,name:d.default.string,maxSize:d.default.number,minSize:d.default.number,className:d.default.string,activeClassName:d.default.string,acceptClassName:d.default.string,rejectClassName:d.default.string,disabledClassName:d.default.string,style:d.default.object,activeStyle:d.default.object,acceptStyle:d.default.object,rejectStyle:d.default.object,disabledStyle:d.default.object,getDataTransferItems:d.default.func,onClick:d.default.func,onDrop:d.default.func,onDropAccepted:d.default.func,onDropRejected:d.default.func,onDragStart:d.default.func,onDragEnter:d.default.func,onDragOver:d.default.func,onDragLeave:d.default.func,onFileDialogCancel:d.default.func},b.defaultProps={preventDropOnDocument:!0,disabled:!1,disablePreview:!1,disableClick:!1,inputProps:{},multiple:!0,maxSize:1/0,minSize:0,getDataTransferItems:f.getDataTransferItems},e.exports=t.default},function(e,t){e.exports=o},function(e,t){e.exports=r},function(e,t,n){"use strict";function o(e){var t=[];if(e.dataTransfer){var n=e.dataTransfer;n.files&&n.files.length?t=n.files:n.items&&n.items.length&&(t=n.items)}else e.target&&e.target.files&&(t=e.target.files);return Array.prototype.slice.call(t)}function r(e,t){return"application/x-moz-file"===e.type||(0,p.default)(e,t)}function a(e,t,n){return e.size<=t&&e.size>=n}function i(e,t){return e.every((function(e){return r(e,t)}))}function s(e){e.preventDefault()}function l(e){return-1!==e.indexOf("MSIE")||-1!==e.indexOf("Trident/")}function c(e){return-1!==e.indexOf("Edge/")}function u(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.navigator.userAgent;return l(e)||c(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.supportMultiple=void 0,t.getDataTransferItems=o,t.fileAccepted=r,t.fileMatchSize=a,t.allFilesAccepted=i,t.onDocumentDragOver=s,t.isIeOrEdge=u;var p=function(e){return e&&e.__esModule?e:{default:e}}(n(4));t.supportMultiple="undefined"==typeof document||!document||!document.createElement||"multiple"in document.createElement("input")},function(e,t){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=13)}([function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){var n=e.exports={version:"2.5.0"};"number"==typeof __e&&(__e=n)},function(e,t,n){e.exports=!n(4)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},function(e,t,n){var o=n(32)("wks"),r=n(9),a=n(0).Symbol,i="function"==typeof a;(e.exports=function(e){return o[e]||(o[e]=i&&a[e]||(i?a:r)("Symbol."+e))}).store=o},function(e,t,n){var o=n(0),r=n(2),a=n(8),i=n(22),s=n(10),l=function(e,t,n){var c,u,p,d,f=e&l.F,g=e&l.G,b=e&l.S,m=e&l.P,v=e&l.B,h=g?o:b?o[t]||(o[t]={}):(o[t]||{}).prototype,k=g?r:r[t]||(r[t]={}),x=k.prototype||(k.prototype={});for(c in g&&(n=t),n)p=((u=!f&&h&&void 0!==h[c])?h:n)[c],d=v&&u?s(p,o):m&&"function"==typeof p?s(Function.call,p):p,h&&i(h,c,p,e&l.U),k[c]!=p&&a(k,c,d),m&&x[c]!=p&&(x[c]=p)};o.core=r,l.F=1,l.G=2,l.S=4,l.P=8,l.B=16,l.W=32,l.U=64,l.R=128,e.exports=l},function(e,t,n){var o=n(16),r=n(21);e.exports=n(3)?function(e,t,n){return o.f(e,t,r(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t){var n=0,o=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},function(e,t,n){var o=n(24);e.exports=function(e,t,n){if(o(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,o){return e.call(t,n,o)};case 3:return function(n,o,r){return e.call(t,n,o,r)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e){if(null==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t,n){var o=n(28),r=Math.min;e.exports=function(e){return e>0?r(o(e),9007199254740991):0}},function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(e&&t){var n=Array.isArray(t)?t:t.split(","),o=e.name||"",r=e.type||"",a=r.replace(/\/.*$/,"");return n.some((function(e){var t=e.trim();return"."===t.charAt(0)?o.toLowerCase().endsWith(t.toLowerCase()):t.endsWith("/*")?a===t.replace(/\/.*$/,""):r===t}))}return!0},n(14),n(34)},function(e,t,n){n(15),e.exports=n(2).Array.some},function(e,t,n){"use strict";var o=n(7),r=n(25)(3);o(o.P+o.F*!n(33)([].some,!0),"Array",{some:function(e){return r(this,e,arguments[1])}})},function(e,t,n){var o=n(17),r=n(18),a=n(20),i=Object.defineProperty;t.f=n(3)?Object.defineProperty:function(e,t,n){if(o(e),t=a(t,!0),o(n),r)try{return i(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t,n){var o=n(1);e.exports=function(e){if(!o(e))throw TypeError(e+" is not an object!");return e}},function(e,t,n){e.exports=!n(3)&&!n(4)((function(){return 7!=Object.defineProperty(n(19)("div"),"a",{get:function(){return 7}}).a}))},function(e,t,n){var o=n(1),r=n(0).document,a=o(r)&&o(r.createElement);e.exports=function(e){return a?r.createElement(e):{}}},function(e,t,n){var o=n(1);e.exports=function(e,t){if(!o(e))return e;var n,r;if(t&&"function"==typeof(n=e.toString)&&!o(r=n.call(e)))return r;if("function"==typeof(n=e.valueOf)&&!o(r=n.call(e)))return r;if(!t&&"function"==typeof(n=e.toString)&&!o(r=n.call(e)))return r;throw TypeError("Can't convert object to primitive value")}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,n){var o=n(0),r=n(8),a=n(23),i=n(9)("src"),s=Function.toString,l=(""+s).split("toString");n(2).inspectSource=function(e){return s.call(e)},(e.exports=function(e,t,n,s){var c="function"==typeof n;c&&(a(n,"name")||r(n,"name",t)),e[t]!==n&&(c&&(a(n,i)||r(n,i,e[t]?""+e[t]:l.join(String(t)))),e===o?e[t]=n:s?e[t]?e[t]=n:r(e,t,n):(delete e[t],r(e,t,n)))})(Function.prototype,"toString",(function(){return"function"==typeof this&&this[i]||s.call(this)}))},function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){var o=n(10),r=n(26),a=n(27),i=n(12),s=n(29);e.exports=function(e,t){var n=1==e,l=2==e,c=3==e,u=4==e,p=6==e,d=5==e||p,f=t||s;return function(t,s,g){for(var b,m,v=a(t),h=r(v),k=o(s,g,3),x=i(h.length),j=0,y=n?f(t,x):l?f(t,0):void 0;x>j;j++)if((d||j in h)&&(m=k(b=h[j],j,v),e))if(n)y[j]=m;else if(m)switch(e){case 3:return!0;case 5:return b;case 6:return j;case 2:y.push(b)}else if(u)return!1;return p?-1:c||u?u:y}}},function(e,t,n){var o=n(5);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==o(e)?e.split(""):Object(e)}},function(e,t,n){var o=n(11);e.exports=function(e){return Object(o(e))}},function(e,t){var n=Math.ceil,o=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},function(e,t,n){var o=n(30);e.exports=function(e,t){return new(o(e))(t)}},function(e,t,n){var o=n(1),r=n(31),a=n(6)("species");e.exports=function(e){var t;return r(e)&&("function"!=typeof(t=e.constructor)||t!==Array&&!r(t.prototype)||(t=void 0),o(t)&&null===(t=t[a])&&(t=void 0)),void 0===t?Array:t}},function(e,t,n){var o=n(5);e.exports=Array.isArray||function(e){return"Array"==o(e)}},function(e,t,n){var o=n(0),r=o["__core-js_shared__"]||(o["__core-js_shared__"]={});e.exports=function(e){return r[e]||(r[e]={})}},function(e,t,n){"use strict";var o=n(4);e.exports=function(e,t){return!!e&&o((function(){t?e.call(null,(function(){}),1):e.call(null)}))}},function(e,t,n){n(35),e.exports=n(2).String.endsWith},function(e,t,n){"use strict";var o=n(7),r=n(12),a=n(36),i="".endsWith;o(o.P+o.F*n(38)("endsWith"),"String",{endsWith:function(e){var t=a(this,e,"endsWith"),n=arguments.length>1?arguments[1]:void 0,o=r(t.length),s=void 0===n?o:Math.min(r(n),o),l=String(e);return i?i.call(t,l,s):t.slice(s-l.length,s)===l}})},function(e,t,n){var o=n(37),r=n(11);e.exports=function(e,t,n){if(o(t))throw TypeError("String#"+n+" doesn't accept regex!");return String(r(e))}},function(e,t,n){var o=n(1),r=n(5),a=n(6)("match");e.exports=function(e){var t;return o(e)&&(void 0!==(t=e[a])?!!t:"RegExp"==r(e))}},function(e,t,n){var o=n(6)("match");e.exports=function(e){var t=/./;try{"/./"[e](t)}catch(n){try{return t[o]=!1,!"/./"[e](t)}catch(e){}}return!0}}])},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={rejected:{borderStyle:"solid",borderColor:"#c66",backgroundColor:"#eee"},disabled:{opacity:.5},active:{borderStyle:"solid",borderColor:"#6c6",backgroundColor:"#eee"},default:{width:200,height:200,borderWidth:2,borderColor:"#666",borderStyle:"dashed",borderRadius:5}},e.exports=t.default}]))},399:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(400);case"v8light":return n(402)}},400:function(e,t,n){var o=n(118),r=n(401);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var a={insert:"head",singleton:!1};o(r,a);e.exports=r.locals||{}},401:function(e,t,n){(t=n(119)(!1)).push([e.i,".canvasWorkpad__dropzone{border:2px dashed transparent}.canvasWorkpad__dropzone--active{background-color:#25262E;border-color:#343741}\n",""]),e.exports=t},402:function(e,t,n){var o=n(118),r=n(403);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var a={insert:"head",singleton:!1};o(r,a);e.exports=r.locals||{}},403:function(e,t,n){(t=n(119)(!1)).push([e.i,".canvasWorkpad__dropzone{border:2px dashed transparent}.canvasWorkpad__dropzone--active{background-color:#F5F7FA;border-color:#D3DAE6}\n",""]),e.exports=t},411:function(e,t,n){"use strict";n.r(t),n.d(t,"WorkpadsContext",(function(){return N})),n.d(t,"MyWorkpads",(function(){return z}));var o=n(17),r=n(83),a=n(150),i=n(19),s=n(57),l=n(54),c=n(398),u=n.n(c),p=(n(399),n(18));const d=({onDrop:e=(()=>{}),disabled:t,children:n})=>Object(p.jsx)(u.a,{onDrop:e,disabled:t,disableClick:!0,className:"canvasWorkpad__dropzone",activeClassName:"canvasWorkpad__dropzone--active"},n),{WorkpadDropzone:f}=l.f,g=({children:e})=>{const t=Object(s.useNotifyService)(),n=Object(r.g)(),[a,i]=Object(o.useState)(!1);return Object(p.jsx)(d,{disabled:a,onDrop:e=>{e&&(e.length>1?t.warning(f.getTooManyFilesErrorMessage()):(i(!0),n(e[0],(()=>i(!1)))))}},e)};var b=n(3),m=n(55);const v=()=>Object(p.jsx)(i.EuiFlexGroup,{justifyContent:"spaceAround",alignItems:"center",style:{minHeight:600}},Object(p.jsx)(i.EuiFlexItem,{grow:!1},Object(p.jsx)(i.EuiPanel,{color:"subdued",borderRadius:"none",hasShadow:!1},Object(p.jsx)(i.EuiEmptyPrompt,{color:"subdued",iconType:"importAction",title:Object(p.jsx)("h2",null,h.getEmptyPromptTitle()),titleSize:"m",body:Object(p.jsx)(o.Fragment,null,Object(p.jsx)("p",null,h.getEmptyPromptGettingStartedDescription()),Object(p.jsx)("p",null,h.getEmptyPromptNewUserDescription()," ",Object(p.jsx)(i.EuiLink,{href:"home#/tutorial_directory/sampleData"},h.getSampleDataLinkLabel()),"."))})))),h={getEmptyPromptGettingStartedDescription:()=>b.i18n.translate("xpack.canvas.homeEmptyPrompt.emptyPromptGettingStartedDescription",{defaultMessage:"Create a new workpad, start from a template, or import a workpad {JSON} file by dropping it here.",values:{JSON:m.r}}),getEmptyPromptNewUserDescription:()=>b.i18n.translate("xpack.canvas.homeEmptyPrompt.emptyPromptNewUserDescription",{defaultMessage:"New to {CANVAS}?",values:{CANVAS:m.c}}),getEmptyPromptTitle:()=>b.i18n.translate("xpack.canvas.homeEmptyPrompt.emptyPromptTitle",{defaultMessage:"Add your first workpad"}),getSampleDataLinkLabel:()=>b.i18n.translate("xpack.canvas.homeEmptyPrompt.sampleDataLinkLabel",{defaultMessage:"Add your first workpad"})};var k=n(56),x=n(68),j=n(104),y=n(25),T=n.n(y),D=n(123),O=n(147);const w=({workpads:e,canUserWrite:t,selectedWorkpadIds:n,onDeleteWorkpads:r,onExportWorkpads:a})=>{var s;const[l,c]=Object(o.useState)(!1),u=()=>c(!1);let d=Object(p.jsx)(i.EuiButton,{color:"danger",iconType:"trash",onClick:()=>c(!0),disabled:!t,"aria-label":E.getDeleteButtonAriaLabel(n.length),"data-test-subj":"deleteWorkpadButton"},E.getDeleteButtonLabel(n.length));const f=Object(p.jsx)(i.EuiButton,{color:"success",onClick:()=>a(n),iconType:"exportAction","aria-label":E.getExportButtonAriaLabel(n.length)},E.getExportButtonLabel(n.length));t||(d=Object(p.jsx)(i.EuiToolTip,{content:E.getNoPermissionToDeleteToolTip()},d));const g=1===n.length?E.getDeleteSingleWorkpadModalTitle((null===(s=e.find((e=>e.id===n[0])))||void 0===s?void 0:s.name)||""):E.getDeleteMultipleWorkpadModalTitle(n.length+""),b=Object(p.jsx)(O.a,{isOpen:l,title:g,message:E.getDeleteModalDescription(),confirmButtonText:E.getDeleteModalConfirmButtonLabel(),onConfirm:()=>{r(n),u()},onCancel:u});return Object(p.jsx)(o.Fragment,null,Object(p.jsx)(i.EuiFlexGroup,{gutterSize:"xs"},Object(p.jsx)(i.EuiFlexItem,{grow:!1},f),Object(p.jsx)(i.EuiFlexItem,{grow:!1},d)),b)},E={getDeleteButtonAriaLabel:e=>b.i18n.translate("xpack.canvas.workpadTableTools.deleteButtonAriaLabel",{defaultMessage:"Delete {numberOfWorkpads} workpads",values:{numberOfWorkpads:e}}),getDeleteButtonLabel:e=>b.i18n.translate("xpack.canvas.workpadTableTools.deleteButtonLabel",{defaultMessage:"Delete ({numberOfWorkpads})",values:{numberOfWorkpads:e}}),getDeleteModalConfirmButtonLabel:()=>b.i18n.translate("xpack.canvas.workpadTableTools.deleteModalConfirmButtonLabel",{defaultMessage:"Delete"}),getDeleteModalDescription:()=>b.i18n.translate("xpack.canvas.workpadTableTools.deleteModalDescription",{defaultMessage:"You can't recover deleted workpads."}),getDeleteMultipleWorkpadModalTitle:e=>b.i18n.translate("xpack.canvas.workpadTableTools.deleteMultipleWorkpadsModalTitle",{defaultMessage:"Delete {numberOfWorkpads} workpads?",values:{numberOfWorkpads:e}}),getDeleteSingleWorkpadModalTitle:e=>b.i18n.translate("xpack.canvas.workpadTableTools.deleteSingleWorkpadModalTitle",{defaultMessage:"Delete workpad '{workpadName}'?",values:{workpadName:e}}),getExportButtonAriaLabel:e=>b.i18n.translate("xpack.canvas.workpadTableTools.exportButtonAriaLabel",{defaultMessage:"Export {numberOfWorkpads} workpads",values:{numberOfWorkpads:e}}),getExportButtonLabel:e=>b.i18n.translate("xpack.canvas.workpadTableTools.exportButtonLabel",{defaultMessage:"Export ({numberOfWorkpads})",values:{numberOfWorkpads:e}}),getNoPermissionToCreateToolTip:()=>b.i18n.translate("xpack.canvas.workpadTableTools.noPermissionToCreateToolTip",{defaultMessage:"You don't have permission to create workpads"}),getNoPermissionToDeleteToolTip:()=>b.i18n.translate("xpack.canvas.workpadTableTools.noPermissionToDeleteToolTip",{defaultMessage:"You don't have permission to delete workpads"}),getNoPermissionToUploadToolTip:()=>b.i18n.translate("xpack.canvas.workpadTableTools.noPermissionToUploadToolTip",{defaultMessage:"You don't have permission to upload workpads"})},C=({selectedWorkpadIds:e})=>{const t=Object(r.d)(),n=Object(j.b)(),a=Object(o.useContext)(N),{canUserWrite:i}=Object(k.useSelector)((e=>({canUserWrite:Object(x.a)(e)})));if(null===a||e.length<=0)return null;const{workpads:s,setWorkpads:l}=a;return Object(p.jsx)(w,{workpads:s,selectedWorkpadIds:e,canUserWrite:i,onDeleteWorkpads:async()=>{const{removedIds:n}=await t(e);l(s.filter((e=>!n.includes(e.id))))},onExportWorkpads:()=>e.map((e=>n(e)))})};var S=n(58),P=n.n(S);const W=({uniqueKey:e,canUserWrite:t,onImportWorkpad:n=(()=>{})})=>Object(p.jsx)(i.EuiFilePicker,{display:"default",className:"canvasWorkpad__upload--compressed","aria-label":M.getFilePickerPlaceholder(),initialPromptText:M.getFilePickerPlaceholder(),onChange:n,key:e,accept:"application/json",disabled:!t}),M={getFilePickerPlaceholder:()=>b.i18n.translate("xpack.canvas.workpadImport.filePickerPlaceholder",{defaultMessage:"Import workpad {JSON} file",values:{JSON:m.r}})},_=e=>{const t=Object(r.g)(),[n,a]=Object(o.useState)(Date.now()),{canUserWrite:i}=Object(k.useSelector)((e=>({canUserWrite:Object(x.a)(e)})));return Object(p.jsx)(W,P()({},e,{uniqueKey:n,onImportWorkpad:e=>{e&&t(e[0]),a(Date.now())},canUserWrite:i}))},F=({workpads:e,canUserWrite:t,dateFormat:n,onExportWorkpad:r,onCloneWorkpad:a})=>{const[s,l]=Object(o.useState)([]),c=e=>e&&T()(e).format(n),u={onSelectionChange:e=>{l(e.map((e=>e.id)).filter((e=>!!e)))}},d=[{render:e=>Object(p.jsx)(i.EuiFlexGroup,{gutterSize:"xs",alignItems:"center"},Object(p.jsx)(i.EuiFlexItem,{grow:!1},Object(p.jsx)(i.EuiToolTip,{content:A.getExportToolTip()},Object(p.jsx)(i.EuiButtonIcon,{iconType:"exportAction",onClick:()=>r(e.id),"aria-label":A.getExportToolTip()}))),Object(p.jsx)(i.EuiFlexItem,{grow:!1},Object(p.jsx)(i.EuiToolTip,{content:t?A.getCloneToolTip():A.getNoPermissionToCloneToolTip()},Object(p.jsx)(i.EuiButtonIcon,{iconType:"copy",onClick:()=>a(e.id),"aria-label":A.getCloneToolTip(),disabled:!t}))))}],f={toolsLeft:s.length>0?Object(p.jsx)(C,{selectedWorkpadIds:s}):void 0,toolsRight:Object(p.jsx)(_,null),box:{schema:!0,incremental:!0,placeholder:A.getWorkpadSearchPlaceholder(),"data-test-subj":"tableListSearchBox"}},g=[{field:"name",name:A.getTableNameColumnTitle(),sortable:!0,dataType:"string",render:(e,t)=>Object(p.jsx)(D.b,{"data-test-subj":"canvasWorkpadTableWorkpad",to:`/workpad/${t.id}`,"aria-label":A.getLoadWorkpadArialLabel(e.length?e:t.id)},((e,t,n)=>{const o=e.length?Object(p.jsx)("span",null,e):Object(p.jsx)("em",null,t);return t===n?Object(p.jsx)("strong",null,o):o})(e,t.id))},{field:"@created",name:A.getTableCreatedColumnTitle(),sortable:!0,dataType:"date",width:"20%",render:e=>c(e)},{field:"@timestamp",name:A.getTableUpdatedColumnTitle(),sortable:!0,dataType:"date",width:"20%",render:e=>c(e)},{name:A.getTableActionsColumnTitle(),actions:d,width:"100px"}];return Object(p.jsx)(i.EuiInMemoryTable,{itemId:"id",items:e,columns:g,message:A.getNoWorkpadsFoundMessage(),search:f,sorting:{sort:{field:"@timestamp",direction:"desc"}},pagination:!0,selection:u,"data-test-subj":"canvasWorkpadTable"})},A={getCloneToolTip:()=>b.i18n.translate("xpack.canvas.workpadTable.cloneTooltip",{defaultMessage:"Clone workpad"}),getExportToolTip:()=>b.i18n.translate("xpack.canvas.workpadTable.exportTooltip",{defaultMessage:"Export workpad"}),getLoadWorkpadArialLabel:e=>b.i18n.translate("xpack.canvas.workpadTable.loadWorkpadArialLabel",{defaultMessage:"Load workpad '{workpadName}'",values:{workpadName:e}}),getNoPermissionToCloneToolTip:()=>b.i18n.translate("xpack.canvas.workpadTable.noPermissionToCloneToolTip",{defaultMessage:"You don't have permission to clone workpads"}),getNoWorkpadsFoundMessage:()=>b.i18n.translate("xpack.canvas.workpadTable.noWorkpadsFoundMessage",{defaultMessage:"No workpads matched your search."}),getWorkpadSearchPlaceholder:()=>b.i18n.translate("xpack.canvas.workpadTable.searchPlaceholder",{defaultMessage:"Find workpad"}),getTableCreatedColumnTitle:()=>b.i18n.translate("xpack.canvas.workpadTable.table.createdColumnTitle",{defaultMessage:"Created",description:"This column in the table contains the date/time the workpad was created."}),getTableNameColumnTitle:()=>b.i18n.translate("xpack.canvas.workpadTable.table.nameColumnTitle",{defaultMessage:"Workpad name"}),getTableUpdatedColumnTitle:()=>b.i18n.translate("xpack.canvas.workpadTable.table.updatedColumnTitle",{defaultMessage:"Updated",description:"This column in the table contains the date/time the workpad was last updated."}),getTableActionsColumnTitle:()=>b.i18n.translate("xpack.canvas.workpadTable.table.actionsColumnTitle",{defaultMessage:"Actions",description:"This column in the table contains the actions that can be taken on a workpad."})},L=()=>{const e=Object(s.usePlatformService)(),t=Object(r.a)(),n=Object(j.b)(),a=Object(o.useContext)(N),{canUserWrite:i}=Object(k.useSelector)((e=>({canUserWrite:Object(x.a)(e)})));if(!a)return null;const{workpads:l}=a,c=e.getUISetting("dateFormat");return Object(p.jsx)(F,{workpads:l,dateFormat:c,canUserWrite:i,onCloneWorkpad:t,onExportWorkpad:n})},I=({workpads:e})=>0===e.length?Object(p.jsx)(g,null,Object(p.jsx)(i.EuiFlexGroup,{justifyContent:"spaceAround",alignItems:"center",style:{minHeight:600}},Object(p.jsx)(i.EuiFlexItem,{grow:!1},Object(p.jsx)(v,null)))):Object(p.jsx)(g,null,Object(p.jsx)(L,null)),N=Object(o.createContext)(null),z=()=>{const e=Object(r.f)(),[t,n]=Object(o.useState)(!1),[i,s]=Object(o.useState)([]);return Object(o.useEffect)((()=>{(async()=>{const t=await e("");n(!0),s((null==t?void 0:t.workpads)||[])})()}),[n,e]),t?Object(p.jsx)(N.Provider,{value:{workpads:i,setWorkpads:s}},Object(p.jsx)(I,{workpads:i})):Object(p.jsx)(a.a,null)};t.default=z}}]);