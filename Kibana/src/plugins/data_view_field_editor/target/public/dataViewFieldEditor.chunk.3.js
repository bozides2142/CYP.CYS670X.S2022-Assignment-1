(window.dataViewFieldEditor_bundle_jsonpfunction=window.dataViewFieldEditor_bundle_jsonpfunction||[]).push([[3,9],{53:function(e,t,n){"use strict";var r,a=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},o=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i=[];function s(e){for(var t=-1,n=0;n<i.length;n++)if(i[n].identifier===e){t=n;break}return t}function u(e,t){for(var n={},r=[],a=0;a<e.length;a++){var o=e[a],u=t.base?o[0]+t.base:o[0],c=n[u]||0,l="".concat(u," ").concat(c);n[u]=c+1;var d=s(l),f={css:o[1],media:o[2],sourceMap:o[3]};-1!==d?(i[d].references++,i[d].updater(f)):i.push({identifier:l,updater:h(f,t),references:1}),r.push(l)}return r}function c(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var a=n.nc;a&&(r.nonce=a)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var i=o(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var l,d=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function f(e,t,n,r){var a=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=d(t,a);else{var o=document.createTextNode(a),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(o,i[t]):e.appendChild(o)}}function m(e,t,n){var r=n.css,a=n.media,o=n.sourceMap;if(a?e.setAttribute("media",a):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var p=null,b=0;function h(e,t){var n,r,a;if(t.singleton){var o=b++;n=p||(p=c(t)),r=f.bind(null,n,o,!1),a=f.bind(null,n,o,!0)}else n=c(t),r=m.bind(null,n,t),a=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else a()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=a());var n=u(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var a=s(n[r]);i[a].references--}for(var o=u(e,t),c=0;c<n.length;c++){var l=s(n[c]);0===i[l].references&&(i[l].updater(),i.splice(l,1))}n=o}}}},54:function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var a=(i=r,s=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),u="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(u," */")),o=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(o).concat([a]).join("\n")}var i,s,u;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var a={};if(r)for(var o=0;o<this.length;o++){var i=this[o][0];null!=i&&(a[i]=!0)}for(var s=0;s<e.length;s++){var u=[].concat(e[s]);r&&a[u[0]]||(n&&(u[2]?u[2]="".concat(n," and ").concat(u[2]):u[2]=n),t.push(u))}},t}},55:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(56);case"v8light":return n(58)}},56:function(e,t,n){var r=n(53),a=n(57);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};r(a,o);e.exports=a.locals||{}},57:function(e,t,n){(t=n(54)(!1)).push([e.i,".kbnFieldFormatEditor__samples audio{max-width:100%}\n",""]),e.exports=t},58:function(e,t,n){var r=n(53),a=n(59);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};r(a,o);e.exports=a.locals||{}},59:function(e,t,n){(t=n(54)(!1)).push([e.i,".kbnFieldFormatEditor__samples audio{max-width:100%}\n",""]),e.exports=t},60:function(e,t,n){"use strict";n.d(t,"a",(function(){return samples_FormatEditorSamples}));var r=n(4),a=n.n(r),o=(n(55),n(1)),i=n(3),s=n(2),u=n(13),c=n(0);class samples_FormatEditorSamples extends o.PureComponent{render(){const{samples:e,sampleType:t}=this.props,n=[{field:"input",name:s.i18n.translate("indexPatternFieldEditor.samples.inputHeader",{defaultMessage:"Input"}),render:e=>"object"==typeof e?JSON.stringify(e):e},{field:"output",name:s.i18n.translate("indexPatternFieldEditor.samples.outputHeader",{defaultMessage:"Output"}),render:e=>"html"===t?Object(c.jsx)("div",{dangerouslySetInnerHTML:{__html:e}}):Object(c.jsx)("div",null,e)}];return e.length?Object(c.jsx)(i.EuiFormRow,{label:Object(c.jsx)(u.FormattedMessage,{id:"indexPatternFieldEditor.samplesHeader",defaultMessage:"Samples"})},Object(c.jsx)(i.EuiBasicTable,{className:"kbnFieldFormatEditor__samples",compressed:!0,items:e,columns:n})):null}}a()(samples_FormatEditorSamples,"defaultProps",{sampleType:"text"})},62:function(e,t,n){"use strict";n.r(t),n.d(t,"NumberFormatEditor",(function(){return NumberFormatEditor}));var r=n(4),a=n.n(r),o=n(1),i=n(3),s=n(13),u=n(7),c=n(60),l=n(18),d=n(8),f=n(0);class NumberFormatEditor extends u.DefaultFormatEditor{constructor(...e){super(...e),a()(this,"state",{...u.defaultState,sampleInputs:[1e4,12.345678,-1,-999,.52]})}render(){var e;const{format:t,formatParams:n}=this.props,{error:r,samples:a}=this.state,u=t.getParamDefaults().pattern;return Object(f.jsx)(o.Fragment,null,Object(f.jsx)(i.EuiFormRow,{label:Object(f.jsx)(s.FormattedMessage,{id:"indexPatternFieldEditor.number.numeralLabel",defaultMessage:"Numeral.js format pattern (Default: {defaultPattern})",values:{defaultPattern:Object(f.jsx)(i.EuiCode,null,u)}}),helpText:Object(f.jsx)("span",null,Object(f.jsx)(i.EuiLink,{target:"_blank",href:null===(e=this.context.services.docLinks)||void 0===e?void 0:e.links.indexPatterns.fieldFormattersNumber},Object(f.jsx)(s.FormattedMessage,{id:"indexPatternFieldEditor.number.documentationLabel",defaultMessage:"Documentation"})," ",Object(f.jsx)(i.EuiIcon,{type:"link"}))),isInvalid:!!r,error:r},Object(f.jsx)(i.EuiFieldText,{"data-test-subj":"numberEditorFormatPattern",value:n.pattern,placeholder:u,onChange:e=>{this.onChange({pattern:e.target.value})},isInvalid:!!r})),Object(f.jsx)(c.a,{samples:a}))}}a()(NumberFormatEditor,"contextType",d.context),a()(NumberFormatEditor,"formatId",l.a)},88:function(e,t,n){"use strict";n.r(t),n.d(t,"PercentFormatEditor",(function(){return PercentFormatEditor}));var r=n(4),a=n.n(r),o=n(62),i=n(14),s=n(33);class PercentFormatEditor extends o.NumberFormatEditor{constructor(...e){super(...e),a()(this,"state",{...i.a,sampleInputs:[.1,.99999,1,100,1e3]})}}a()(PercentFormatEditor,"formatId",s.a)}}]);