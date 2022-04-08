(window.presentationUtil_bundle_jsonpfunction=window.presentationUtil_bundle_jsonpfunction||[]).push([[2,11],{121:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Fn",{enumerable:!0,get:function(){return o.Fn}}),Object.defineProperty(t,"Registry",{enumerable:!0,get:function(){return c.Registry}}),Object.defineProperty(t,"addRegistries",{enumerable:!0,get:function(){return l.addRegistries}}),Object.defineProperty(t,"castProvider",{enumerable:!0,get:function(){return s.castProvider}}),Object.defineProperty(t,"fromExpression",{enumerable:!0,get:function(){return r.fromExpression}}),Object.defineProperty(t,"getByAlias",{enumerable:!0,get:function(){return a.getByAlias}}),Object.defineProperty(t,"getType",{enumerable:!0,get:function(){return i.getType}}),Object.defineProperty(t,"isAst",{enumerable:!0,get:function(){return r.isAst}}),Object.defineProperty(t,"isAstWithMeta",{enumerable:!0,get:function(){return r.isAstWithMeta}}),Object.defineProperty(t,"parse",{enumerable:!0,get:function(){return u.parse}}),Object.defineProperty(t,"register",{enumerable:!0,get:function(){return l.register}}),Object.defineProperty(t,"registryFactory",{enumerable:!0,get:function(){return l.registryFactory}}),Object.defineProperty(t,"safeElementFromExpression",{enumerable:!0,get:function(){return r.safeElementFromExpression}}),Object.defineProperty(t,"toExpression",{enumerable:!0,get:function(){return r.toExpression}});var r=n(122),o=n(127),i=n(68),s=n(129),u=n(67),a=n(130),c=n(131),l=n(132)},122:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(58);Object.keys(r).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in t&&t[e]===r[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}}))}));var o=n(85);Object.keys(o).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in t&&t[e]===o[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}}))}));var i=n(124);Object.keys(i).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}}))}));var s=n(86);Object.keys(s).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in t&&t[e]===s[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}}))}))},123:function(e,t,n){"use strict";function r(e,t,n,o){var i=Error.call(this,e);return Object.setPrototypeOf&&Object.setPrototypeOf(i,r.prototype),i.expected=t,i.found=n,i.location=o,i.name="SyntaxError",i}function o(e,t,n){return n=n||" ",e.length>t?e:(t-=e.length,e+(n+=n.repeat(t)).slice(0,t))}!function(e,t){function n(){this.constructor=e}n.prototype=t.prototype,e.prototype=new n}(r,Error),r.prototype.format=function(e){var t="Error: "+this.message;if(this.location){var n,r=null;for(n=0;n<e.length;n++)if(e[n].source===this.location.source){r=e[n].text.split(/\r\n|\n|\r/g);break}var i=this.location.start,s=this.location.source+":"+i.line+":"+i.column;if(r){var u=this.location.end,a=o("",i.line.toString().length),c=r[i.line-1],l=i.line===u.line?u.column:c.length+1;t+="\n --\x3e "+s+"\n"+a+" |\n"+i.line+" | "+c+"\n"+a+" | "+o("",i.column-1)+o("",l-i.column,"^")}else t+="\n at "+s}return t},r.buildMessage=function(e,t){var n={literal:function(e){return'"'+o(e.text)+'"'},class:function(e){var t=e.parts.map((function(e){return Array.isArray(e)?i(e[0])+"-"+i(e[1]):i(e)}));return"["+(e.inverted?"^":"")+t+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(e){return e.description}};function r(e){return e.charCodeAt(0).toString(16).toUpperCase()}function o(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(e){return"\\x0"+r(e)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(e){return"\\x"+r(e)}))}function i(e){return e.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(e){return"\\x0"+r(e)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(e){return"\\x"+r(e)}))}function s(e){return n[e.type](e)}return"Expected "+function(e){var t,n,r=e.map(s);if(r.sort(),r.length>0){for(t=1,n=1;t<r.length;t++)r[t-1]!==r[t]&&(r[n]=r[t],n++);r.length=n}switch(r.length){case 1:return r[0];case 2:return r[0]+" or "+r[1];default:return r.slice(0,-1).join(", ")+", or "+r[r.length-1]}}(e)+" but "+function(e){return e?'"'+o(e)+'"':"end of input"}(t)+" found."},e.exports={SyntaxError:r,parse:function(e,t){var n,o={},i=(t=void 0!==t?t:{}).grammarSource,s={expression:ie,argument:ae},u=ie,a='"',c="'",l="//",f="/*",d="*/",p="\\",g=/^[a-zA-Z0-9_\-]/,h=/^[ \t\r\n]/,m=/^[^\n]/,y=/^["'(){}<>[\]$`|= \t\n\r]/,b=/^[^"'(){}<>[\]$`|= \t\n\r]/,v=/^[^"]/,_=/^[^']/,O=Q("|",!1),x=ee("function"),j=Q("=",!1),A=Q("$",!1),E=Q("{",!1),w=Q("}",!1),M=Y([["a","z"],["A","Z"],["0","9"],"_","-"],!1,!1),C=ee("literal"),D=Q('"',!1),T=Q("'",!1),P=Y([" ","\t","\r","\n"],!1,!1),$=Q("//",!1),N=Y(["\n"],!0,!1),L=Q("/*",!1),R=Q("*/",!1),B={type:"any"},k=Q("\\",!1),S=Y(['"',"'","(",")","{","}","<",">","[","]","$","`","|","="," ","\t","\n","\r"],!1,!1),F=Y(['"',"'","(",")","{","}","<",">","[","]","$","`","|","="," ","\t","\n","\r"],!0,!1),I=Y(['"'],!0,!1),K=Y(["'"],!0,!1),U=function(e,t){return t},V=function(e){return e.join("")},W=0,q=0,z=[{line:1,column:1}],G=0,Z=[],H=0;if("startRule"in t){if(!(t.startRule in s))throw new Error("Can't start parsing from rule \""+t.startRule+'".');u=s[t.startRule]}function J(){return e.substring(q,W)}function X(){return ne(q,W)}function Q(e,t){return{type:"literal",text:e,ignoreCase:t}}function Y(e,t,n){return{type:"class",parts:e,inverted:t,ignoreCase:n}}function ee(e){return{type:"other",description:e}}function te(t){var n,r=z[t];if(r)return r;for(n=t-1;!z[n];)n--;for(r={line:(r=z[n]).line,column:r.column};n<t;)10===e.charCodeAt(n)?(r.line++,r.column=1):r.column++,n++;return z[t]=r,r}function ne(e,t){var n=te(e),r=te(t);return{source:i,start:{offset:e,line:n.line,column:n.column},end:{offset:t,line:r.line,column:r.column}}}function re(e){W<G||(W>G&&(G=W,Z=[]),Z.push(e))}function oe(e,t,n){return new r(r.buildMessage(e,t),e,t,n)}function ie(){var t,n,r,i,s,u,a,c;for(t=W,le()===o&&null,(n=se())===o&&(n=null),r=[],i=W,124===e.charCodeAt(W)?(s="|",W++):(s=o,0===H&&re(O)),s!==o?(le()===o&&null,(u=se())!==o?(q=i,i=U(0,u)):(W=i,i=o)):(W=i,i=o);i!==o;)r.push(i),i=W,124===e.charCodeAt(W)?(s="|",W++):(s=o,0===H&&re(O)),s!==o?(le()===o&&null,(u=se())!==o?(q=i,i=U(0,u)):(W=i,i=o)):(W=i,i=o);return q=t,c=r,t=me({type:"expression",chain:(a=n)?[a].concat(c):[]},J(),X())}function se(){var e,t,n;return H++,e=W,(t=ce())!==o?(n=function(){var e,t,n,r;e=W,t=[],n=W,le()!==o&&(r=ue())!==o?(q=n,n=r):(W=n,n=o);for(;n!==o;)t.push(n),n=W,le()!==o&&(r=ue())!==o?(q=n,n=r):(W=n,n=o);(n=le())===o&&(n=null);return q=e,e=function(e){return e.reduce(((e,{name:t,value:n})=>({...e,[t]:(e[t]||[]).concat(n)})),{})}(t)}(),q=e,e=me({type:"function",function:t,arguments:n},J(),X())):(W=e,e=o),H--,e===o&&(t=o,0===H&&re(x)),e}function ue(){var t,n,r,i;return t=W,(n=ce())!==o?(le()===o&&null,61===e.charCodeAt(W)?(r="=",W++):(r=o,0===H&&re(j)),r!==o?(le()===o&&null,(i=ae())!==o?(q=t,t={name:n,value:i}):(W=t,t=o)):(W=t,t=o)):(W=t,t=o),t===o&&(t=W,(n=ae())!==o&&(q=t,n=function(e){return{name:"_",value:e}}(n)),t=n),t}function ae(){var t,n,r,i,s;return t=W,36===e.charCodeAt(W)?(n="$",W++):(n=o,0===H&&re(A)),n===o&&(n=null),123===e.charCodeAt(W)?(r="{",W++):(r=o,0===H&&re(E)),r!==o&&(i=ie())!==o?(125===e.charCodeAt(W)?(s="}",W++):(s=o,0===H&&re(w)),s!==o?(q=t,t=i):(W=t,t=o)):(W=t,t=o),t===o&&(t=W,(n=function(){var t;H++,(t=function(){var t,n,r,i;t=W,34===e.charCodeAt(W)?(n=a,W++):(n=o,0===H&&re(D));if(n!==o){for(r=[],i=ge();i!==o;)r.push(i),i=ge();34===e.charCodeAt(W)?(i=a,W++):(i=o,0===H&&re(D)),i!==o?(q=t,t=V(r)):(W=t,t=o)}else W=t,t=o;if(t===o)if(t=W,39===e.charCodeAt(W)?(n=c,W++):(n=o,0===H&&re(T)),n!==o){for(r=[],i=he();i!==o;)r.push(i),i=he();39===e.charCodeAt(W)?(i=c,W++):(i=o,0===H&&re(T)),i!==o?(q=t,t=V(r)):(W=t,t=o)}else W=t,t=o;return t}())===o&&(t=function(){var e,t,n,r;e=W,t=W,H++,n=de(),H--,n===o?t=void 0:(W=t,t=o);if(t!==o){if(n=[],(r=pe())!==o)for(;r!==o;)n.push(r),r=pe();else n=o;n!==o?(q=e,e="null"===(i=n.join(""))?null:"true"===i||"false"!==i&&(isNaN(Number(i))?i:Number(i))):(W=e,e=o)}else W=e,e=o;var i;return e}());H--,t===o&&(o,0===H&&re(C));return t}())!==o&&(q=t,n=me(n,J(),X())),t=n),t}function ce(){var t,n,r;if(t=W,n=[],g.test(e.charAt(W))?(r=e.charAt(W),W++):(r=o,0===H&&re(M)),r!==o)for(;r!==o;)n.push(r),g.test(e.charAt(W))?(r=e.charAt(W),W++):(r=o,0===H&&re(M));else n=o;return n!==o&&(q=t,n=n.join("")),t=n}function le(){var e,t;if(e=[],(t=fe())===o&&(t=de()),t!==o)for(;t!==o;)e.push(t),(t=fe())===o&&(t=de());else e=o;return e}function fe(){var t;return h.test(e.charAt(W))?(t=e.charAt(W),W++):(t=o,0===H&&re(P)),t}function de(){var t;return(t=function(){var t,n,r,i;t=W,e.substr(W,2)===l?(n=l,W+=2):(n=o,0===H&&re($));if(n!==o){for(r=[],m.test(e.charAt(W))?(i=e.charAt(W),W++):(i=o,0===H&&re(N));i!==o;)r.push(i),m.test(e.charAt(W))?(i=e.charAt(W),W++):(i=o,0===H&&re(N));t=n=[n,r]}else W=t,t=o;return t}())===o&&(t=function(){var t,n,r,i,s,u;t=W,e.substr(W,2)===f?(n=f,W+=2):(n=o,0===H&&re(L));if(n!==o){for(r=[],i=W,s=W,H++,e.substr(W,2)===d?(u=d,W+=2):(u=o,0===H&&re(R)),H--,u===o?s=void 0:(W=s,s=o),s!==o?(e.length>W?(u=e.charAt(W),W++):(u=o,0===H&&re(B)),u!==o?i=s=[s,u]:(W=i,i=o)):(W=i,i=o);i!==o;)r.push(i),i=W,s=W,H++,e.substr(W,2)===d?(u=d,W+=2):(u=o,0===H&&re(R)),H--,u===o?s=void 0:(W=s,s=o),s!==o?(e.length>W?(u=e.charAt(W),W++):(u=o,0===H&&re(B)),u!==o?i=s=[s,u]:(W=i,i=o)):(W=i,i=o);e.substr(W,2)===d?(i=d,W+=2):(i=o,0===H&&re(R)),i===o&&(i=null),t=n=[n,r,i]}else W=t,t=o;return t}()),t}function pe(){var t,n,r;return t=W,92===e.charCodeAt(W)?(n=p,W++):(n=o,0===H&&re(k)),n!==o?(y.test(e.charAt(W))?(r=e.charAt(W),W++):(r=o,0===H&&re(S)),r===o&&(92===e.charCodeAt(W)?(r=p,W++):(r=o,0===H&&re(k))),r!==o?(q=t,t=r):(W=t,t=o)):(W=t,t=o),t===o&&(b.test(e.charAt(W))?(t=e.charAt(W),W++):(t=o,0===H&&re(F))),t}function ge(){var t,n,r;return t=W,92===e.charCodeAt(W)?(n=p,W++):(n=o,0===H&&re(k)),n!==o?(34===e.charCodeAt(W)?(r=a,W++):(r=o,0===H&&re(D)),r===o&&(92===e.charCodeAt(W)?(r=p,W++):(r=o,0===H&&re(k))),r!==o?(q=t,t=r):(W=t,t=o)):(W=t,t=o),t===o&&(v.test(e.charAt(W))?(t=e.charAt(W),W++):(t=o,0===H&&re(I))),t}function he(){var t,n,r;return t=W,92===e.charCodeAt(W)?(n=p,W++):(n=o,0===H&&re(k)),n!==o?(39===e.charCodeAt(W)?(r=c,W++):(r=o,0===H&&re(T)),r===o&&(92===e.charCodeAt(W)?(r=p,W++):(r=o,0===H&&re(k))),r!==o?(q=t,t=r):(W=t,t=o)):(W=t,t=o),t===o&&(_.test(e.charAt(W))?(t=e.charAt(W),W++):(t=o,0===H&&re(K))),t}function me(e,n,{start:{offset:r},end:{offset:o}}){return t.addMeta?{node:e,text:n,start:r,end:o}:e}if((n=u())!==o&&W===e.length)return n;throw n!==o&&W<e.length&&re({type:"end"}),oe(Z,G<e.length?e.charAt(G):null,G<e.length?ne(G,G+1):ne(G,G))}}},124:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.safeElementFromExpression=function(e){try{return(0,r.fromExpression)(e)}catch(e){return(0,r.fromExpression)("markdown\n\"## Crud.\nCanvas could not parse this element's expression. I am so sorry this error isn't more useful. I promise it will be soon.\n\nThanks for understanding,\n#### Management\n\"")}};var r=n(85)},125:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.patch=function(e,t){let n="",s=0;function u(t){if((0,r.isAstWithMeta)(t.source))throw new Error("Patching sub-expressions is not supported.");n+=`${e.substring(s,t.source.start)}${(0,i.toExpression)(t.target,"argument")}`,s=t.source.end}return(0,o.compare)(e,t).sort((({source:e},{source:t})=>e.start-t.start)).forEach((function(e){if((0,o.isValueChange)(e))return void u(e);throw new Error("Cannot apply patch for the change.")})),n+=e.substring(s),n};var r=n(58),o=n(126),i=n(86)},126:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.compare=function(e,t){const n=[[(0,o.parse)(e,{addMeta:!0}),t]],s=[];function u(e,t){(0,r.zip)(e.node.chain,t.chain).forEach((([e,t])=>{if(!e||!t||(null==e?void 0:e.node.function)!==(null==t?void 0:t.function))throw Error("Expression changes are not supported.");!function(e,t){if((0,r.xor)(Object.keys(e.node.arguments),Object.keys(t.arguments)).length)throw Error("Function changes are not supported.");(0,r.forEach)(e.node.arguments,((e,n)=>{!function(e,t){if(e.length!==t.length)throw Error("Arguments changes are not supported.");(0,r.zip)(e,t).forEach((([e,t])=>function(e,t){if((0,i.isAstWithMeta)(e)&&(0,i.isAst)(t))return void u(e,t);e.node!==t&&s.push({type:"value",source:e,target:t})}(e,t)))}(e,t.arguments[n])}))}(e,t)}))}for(;n.length;)u(...n.shift());return s},t.isValueChange=function(e){return"value"===(null==e?void 0:e.type)};var r=n(12),o=n(67),i=n(58)},127:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Fn=function(e){this.name=e.name,this.type=e.type,this.aliases=e.aliases||[],this.fn=(...t)=>Promise.resolve(e.fn(...t)),this.help=e.help||"",this.args=(0,r.mapValues)(e.args||{},((e,t)=>new o.Arg({name:t,...e}))),this.context=e.context||{},this.accepts=e=>!this.context.types||(0,r.includes)(this.context.types,e)};var r=n(12),o=n(128)},128:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Arg=function(e){if("_"===e.name)throw Error("Arg names must not be _. Use it in aliases instead.");this.name=e.name,this.required=e.required||!1,this.help=e.help||"",this.types=e.types||[],this.default=e.default,this.aliases=e.aliases||[],this.multi=null!=e.multi&&e.multi,this.resolve=null==e.resolve||e.resolve,this.options=e.options||[],this.accepts=t=>!this.types.length||(0,r.includes)(e.types,t)};var r=n(12)},129:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.castProvider=function(e){return function(t,n){if(!n||0===n.length)return t;const o=(0,r.getType)(t);if(n.includes(o))return t;const i=e[o];for(let r=0;r<n.length;r++){if(i&&i.castsTo(n[r]))return i.to(t,n[r],e);const s=e[n[r]];if(s&&s.castsFrom(o))return s.from(t,e)}throw new Error(`Can not cast '${o}' to any of '${n.join(", ")}'`)}};var r=n(68)},130:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getByAlias=function(e,t){const n=t.toLowerCase();return Object.values(e).find((({name:e,aliases:t})=>e.toLowerCase()===n||(t||[]).some((e=>e.toLowerCase()===n))))}},131:function(e,t,n){"use strict";var r=n(54);Object.defineProperty(t,"__esModule",{value:!0}),t.Registry=void 0;var o=r(n(8)),i=n(12);t.Registry=class Registry{constructor(e="name"){if((0,o.default)(this,"_prop",void 0),(0,o.default)(this,"_indexed",void 0),"string"!=typeof e)throw new Error("Registry property name must be a string");this._prop=e,this._indexed=new Object}wrapper(e){return e}register(e){const t="function"==typeof e?e():e;if("object"!=typeof t||!t[this._prop])throw new Error(`Registered functions must return an object with a ${this._prop} property`);this._indexed[t[this._prop].toLowerCase()]=this.wrapper(t)}toJS(){return Object.keys(this._indexed).reduce(((e,t)=>(e[t]=this.get(t),e)),{})}toArray(){return Object.keys(this._indexed).map((e=>this.get(e)))}get(e){if(void 0===e)return null;const t=e.toLowerCase();return this._indexed[t]?(0,i.clone)(this._indexed[t]):null}getProp(){return this._prop}reset(){this._indexed=new Object}}},132:function(e,t,n){"use strict";function r(e,t){return Object.keys(t).forEach((n=>{if(!e[n])throw new Error(`There is no registry named "${n}".`);if(!e[n].register)throw new Error(`Registry "${n}" must have a register function.`);t[n].forEach((t=>e[n].register(t)))})),e}Object.defineProperty(t,"__esModule",{value:!0}),t.addRegistries=function(e,t){return Object.keys(t).forEach((n=>{if(e[n])throw new Error(`There is already a registry named "${n}".`);e[n]=t[n]})),e},t.register=r,t.registryFactory=function(e){return{registries:()=>e,register:t=>r(e,t)}}},133:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1);t.default=function(e){var t=r.useRef();return r.useEffect((function(){t.current=e})),t.current}},139:function(e,t,n){"use strict";n.r(t),n.d(t,"ExpressionInput",(function(){return P})),n.d(t,"registerExpressionsLanguage",(function(){return $.registerExpressionsLanguage}));var r=n(1),o=n(12),i=n(133),s=n.n(i),u=n(48),a=n(4);const c={autoClosingPairs:[{open:"{",close:"}"}]},l={scrollBeyondLastLine:!1,quickSuggestions:!0,minimap:{enabled:!1},wordWrap:"on",wrappingIndent:"indent"};var f=n(47),d=n(84),p=n(53);const g="EXPRESSIONS_SUGGESTION_MARKER";function h(e,t,n){const r=t.substr(0,n)+g+t.substr(n);try{const t=Object(d.parse)(r,{addMeta:!0}),{ast:i,fnIndex:s,argName:u,argIndex:a,parentFn:c,contextFn:l}=m(t,n),f=i.node.chain[s].node;if(c&&f.function.includes(g)&&u)return function(e,t,n,r,o,i){const{start:s,end:u,node:a}=t.node.chain[n],c=a.function.replace(g,""),l=e.filter((({name:e})=>function(e,t){return e.toLowerCase().includes(t.toLowerCase().trim())}(e,c))),f=Object(p.getByAlias)(e,r),d=Object(p.getByAlias)(f.args,o);if(!d)return[];const h=i?Object(p.getByAlias)(e,i):null,m=h&&h.type,b=d.types;return l.sort(((e,t)=>{const n=y(e,m,b,!0),r=y(t,m,b,!0);return n===r?e.name<t.name?-1:1:n>r?-1:1})).map((e=>({type:"function",text:e.name+" ",start:s,end:u-g.length,fnDef:e})))}(e,i,s,c,u,l);if(f.function.includes(g))return function(e,t,n){const{start:r,end:o}=t.node.chain[n],i=t.node.chain[n-1],s=t.node.chain.length>n+1?t.node.chain[n+1]:null,u=i&&Object(p.getByAlias)(e,i.node.function),a=u&&u.type,c=s&&Object(p.getByAlias)(e,s.node.function),l=c&&c.inputTypes;return e.sort(((e,t)=>{const n=y(e,a,l,!1),r=y(t,a,l,!1);return n===r?e.name<t.name?-1:1:n>r?-1:1})).map((e=>({type:"function",text:`${e.name} `,start:r,end:o-g.length,fnDef:e})))}(e,i,s);if("_"===u&&void 0!==a)return function(e,t,n,r,o){const i=t.node.chain[n].node,s=Object(p.getByAlias)(e,i.function);if(!s)return[];const{start:u,end:a}=i.arguments[r][o],c=Object.entries(i.arguments).map((([e,t])=>[e,t.filter((e=>!e.text.includes(g)))])),l=Object.entries(s.args).filter((([e,t])=>!!t.multi||!c.some((([n,r])=>r.length>0&&(n===e||(t.aliases||[]).includes(n))))));return l.map((([e,t])=>t)).sort(b).map((e=>({type:"argument",text:e.name+"=",start:u,end:a-g.length,argDef:e})))}(e,i,s,u,a);if(u&&void 0!==a)return function(e,t,n,r,i){const s=t.node.chain[n].node,u=Object(p.getByAlias)(e,s.function);if(!u)return[];const a=Object(p.getByAlias)(u.args,r);if(!a)return[];const{start:c,end:l,node:f}=s.arguments[r][i];if("string"!=typeof f)return[];const d=[...a.options?a.options:[]];void 0!==a.default&&d.push(a.default);return Object(o.uniq)(d).map((e=>{const t=function(e){if("string"==typeof e)return e.match(/^\{.*\}$/)?e:`"${e.replace(/"/g,'\\"')}"`;return e}(e)+" ";return{start:c,end:l-g.length,type:"value",text:t}}))}(e,i,s,u,a)}catch(e){}return[]}function m(e,t){const n=e.node.chain.findIndex((e=>e.start<=t&&t<=e.end)),r=e.node.chain[n];for(const[o,i]of Object.entries(r.node.arguments))for(let s=0;s<i.length;s++){const u=i[s];let a=u.start,c=u.end;if("_"!==o&&(a-=o.length+1,null!==u.node&&Object(d.isAstWithMeta)(u)&&(a--,c++)),a<=t&&t<=c){if(null!==u.node&&Object(d.isAstWithMeta)(u)&&("_"===o||!(a<=t&&t<=a+o.length+1))){const i=m(u,t);if(!i.argName){const t=0===i.fnIndex?n>0?e.node.chain[n-1].node.function:null:i.ast.node.chain[i.fnIndex-1].node.function;return{...i,argName:o,argIndex:s,argStart:a,argEnd:c,parentFn:r.node.function,contextFn:t}}return i}return{ast:e,fnIndex:n,argName:o,argIndex:s,argStart:a,argEnd:c}}}return{ast:e,fnIndex:n}}function y(e,t,n,r){let o=0;t||(t="null");const i=e.inputTypes||[];if(r)n&&e.type&&n.length&&n.includes(e.type)&&(o++,i.includes(t)&&o++);else if(e.inputTypes){const n=i.includes("null");n||"null"===t?n&&"null"===t&&(o++,e.type&&"null"!==e.type&&o++):(o++,e.inputTypes.includes(t)&&o++)}return o}function b(e,t){return(t.aliases&&t.aliases.includes("_")?1:0)-(e.aliases&&e.aliases.includes("_")?1:0)}var v=n(7);const _="**",O=e=>v.i18n.translate("presentationUtil.expressionInput.argReferenceAliasesDetail",{defaultMessage:"{BOLD_MD_TOKEN}Aliases{BOLD_MD_TOKEN}: {aliases}",values:{BOLD_MD_TOKEN:_,aliases:e}}),x=e=>v.i18n.translate("presentationUtil.expressionInput.argReferenceDefaultDetail",{defaultMessage:"{BOLD_MD_TOKEN}Default{BOLD_MD_TOKEN}: {defaultVal}",values:{BOLD_MD_TOKEN:_,defaultVal:e}}),j=e=>v.i18n.translate("presentationUtil.expressionInput.argReferenceRequiredDetail",{defaultMessage:"{BOLD_MD_TOKEN}Required{BOLD_MD_TOKEN}: {required}",values:{BOLD_MD_TOKEN:_,required:e}}),A=e=>v.i18n.translate("presentationUtil.expressionInput.argReferenceTypesDetail",{defaultMessage:"{BOLD_MD_TOKEN}Types{BOLD_MD_TOKEN}: {types}",values:{BOLD_MD_TOKEN:_,types:e}}),E=e=>v.i18n.translate("presentationUtil.expressionInput.functionReferenceAccepts",{defaultMessage:"{BOLD_MD_TOKEN}Accepts{BOLD_MD_TOKEN}: {acceptTypes}",values:{BOLD_MD_TOKEN:_,acceptTypes:e}}),w=e=>v.i18n.translate("presentationUtil.expressionInput.functionReferenceReturns",{defaultMessage:"{BOLD_MD_TOKEN}Returns{BOLD_MD_TOKEN}: {returnType}",values:{BOLD_MD_TOKEN:_,returnType:e}});function M(e){const{help:t,type:n,inputTypes:r}=e,o=r?r.join(" | "):"null",i=n||"null";return`${E(o)} ${w(i)}\n\n\n${t}`}function C(e){const{aliases:t,types:n,default:r,required:o,help:i}=e,s=[];null!=r&&s.push(x(String(r))),t&&t.length&&s.push(O(t.join(" | ")));const u=n&&n.length?n.join(" | "):"null",a=String(Boolean(o));return`${A(u)} ${j(a)}\n  \n\n${s.join(" ")}\n  \n\n${i}`}const D=e=>({provideHover:(t,n)=>{const r=t.getValue(),o=t.getWordAtPosition(n);if(!o)return{contents:[]};const i=t.getValueLengthInRange({startLineNumber:0,startColumn:0,endLineNumber:n.lineNumber,endColumn:o.endColumn}),{fnDef:s,argDef:u,argStart:a,argEnd:c}=function(e,t,n){try{const r=Object(d.parse)(t,{addMeta:!0}),{ast:o,fnIndex:i,argName:s,argStart:u,argEnd:a}=m(r,n),c=o.node.chain[i].node,l=Object(p.getByAlias)(e,c.function);return l&&s?{fnDef:l,argDef:Object(p.getByAlias)(l.args,s),argStart:u,argEnd:a}:{fnDef:l}}catch(e){}return{}}(e,r,i);if(u&&a&&c){const e=t.getPositionAt(a),n=t.getPositionAt(c),r=new f.monaco.Range(e.lineNumber,e.column,n.lineNumber,n.column);return{contents:[{value:C(u),isTrusted:!0}],range:r}}return s?{contents:[{value:M(s),isTrusted:!0}]}:{contents:[]}}});var T=n(0);const P=e=>{const{expressionFunctions:t,expression:n,onChange:i,isCompact:d,height:p,style:g,editorRef:m,...y}=e,[b,v]=Object(r.useState)(n),_=s()(n);Object(r.useEffect)((()=>{_!==n&&v(n)}),[_,n]);const O=Object(r.useMemo)((()=>(e=>({triggerCharacters:[" ","{"],provideCompletionItems:(t,n,r)=>{const o=t.getValue(),i=t.getFullModelRange(),s=t.getValueLengthInRange({startLineNumber:n.lineNumber,startColumn:n.column,endLineNumber:i.endLineNumber,endColumn:i.endColumn});let u,a;if("{"===r.triggerCharacter)t.getWordAtPosition(n.delta(0,-3))&&(u=new f.monaco.Range(n.lineNumber,n.column,n.lineNumber,n.column),a=h(e,o.substring(0,o.length-s)+"}",o.length-s));else{const r=t.getWordUntilPosition(n);u=new f.monaco.Range(n.lineNumber,r.startColumn,n.lineNumber,r.endColumn),a=h(e,o,o.length-s)}return a?{suggestions:a.map(((e,t)=>{const n=String.fromCharCode(t);return"argument"===e.type?{label:e.argDef.name,kind:f.monaco.languages.CompletionItemKind.Variable,documentation:{value:C(e.argDef),isTrusted:!0},insertText:e.text,command:{title:"Trigger Suggestion Dialog",id:"editor.action.triggerSuggest"},range:u,sortText:n}:"value"===e.type?{label:e.text,kind:f.monaco.languages.CompletionItemKind.Value,insertText:e.text,command:{title:"Trigger Suggestion Dialog",id:"editor.action.triggerSuggest"},range:u,sortText:n}:{label:e.fnDef.name,kind:f.monaco.languages.CompletionItemKind.Function,documentation:{value:M(e.fnDef),isTrusted:!0},insertText:e.text,command:{title:"Trigger Suggestion Dialog",id:"editor.action.triggerSuggest"},range:u,sortText:n}}))}:{suggestions:[]}}}))(t)),[t]),x=Object(r.useMemo)((()=>D(t)),[t]),j=Object(o.debounce)((e=>v(e)),500,{leading:!0,trailing:!1});return Object(T.jsx)("div",{style:{height:p,...g},rest:y},Object(T.jsx)(u.CodeEditor,{languageId:a.a,languageConfiguration:c,value:b,onChange:e=>{j(e),i(e)},suggestionProvider:O,hoverProvider:x,options:{...l,fontSize:d?12:16},editorDidMount:e=>{const t=e.getModel();null==t||t.updateOptions({tabSize:2}),m&&(m.current=e)}}))};var $=n(59);t.default=P},54:function(e,t,n){e.exports=n(17)(1115)},58:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isAst=function(e){return"object"==typeof e&&"expression"===(null==e?void 0:e.type)},t.isAstWithMeta=function(e){return"object"==typeof(null==e?void 0:e.node)}},59:function(e,t,n){"use strict";n.r(t),n.d(t,"registerExpressionsLanguage",(function(){return s}));var r=n(47),o=n(4);const i={keywords:[],symbols:/[=|]/,escapes:/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,digits:/\d+(_+\d+)*/,boolean:["true","false"],null:["null"],tokenizer:{root:[[/[{}]/,"delimiter.bracket"],{include:"common"}],common:[[/[a-z_$][\w$]*=/,"identifier"],[/[a-z_$][\w$]*/,{cases:{"@keywords":"keyword","@null":"keyword","@boolean":"keyword","@default":"identifier"}}],[/(@digits)/,"number"],[/"/,"string","@string_double"],[/'/,"string","@string_single"],[/@symbols/,"delimiter"],[/\/\*/,"comment","@multiline_comment"],[/\/\/.*$/,"comment"]],string_double:[[/[^\\"]+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/"/,"string","@pop"]],string_single:[[/[^\\']+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/'/,"string","@pop"]],bracketCounting:[[/\{/,"delimiter.bracket","@bracketCounting"],[/\}/,"delimiter.bracket","@pop"],{include:"common"}],multiline_comment:[[/[^\/*]+/,"comment"],["\\*/","comment","@pop"],[/[\/*]/,"comment"]]}};function s(e){i.keywords=e.map((e=>e.name)),r.monaco.languages.register({id:o.a}),r.monaco.languages.setMonarchTokensProvider(o.a,i)}},67:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parse=void 0;const r=n(123).parse;t.parse=r},68:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getType=function(e){if(null==e)return"null";if("object"==typeof e){if(!e.type)throw new Error("Objects must have a type property");return e.type}return typeof e}},84:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(121);Object.keys(r).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in t&&t[e]===r[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}}))}))},85:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fromExpression=function(e,t="expression"){try{return(0,r.parse)(String(e),{startRule:t})}catch(e){throw new Error(`Unable to parse expression: ${e.message}`)}};var r=n(67)},86:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.toExpression=function(e,t="expression"){const{type:n,source:l}="string"==typeof t?{type:t}:t;if(l&&(0,o.isAst)(e))return(0,i.patch)(l,e);if("argument"===n)return s(e);const f=(0,r.getType)(e);if("expression"===f){const{chain:t}=e;if(!Array.isArray(t))throw new Error("Expressions must contain a chain");return c(t)}if("function"===f){const{function:t}=e,n=u(e);return a(t,n)}throw new Error("Expression must be an expression or argument function")};var r=n(68),o=n(58),i=n(125);function s(e,t,n=0){const o=(0,r.getType)(e);function i(e,t){return null==e||"_"===e?t:`${e}=${t}`}if("string"===o){return i(t,`"${e.replace(/[\\"]/g,"\\$&")}"`)}if("boolean"===o||"null"===o||"number"===o)return i(t,`${e}`);if("expression"===o)return i(t,`{${c(e.chain,n+1)}}`);throw new Error(`Invalid argument type in AST: ${o}`)}function u({arguments:e},t=0){if(null==e||"object"!=typeof e||Array.isArray(e))throw new Error("Arguments can only be an object");const n=Object.keys(e);return n.map((n=>e[n].reduce(((e,r)=>{const o=s(r,n,t),i=e.split("\n").pop().length;return 0===t&&i+o.length>80?`${e}\n  ${o}`:i>0?`${e} ${o}`:o}),"")))}function a(e,t){var n;return`${e} ${null!==(n=null==t?void 0:t.join(" "))&&void 0!==n?n:""}`.trim()}function c(e,t=0){if(!e)throw new Error("Expressions must contain a chain");const n=t>0?" | ":"\n| ";return e.map((e=>{if("function"!==(0,r.getType)(e))return;const{function:n}=e;if(!n)throw new Error("Functions must have a function name");return a(n,u(e,t))})).join(n)}}}]);