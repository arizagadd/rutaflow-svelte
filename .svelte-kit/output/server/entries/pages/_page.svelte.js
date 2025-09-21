import { c as create_ssr_component, a as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import "@ionic/core";
import "../../chunks/authStore.js";
import { g as goto } from "../../chunks/client.js";
const IonInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "" } = $$props;
  let { type = "text" } = $$props;
  let { placeholder = "" } = $$props;
  let { value } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  return `<ion-input${add_attribute("type", type, 0)}${add_attribute("name", name, 0)}${add_attribute("placeholder", placeholder, 0)}${add_attribute("value", value, 0)}></ion-input>`;
});
const css = {
  code: ".submit-btn.svelte-dlpg8h.svelte-dlpg8h{background-color:#2c83d3 !important}.logo-row.svelte-dlpg8h.svelte-dlpg8h{margin-top:20px}.login-box.svelte-dlpg8h.svelte-dlpg8h{margin-top:50px}.w-80.svelte-dlpg8h img.svelte-dlpg8h{width:80% !important}@media(max-width: 768px){.w-80.svelte-dlpg8h img.svelte-dlpg8h{width:100% !important}}.text-center.svelte-dlpg8h.svelte-dlpg8h{text-align:center !important}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\r\\n    // Import the necessary components from Ionic\\r\\n    import IonInput from \\"../components/IonInput.svelte\\";\\r\\n    import { alertController } from \\"@ionic/core\\";\\r\\n    import IonPage from \\"ionic-svelte/components/IonPage.svelte\\";\\r\\n    import authStore from \\"../stores/authStore\\";\\r\\n    import { goto } from \\"$app/navigation\\";\\r\\n    import { onMount } from \\"svelte\\";\\r\\n    import { DATABASE_URL } from \\"../hooks\\";\\r\\n\\r\\n    /*Back URL*/\\r\\n    let back_url = DATABASE_URL;\\r\\n\\r\\n    let data = {};\\r\\n    let dataSession = new Object();\\r\\n\\r\\n    $: {\\r\\n        dataSession = JSON.parse(localStorage.getItem(\\"userSession\\"));\\r\\n        if (dataSession) {\\r\\n            if (\\r\\n                dataSession.id_user &&\\r\\n                (dataSession.type == \\"admin\\" || dataSession.type == \\"super\\")\\r\\n            ) {\\r\\n                goto(`/drivers/me`);\\r\\n            } else if (dataSession.id_user && dataSession.id_driver) {\\r\\n                goto(`/drivers/${dataSession.id_driver}`);\\r\\n            }\\r\\n        } else {\\r\\n            goto(\\"/\\");\\r\\n        }\\r\\n    }\\r\\n\\r\\n    // This will clear all localStorage when the page loads\\r\\n    onMount(() => {\\r\\n        localStorage.clear();\\r\\n    });\\r\\n\\r\\n    const handleSubmit = (e) => {\\r\\n        e.preventDefault();\\r\\n\\r\\n        const showAlert = async () => {\\r\\n            const alert = await alertController.create({\\r\\n                header: \\"Datos inválidos\\",\\r\\n                message:\\r\\n                    \\"El correo/teléfono o la contraseña son incorrectos, vuelva a intentar\\",\\r\\n                buttons: [\\r\\n                    {\\r\\n                        text: \\"Cerrar\\",\\r\\n                    },\\r\\n                ],\\r\\n            });\\r\\n\\r\\n            await alert.present();\\r\\n        };\\r\\n\\r\\n        const showAlertNoDriver = async () => {\\r\\n            const alert = await alertController.create({\\r\\n                header: \\"Sin perfil de operador\\",\\r\\n                message: \\"Su cuenta no cuenta con un perfil de operador creado\\",\\r\\n                buttons: [\\r\\n                    {\\r\\n                        text: \\"Cerrar\\",\\r\\n                    },\\r\\n                ],\\r\\n            });\\r\\n\\r\\n            await alert.present();\\r\\n        };\\r\\n\\r\\n        const requestData = new FormData();\\r\\n        requestData.append(\\"email\\", data.email);\\r\\n        requestData.append(\\"pass\\", data.password);\\r\\n        return fetch(`${back_url}api/admin/user/user_login.php`, {\\r\\n            method: \\"POST\\",\\r\\n            body: requestData,\\r\\n        })\\r\\n            .then((response) => response.json())\\r\\n            .then((data) => {\\r\\n                if (data.nodos.length) {\\r\\n                    const userData = data.nodos[0];\\r\\n                    localStorage.setItem(\\r\\n                        \\"userSession\\",\\r\\n                        JSON.stringify(userData)\\r\\n                    );\\r\\n                    authStore.set({\\r\\n                        resolved: true,\\r\\n                        id: userData.id_driver ? userData.id_driver : \\"me\\",\\r\\n                        user: {\\r\\n                            userData,\\r\\n                        },\\r\\n                    });\\r\\n\\r\\n                    if (userData.id_driver) {\\r\\n                        goto(`/drivers/${userData.id_driver}`);\\r\\n                    } else {\\r\\n                        goto(`/drivers/me`);\\r\\n                        showAlertNoDriver();\\r\\n                    }\\r\\n\\r\\n                    //redireccionar al index de drivers\\r\\n                } else {\\r\\n                    showAlert();\\r\\n                }\\r\\n            })\\r\\n            .catch((e) => {\\r\\n                showAlert();\\r\\n            });\\r\\n    };\\r\\n<\/script>\\r\\n\\r\\n<ion-app color-mode=\\"light\\">\\r\\n    <ion-content class=\\"login-content\\" padding>\\r\\n        <ion-row class=\\"logo-row\\">\\r\\n            <ion-col />\\r\\n            <ion-col class=\\"w-80 text-center\\">\\r\\n                <img src=\\"/rutaflow.png\\" alt=\\"Rutaflow\\" />\\r\\n            </ion-col>\\r\\n            <ion-col />\\r\\n        </ion-row>\\r\\n        <div class=\\"login-box\\">\\r\\n            <form on:submit={handleSubmit}>\\r\\n                <ion-row>\\r\\n                    <ion-col>\\r\\n                        <ion-list>\\r\\n                            <ion-item>\\r\\n                                <IonInput\\r\\n                                    bind:value={data.email}\\r\\n                                    type=\\"text\\"\\r\\n                                    placeholder=\\"Correo o Teléfono\\"\\r\\n                                    name=\\"email\\"\\r\\n                                    required\\r\\n                                />\\r\\n                            </ion-item>\\r\\n\\r\\n                            <ion-item>\\r\\n                                <IonInput\\r\\n                                    bind:value={data.password}\\r\\n                                    type=\\"password\\"\\r\\n                                    placeholder=\\"Contraseña\\"\\r\\n                                    name=\\"password\\"\\r\\n                                    required\\r\\n                                />\\r\\n                            </ion-item>\\r\\n                        </ion-list>\\r\\n                    </ion-col>\\r\\n                </ion-row>\\r\\n\\r\\n                <ion-row>\\r\\n                    <ion-col class=\\"signup-col\\">\\r\\n                        <ion-button\\r\\n                            class=\\"submit-btn\\"\\r\\n                            color=\\"#2c83d3\\"\\r\\n                            expand=\\"block\\"\\r\\n                            type=\\"submit\\">Ingresar</ion-button\\r\\n                        >\\r\\n                    </ion-col>\\r\\n                </ion-row>\\r\\n            </form>\\r\\n        </div>\\r\\n    </ion-content>\\r\\n</ion-app>\\r\\n\\r\\n<style>\\r\\n    .submit-btn {\\r\\n        background-color: #2c83d3 !important;\\r\\n    }\\r\\n    .logo-row {\\r\\n        margin-top: 20px;\\r\\n    }\\r\\n\\r\\n    .login-box {\\r\\n        margin-top: 50px;\\r\\n    }\\r\\n    .w-80 img {\\r\\n        width: 80% !important;\\r\\n    }\\r\\n    @media (max-width: 768px) {\\r\\n        .w-80 img {\\r\\n            width: 100% !important;\\r\\n        }\\r\\n    }\\r\\n    .text-center {\\r\\n        text-align: center !important;\\r\\n    }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAmKI,uCAAY,CACR,gBAAgB,CAAE,OAAO,CAAC,UAC9B,CACA,qCAAU,CACN,UAAU,CAAE,IAChB,CAEA,sCAAW,CACP,UAAU,CAAE,IAChB,CACA,mBAAK,CAAC,iBAAI,CACN,KAAK,CAAE,GAAG,CAAC,UACf,CACA,MAAO,YAAY,KAAK,CAAE,CACtB,mBAAK,CAAC,iBAAI,CACN,KAAK,CAAE,IAAI,CAAC,UAChB,CACJ,CACA,wCAAa,CACT,UAAU,CAAE,MAAM,CAAC,UACvB"}'
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
    $$rendered = `<ion-app color-mode="light"><ion-content class="login-content" padding><ion-row class="logo-row svelte-dlpg8h" data-svelte-h="svelte-xx8z9p"><ion-col></ion-col> <ion-col class="w-80 text-center svelte-dlpg8h"><img src="/rutaflow.png" alt="Rutaflow" class="svelte-dlpg8h"></ion-col> <ion-col></ion-col></ion-row> <div class="login-box svelte-dlpg8h"><form><ion-row><ion-col><ion-list><ion-item>${validate_component(IonInput, "IonInput").$$render(
      $$result,
      {
        type: "text",
        placeholder: "Correo o Teléfono",
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
    )}</ion-item></ion-list></ion-col></ion-row> <ion-row data-svelte-h="svelte-sdgh4c"><ion-col class="signup-col"><ion-button class="submit-btn svelte-dlpg8h" color="#2c83d3" expand="block" type="submit">Ingresar</ion-button></ion-col></ion-row></form></div></ion-content> </ion-app>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
