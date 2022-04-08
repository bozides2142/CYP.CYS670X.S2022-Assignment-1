/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.ml_bundle_jsonpfunction=window.ml_bundle_jsonpfunction||[]).push([[20],{160:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));n(16);var s=n(44),i=n(12);const a=()=>Object(i.jsx)(s.EuiText,{textAlign:"center"},Object(i.jsx)(s.EuiSpacer,{size:"l"}),Object(i.jsx)(s.EuiLoadingSpinner,{size:"l"}),Object(i.jsx)(s.EuiSpacer,{size:"l"}))},277:function(e,t,n){"use strict";n.r(t),n.d(t,"getDefaultSwimlanePanelTitle",(function(){return v})),n.d(t,"AnomalySwimlaneEmbeddable",(function(){return anomaly_swimlane_embeddable_AnomalySwimlaneEmbeddable}));var s=n(5),i=n.n(s),a=n(16),l=n.n(a),d=n(52),r=n.n(d),o=n(2),u=n(25),b=n(46),c=n(50);const m=l.a.lazy((()=>n.e(17).then(n.bind(null,770))));var h=n(178),j=n(109),p=n(160),x=n(12);const v=e=>o.i18n.translate("xpack.ml.swimlaneEmbeddable.title",{defaultMessage:"ML anomaly swim lane for {jobIds}",values:{jobIds:e.join(", ")}});class anomaly_swimlane_embeddable_AnomalySwimlaneEmbeddable extends c.Embeddable{constructor(e,t,n){super(e,{defaultTitle:e.title},n),i()(this,"node",void 0),i()(this,"reload$",new u.Subject),i()(this,"type",j.b),this.services=t}render(e){super.render(e),this.node=e;const t=this.services[0].i18n.Context,n=this.services[0].theme.theme$;r.a.render(Object(x.jsx)(t,null,Object(x.jsx)(b.KibanaThemeProvider,{theme$:n},Object(x.jsx)(b.KibanaContextProvider,{services:{...this.services[0]}},Object(x.jsx)(a.Suspense,{fallback:Object(x.jsx)(p.a,null)},Object(x.jsx)(m,{id:this.input.id,embeddableContext:this,embeddableInput:this.getInput$(),services:this.services,refresh:this.reload$.asObservable(),onInputChange:this.updateInput.bind(this),onOutputChange:this.updateOutput.bind(this)}))))),e)}destroy(){super.destroy(),this.node&&r.a.unmountComponentAtNode(this.node)}reload(){this.reload$.next()}supportedTriggers(){return[h.a]}}}}]);