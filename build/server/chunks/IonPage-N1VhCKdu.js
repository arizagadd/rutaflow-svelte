import { g as getContext, c as create_ssr_component, o as onDestroy } from './ssr-CNVVjtts.js';
import './client-CQ5E_ugM.js';

const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};

const IonPage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const ionViewWillEnter = () => {
  };
  const ionViewDidEnter = () => {
  };
  const ionViewWillLeave = void 0;
  const ionViewDidLeave = () => {
  };
  onDestroy(() => {
  });
  if ($$props.ionViewWillEnter === void 0 && $$bindings.ionViewWillEnter && ionViewWillEnter !== void 0)
    $$bindings.ionViewWillEnter(ionViewWillEnter);
  if ($$props.ionViewDidEnter === void 0 && $$bindings.ionViewDidEnter && ionViewDidEnter !== void 0)
    $$bindings.ionViewDidEnter(ionViewDidEnter);
  if ($$props.ionViewWillLeave === void 0 && $$bindings.ionViewWillLeave && ionViewWillLeave !== void 0)
    $$bindings.ionViewWillLeave(ionViewWillLeave);
  if ($$props.ionViewDidLeave === void 0 && $$bindings.ionViewDidLeave && ionViewDidLeave !== void 0)
    $$bindings.ionViewDidLeave(ionViewDidLeave);
  return `<div class="ion-page">${slots.default ? slots.default({}) : ``}</div>`;
});

export { IonPage as I, page as p };
//# sourceMappingURL=IonPage-N1VhCKdu.js.map
