/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.ml_bundle_jsonpfunction=window.ml_bundle_jsonpfunction||[]).push([[4],{105:function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return p})),a.d(e,"a",(function(){return HttpService}));var o=a(5),s=a.n(o),i=a(25),r=a(26);function d(t){var e,a;if(!t.path)throw new Error("URL path is missing");return{path:t.path,fetchOptions:{asSystemRequest:!0,credentials:"same-origin",method:t.method||"GET",...t.body?{body:t.body}:{},...t.query?{query:t.query}:{},headers:(a=null!==(e=t.headers)&&void 0!==e?e:{},{"Content-Type":"application/json",...a})}}}async function n(t){const{path:e,fetchOptions:a}=d(t);return Object(r.f)().fetch(e,a)}function p(t){const{path:e,fetchOptions:a}=d(t);return o=e,s=a,new i.Observable((t=>{const e=new AbortController,a=e.signal;let i=!0,d=!1;null!=s&&s.signal&&(s.signal.aborted?e.abort():s.signal.addEventListener("abort",(()=>{a.aborted||e.abort()})));const n={...s||{},signal:a};return Object(r.f)().fetch(o,n).then((e=>{i=!1,t.next(e),t.complete()})).catch((e=>{i=!1,d||t.error(e)})),()=>{d=!0,i&&e.abort()}}));var o,s}class HttpService{constructor(t){s()(this,"getLoadingCount$",void 0),this.httpStart=t,this.getLoadingCount$=t.getLoadingCount$()}getResultHeaders(t){return{"Content-Type":"application/json",...t}}getFetchOptions(t){var e;if(!t.path)throw new Error("URL path is missing");return{path:t.path,fetchOptions:{asSystemRequest:!0,credentials:"same-origin",method:t.method||"GET",...t.body?{body:t.body}:{},...t.query?{query:t.query}:{},headers:this.getResultHeaders(null!==(e=t.headers)&&void 0!==e?e:{})}}}fromHttpHandler(t,e){return new i.Observable((a=>{const o=new AbortController,s=o.signal;let i=!0,r=!1;null!=e&&e.signal&&(e.signal.aborted?o.abort():e.signal.addEventListener("abort",(()=>{s.aborted||o.abort()})));const d={...e||{},signal:s};return this.httpStart.fetch(t,d).then((t=>{i=!1,a.next(t),a.complete()})).catch((t=>{i=!1,r||a.error(t)})),()=>{r=!0,i&&o.abort()}}))}async http(t){const{path:e,fetchOptions:a}=this.getFetchOptions(t);return this.httpStart.fetch(e,a)}http$(t){const{path:e,fetchOptions:a}=this.getFetchOptions(t);return this.fromHttpHandler(e,a)}}},219:function(t,e,a){"use strict";a.r(e),a.d(e,"jobsApiProvider",(function(){return s}));var o=a(4);const s=t=>({jobsSummary(e){const a=JSON.stringify({jobIds:e});return t.http({path:`${o.b}/jobs/jobs_summary`,method:"POST",body:a})},jobIdsWithGeo:()=>t.http({path:`${o.b}/jobs/jobs_with_geo`,method:"GET"}),jobsWithTimerange(e){const a=JSON.stringify({dateFormatTz:e});return t.http({path:`${o.b}/jobs/jobs_with_time_range`,method:"POST",body:a})},jobForCloning(e){const a=JSON.stringify({jobId:e});return t.http({path:`${o.b}/jobs/job_for_cloning`,method:"POST",body:a})},jobs(e){const a=JSON.stringify({jobIds:e});return t.http({path:`${o.b}/jobs/jobs`,method:"POST",body:a})},groups:()=>t.http({path:`${o.b}/jobs/groups`,method:"GET"}),updateGroups(e){const a=JSON.stringify({jobs:e});return t.http({path:`${o.b}/jobs/update_groups`,method:"POST",body:a})},forceStartDatafeeds(e,a,s){const i=JSON.stringify({datafeedIds:e,start:a,end:s});return t.http({path:`${o.b}/jobs/force_start_datafeeds`,method:"POST",body:i})},stopDatafeeds(e){const a=JSON.stringify({datafeedIds:e});return t.http({path:`${o.b}/jobs/stop_datafeeds`,method:"POST",body:a})},deleteJobs(e){const a=JSON.stringify({jobIds:e});return t.http({path:`${o.b}/jobs/delete_jobs`,method:"POST",body:a})},closeJobs(e){const a=JSON.stringify({jobIds:e});return t.http({path:`${o.b}/jobs/close_jobs`,method:"POST",body:a})},resetJobs(e){const a=JSON.stringify({jobIds:e});return t.http({path:`${o.b}/jobs/reset_jobs`,method:"POST",body:a})},forceStopAndCloseJob(e){const a=JSON.stringify({jobId:e});return t.http({path:`${o.b}/jobs/force_stop_and_close_job`,method:"POST",body:a})},jobAuditMessages({jobId:e,from:a,start:s,end:i}){const r=void 0!==e?`/${e}`:"",d={...void 0!==a?{from:a}:{},...void 0!==s&&void 0!==i?{start:s,end:i}:{}};return t.http({path:`${o.b}/job_audit_messages/messages${r}`,method:"GET",query:d})},clearJobAuditMessages(e,a){const s=JSON.stringify({jobId:e,notificationIndices:a});return t.http({path:`${o.b}/job_audit_messages/clear_messages`,method:"PUT",body:s})},blockingJobTasks:()=>t.http({path:`${o.b}/jobs/blocking_jobs_tasks`,method:"GET"}),jobsExist(e,a=!1){const s=JSON.stringify({jobIds:e,allSpaces:a});return t.http({path:`${o.b}/jobs/jobs_exist`,method:"POST",body:s})},jobsExist$(e,a=!1){const s=JSON.stringify({jobIds:e,allSpaces:a});return t.http$({path:`${o.b}/jobs/jobs_exist`,method:"POST",body:s})},newJobCaps(e,a=!1){const s=!0===a?{rollup:!0}:{};return t.http({path:`${o.b}/jobs/new_job_caps/${e}`,method:"GET",query:s})},newJobLineChart(e,a,s,i,r,d,n,p,l,h,m){const c=JSON.stringify({indexPatternTitle:e,timeField:a,start:s,end:i,intervalMs:r,query:d,aggFieldNamePairs:n,splitFieldName:p,splitFieldValue:l,runtimeMappings:h,indicesOptions:m});return t.http({path:`${o.b}/jobs/new_job_line_chart`,method:"POST",body:c})},newJobPopulationsChart(e,a,s,i,r,d,n,p,l,h){const m=JSON.stringify({indexPatternTitle:e,timeField:a,start:s,end:i,intervalMs:r,query:d,aggFieldNamePairs:n,splitFieldName:p,runtimeMappings:l,indicesOptions:h});return t.http({path:`${o.b}/jobs/new_job_population_chart`,method:"POST",body:m})},getAllJobAndGroupIds:()=>t.http({path:`${o.b}/jobs/all_jobs_and_group_ids`,method:"GET"}),getLookBackProgress(e,a,s){const i=JSON.stringify({jobId:e,start:a,end:s});return t.http({path:`${o.b}/jobs/look_back_progress`,method:"POST",body:i})},categorizationFieldExamples(e,a,s,i,r,d,n,p,l,h){const m=JSON.stringify({indexPatternTitle:e,query:a,size:s,field:i,timeField:r,start:d,end:n,analyzer:p,runtimeMappings:l,indicesOptions:h});return t.http({path:`${o.b}/jobs/categorization_field_examples`,method:"POST",body:m})},topCategories(e,a){const s=JSON.stringify({jobId:e,count:a});return t.http({path:`${o.b}/jobs/top_categories`,method:"POST",body:s})},revertModelSnapshot(e,a,s,i,r){const d=JSON.stringify({jobId:e,snapshotId:a,replay:s,end:i,calendarEvents:r});return t.http({path:`${o.b}/jobs/revert_model_snapshot`,method:"POST",body:d})},datafeedPreview(e,a,s){const i=JSON.stringify({datafeedId:e,job:a,datafeed:s});return t.http({path:`${o.b}/jobs/datafeed_preview`,method:"POST",body:i})},bulkCreateJobs(e){const a=JSON.stringify(e);return t.http({path:`${o.b}/jobs/bulk_create`,method:"POST",body:a})}})},73:function(t,e,a){"use strict";a.r(e),a.d(e,"basePath",(function(){return m})),a.d(e,"ml",(function(){return b})),a.d(e,"mlApiServicesProvider",(function(){return u}));var o=a(105);const s={getAnnotations$(t){const e=JSON.stringify(t);return Object(o.c)({path:"/api/ml/annotations",method:"POST",body:e})},getAnnotations(t){const e=JSON.stringify(t);return Object(o.b)({path:"/api/ml/annotations",method:"POST",body:e})},indexAnnotation(t){const e=JSON.stringify(t);return Object(o.b)({path:"/api/ml/annotations/index",method:"PUT",body:e})},deleteAnnotation:t=>Object(o.b)({path:`/api/ml/annotations/delete/${t}`,method:"DELETE"})},i={getDataFrameAnalytics(t,e){const a=void 0!==t?`/${t}`:"";return Object(o.b)({path:`/api/ml/data_frame/analytics${a}`,method:"GET",...e?{query:{excludeGenerated:e}}:{}})},getDataFrameAnalyticsStats:t=>void 0!==t?Object(o.b)({path:`/api/ml/data_frame/analytics/${t}/_stats`,method:"GET"}):Object(o.b)({path:"/api/ml/data_frame/analytics/_stats",method:"GET"}),createDataFrameAnalytics(t,e){const a=JSON.stringify(e);return Object(o.b)({path:`/api/ml/data_frame/analytics/${t}`,method:"PUT",body:a})},updateDataFrameAnalytics(t,e){const a=JSON.stringify(e);return Object(o.b)({path:`/api/ml/data_frame/analytics/${t}/_update`,method:"POST",body:a})},getDataFrameAnalyticsMap(t,e,a){const s=void 0!==t?`/${t}`:"";return Object(o.b)({path:`/api/ml/data_frame/analytics/map${s}`,method:"GET",query:{treatAsRoot:e,type:a}})},jobsExist(t,e=!1){const a=JSON.stringify({analyticsIds:t,allSpaces:e});return Object(o.b)({path:"/api/ml/data_frame/analytics/jobs_exist",method:"POST",body:a})},evaluateDataFrameAnalytics(t){const e=JSON.stringify(t);return Object(o.b)({path:"/api/ml/data_frame/_evaluate",method:"POST",body:e})},explainDataFrameAnalytics(t){const e=JSON.stringify(t);return Object(o.b)({path:"/api/ml/data_frame/analytics/_explain",method:"POST",body:e})},deleteDataFrameAnalytics:t=>Object(o.b)({path:`/api/ml/data_frame/analytics/${t}`,method:"DELETE"}),deleteDataFrameAnalyticsAndDestIndex:(t,e,a)=>Object(o.b)({path:`/api/ml/data_frame/analytics/${t}`,query:{deleteDestIndex:e,deleteDestIndexPattern:a},method:"DELETE"}),startDataFrameAnalytics:t=>Object(o.b)({path:`/api/ml/data_frame/analytics/${t}/_start`,method:"POST"}),stopDataFrameAnalytics:(t,e=!1)=>Object(o.b)({path:`/api/ml/data_frame/analytics/${t}/_stop`,method:"POST",query:{force:e}}),getAnalyticsAuditMessages:t=>Object(o.b)({path:`/api/ml/data_frame/analytics/${t}/messages`,method:"GET"}),validateDataFrameAnalytics(t){const e=JSON.stringify(t);return Object(o.b)({path:"/api/ml/data_frame/analytics/validate",method:"POST",body:e})},newJobCapsAnalytics(t,e=!1){const a=!0===e?{rollup:!0}:{};return Object(o.b)({path:`/api/ml/data_frame/analytics/new_job_caps/${t}`,method:"GET",query:a})}},r={filters(t){const e=t&&t.filterId?`/${t.filterId}`:"";return Object(o.b)({path:`/api/ml/filters${e}`,method:"GET"})},filtersStats:()=>Object(o.b)({path:"/api/ml/filters/_stats",method:"GET"}),addFilter(t,e,a){const s=JSON.stringify({filterId:t,description:e,items:a});return Object(o.b)({path:"/api/ml/filters",method:"PUT",body:s})},updateFilter(t,e,a,s){const i=JSON.stringify({...void 0!==e?{description:e}:{},...void 0!==a?{addItems:a}:{},...void 0!==s?{removeItems:s}:{}});return Object(o.b)({path:`/api/ml/filters/${t}`,method:"PUT",body:i})},deleteFilter:t=>Object(o.b)({path:`/api/ml/filters/${t}`,method:"DELETE"})},d=t=>({getAnomaliesTableData(e,a,o,s,i,r,d,n,p,l,h,m){const c=JSON.stringify({jobIds:e,criteriaFields:a,influencers:o,aggregationInterval:s,threshold:i,earliestMs:r,latestMs:d,dateFormatTz:n,maxRecords:p,maxExamples:l,influencersFilterQuery:h,functionDescription:m});return t.http$({path:"/api/ml/results/anomalies_table_data",method:"POST",body:c})},getMaxAnomalyScore(e,a,o){const s=JSON.stringify({jobIds:e,earliestMs:a,latestMs:o});return t.http({path:"/api/ml/results/max_anomaly_score",method:"POST",body:s})},getCategoryDefinition(e,a){const o=JSON.stringify({jobId:e,categoryId:a});return t.http({path:"/api/ml/results/category_definition",method:"POST",body:o})},getCategoryExamples(e,a,o){const s=JSON.stringify({jobId:e,categoryIds:a,maxExamples:o});return t.http({path:"/api/ml/results/category_examples",method:"POST",body:s})},fetchPartitionFieldsValues(e,a,o,s,i,r){const d=JSON.stringify({jobId:e,searchTerm:a,criteriaFields:o,earliestMs:s,latestMs:i,fieldsConfig:r});return t.http$({path:"/api/ml/results/partition_fields_values",method:"POST",body:d})},anomalySearch(e,a){const o=JSON.stringify({query:e,jobIds:a});return t.http({path:"/api/ml/results/anomaly_search",method:"POST",body:o})},anomalySearch$(e,a){const o=JSON.stringify({query:e,jobIds:a});return t.http$({path:"/api/ml/results/anomaly_search",method:"POST",body:o})},getCategoryStoppedPartitions(e,a){const o=JSON.stringify({jobIds:e,fieldToBucket:a});return t.http({path:"/api/ml/results/category_stopped_partitions",method:"POST",body:o})},getDatafeedResultChartData(e,a,o){const s=JSON.stringify({jobId:e,start:a,end:o});return t.http({path:"/api/ml/results/datafeed_results_chart",method:"POST",body:s})}});var n=a(219);const p={analyzeFile(t,e={}){const a=JSON.stringify(t);return Object(o.b)({path:"/api/file_upload/analyze_file",method:"POST",body:a,query:e})}},l=t=>({jobsSpaces:()=>t.http({path:"/api/ml/saved_objects/jobs_spaces",method:"GET"}),updateJobsSpaces(e,a,o,s){const i=JSON.stringify({jobType:e,jobIds:a,spacesToAdd:o,spacesToRemove:s});return t.http({path:"/api/ml/saved_objects/update_jobs_spaces",method:"POST",body:i})},removeJobFromCurrentSpace(e,a){const o=JSON.stringify({jobType:e,jobIds:a});return t.http({path:"/api/ml/saved_objects/remove_job_from_current_space",method:"POST",body:o})},syncSavedObjects:(e=!1)=>t.http({path:"/api/ml/saved_objects/sync",method:"GET",query:{simulate:e}}),initSavedObjects:(e=!1)=>t.http({path:"/api/ml/saved_objects/initialize",method:"GET",query:{simulate:e}}),syncCheck(e){const a=JSON.stringify({jobType:e});return t.http({path:"/api/ml/saved_objects/sync_check",method:"POST",body:a})},canDeleteJob(e,a){const o=JSON.stringify({jobIds:a});return t.http({path:`/api/ml/saved_objects/can_delete_job/${e}`,method:"POST",body:o})}});var h=a(26);function m(){return"/api/ml"}const c=new Proxy({},{get(t,e){try{return Object(h.f)()[e]}catch(t){if("getLoadingCount$"===e)return()=>{};console.error(t)}}}),b=u(new o.a(c));function u(t){return{getJobs(e){const a=e&&e.jobId?`/${e.jobId}`:"";return t.http({path:`/api/ml/anomaly_detectors${a}`})},getJobStats(e){const a=e&&e.jobId?`/${e.jobId}`:"";return t.http({path:`/api/ml/anomaly_detectors${a}/_stats`})},addJob({jobId:e,job:a}){const o=JSON.stringify(a);return t.http({path:`/api/ml/anomaly_detectors/${e}`,method:"PUT",body:o})},openJob:({jobId:e})=>t.http({path:`/api/ml/anomaly_detectors/${e}/_open`,method:"POST"}),closeJob:({jobId:e})=>t.http({path:`/api/ml/anomaly_detectors/${e}/_close`,method:"POST"}),forceCloseJob:({jobId:e})=>t.http({path:`/api/ml/anomaly_detectors/${e}/_close?force=true`,method:"POST"}),deleteJob:({jobId:e})=>t.http({path:`/api/ml/anomaly_detectors/${e}`,method:"DELETE"}),forceDeleteJob:({jobId:e})=>t.http({path:`/api/ml/anomaly_detectors/${e}?force=true`,method:"DELETE"}),updateJob({jobId:e,job:a}){const o=JSON.stringify(a);return t.http({path:`/api/ml/anomaly_detectors/${e}/_update`,method:"POST",body:o})},resetJob:({jobId:e})=>t.http({path:`/api/ml/anomaly_detectors/${e}/_reset`,method:"POST"}),estimateBucketSpan(e){const a=JSON.stringify(e);return t.http({path:"/api/ml/validate/estimate_bucket_span",method:"POST",body:a})},validateJob(e){const a=JSON.stringify(e);return t.http({path:"/api/ml/validate/job",method:"POST",body:a})},validateDatafeedPreview(e){const a=JSON.stringify(e);return t.http({path:"/api/ml/validate/datafeed_preview",method:"POST",body:a})},validateCardinality$(e){const a=JSON.stringify(e);return t.http$({path:"/api/ml/validate/cardinality",method:"POST",body:a})},getDatafeeds(e){const a=e&&e.datafeedId?`/${e.datafeedId}`:"";return t.http({path:`/api/ml/datafeeds${a}`})},getDatafeedStats(e){const a=e&&e.datafeedId?`/${e.datafeedId}`:"";return t.http({path:`/api/ml/datafeeds${a}/_stats`})},addDatafeed({datafeedId:e,datafeedConfig:a}){const o=JSON.stringify(a);return t.http({path:`/api/ml/datafeeds/${e}`,method:"PUT",body:o})},updateDatafeed({datafeedId:e,datafeedConfig:a}){const o=JSON.stringify(a);return t.http({path:`/api/ml/datafeeds/${e}/_update`,method:"POST",body:o})},deleteDatafeed:({datafeedId:e})=>t.http({path:`/api/ml/datafeeds/${e}`,method:"DELETE"}),forceDeleteDatafeed:({datafeedId:e})=>t.http({path:`/api/ml/datafeeds/${e}?force=true`,method:"DELETE"}),startDatafeed({datafeedId:e,start:a,end:o}){const s=JSON.stringify({...void 0!==a?{start:a}:{},...void 0!==o?{end:o}:{}});return t.http({path:`/api/ml/datafeeds/${e}/_start`,method:"POST",body:s})},stopDatafeed:({datafeedId:e})=>t.http({path:`/api/ml/datafeeds/${e}/_stop`,method:"POST"}),forceStopDatafeed:({datafeedId:e})=>t.http({path:`/api/ml/datafeeds/${e}/_stop?force=true`,method:"POST"}),datafeedPreview:({datafeedId:e})=>t.http({path:`/api/ml/datafeeds/${e}/_preview`,method:"GET"}),validateDetector({detector:e}){const a=JSON.stringify(e);return t.http({path:"/api/ml/anomaly_detectors/_validate/detector",method:"POST",body:a})},forecast({jobId:e,duration:a}){const o=JSON.stringify({...void 0!==a?{duration:a}:{}});return t.http({path:`/api/ml/anomaly_detectors/${e}/_forecast`,method:"POST",body:o})},overallBuckets({jobId:e,topN:a,bucketSpan:o,start:s,end:i,overallScore:r}){const d=JSON.stringify({topN:a,bucketSpan:o,start:s,end:i,...r?{overall_score:r}:{}});return t.http({path:`/api/ml/anomaly_detectors/${e}/results/overall_buckets`,method:"POST",body:d})},hasPrivileges(e){const a=JSON.stringify(e);return t.http({path:"/api/ml/_has_privileges",method:"POST",body:a})},checkMlCapabilities:()=>t.http({path:"/api/ml/ml_capabilities",method:"GET"}),checkManageMLCapabilities:()=>t.http({path:"/api/ml/ml_capabilities",method:"GET"}),checkIndicesExists({indices:e}){const a=JSON.stringify({indices:e});return t.http({path:"/api/ml/index_exists",method:"POST",body:a})},getFieldCaps({index:e,fields:a}){const o=JSON.stringify({...void 0!==e?{index:e}:{},...void 0!==a?{fields:a}:{}});return t.http({path:"/api/ml/indices/field_caps",method:"POST",body:o})},recognizeIndex:({indexPatternTitle:e})=>t.http({path:`/api/ml/modules/recognize/${e}`,method:"GET"}),listDataRecognizerModules:()=>t.http({path:"/api/ml/modules/get_module",method:"GET"}),getDataRecognizerModule:({moduleId:e})=>t.http({path:`/api/ml/modules/get_module/${e}`,method:"GET"}),dataRecognizerModuleJobsExist:({moduleId:e})=>t.http({path:`/api/ml/modules/jobs_exist/${e}`,method:"GET"}),setupDataRecognizerConfig({moduleId:e,prefix:a,groups:o,indexPatternName:s,query:i,useDedicatedIndex:r,startDatafeed:d,start:n,end:p,jobOverrides:l,estimateModelMemory:h}){const m=JSON.stringify({prefix:a,groups:o,indexPatternName:s,query:i,useDedicatedIndex:r,startDatafeed:d,start:n,end:p,jobOverrides:l,estimateModelMemory:h});return t.http({path:`/api/ml/modules/setup/${e}`,method:"POST",body:m})},getVisualizerFieldHistograms({indexPattern:e,query:a,fields:o,samplerShardSize:s,runtimeMappings:i}){const r=JSON.stringify({query:a,fields:o,samplerShardSize:s,runtimeMappings:i});return t.http({path:`/api/ml/data_visualizer/get_field_histograms/${e}`,method:"POST",body:r})},calendars(e){const{calendarId:a,calendarIds:o}=e||{};let s="";return a?s=`/${a}`:o&&(s=`/${o.join(",")}`),t.http({path:`/api/ml/calendars${s}`,method:"GET"})},addCalendar(e){const a=JSON.stringify(e);return t.http({path:"/api/ml/calendars",method:"PUT",body:a})},updateCalendar(e){const a=e&&e.calendarId?`/${e.calendarId}`:"",o=JSON.stringify(e);return t.http({path:`/api/ml/calendars${a}`,method:"PUT",body:o})},deleteCalendar:({calendarId:e})=>t.http({path:`/api/ml/calendars/${e}`,method:"DELETE"}),mlNodeCount:()=>t.http({path:"/api/ml/ml_node_count",method:"GET"}),mlInfo:()=>t.http({path:"/api/ml/info",method:"GET"}),calculateModelMemoryLimit$({datafeedConfig:e,analysisConfig:a,indexPattern:o,query:s,timeFieldName:i,earliestMs:r,latestMs:d}){const n=JSON.stringify({datafeedConfig:e,analysisConfig:a,indexPattern:o,query:s,timeFieldName:i,earliestMs:r,latestMs:d});return t.http$({path:"/api/ml/validate/calculate_model_memory_limit",method:"POST",body:n})},getCardinalityOfFields({index:e,fieldNames:a,query:o,timeFieldName:s,earliestMs:i,latestMs:r}){const d=JSON.stringify({index:e,fieldNames:a,query:o,timeFieldName:s,earliestMs:i,latestMs:r});return t.http({path:"/api/ml/fields_service/field_cardinality",method:"POST",body:d})},getTimeFieldRange({index:e,timeFieldName:a,query:o,runtimeMappings:s,indicesOptions:i}){const r=JSON.stringify({index:e,timeFieldName:a,query:o,runtimeMappings:s,indicesOptions:i});return t.http({path:"/api/ml/fields_service/time_field_range",method:"POST",body:r})},esSearch(e){const a=JSON.stringify(e);return t.http({path:"/api/ml/es_search",method:"POST",body:a})},esSearch$(e){const a=JSON.stringify(e);return t.http$({path:"/api/ml/es_search",method:"POST",body:a})},getIndices:()=>t.http({path:"/api/index_management/indices",method:"GET"}),getModelSnapshots:(e,a)=>t.http({path:`/api/ml/anomaly_detectors/${e}/model_snapshots${void 0!==a?`/${a}`:""}`}),updateModelSnapshot:(e,a,o)=>t.http({path:`/api/ml/anomaly_detectors/${e}/model_snapshots/${a}/_update`,method:"POST",body:JSON.stringify(o)}),deleteModelSnapshot:(e,a)=>t.http({path:`/api/ml/anomaly_detectors/${e}/model_snapshots/${a}`,method:"DELETE"}),annotations:s,dataFrameAnalytics:i,filters:r,results:d(t),jobs:Object(n.jobsApiProvider)(t),fileDatavisualizer:p,savedObjects:l(t)}}}}]);