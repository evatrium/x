inspiration driven by superfine, atomico, stencil, preact and open-wc

**abandoning this project**

after wrestling with superfine, making several alterations and hacks, 
I have decided preact will be a better option for higher fidelity diffing, and a better option for web components.

Superfine.js is awesome by itself, although not a good option for webcomponents

Notable pitfalls using superfine V7 for web components as of Sept 12 2019:
- patching into the shadowDom is kind of hacky https://github.com/jorgebucaran/superfine/issues/172
- No Fragments (added a work around in this repo)
- patching can cause inadvertant invocation of web component constructor and connectedCallback
- ...I just prefer the general utilities provided by preact that are worth the extra few KB