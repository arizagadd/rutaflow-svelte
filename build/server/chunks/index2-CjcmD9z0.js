import { c as create_ssr_component, o as onDestroy, g as getContext } from './ssr-BvR1n3wf.js';
import './client-DpIAX_q0.js';

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
  if ($$props.ionViewWillEnter === void 0 && $$bindings.ionViewWillEnter && ionViewWillEnter !== void 0) $$bindings.ionViewWillEnter(ionViewWillEnter);
  if ($$props.ionViewDidEnter === void 0 && $$bindings.ionViewDidEnter && ionViewDidEnter !== void 0) $$bindings.ionViewDidEnter(ionViewDidEnter);
  if ($$props.ionViewWillLeave === void 0 && $$bindings.ionViewWillLeave && ionViewWillLeave !== void 0) $$bindings.ionViewWillLeave(ionViewWillLeave);
  if ($$props.ionViewDidLeave === void 0 && $$bindings.ionViewDidLeave && ionViewDidLeave !== void 0) $$bindings.ionViewDidLeave(ionViewDidLeave);
  return `<div class="ion-page">${slots.default ? slots.default({}) : ``}</div>`;
});
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
function hexToRGBA(hex = "", alpha = 0) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
async function getJson(apiUrl = "", callback = function(obj = {}) {
}, variables = {}) {
  let formData = new FormData();
  for (const [key, value] of Object.entries(variables)) {
    formData.append(key, value);
  }
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const result = await response.json();
      callback(result);
    } else {
      console.error("Request failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error during file upload:", error);
  }
}

export { IonPage as I, getJson as g, hexToRGBA as h, page as p };
//# sourceMappingURL=index2-CjcmD9z0.js.map
