import{c as l,r as o,j as e,X as m}from"./index-BxdrD1wD.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=l("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=l("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=l("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=l("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=l("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=l("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=l("Pencil",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=l("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]),j={view:h,edit:b,copy:u,version:k,history:p,link:f,delete:w},g=[{key:"view",label:"Goruntule",icon:"view"},{key:"edit",label:"Duzenle",icon:"edit"},{key:"copy",label:"Kopyala",icon:"copy"},{key:"version",label:"Yeni Versiyon",icon:"version"},{key:"history",label:"Versiyon Gecmisi",icon:"history"},{key:"delete",label:"Sil",icon:"delete",danger:!0}];function M({actions:n=g,onAction:s,row:y}){const[a,c]=o.useState(!1),i=o.useRef(null);o.useEffect(()=>{if(!a)return;const t=r=>{i.current&&!i.current.contains(r.target)&&c(!1)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[a]);const d=t=>{c(!1),s==null||s(t,y)};return e.jsxs("div",{className:"relative",ref:i,children:[e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),c(r=>!r)},className:"p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 inline-flex items-center justify-center","aria-label":"Satir aksiyonlari",children:e.jsx(v,{className:"w-4 h-4"})}),a&&e.jsx("div",{className:"absolute right-0 top-full mt-1 z-30 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 text-sm",children:n.map((t,r)=>{if(t.divider)return e.jsx("div",{className:"my-1 border-t border-slate-100"},`d${r}`);const x=j[t.icon]||h;return e.jsxs("button",{onClick:()=>d(t.key),className:`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 ${t.danger?"text-red-600 hover:bg-red-50":"text-slate-700"}`,children:[e.jsx(x,{className:"w-3.5 h-3.5"})," ",t.label]},t.key)})})]})}function E({open:n,onClose:s,title:y,description:a,footer:c,children:i,size:d="md"}){if(o.useEffect(()=>{if(!n)return;const r=x=>{x.key==="Escape"&&(s==null||s())};return window.addEventListener("keydown",r),document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",r),document.body.style.overflow=""}},[n,s]),!n)return null;const t=d==="sm"?"max-w-md":d==="lg"?"max-w-3xl":d==="xl"?"max-w-5xl":"max-w-xl";return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm",onClick:s,children:e.jsxs("div",{className:`bg-white w-full ${t} rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden`,style:{animation:"modalFadeIn .15s ease-out"},onClick:r=>r.stopPropagation(),children:[e.jsxs("div",{className:"flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-base font-bold text-slate-800",children:y}),a&&e.jsx("p",{className:"text-xs text-slate-500 mt-0.5",children:a})]}),e.jsx("button",{onClick:s,className:"text-slate-400 hover:text-slate-700 transition",children:e.jsx(m,{className:"w-5 h-5"})})]}),e.jsx("div",{className:"flex-1 overflow-auto px-5 py-4",children:i}),c&&e.jsx("div",{className:"px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-2",children:c})]})})}export{f as L,E as M,M as R};
