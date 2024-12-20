import { c as create_ssr_component, a as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import "@ionic/core";
import { I as IonPage } from "../../chunks/IonPage.js";
import "../../chunks/authStore.js";
import { g as goto } from "../../chunks/client.js";
const IonInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "" } = $$props;
  let { type = "text" } = $$props;
  let { placeholder = "" } = $$props;
  let { value } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `<ion-input${add_attribute("type", type, 0)}${add_attribute("name", name, 0)}${add_attribute("placeholder", placeholder, 0)}${add_attribute("value", value, 0)}></ion-input>`;
});
const css = {
  code: ".submit-btn.svelte-19nd3yu.svelte-19nd3yu{background-color:#2c83d3!important}.logo-row.svelte-19nd3yu.svelte-19nd3yu{margin-top:20px}.login-box.svelte-19nd3yu.svelte-19nd3yu{margin-top:50px}.w-80.svelte-19nd3yu img.svelte-19nd3yu{width:80% !important}@media(max-width: 768px){.w-80.svelte-19nd3yu img.svelte-19nd3yu{width:100% !important}}.text-center.svelte-19nd3yu.svelte-19nd3yu{text-align:center !important}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let data = {};
  let dataSession = new Object();
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        dataSession = JSON.parse(localStorage.getItem("userSession"));
        if (dataSession) {
          if (dataSession.id_user && (dataSession.type == "admin" || dataSession.type == "super")) {
            goto();
          } else if (dataSession.id_user && dataSession.id_driver) {
            goto(`/drivers/${dataSession.id_driver}`);
          }
        } else {
          goto();
        }
      }
    }
    $$rendered = `${validate_component(IonPage, "IonPage").$$render($$result, {}, {}, {
      default: () => {
        return `<ion-content class="login-content" padding><ion-row class="logo-row svelte-19nd3yu" data-svelte-h="svelte-1mi73el"><ion-col></ion-col> <ion-col class="w-80 text-center svelte-19nd3yu"><img src="/rutaflow.png" alt="Rutaflow" class="svelte-19nd3yu"></ion-col> <ion-col></ion-col></ion-row> <div class="login-box svelte-19nd3yu"><form><ion-row><ion-col><ion-list><ion-item>${validate_component(IonInput, "IonInput").$$render(
          $$result,
          {
            type: "text",
            placeholder: "Correo o Usuario",
            name: "email",
            required: true,
            value: data.email
          },
          {
            value: ($$value) => {
              data.email = $$value;
              $$settled = false;
            }
          },
          {}
        )}</ion-item> <ion-item>${validate_component(IonInput, "IonInput").$$render(
          $$result,
          {
            type: "password",
            placeholder: "Contraseña",
            name: "password",
            required: true,
            value: data.password
          },
          {
            value: ($$value) => {
              data.password = $$value;
              $$settled = false;
            }
          },
          {}
        )}</ion-item></ion-list></ion-col></ion-row> <ion-row data-svelte-h="svelte-19dro8s"><ion-col class="signup-col"><ion-button class="submit-btn svelte-19nd3yu" color="#2c83d3" expand="block" type="submit">Ingresar</ion-button></ion-col></ion-row></form></div></ion-content>`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
