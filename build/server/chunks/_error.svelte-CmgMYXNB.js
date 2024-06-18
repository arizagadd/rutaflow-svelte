import { c as create_ssr_component, a as add_attribute } from './ssr-BvR1n3wf.js';
import { url } from './_layout.svelte-BG0Xogss.js';
import 'ionic-svelte/components/all.js';
import '@ionic/core';
import '@ionic/core/components/index.js';
import '@ionic/core/dist/collection/global/config.js';
import './index-B-yAdcwh.js';

const css = {
  code: ".huge.svelte-viq1pm{font-size:12rem}.e404.svelte-viq1pm{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center}",
  map: `{"version":3,"file":"+error.svelte","sources":["+error.svelte"],"sourcesContent":["<script>\\n    import { url } from './+layout.svelte'\\n<\/script>\\n\\n<style>\\n  .huge {\\n    font-size: 12rem;\\n  }\\n  .e404 {\\n    position: absolute;\\n    left: 50%;\\n    top: 50%;\\n    transform: translate(-50%, -50%);\\n    text-align: center;\\n  }\\n</style>\\n\\n<div class=\\"e404\\">\\n  <div class=\\"huge\\">404</div>\\n  <div class=\\"big\\">Page not found. \\n    <!-- link to the parent folder of _fallback.svelte -->\\n    <a href={url('../')}>Go back</a>\\n  </div>\\n</div>\\n"],"names":[],"mappings":"AAKE,mBAAM,CACJ,SAAS,CAAE,KACb,CACA,mBAAM,CACJ,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,UAAU,CAAE,MACd"}`
};
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="e404 svelte-viq1pm" data-svelte-h="svelte-1to51ow"><div class="huge svelte-viq1pm">404</div> <div class="big">Page not found. 
     <a${add_attribute("href", url("../"), 0)}>Go back</a></div></div>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-CmgMYXNB.js.map
