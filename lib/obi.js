import{extend as e,def as t,isFunc as r,isObj as n,Subie as u}from"./utils.js";const l=l=>{const{sub:a,notify:i}=u();let b=u=>{if(u.$obi)return u;t(u,"$obi",{enumerable:!1,value:!0}),t(u,"$batching",{enumerable:!1,value:{active:!1}}),t(u,"$onChange",{enumerable:!1,value:e=>a(e)}),t(u,"$getState",{enumerable:!1,value:()=>Object.keys(u).reduce((e,t)=>r(u[t])?e:(e[t]=n(u[t])&&u[t].$obi?u[t].$getState():u[t],e),{})}),t(u,"$merge",{enumerable:!1,value:(t,n)=>{u.$batching.active=!0,r(t)?t(l):e(l,t),u.$batching.active=!1,!n&&i(l)}});for(let e in u){let a=u[e];r(a)||e.startsWith("$")||(n(a)&&(a=b(u[e])),t(u,e,{enumerable:!0,get:()=>a,set(e){e!==a&&(a=e,l.$batching.active||i(l))}}))}return u};return b(l)},a=(t,r,n)=>{let u,l,a,i;return(b,o)=>(setTimeout(()=>{l||(l=!0,(i=new MutationObserver(e=>{[...e[0].removedNodes].includes(u)&&(i.disconnect(),a(),l=!1)})).observe(u.parentNode,{childList:!0}),n(u,r),a=r.$onChange(e=>n(u,e)))}),t(e(b,{ref:e=>u=e}),o))};export{l as obi,a as obiHOC};
//# sourceMappingURL=obi.js.map