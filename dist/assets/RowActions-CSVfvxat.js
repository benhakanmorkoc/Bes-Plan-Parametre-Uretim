import{c as a,r as i,j as n,b as w}from"./index-BgcZ9i_J.js";import{M as b}from"./more-vertical-29IAx1Th.js";import{F as g}from"./file-text-CjC8iz6I.js";import{T as L}from"./trash-2-BCFvaBG1.js";import{L as M}from"./plus-U44VsLED.js";import{P as j}from"./pencil-B3RorSW_.js";import{E as h}from"./eye-BXZnSja7.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=a("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=a("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=a("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=a("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=a("Link2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]),R={view:h,edit:j,copy:E,version:C,history:P,link:M,delete:L,details:g,download:N},q=[{key:"view",label:"Goruntule",icon:"view"},{key:"edit",label:"Duzenle",icon:"edit"},{key:"copy",label:"Kopyala",icon:"copy"},{key:"version",label:"Yeni Versiyon",icon:"version"},{key:"history",label:"Versiyon Gecmisi",icon:"history"},{key:"delete",label:"Sil",icon:"delete",danger:!0}];function B({actions:p=q,onAction:l,row:x}){const[c,d]=i.useState(!1),[m,f]=i.useState({top:0,left:0}),y=i.useRef(null),u=i.useRef(null),o=()=>{const e=y.current;if(!e)return;const r=e.getBoundingClientRect(),t=224,s=8,k=Math.min(Math.max(s,r.right-t),window.innerWidth-t-s);f({top:r.bottom+4,left:k})};i.useEffect(()=>{if(!c)return;o();const e=r=>{var t,s;(t=y.current)!=null&&t.contains(r.target)||(s=u.current)!=null&&s.contains(r.target)||d(!1)};return document.addEventListener("mousedown",e),window.addEventListener("resize",o),window.addEventListener("scroll",o,!0),()=>{document.removeEventListener("mousedown",e),window.removeEventListener("resize",o),window.removeEventListener("scroll",o,!0)}},[c]);const v=e=>{d(!1),l==null||l(e,x)};return n.jsxs("div",{className:"relative",ref:y,children:[n.jsx("button",{type:"button",onClick:e=>{e.stopPropagation(),d(r=>{const t=!r;return t&&o(),t})},className:"p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 inline-flex items-center justify-center","aria-label":"Satir aksiyonlari",children:n.jsx(b,{className:"w-4 h-4"})}),c&&w.createPortal(n.jsx("div",{ref:u,className:"fixed z-[1000] min-w-[11rem] w-max max-w-[14rem] bg-white border border-slate-200 rounded-md shadow-lg py-1 text-sm",style:{top:m.top,left:m.left},children:p.map((e,r)=>{if(e.divider)return n.jsx("div",{className:"my-1 border-t border-slate-100"},`d${r}`);const t=R[e.icon]||h;return n.jsxs("button",{type:"button",disabled:e.disabled,onClick:()=>{e.disabled||v(e.key)},className:`w-full text-left px-3 py-1.5 flex items-center gap-2 ${e.disabled?"text-slate-300 cursor-not-allowed":e.danger?"text-red-600 hover:bg-red-50":"text-slate-700 hover:bg-slate-50"}`,children:[n.jsx(t,{className:"w-3.5 h-3.5"})," ",e.label]},e.key)})}),document.body)]})}export{E as C,N as D,P as H,V as L,B as R};
