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
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  return `<ion-input${add_attribute("type", type, 0)}${add_attribute("name", name, 0)}${add_attribute("placeholder", placeholder, 0)}${add_attribute("value", value, 0)}></ion-input>`;
});
const css = {
  code: ".submit-btn.svelte-19nd3yu.svelte-19nd3yu{background-color:#2c83d3!important}.logo-row.svelte-19nd3yu.svelte-19nd3yu{margin-top:20px}.login-box.svelte-19nd3yu.svelte-19nd3yu{margin-top:50px}.w-80.svelte-19nd3yu img.svelte-19nd3yu{width:80% !important}@media(max-width: 768px){.w-80.svelte-19nd3yu img.svelte-19nd3yu{width:100% !important}}.text-center.svelte-19nd3yu.svelte-19nd3yu{text-align:center !important}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    // Import the necessary components from Ionic\\n    import IonInput from \\"../components/IonInput.svelte\\";\\n\\timport { alertController } from '@ionic/core';\\n    import IonPage from 'ionic-svelte/components/IonPage.svelte';\\n    import authStore from \\"../stores/authStore\\";\\n\\timport { goto } from '$app/navigation';\\n\\n    let data = {};\\n    let dataSession = new Object();\\n\\n    $: { dataSession = JSON.parse(localStorage.getItem('userSession'));\\n        if(dataSession){\\n            if(dataSession.id_user && (dataSession.type==\\"admin\\" || dataSession.type==\\"super\\")){\\n                goto(\`/drivers/me\`);\\n            }else if(dataSession.id_user && dataSession.id_driver){\\n                goto(\`/drivers/\${dataSession.id_driver}\`);\\n            }\\n        }else{\\n            goto('/');\\n        }\\n    }\\n\\n    const handleSubmit = (e) => {\\n        e.preventDefault();\\n        console.log('submit', data);\\n\\n\\t\\tconst showAlert = async () => {\\n\\t\\t\\tconst alert = await alertController.create({\\n\\t\\t\\t\\theader: 'Datos inválidos',\\n\\t\\t\\t\\tmessage: 'El correo o la contraseña son incorrectos, vuelva a intentar',\\n\\t\\t\\t\\tbuttons: [\\n\\t\\t\\t\\t{\\n\\t\\t\\t\\t\\ttext: 'Cerrar'\\n\\t\\t\\t\\t}\\n\\t\\t\\t\\t]\\n\\t\\t\\t});\\n\\t\\t\\n\\t\\t\\tawait alert.present();\\n\\t\\t};\\n\\n        const showAlertNoDriver = async () => {\\n\\t\\t\\tconst alert = await alertController.create({\\n\\t\\t\\t\\theader: 'Sin perfil de operador',\\n\\t\\t\\t\\tmessage: 'Su cuenta no cuenta con un perfil de operador creado',\\n\\t\\t\\t\\tbuttons: [\\n\\t\\t\\t\\t{\\n\\t\\t\\t\\t\\ttext: 'Cerrar'\\n\\t\\t\\t\\t}\\n\\t\\t\\t\\t]\\n\\t\\t\\t});\\n\\t\\t\\n\\t\\t\\tawait alert.present();\\n\\t\\t};\\n\\n\\t\\tconst requestData = new FormData();\\n        requestData.append('email', data.email);\\n\\t\\trequestData.append('pass', data.password);\\n        return fetch(\`https://app.rutaflow.com/api/admin/user/user_login.php\`,{\\n\\t\\t\\t\\t\\tmethod: 'POST',\\n\\t\\t\\t\\t\\tbody: requestData,\\n                })\\n                .then(response => response.json())\\n                .then(data => {\\n                    if (data.nodos.length) {\\n                        const userData = data.nodos[0];\\n                        localStorage.setItem('userSession', JSON.stringify(userData));\\n                        authStore.set({\\n                            resolved: true,\\n                            id: userData.id_driver?userData.id_driver:'me',\\n                            user: {\\n                                userData\\n                            }\\n                        });\\n                        console.log(userData);\\n                        if(userData.id_driver){\\n                            goto(\`/drivers/\${userData.id_driver}\`);\\n                        }else{\\n                            goto(\`/drivers/me\`);\\n                            showAlertNoDriver();\\n                        }\\n                        \\n\\t\\t\\t\\t\\t\\t//redireccionar al index de drivers\\n                    } else {\\n                        showAlert();\\n                    }\\n                })\\n                .catch(e => {\\n                    showAlert();\\n                });\\n\\n\\n    }\\n<\/script>\\n\\n<style>\\n    .submit-btn{\\n        background-color: #2c83d3!important;\\n    }\\n    .logo-row {\\n        margin-top: 20px;\\n    }\\n\\n    .login-box {\\n        margin-top: 50px;\\n    }\\n\\t.w-80 img{\\n\\t\\twidth: 80% !important;\\n\\t}\\n    @media (max-width: 768px) {\\n        .w-80 img{\\n\\t\\twidth: 100% !important;\\n\\t}\\n    }\\n\\t.text-center{\\n\\t\\ttext-align: center !important;\\n\\t}\\n</style>\\n\\n<IonPage>\\n    <ion-content class=\\"login-content\\" padding>\\n        <ion-row class=\\"logo-row\\">\\n            <ion-col></ion-col>\\n            <ion-col class=\\"w-80 text-center\\">\\n                <img src=\\"/rutaflow.png\\" alt=\\"Rutaflow\\"/>\\n            </ion-col>\\n            <ion-col></ion-col>\\n        </ion-row>\\n        <div class=\\"login-box\\">\\n            <form on:submit={handleSubmit}>\\n                <ion-row>\\n                    <ion-col>\\n                        <ion-list>\\n\\n                            <ion-item>\\n                                <IonInput bind:value={data.email} type=\\"text\\" placeholder=\\"Correo o Usuario\\" name=\\"email\\"\\n                                        required></IonInput>\\n                            </ion-item>\\n\\n                            <ion-item>\\n                                <IonInput bind:value={data.password} type=\\"password\\" placeholder=\\"Contraseña\\" name=\\"password\\"\\n                                        required></IonInput>\\n                            </ion-item>\\n\\n                        </ion-list>\\n                    </ion-col>\\n                </ion-row>\\n\\n                <ion-row>\\n                    <ion-col class=\\"signup-col\\">\\n                        <ion-button class=\\"submit-btn\\" color=\\"#2c83d3\\" expand=\\"block\\" type=\\"submit\\">Ingresar</ion-button>\\n                    </ion-col>\\n                </ion-row>\\n\\n            </form>\\n        </div>\\n    </ion-content>\\n</IonPage>\\n"],"names":[],"mappings":"AAgGI,yCAAW,CACP,gBAAgB,CAAE,OAAO,UAC7B,CACA,uCAAU,CACN,UAAU,CAAE,IAChB,CAEA,wCAAW,CACP,UAAU,CAAE,IAChB,CACH,oBAAK,CAAC,kBAAG,CACR,KAAK,CAAE,GAAG,CAAC,UACZ,CACG,MAAO,YAAY,KAAK,CAAE,CACtB,oBAAK,CAAC,kBAAG,CACf,KAAK,CAAE,IAAI,CAAC,UACb,CACG,CACH,0CAAY,CACX,UAAU,CAAE,MAAM,CAAC,UACpB"}`
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
