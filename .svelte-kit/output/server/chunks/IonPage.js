import { c as create_ssr_component, o as onDestroy } from "./ssr.js";
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
export {
  IonPage as I
};
