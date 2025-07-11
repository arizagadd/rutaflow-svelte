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
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    // Import the necessary components from Ionic\\n    import IonInput from \\"../components/IonInput.svelte\\";\\n    import { alertController } from \\"@ionic/core\\";\\n    import IonPage from \\"ionic-svelte/components/IonPage.svelte\\";\\n    import authStore from \\"../stores/authStore\\";\\n    import { goto } from \\"$app/navigation\\";\\n    import { onMount } from \\"svelte\\";\\n    import { DATABASE_URL } from \\"../hooks\\";\\n\\n    /*Back URL*/\\n    let back_url = DATABASE_URL;\\n\\n    let data = {};\\n    let dataSession = new Object();\\n\\n    $: {\\n        dataSession = JSON.parse(localStorage.getItem(\\"userSession\\"));\\n        if (dataSession) {\\n            if (\\n                dataSession.id_user &&\\n                (dataSession.type == \\"admin\\" || dataSession.type == \\"super\\")\\n            ) {\\n                goto(`/drivers/me`);\\n            } else if (dataSession.id_user && dataSession.id_driver) {\\n                goto(`/drivers/${dataSession.id_driver}`);\\n            }\\n        } else {\\n            goto(\\"/\\");\\n        }\\n    }\\n\\n    // This will clear all localStorage when the page loads\\n    onMount(() => {\\n        localStorage.clear();\\n    });\\n\\n    const handleSubmit = (e) => {\\n        e.preventDefault();\\n\\n        const showAlert = async () => {\\n            const alert = await alertController.create({\\n                header: \\"Datos inválidos\\",\\n                message:\\n                    \\"El correo/teléfono o la contraseña son incorrectos, vuelva a intentar\\",\\n                buttons: [\\n                    {\\n                        text: \\"Cerrar\\",\\n                    },\\n                ],\\n            });\\n\\n            await alert.present();\\n        };\\n\\n        const showAlertNoDriver = async () => {\\n            const alert = await alertController.create({\\n                header: \\"Sin perfil de operador\\",\\n                message: \\"Su cuenta no cuenta con un perfil de operador creado\\",\\n                buttons: [\\n                    {\\n                        text: \\"Cerrar\\",\\n                    },\\n                ],\\n            });\\n\\n            await alert.present();\\n        };\\n\\n        const requestData = new FormData();\\n        requestData.append(\\"email\\", data.email);\\n        requestData.append(\\"pass\\", data.password);\\n        return fetch(`${back_url}api/admin/user/user_login.php`, {\\n            method: \\"POST\\",\\n            body: requestData,\\n        })\\n            .then((response) => response.json())\\n            .then((data) => {\\n                if (data.nodos.length) {\\n                    const userData = data.nodos[0];\\n                    localStorage.setItem(\\n                        \\"userSession\\",\\n                        JSON.stringify(userData)\\n                    );\\n                    authStore.set({\\n                        resolved: true,\\n                        id: userData.id_driver ? userData.id_driver : \\"me\\",\\n                        user: {\\n                            userData,\\n                        },\\n                    });\\n\\n                    if (userData.id_driver) {\\n                        goto(`/drivers/${userData.id_driver}`);\\n                    } else {\\n                        goto(`/drivers/me`);\\n                        showAlertNoDriver();\\n                    }\\n\\n                    //redireccionar al index de drivers\\n                } else {\\n                    showAlert();\\n                }\\n            })\\n            .catch((e) => {\\n                showAlert();\\n            });\\n    };\\n<\/script>\\n\\n<ion-app color-mode=\\"light\\">\\n    <ion-content class=\\"login-content\\" padding>\\n        <ion-row class=\\"logo-row\\">\\n            <ion-col />\\n            <ion-col class=\\"w-80 text-center\\">\\n                <img src=\\"/rutaflow.png\\" alt=\\"Rutaflow\\" />\\n            </ion-col>\\n            <ion-col />\\n        </ion-row>\\n        <div class=\\"login-box\\">\\n            <form on:submit={handleSubmit}>\\n                <ion-row>\\n                    <ion-col>\\n                        <ion-list>\\n                            <ion-item>\\n                                <IonInput\\n                                    bind:value={data.email}\\n                                    type=\\"text\\"\\n                                    placeholder=\\"Correo o Teléfono\\"\\n                                    name=\\"email\\"\\n                                    required\\n                                />\\n                            </ion-item>\\n\\n                            <ion-item>\\n                                <IonInput\\n                                    bind:value={data.password}\\n                                    type=\\"password\\"\\n                                    placeholder=\\"Contraseña\\"\\n                                    name=\\"password\\"\\n                                    required\\n                                />\\n                            </ion-item>\\n                        </ion-list>\\n                    </ion-col>\\n                </ion-row>\\n\\n                <ion-row>\\n                    <ion-col class=\\"signup-col\\">\\n                        <ion-button\\n                            class=\\"submit-btn\\"\\n                            color=\\"#2c83d3\\"\\n                            expand=\\"block\\"\\n                            type=\\"submit\\">Ingresar</ion-button\\n                        >\\n                    </ion-col>\\n                </ion-row>\\n            </form>\\n        </div>\\n    </ion-content>\\n</ion-app>\\n\\n<style>\\n    .submit-btn {\\n        background-color: #2c83d3 !important;\\n    }\\n    .logo-row {\\n        margin-top: 20px;\\n    }\\n\\n    .login-box {\\n        margin-top: 50px;\\n    }\\n    .w-80 img {\\n        width: 80% !important;\\n    }\\n    @media (max-width: 768px) {\\n        .w-80 img {\\n            width: 100% !important;\\n        }\\n    }\\n    .text-center {\\n        text-align: center !important;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAmKI,uCAAY,CACR,gBAAgB,CAAE,OAAO,CAAC,UAC9B,CACA,qCAAU,CACN,UAAU,CAAE,IAChB,CAEA,sCAAW,CACP,UAAU,CAAE,IAChB,CACA,mBAAK,CAAC,iBAAI,CACN,KAAK,CAAE,GAAG,CAAC,UACf,CACA,MAAO,YAAY,KAAK,CAAE,CACtB,mBAAK,CAAC,iBAAI,CACN,KAAK,CAAE,IAAI,CAAC,UAChB,CACJ,CACA,wCAAa,CACT,UAAU,CAAE,MAAM,CAAC,UACvB"}'
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
