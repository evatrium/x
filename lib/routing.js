import{isArray as t,isObj as a,createElement as e,appendChild as r,extend as o}from"./utils.js";import{obi as n}from"./obi.js";const l=()=>{let e=window,r=t=>{if(!t)return"";var a=decodeURIComponent(t);return"false"!==a&&("true"===a||(0*+a==0?+a:a))},o=t=>{let a,o,n,l={};if((n=(t=t||e.location.search).indexOf("?"))<0)return;let p=(t=t.substr(n+1)).split("&");for(;a=p.shift();)void 0!==l[o=(a=a.split("=")).shift()]?l[o]=[].concat(l[o],r(a.shift())):l[o]=r(a.shift());return l},l=a=>{var e,r,o,n=encodeURIComponent,l="";for(e in a)if(void 0!==(o=a[e]))if(t(o))for(r=0;r<o.length;r++)l&&(l+="&"),l+=n(e)+"="+n(o[r]);else l&&(l+="&"),l+=n(e)+"="+n(o);return"?"+l},p=()=>{let{pathname:t,search:a}=e.location;return{url:t+a,pathname:t,search:a,params:o()}},i=p(),{url:s,pathname:u}=i,c=n({$lastUrl:s,$lastPathname:u,$lastType:"initial",...i,getParams:o,stringifyParams:l,getLocation:p,route(t,r,o){o=o||"push",t=t||location.pathname,r=r||"";const{pathname:n,url:i}=p();"replace"!==o&&(s=i,u=n),((t,r,o)=>{r=a(r)?l(r):r,e.history[o+"State"](null,null,t+r)})(t,r,o),"replace"===o?setTimeout(()=>m({type:o})):m({type:o})}});c.routerSwitch=({root:t,pathMap:a,noMatch:e})=>{let r=null,o=!1,{pathname:n,$lastPathname:l,$lastUrl:p,$lastType:i,url:s}=c,u=s===p;return e=e||"/",t?r=a["/"+n.split("/")[1]]||a[e]:a[n]?r=a[n]:l!==n&&a[l]?(c.route(p,location.search,"replace"),r=a[l],o=!0):e&&a[e]&&(c.route(e,location.search,"replace"),r=a[e]),{next:r,toLast:o,noChange:u,replacedLast:"replace"===i}};var m=t=>{c.$merge({...p(),$lastUrl:"popstate"===t.type?c.url:s,$lastPathname:"popstate"===t.type?c.pathname:u,$lastType:t.type})};return e.addEventListener("popstate",m),c},p=l(),i=({transition:t,pathMap:a,noMatch:n,loadingIndicator:l,lazyMap:i})=>{var s,u,c,m,h=!0,f=`opacity ${t="number"==typeof t?t:!0===t?150:0}ms ease-in-out`,{routerSwitch:y}=p,d=customElements,$=(t,a)=>((t=>{let a=t.lastElementChild;for(;a;)t.removeChild(a),a=t.lastElementChild})(t),r(t,a)),M=(a,r)=>{if(clearTimeout(c),s=e(a),h||!t)return $(r,s);o(r.style,{transition:f,opacity:0}),c=setTimeout(()=>{$(r,s),o(r.style,{transition:f,opacity:1})},t?t+10:0)},T=()=>{let{next:t,toLast:e,noChange:r,replacedLast:o}=y({pathMap:a,noMatch:n}),p=u&&u();!p||!p.nodeName||e||o||r&&!h||(t&&d.get(t)?M(t,p):((t,e)=>{l&&M(l,e),i&&i[t]&&i[t]().then(()=>d.whenDefined(t).then(()=>a[location.pathname]===t&&M(t,e)))})(t,p))};return{mountTo:t=>(m&&m(),u=t,T(),h=!1,m=p.$onChange(T))}};export{i as CustomElementsRouter,l as createRouting,p as routing};
//# sourceMappingURL=routing.js.map