/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.reporting_bundle_jsonpfunction=window.reporting_bundle_jsonpfunction||[]).push([[0],{47:function(t,e,s){"use strict";var r=s(48),n=s(51);function o(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}e.parse=v,e.resolve=function(t,e){return v(t,!1,!0).resolve(e)},e.resolveObject=function(t,e){return t?v(t,!1,!0).resolveObject(e):e},e.format=function(t){n.isString(t)&&(t=v(t));return t instanceof o?t.format():o.prototype.format.call(t)},e.Url=o;var a=/^([a-z0-9.+-]+:)/i,i=/:[0-9]*$/,h=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,p=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),c=["'"].concat(p),l=["%","/","?",";","#"].concat(c),u=["/","?","#"],f=/^[+a-z0-9A-Z_-]{0,63}$/,d=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,g={javascript:!0,"javascript:":!0},m={javascript:!0,"javascript:":!0},b={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},j=s(52);function v(t,e,s){if(t&&n.isObject(t)&&t instanceof o)return t;var r=new o;return r.parse(t,e,s),r}o.prototype.parse=function(t,e,s){if(!n.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var o=t.indexOf("?"),i=-1!==o&&o<t.indexOf("#")?"?":"#",p=t.split(i);p[0]=p[0].replace(/\\/g,"/");var v=t=p.join(i);if(v=v.trim(),!s&&1===t.split("#").length){var y=h.exec(v);if(y)return this.path=v,this.href=v,this.pathname=y[1],y[2]?(this.search=y[2],this.query=e?j.parse(this.search.substr(1)):this.search.substr(1)):e&&(this.search="",this.query={}),this}var x=a.exec(v);if(x){var O=(x=x[0]).toLowerCase();this.protocol=O,v=v.substr(x.length)}if(s||x||v.match(/^\/\/[^@\/]+@[^@\/]+/)){var C="//"===v.substr(0,2);!C||x&&m[x]||(v=v.substr(2),this.slashes=!0)}if(!m[x]&&(C||x&&!b[x])){for(var R,T,w=-1,U=0;U<u.length;U++){-1!==(S=v.indexOf(u[U]))&&(-1===w||S<w)&&(w=S)}-1!==(T=-1===w?v.lastIndexOf("@"):v.lastIndexOf("@",w))&&(R=v.slice(0,T),v=v.slice(T+1),this.auth=decodeURIComponent(R)),w=-1;for(U=0;U<l.length;U++){var S;-1!==(S=v.indexOf(l[U]))&&(-1===w||S<w)&&(w=S)}-1===w&&(w=v.length),this.host=v.slice(0,w),v=v.slice(w),this.parseHost(),this.hostname=this.hostname||"";var M="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!M)for(var A=this.hostname.split(/\./),k=(U=0,A.length);U<k;U++){var E=A[U];if(E&&!E.match(f)){for(var I="",L=0,F=E.length;L<F;L++)E.charCodeAt(L)>127?I+="x":I+=E[L];if(!I.match(f)){var P=A.slice(0,U),q=A.slice(U+1),z=E.match(d);z&&(P.push(z[1]),q.unshift(z[2])),q.length&&(v="/"+q.join(".")+v),this.hostname=P.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),M||(this.hostname=r.toASCII(this.hostname));var _=this.port?":"+this.port:"",N=this.hostname||"";this.host=N+_,this.href+=this.host,M&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==v[0]&&(v="/"+v))}if(!g[O])for(U=0,k=c.length;U<k;U++){var D=c[U];if(-1!==v.indexOf(D)){var G=encodeURIComponent(D);G===D&&(G=escape(D)),v=v.split(D).join(G)}}var B=v.indexOf("#");-1!==B&&(this.hash=v.substr(B),v=v.slice(0,B));var J=v.indexOf("?");if(-1!==J?(this.search=v.substr(J),this.query=v.substr(J+1),e&&(this.query=j.parse(this.query)),v=v.slice(0,J)):e&&(this.search="",this.query={}),v&&(this.pathname=v),b[O]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){_=this.pathname||"";var $=this.search||"";this.path=_+$}return this.href=this.format(),this},o.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var e=this.protocol||"",s=this.pathname||"",r=this.hash||"",o=!1,a="";this.host?o=t+this.host:this.hostname&&(o=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(o+=":"+this.port)),this.query&&n.isObject(this.query)&&Object.keys(this.query).length&&(a=j.stringify(this.query));var i=this.search||a&&"?"+a||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||b[e])&&!1!==o?(o="//"+(o||""),s&&"/"!==s.charAt(0)&&(s="/"+s)):o||(o=""),r&&"#"!==r.charAt(0)&&(r="#"+r),i&&"?"!==i.charAt(0)&&(i="?"+i),e+o+(s=s.replace(/[?#]/g,(function(t){return encodeURIComponent(t)})))+(i=i.replace("#","%23"))+r},o.prototype.resolve=function(t){return this.resolveObject(v(t,!1,!0)).format()},o.prototype.resolveObject=function(t){if(n.isString(t)){var e=new o;e.parse(t,!1,!0),t=e}for(var s=new o,r=Object.keys(this),a=0;a<r.length;a++){var i=r[a];s[i]=this[i]}if(s.hash=t.hash,""===t.href)return s.href=s.format(),s;if(t.slashes&&!t.protocol){for(var h=Object.keys(t),p=0;p<h.length;p++){var c=h[p];"protocol"!==c&&(s[c]=t[c])}return b[s.protocol]&&s.hostname&&!s.pathname&&(s.path=s.pathname="/"),s.href=s.format(),s}if(t.protocol&&t.protocol!==s.protocol){if(!b[t.protocol]){for(var l=Object.keys(t),u=0;u<l.length;u++){var f=l[u];s[f]=t[f]}return s.href=s.format(),s}if(s.protocol=t.protocol,t.host||m[t.protocol])s.pathname=t.pathname;else{for(var d=(t.pathname||"").split("/");d.length&&!(t.host=d.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==d[0]&&d.unshift(""),d.length<2&&d.unshift(""),s.pathname=d.join("/")}if(s.search=t.search,s.query=t.query,s.host=t.host||"",s.auth=t.auth,s.hostname=t.hostname||t.host,s.port=t.port,s.pathname||s.search){var g=s.pathname||"",j=s.search||"";s.path=g+j}return s.slashes=s.slashes||t.slashes,s.href=s.format(),s}var v=s.pathname&&"/"===s.pathname.charAt(0),y=t.host||t.pathname&&"/"===t.pathname.charAt(0),x=y||v||s.host&&t.pathname,O=x,C=s.pathname&&s.pathname.split("/")||[],R=(d=t.pathname&&t.pathname.split("/")||[],s.protocol&&!b[s.protocol]);if(R&&(s.hostname="",s.port=null,s.host&&(""===C[0]?C[0]=s.host:C.unshift(s.host)),s.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===d[0]?d[0]=t.host:d.unshift(t.host)),t.host=null),x=x&&(""===d[0]||""===C[0])),y)s.host=t.host||""===t.host?t.host:s.host,s.hostname=t.hostname||""===t.hostname?t.hostname:s.hostname,s.search=t.search,s.query=t.query,C=d;else if(d.length)C||(C=[]),C.pop(),C=C.concat(d),s.search=t.search,s.query=t.query;else if(!n.isNullOrUndefined(t.search)){if(R)s.hostname=s.host=C.shift(),(M=!!(s.host&&s.host.indexOf("@")>0)&&s.host.split("@"))&&(s.auth=M.shift(),s.host=s.hostname=M.shift());return s.search=t.search,s.query=t.query,n.isNull(s.pathname)&&n.isNull(s.search)||(s.path=(s.pathname?s.pathname:"")+(s.search?s.search:"")),s.href=s.format(),s}if(!C.length)return s.pathname=null,s.search?s.path="/"+s.search:s.path=null,s.href=s.format(),s;for(var T=C.slice(-1)[0],w=(s.host||t.host||C.length>1)&&("."===T||".."===T)||""===T,U=0,S=C.length;S>=0;S--)"."===(T=C[S])?C.splice(S,1):".."===T?(C.splice(S,1),U++):U&&(C.splice(S,1),U--);if(!x&&!O)for(;U--;U)C.unshift("..");!x||""===C[0]||C[0]&&"/"===C[0].charAt(0)||C.unshift(""),w&&"/"!==C.join("/").substr(-1)&&C.push("");var M,A=""===C[0]||C[0]&&"/"===C[0].charAt(0);R&&(s.hostname=s.host=A?"":C.length?C.shift():"",(M=!!(s.host&&s.host.indexOf("@")>0)&&s.host.split("@"))&&(s.auth=M.shift(),s.host=s.hostname=M.shift()));return(x=x||s.host&&C.length)&&!A&&C.unshift(""),C.length?s.pathname=C.join("/"):(s.pathname=null,s.path=null),n.isNull(s.pathname)&&n.isNull(s.search)||(s.path=(s.pathname?s.pathname:"")+(s.search?s.search:"")),s.auth=t.auth||s.auth,s.slashes=s.slashes||t.slashes,s.href=s.format(),s},o.prototype.parseHost=function(){var t=this.host,e=i.exec(t);e&&(":"!==(e=e[0])&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},48:function(t,e,s){(function(t,r){var n;/*! https://mths.be/punycode v1.4.1 by @mathias */!function(o){e&&e.nodeType,t&&t.nodeType;var a="object"==typeof r&&r;a.global!==a&&a.window!==a&&a.self;var i,h=2147483647,p=36,c=/^xn--/,l=/[^\x20-\x7E]/,u=/[\x2E\u3002\uFF0E\uFF61]/g,f={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},d=Math.floor,g=String.fromCharCode;function m(t){throw new RangeError(f[t])}function b(t,e){for(var s=t.length,r=[];s--;)r[s]=e(t[s]);return r}function j(t,e){var s=t.split("@"),r="";return s.length>1&&(r=s[0]+"@",t=s[1]),r+b((t=t.replace(u,".")).split("."),e).join(".")}function v(t){for(var e,s,r=[],n=0,o=t.length;n<o;)(e=t.charCodeAt(n++))>=55296&&e<=56319&&n<o?56320==(64512&(s=t.charCodeAt(n++)))?r.push(((1023&e)<<10)+(1023&s)+65536):(r.push(e),n--):r.push(e);return r}function y(t){return b(t,(function(t){var e="";return t>65535&&(e+=g((t-=65536)>>>10&1023|55296),t=56320|1023&t),e+=g(t)})).join("")}function x(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function O(t,e,s){var r=0;for(t=s?d(t/700):t>>1,t+=d(t/e);t>455;r+=p)t=d(t/35);return d(r+36*t/(t+38))}function C(t){var e,s,r,n,o,a,i,c,l,u,f,g=[],b=t.length,j=0,v=128,x=72;for((s=t.lastIndexOf("-"))<0&&(s=0),r=0;r<s;++r)t.charCodeAt(r)>=128&&m("not-basic"),g.push(t.charCodeAt(r));for(n=s>0?s+1:0;n<b;){for(o=j,a=1,i=p;n>=b&&m("invalid-input"),((c=(f=t.charCodeAt(n++))-48<10?f-22:f-65<26?f-65:f-97<26?f-97:p)>=p||c>d((h-j)/a))&&m("overflow"),j+=c*a,!(c<(l=i<=x?1:i>=x+26?26:i-x));i+=p)a>d(h/(u=p-l))&&m("overflow"),a*=u;x=O(j-o,e=g.length+1,0==o),d(j/e)>h-v&&m("overflow"),v+=d(j/e),j%=e,g.splice(j++,0,v)}return y(g)}function R(t){var e,s,r,n,o,a,i,c,l,u,f,b,j,y,C,R=[];for(b=(t=v(t)).length,e=128,s=0,o=72,a=0;a<b;++a)(f=t[a])<128&&R.push(g(f));for(r=n=R.length,n&&R.push("-");r<b;){for(i=h,a=0;a<b;++a)(f=t[a])>=e&&f<i&&(i=f);for(i-e>d((h-s)/(j=r+1))&&m("overflow"),s+=(i-e)*j,e=i,a=0;a<b;++a)if((f=t[a])<e&&++s>h&&m("overflow"),f==e){for(c=s,l=p;!(c<(u=l<=o?1:l>=o+26?26:l-o));l+=p)C=c-u,y=p-u,R.push(g(x(u+C%y,0))),c=d(C/y);R.push(g(x(c,0))),o=O(s,j,r==n),s=0,++r}++s,++e}return R.join("")}i={version:"1.4.1",ucs2:{decode:v,encode:y},decode:C,encode:R,toASCII:function(t){return j(t,(function(t){return l.test(t)?"xn--"+R(t):t}))},toUnicode:function(t){return j(t,(function(t){return c.test(t)?C(t.slice(4).toLowerCase()):t}))}},void 0===(n=function(){return i}.call(e,s,e,t))||(t.exports=n)}()}).call(this,s(49)(t),s(50))},49:function(t,e,s){t.exports=s(19)(434)},50:function(t,e,s){t.exports=s(19)(158)},51:function(t,e,s){"use strict";t.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},52:function(t,e,s){"use strict";e.decode=e.parse=s(53),e.encode=e.stringify=s(54)},53:function(t,e,s){"use strict";function r(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,s,o){e=e||"&",s=s||"=";var a={};if("string"!=typeof t||0===t.length)return a;var i=/\+/g;t=t.split(e);var h=1e3;o&&"number"==typeof o.maxKeys&&(h=o.maxKeys);var p=t.length;h>0&&p>h&&(p=h);for(var c=0;c<p;++c){var l,u,f,d,g=t[c].replace(i,"%20"),m=g.indexOf(s);m>=0?(l=g.substr(0,m),u=g.substr(m+1)):(l=g,u=""),f=decodeURIComponent(l),d=decodeURIComponent(u),r(a,f)?n(a[f])?a[f].push(d):a[f]=[a[f],d]:a[f]=d}return a};var n=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},54:function(t,e,s){"use strict";var r=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,s,i){return e=e||"&",s=s||"=",null===t&&(t=void 0),"object"==typeof t?o(a(t),(function(a){var i=encodeURIComponent(r(a))+s;return n(t[a])?o(t[a],(function(t){return i+encodeURIComponent(r(t))})).join(e):i+encodeURIComponent(r(t[a]))})).join(e):i?encodeURIComponent(r(i))+s+encodeURIComponent(r(t)):""};var n=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function o(t,e){if(t.map)return t.map(e);for(var s=[],r=0;r<t.length;r++)s.push(e(t[r],r));return s}var a=Object.keys||function(t){var e=[];for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.push(s);return e}},55:function(t,e,s){"use strict";s.r(e),s.d(e,"ReportingPanelContent",(function(){return j}));var r=s(1),n=s.n(r),o=s(5),a=s(3),i=s(6),h=s(4),p=s(47),c=s.n(p),l=s(7),u=s(2),f=s(0);const d={title:a.i18n.translate("xpack.reporting.panelContent.unsavedStateErrorTitle",{defaultMessage:"Unsaved work"})},g=()=>Object(f.jsx)(o.EuiCallOut,{size:"s",title:d.title,iconType:"alert",color:"danger"},Object(f.jsx)(o.EuiText,{size:"s"},Object(f.jsx)("p",null,Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.unsavedStateErrorText",defaultMessage:"Save your work before copying this URL."}))),Object(f.jsx)(o.EuiSpacer,{size:"s"})),m={title:a.i18n.translate("xpack.reporting.panelContent.unsavedStateAndExceedsMaxLengthTitle",{defaultMessage:"URL too long"})},b=({isUnsaved:t})=>Object(f.jsx)(o.EuiCallOut,{title:m.title,size:"s",iconType:"alert",color:"danger"},Object(f.jsx)(o.EuiText,{size:"s"},Object(f.jsx)("p",null,t?Object(f.jsx)("span",{"data-test-subj":"urlTooLongTrySavingMessage"},Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.unsavedStateAndExceedsMaxLengthTrySaveDescription",defaultMessage:"This URL cannot be copied. Try saving your work."})):Object(f.jsx)("span",{"data-test-subj":"urlTooLongErrorMessage"},Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.unsavedStateAndExceedsMaxLengthDescription",defaultMessage:"This URL cannot be copied."})))));class reporting_panel_content_ReportingPanelContentUi extends h.Component{constructor(t){super(t),n()(this,"mounted",void 0),n()(this,"getAbsoluteReportGenerationUrl",(t=>{const e=this.props.apiClient.getReportingJobPath(t.reportType,this.props.apiClient.getDecoratedJobParams(this.props.getJobParams(!0)));return c.a.resolve(window.location.href,e)})),n()(this,"isNotSaved",(()=>void 0===this.props.objectId||""===this.props.objectId)),n()(this,"renderGenerateReportButton",(t=>Object(f.jsx)(o.EuiButton,{disabled:t,fullWidth:!0,fill:!0,onClick:this.createReportingJob,"data-test-subj":"generateReportButton",size:"s"},Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.generateButtonLabel",defaultMessage:"Generate {reportingType}",values:{reportingType:this.prettyPrintReportingType()}})))),n()(this,"prettyPrintReportingType",(()=>{switch(this.props.reportType){case u.p:case u.q:return"PDF";case"csv_searchsource":return u.j;case"png":case u.u:return u.t;default:return this.props.reportType}})),n()(this,"markAsStale",(()=>{this.mounted&&this.setState({isStale:!0})})),n()(this,"setAbsoluteReportGenerationUrl",(()=>{if(!this.mounted)return;const t=this.getAbsoluteReportGenerationUrl(this.props);this.setState({absoluteUrl:t})})),n()(this,"createReportingJob",(()=>{const{intl:t}=this.props,e=this.props.apiClient.getDecoratedJobParams(this.props.getJobParams());return this.props.apiClient.createReportingJob(this.props.reportType,e).then((()=>{this.props.toasts.addSuccess({title:t.formatMessage({id:"xpack.reporting.panelContent.successfullyQueuedReportNotificationTitle",defaultMessage:"Queued report for {objectType}"},{objectType:this.state.objectType}),text:Object(l.toMountPoint)(Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.successfullyQueuedReportNotificationDescription",defaultMessage:"Track its progress in {path}",values:{path:Object(f.jsx)("a",{href:this.props.apiClient.getManagementLink()},Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.publicNotifier.reportLink.reportingSectionUrlLinkLabel",defaultMessage:"Stack Management > Alerts and Insights > Reporting"}))}}),{theme$:this.props.theme.theme$}),"data-test-subj":"queueReportSuccess"}),this.props.onClose&&this.props.onClose()})).catch((e=>{this.props.toasts.addError(e,{title:t.formatMessage({id:"xpack.reporting.panelContent.notification.reportingErrorTitle",defaultMessage:"Failed to create report"}),toastMessage:e.body.message})}))}));const{objectType:e}=t.getJobParams();this.state={isStale:!1,absoluteUrl:this.getAbsoluteReportGenerationUrl(t),layoutId:"",objectType:e}}componentDidUpdate(t,e){this.props.layoutId&&this.props.layoutId!==e.layoutId&&this.setState({...e,absoluteUrl:this.getAbsoluteReportGenerationUrl(this.props),layoutId:this.props.layoutId})}componentWillUnmount(){window.removeEventListener("hashchange",this.markAsStale),window.removeEventListener("resize",this.setAbsoluteReportGenerationUrl),this.mounted=!1}componentDidMount(){this.mounted=!0,window.addEventListener("hashchange",this.markAsStale,!1),window.addEventListener("resize",this.setAbsoluteReportGenerationUrl)}renderCopyURLButton({isUnsaved:t,exceedsMaxLength:e}){return t?e?Object(f.jsx)(b,{isUnsaved:!0}):Object(f.jsx)(g,null):e?Object(f.jsx)(b,{isUnsaved:!1}):Object(f.jsx)(o.EuiCopy,{textToCopy:this.state.absoluteUrl,anchorClassName:"eui-displayBlock"},(e=>Object(f.jsx)(o.EuiButton,{color:t?"warning":"primary",fullWidth:!0,onClick:e,size:"s"},Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.copyUrlButtonLabel",defaultMessage:"Copy POST URL"}))))}render(){const t=this.isNotSaved()||this.props.isDirty||this.state.isStale;if(this.props.requiresSavedState&&t)return Object(f.jsx)(o.EuiForm,{className:"kbnShareContextMenu__finalPanel","data-test-subj":"shareReportingForm"},Object(f.jsx)(o.EuiFormRow,{helpText:Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.saveWorkDescription",defaultMessage:"Please save your work before generating a report."})},this.renderGenerateReportButton(!0)));const e=this.state.absoluteUrl.length>=25e3;return Object(f.jsx)(o.EuiForm,{className:"kbnShareContextMenu__finalPanel","data-test-subj":"shareReportingForm"},Object(f.jsx)(o.EuiText,{size:"s"},Object(f.jsx)("p",null,Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.generationTimeDescription",defaultMessage:"{reportingType}s can take a minute or two to generate based upon the size of your {objectType}.",description:"Here 'reportingType' can be 'PDF' or 'CSV'",values:{reportingType:this.prettyPrintReportingType(),objectType:this.state.objectType}}))),Object(f.jsx)(o.EuiSpacer,{size:"s"}),this.props.options,this.renderGenerateReportButton(!1),Object(f.jsx)(o.EuiHorizontalRule,{margin:"s",style:{width:"auto",marginLeft:"-16px",marginRight:"-16px"}}),Object(f.jsx)(o.EuiAccordion,{id:"advanced-options",buttonContent:a.i18n.translate("xpack.reporting.panelContent.advancedOptions",{defaultMessage:"Advanced options"}),paddingSize:"none"},Object(f.jsx)(o.EuiSpacer,{size:"s"}),Object(f.jsx)(o.EuiText,{size:"s"},Object(f.jsx)("p",null,Object(f.jsx)(i.FormattedMessage,{id:"xpack.reporting.panelContent.howToCallGenerationDescription",defaultMessage:"Alternatively, copy this POST URL to call generation from outside Kibana or from Watcher."}))),Object(f.jsx)(o.EuiSpacer,{size:"s"}),this.renderCopyURLButton({isUnsaved:t,exceedsMaxLength:e})))}}const j=Object(i.injectI18n)(reporting_panel_content_ReportingPanelContentUi)}}]);