import { c as create_ssr_component, a as add_attribute } from './ssr-Ba6f9FPv.js';
import { url } from './_layout.svelte-BG13t4_6.js';
import 'ionic-svelte/components/all.js';
import '@ionic/core';
import '@ionic/core/components/index.js';
import '@ionic/core/dist/collection/global/config.js';
import './index-DFQmzJno.js';

const css = {
  code: ".huge.svelte-viq1pm{font-size:12rem}.e404.svelte-viq1pm{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center}",
  map: null
};
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="e404 svelte-viq1pm" data-svelte-h="svelte-1to51ow"><div class="huge svelte-viq1pm">404</div> <div class="big">Page not found. 
     <a${add_attribute("href", url("../"), 0)}>Go back</a></div></div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-oeqIRdbm.js.map
