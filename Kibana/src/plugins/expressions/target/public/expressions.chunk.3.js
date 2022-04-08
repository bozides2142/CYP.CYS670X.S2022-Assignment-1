(window.expressions_bundle_jsonpfunction=window.expressions_bundle_jsonpfunction||[]).push([[3,8],{56:function(e,t,r){"use strict";r.r(t),r.d(t,"ExpressionRenderHandler",(function(){return render_ExpressionRenderHandler})),r.d(t,"render",(function(){return l}));var s=r(0),i=r.n(s),n=r(2),a=r(4),o=r(3),d=r(1),h=r(10);const c=(e,t,r)=>{"AbortError"!==t.name?(Object(h.c)().toasts.addError(t,{title:d.i18n.translate("expressions.defaultErrorRenderer.errorTitle",{defaultMessage:"Error in visualisation"}),toastMessage:t.message}),r.done()):r.done()};class render_ExpressionRenderHandler{constructor(e,{onRenderError:t,renderMode:r,syncColors:s,interactive:d,hasCompatibleActions:l=(async()=>!1)}={}){i()(this,"render$",void 0),i()(this,"update$",void 0),i()(this,"events$",void 0),i()(this,"element",void 0),i()(this,"destroyFn",void 0),i()(this,"renderCount",0),i()(this,"renderSubject",void 0),i()(this,"eventsSubject",void 0),i()(this,"updateSubject",void 0),i()(this,"handlers",void 0),i()(this,"onRenderError",void 0),i()(this,"render",(async(e,t)=>{if(!e||"object"!=typeof e)return this.handleRenderError(new Error("invalid data provided to the expression renderer"));if("render"!==e.type||!e.as)return"error"===e.type?this.handleRenderError(e.error):this.handleRenderError(new Error("invalid data provided to the expression renderer"));if(!Object(h.d)().get(e.as))return this.handleRenderError(new Error(`invalid renderer id '${e.as}'`));try{await Object(h.d)().get(e.as).render(this.element,e.value,{...this.handlers,uiState:t})}catch(e){return this.handleRenderError(e)}})),i()(this,"destroy",(()=>{this.renderSubject.complete(),this.eventsSubject.complete(),this.updateSubject.complete(),this.destroyFn&&this.destroyFn()})),i()(this,"getElement",(()=>this.element)),i()(this,"handleRenderError",(e=>{this.onRenderError(this.element,e,this.handlers)})),this.element=e,this.eventsSubject=new n.Subject,this.events$=this.eventsSubject.asObservable(),this.onRenderError=t||c,this.renderSubject=new n.BehaviorSubject(null),this.render$=this.renderSubject.asObservable().pipe(Object(a.filter)(o.isNumber)),this.updateSubject=new n.Subject,this.update$=this.updateSubject.asObservable(),this.handlers={onDestroy:e=>{this.destroyFn=e},done:()=>{this.renderCount++,this.renderSubject.next(this.renderCount)},reload:()=>{this.updateSubject.next(null)},update:e=>{this.updateSubject.next(e)},event:e=>{this.eventsSubject.next(e)},getRenderMode:()=>r||"view",isSyncColorsEnabled:()=>s||!1,isInteractive:()=>null==d||d,hasCompatibleActions:l}}}const l=async(e,t,r)=>{const s=new render_ExpressionRenderHandler(e,r);return s.render(t),s}},58:function(e,t,r){"use strict";r.r(t),r.d(t,"ExpressionLoader",(function(){return ExpressionLoader})),r.d(t,"loader",(function(){return c}));var s=r(0),i=r.n(s),n=r(2),a=r(4),o=r(3),d=r(56),h=r(10);class ExpressionLoader{constructor(e,t,r){i()(this,"data$",void 0),i()(this,"update$",void 0),i()(this,"render$",void 0),i()(this,"events$",void 0),i()(this,"loading$",void 0),i()(this,"execution",void 0),i()(this,"renderHandler",void 0),i()(this,"dataSubject",void 0),i()(this,"loadingSubject",void 0),i()(this,"data",void 0),i()(this,"params",{}),i()(this,"subscription",void 0),i()(this,"loadData",((e,t)=>{var r;null===(r=this.subscription)||void 0===r||r.unsubscribe(),this.execution&&this.execution.isPending&&this.execution.cancel(),this.setParams(t),this.execution=Object(h.b)().execute(e,t.context,{searchContext:t.searchContext,variables:t.variables||{},inspectorAdapters:t.inspectorAdapters,searchSessionId:t.searchSessionId,debug:t.debug,syncColors:t.syncColors,executionContext:t.executionContext}),this.subscription=this.execution.getData().pipe(Object(a.delay)(0),Object(a.filter)((({partial:e})=>t.partial||!e)),t.partial&&t.throttle?Object(a.throttleTime)(t.throttle,n.asyncScheduler,{leading:!0,trailing:!0}):n.identity).subscribe((e=>this.dataSubject.next(e)))})),this.dataSubject=new n.Subject,this.data$=this.dataSubject.asObservable(),this.loadingSubject=new n.BehaviorSubject(!1),this.loading$=this.loadingSubject.asObservable().pipe(Object(a.filter)((e=>!0===e)),Object(a.map)((()=>{}))),this.renderHandler=new d.ExpressionRenderHandler(e,{interactive:null==r?void 0:r.interactive,onRenderError:r&&r.onRenderError,renderMode:null==r?void 0:r.renderMode,syncColors:null==r?void 0:r.syncColors,hasCompatibleActions:null==r?void 0:r.hasCompatibleActions}),this.render$=this.renderHandler.render$,this.update$=this.renderHandler.update$,this.events$=this.renderHandler.events$,this.update$.subscribe((e=>{if(e){const{newExpression:t,newParams:r}=e;this.update(t,r)}})),this.data$.subscribe((({result:e})=>{this.render(e)})),this.render$.subscribe((()=>{this.loadingSubject.next(!1)})),this.setParams(r),t&&(this.loadingSubject.next(!0),this.loadData(t,this.params))}destroy(){var e;this.dataSubject.complete(),this.loadingSubject.complete(),this.renderHandler.destroy(),this.cancel(),null===(e=this.subscription)||void 0===e||e.unsubscribe()}cancel(){var e;null===(e=this.execution)||void 0===e||e.cancel()}getExpression(){var e;return null===(e=this.execution)||void 0===e?void 0:e.getExpression()}getAst(){var e;return null===(e=this.execution)||void 0===e?void 0:e.getAst()}getElement(){return this.renderHandler.getElement()}inspect(){var e;return null===(e=this.execution)||void 0===e?void 0:e.inspect()}update(e,t){this.setParams(t),this.loadingSubject.next(!0),e?this.loadData(e,this.params):this.data&&this.render(this.data)}render(e){this.renderHandler.render(e,this.params.uiState)}setParams(e){var t,r;e&&Object.keys(e).length&&(e.searchContext&&(this.params.searchContext=Object(o.defaults)({},e.searchContext,this.params.searchContext||{})),e.uiState&&this.params&&(this.params.uiState=e.uiState),e.variables&&this.params&&(this.params.variables=e.variables),e.searchSessionId&&this.params&&(this.params.searchSessionId=e.searchSessionId),this.params.syncColors=e.syncColors,this.params.debug=Boolean(e.debug),this.params.partial=Boolean(e.partial),this.params.throttle=Number(null!==(t=e.throttle)&&void 0!==t?t:1e3),this.params.inspectorAdapters=e.inspectorAdapters||(null===(r=this.execution)||void 0===r?void 0:r.inspect()),this.params.executionContext=e.executionContext)}}const c=async(e,t,r)=>new ExpressionLoader(e,t,r)}}]);