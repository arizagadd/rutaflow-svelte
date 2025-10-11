import { c as create_ssr_component, a as add_attribute } from './ssr-BvR1n3wf.js';
import { url } from './_layout.svelte-BG0Xogss.js';
import 'ionic-svelte/components/all.js';
import '@ionic/core';
import '@ionic/core/components/index.js';
import '@ionic/core/dist/collection/global/config.js';
import './index-B-yAdcwh.js';

const css = {
  code: ".huge.svelte-viq1pm{font-size:12rem}.e404.svelte-viq1pm{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center}",
  map: `{"version":3,"file":"+error.svelte","sources":["+error.svelte"],"sourcesContent":["<script>\\r\\n    import { url } from './+layout.svelte'\\r\\n<\/script>\\r\\n\\r\\n<style>\\r\\n  .huge {\\r\\n    font-size: 12rem;\\r\\n  }\\r\\n  .e404 {\\r\\n    position: absolute;\\r\\n    left: 50%;\\r\\n    top: 50%;\\r\\n    transform: translate(-50%, -50%);\\r\\n    text-align: center;\\r\\n  }\\r\\n</style>\\r\\n\\r\\n<div class=\\"e404\\">\\r\\n  <div class=\\"huge\\">404</div>\\r\\n  <div class=\\"big\\">Page not found. \\r\\n    <!-- link to the parent folder of _fallback.svelte -->\\r\\n    <a href={url('../')}>Go back</a>\\r\\n  </div>\\r\\n</div>\\r\\n"],"names":[],"mappings":"AAKE,mBAAM,CACJ,SAAS,CAAE,KACb,CACA,mBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,UAAU,CAAE,MACd"}`
};
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="e404 svelte-viq1pm" data-svelte-h="svelte-1to51ow"><div class="huge svelte-viq1pm">404</div> <div class="big">Page not found. 
     <a${add_attribute("href", url("../"), 0)}>Go back</a></div></div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-BlJX736k.js.map
