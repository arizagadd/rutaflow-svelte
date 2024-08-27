import { c as create_ssr_component, d as subscribe, v as validate_component, e as escape, a as add_attribute, f as each } from './ssr-BvR1n3wf.js';
import { p as page, I as IonPage } from './IonPage-D5oPt8FW.js';
import { alertController } from '@ionic/core';
import { logOut } from 'ionicons/icons/index.mjs';
import { g as goto } from './client-DpIAX_q0.js';
import './authStore-CNL91nMo.js';
import './exports-BGi7-Rnc.js';

const css = {
  code: ".route-color.svelte-1xh3ip{width:100%;height:100%;border-radius:50%;display:flex;justify-content:center}.route-symbol.svelte-1xh3ip{text-align:center;align-self:center;font-size:30px}h3.svelte-1xh3ip{font-size:13px}.text-muted.svelte-1xh3ip{color:#8e8e8e}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    export let driverId;\\n    import {page} from '$app/stores';\\n    import { alertController } from '@ionic/core';\\n    //import {ready, url, goto, params} from '@sveltech/routify';\\n    import {logOut} from \\"ionicons/icons\\"; \\n    import { goto } from '$app/navigation';\\n    import { onMount } from 'svelte';\\n    import IonPage from 'ionic-svelte/components/IonPage.svelte';\\n    //import moment from 'moment';\\n    import authStore from '../../../stores/authStore';\\n    let routes = [];\\n    let events = new Object();\\n    let hasPendingRoutes = false;\\n    let formattedDate = new Date();\\n    let flag = false;\\n    let dataSession = new Object();\\n    let refresher;\\n\\n    const refresh = async () => {\\n       await loadRoutes(driverId);\\n       refresher.complete();\\n    }\\n\\n    onMount( async () => {\\n\\t\\tawait refresh();\\n\\t});\\n\\n    $: {({driverId} = $page.params);\\n        const storedSession = localStorage.getItem('userSession');\\n        dataSession = JSON.parse(storedSession);\\n        if(dataSession){\\n            if(driverId=='me' && dataSession.id_user){\\n                if(dataSession.type=='admin' || dataSession.type == 'super'){\\n                    goto(\`/drivers/me\`);\\n                    loadRoutes(driverId);\\n                    flag = true;\\n                }else{\\n                    showAlert('Usuario no autorizado','Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte');\\n                    goto('/');\\n                }\\n            }else if(dataSession && driverId){\\n                goto(\`/drivers/\${dataSession.id_driver}\`);\\n                loadRoutes(driverId);\\n            }\\n        }else{\\n            showAlert('Sesión cerrada','Será redireccionado para volver a ingresar');\\n            goto('/');\\n        }};\\n\\n    //const encodeEmoji = (emoji) => unescape(encodeURIComponent(emoji));\\n\\n    const decodeEmoji = (text) => {\\n      try {\\n        return decodeURIComponent(escape(text));\\n      } catch (e) {\\n        // return unescape(text);\\n      }\\n    }\\n\\n    function loadRoutes(driverId) {\\n        var actualDate = getActualFormattedDate();\\n        const requestData = new FormData();\\n        requestData.append('actual_date', actualDate);\\n        fetch(\`https://app.rutaflow.com/api/admin/report/seguimiento_list.php\`, {\\n                method: 'POST',\\n                body: requestData,\\n            })\\n            .then(response => response.json())\\n            .then(data => {\\n                const seguimiento_info = data;\\n                routes = seguimiento_info.data.seguimiento_list;\\n                events = seguimiento_info.data.event_list;\\n            })\\n            .catch(error => {\\n                console.error('Error fetching data:', error);\\n            });\\n    }\\n\\n    function openRoute(routeId,status) {\\n        if(status==\\"checklist-pending\\"){\\n            showAlert('Checklist Pendiente de Autorizar','La lista de requerimientos de ruta está en revisión, podrás inciar la ruta una vez autorizado el checklist.');\\n        }else{\\n            goto(\`/drivers/\${driverId}/routes/\${routeId}\`);\\n        }\\n    }\\n\\n    function compareDates(start_date) {\\n        var today = getActualFormattedDate();\\n        // Extract the date part from route.start_date and set time to midnight\\n        const routeDateParts = start_date.split(' ')[0];\\n        //const routeDate = new Date(\`\${routeDateParts[2]}-\${routeDateParts[1]}-\${routeDateParts[0]}T00:00:00\`);\\n\\n        // Compare only the date parts\\n        return today === routeDateParts;\\n    }\\n\\n    function changePendingState(status){\\n        status==\\"true\\" ? hasPendingRoutes = true: hasPendingRoutes = false;\\n        return \\"\\";\\n    }\\n\\n    const capitalizeFirstLetter = (str) => {\\n        return str.charAt(0).toUpperCase() + str.slice(1);\\n    };\\n\\n    function getDeliveryColor(status) {\\n        let color = '#ffffff';\\n\\n        if (status === 'pending') {\\n            color = '#FAD733';\\n        }else if (status === 'completed') {\\n            color = '#27C24C';\\n        }else if (status == 'enroute'){\\n            color = '#3BBAC2';\\n        }else if (status == 'paused'){\\n            color = '#949DB9';\\n        }else if (status == 'cancelled'){\\n            color = '#F05050';\\n        }else if (status == 'checklist'){\\n            color = \\"#F6A833\\";\\n        }else if (status == 'checklist-pending'){\\n            color = \\"#E98C00\\";\\n        }\\n\\n        return color;\\n    }\\n\\n    function setTitleStatus(status) {\\n        let title_status = '';\\n\\n        if (status === 'pending') {\\n            title_status = 'Pendiente';\\n        }else if (status === 'completed') {\\n            title_status = 'Completado';\\n        }else if (status == 'enroute'){\\n            title_status = 'En ruta';\\n        }else if (status == 'paused'){\\n            title_status = 'Pausado';\\n        }else if (status == 'cancelled'){\\n            title_status = 'Cancelado';\\n        }else if (status == 'checklist'){\\n            title_status = \\"En checklist\\"\\n        }else if (status == 'checklist-pending'){\\n            title_status = \\"Pendiente de aprobar checklist\\"\\n        }\\n\\n        return title_status;\\n    }\\n\\n    function getContrast(hexColor) {\\n\\n        // If a leading # is provided, remove it\\n        if (hexColor.slice(0, 1) === '#') {\\n            hexColor = hexColor.slice(1);\\n        }\\n\\n        // If a three-character hexcode, make six-character\\n        if (hexColor.length === 3) {\\n            hexColor = hexColor.split('').map(function (hex) {\\n                return hex + hex;\\n            }).join('');\\n        }\\n\\n        // Convert to RGB value\\n        const r = parseInt(hexColor.substr(0, 2), 16);\\n        const g = parseInt(hexColor.substr(2, 2), 16);\\n        const b = parseInt(hexColor.substr(4, 2), 16);\\n\\n        // Get YIQ ratio\\n        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;\\n\\n        // Check contrast\\n        return (yiq >= 128) ? '#414040' : '#fff';\\n\\n    }\\n\\n    const showAlert = async (customHeader, customMessage) => {\\n        const alert = await alertController.create({\\n            header: customHeader || 'Error', // Use customHeader or default value\\n            message: customMessage || 'Vuelva a intentar', // Use customMessage or default value\\n            buttons: [\\n                {\\n                    text: 'Cerrar'\\n                }\\n            ]\\n        });\\n\\n        await alert.present();\\n    };\\n\\n    function getActualFormattedDate(){\\n        // Get the current date\\n        var today = new Date();\\n\\n        // Get the day of the month\\n        var dd = today.getDate();\\n\\n        // Get the month (adding 1 because months are zero-based)\\n        var mm = today.getMonth() + 1;\\n\\n        // Get the year\\n        var yyyy = today.getFullYear();\\n\\n        // Add leading zero if the day is less than 10\\n        if (dd < 10) {\\n            dd = '0' + dd;\\n        } \\n\\n        // Add leading zero if the month is less than 10\\n        if (mm < 10) {\\n            mm = '0' + mm;\\n        } \\n\\n        // Format the date as mm-dd-yyyy and log it\\n        today = yyyy + '-' + mm + '-' + dd;\\n\\n        return today;\\n    }\\n\\n    const logout = () => {\\n        // Redirect to login page or homepage\\n        goto('/');\\n        flag = false;\\n        // Remove user session from localStorage\\n        localStorage.removeItem('userSession');\\n    }\\n\\n\\n<\/script>\\n\\n<style>\\n    .route-color {\\n        width: 100%;\\n        height: 100%;\\n        border-radius: 50%;\\n        display: flex;\\n        justify-content: center;\\n    }\\n\\n    .route-symbol {\\n        text-align: center;\\n        align-self: center;\\n        font-size: 30px;\\n    }\\n\\n    .total,\\n    .time {\\n        color: #86888f;\\n        font-size: 14px;\\n    }\\n\\n    .secret {\\n        color:#c05cea;\\n    }\\n    .fruti {\\n        color: #338be6\\n    }\\n    .berry {\\n        color: #e82866\\n    }\\n    .big {\\n        color: #e68633\\n    }\\n    h3 {\\n        font-size: 13px;\\n    }\\n    .text-muted{\\n        color: #8e8e8e;\\n    }\\n    .mr-10{\\n        margin-right:10px;\\n    }\\n</style>\\n\\n<svelte:head>\\n    <title>Rutas - Rutaflow</title>\\n</svelte:head>\\n{#if dataSession}\\n    <IonPage>\\n        <ion-header translucent>\\n            <ion-toolbar>\\n                <ion-buttons slot=\\"secondary\\">\\n                <ion-button>{dataSession.name}</ion-button>\\n                </ion-buttons>\\n        \\n                <ion-title>Rutas del día</ion-title>\\n        \\n                <ion-buttons slot=\\"primary\\">\\n                <ion-button title=\\"Salir\\" alt=\\"Salir\\" on:click={logout}><ion-icon icon={logOut}></ion-icon></ion-button>\\n                </ion-buttons>\\n            </ion-toolbar>\\n        </ion-header>\\n        \\n        <ion-content>\\n            <ion-refresher slot=\\"fixed\\" bind:this={refresher} on:ionRefresh={refresh}>\\n                <ion-refresher-content pulling-icon=\\"arrow-dropdown\\"\\n                                    pulling-text=\\"Jale para actualizar\\"\\n                                    refreshing-spinner=\\"circles\\"\\n                                    refreshing-text=\\"Actualizando...\\"></ion-refresher-content>\\n            </ion-refresher>\\n            <ion-list>\\n                {#if driverId=='me' && flag}\\n                    {#each routes as route (route.id_route)}\\n                        {#if compareDates(route.date_start)}\\n                            {changePendingState(\\"true\\")}\\n                            <ion-item button on:click={openRoute(route.id_route,route.status)}>\\n                                <ion-avatar slot=\\"start\\">\\n                                    <div class=\\"route-color\\" style=\\"background-color:{getDeliveryColor(route.status)};color: {getContrast(getDeliveryColor(route.status))}\\" title=\\"{setTitleStatus(route.status)}\\">\\n                                        <div class=\\"route-symbol\\" style=\\"\\">\\n                                            {capitalizeFirstLetter(route.name.charAt(0))}\\n                                        </div>\\n                                    </div>\\n                                </ion-avatar>\\n                                <ion-label>\\n                                    <h2>{route.name}</h2>\\n                                    <h3 class=\\"text-muted\\">Inicio: {route.date_start}</h3>\\n                                </ion-label>\\n                                <div slot=\\"end\\"></div>\\n                            </ion-item>\\n                        {:else}\\n                            {changePendingState(\\"false\\")}\\n                        {/if}\\n                    {/each}\\n                {:else}\\n                    <!--Filter by driverId & date-->\\n                    {#each routes.filter(route => route.id_driver === driverId) as route (route.id_route)}\\n                        {#if compareDates(route.date_start)}\\n                            {changePendingState(\\"true\\")}\\n                            {#if route.status!='completed' && route.status != 'cancelled'}\\n                                <ion-item button on:click={openRoute(route.id_route,route.status)}>\\n                                    <ion-avatar slot=\\"start\\">\\n                                        <div class=\\"route-color\\" style=\\"background-color:{getDeliveryColor(route.status)};color: {getContrast(getDeliveryColor(route.status))}\\" title=\\"{setTitleStatus(route.status)}\\">\\n                                            <div class=\\"route-symbol\\" style=\\"\\">\\n                                                {capitalizeFirstLetter(route.name.charAt(0))}\\n                                            </div>\\n                                        </div>\\n                                    </ion-avatar>\\n                                    <ion-label>\\n                                        <h2>{route.name}</h2>\\n                                        <h3 class=\\"text-muted\\">Inicio: {route.date_start}</h3>\\n                                    </ion-label>\\n                                    <div slot=\\"end\\"></div>\\n                                </ion-item>\\n                            {:else}\\n                                {changePendingState(\\"false\\")}\\n                            {/if}\\n                        {:else}\\n                            {changePendingState(\\"false\\")}\\n                        {/if}\\n                    {/each}\\n                {/if}\\n                {#if !hasPendingRoutes}\\n                    <ion-grid class=\\"ion-text-center h-full\\">\\n                        <ion-row class=\\"h-full items-center\\">\\n                            <ion-col class=\\"text-center\\">\\n                                <h2 class=\\"text-3xl text-muted mb-4\\">No hay rutas pendientes para hoy</h2>\\n                                <p class=\\"text-muted\\">Espere indicaciones de su supervisor</p>\\n                            </ion-col>\\n                        </ion-row>\\n                    </ion-grid>\\n                {/if}\\n            </ion-list>\\n        </ion-content>\\n    </IonPage>\\n{/if}\\n"],"names":[],"mappings":"AAwOI,0BAAa,CACT,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MACrB,CAEA,2BAAc,CACV,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IACf,CAoBA,gBAAG,CACC,SAAS,CAAE,IACf,CACA,yBAAW,CACP,KAAK,CAAE,OACX"}`
};
function compareDates(start_date) {
  var today = getActualFormattedDate();
  const routeDateParts = start_date.split(" ")[0];
  return today === routeDateParts;
}
function getDeliveryColor(status) {
  let color = "#ffffff";
  if (status === "pending") {
    color = "#FAD733";
  } else if (status === "completed") {
    color = "#27C24C";
  } else if (status == "enroute") {
    color = "#3BBAC2";
  } else if (status == "paused") {
    color = "#949DB9";
  } else if (status == "cancelled") {
    color = "#F05050";
  } else if (status == "checklist") {
    color = "#F6A833";
  } else if (status == "checklist-pending") {
    color = "#E98C00";
  }
  return color;
}
function setTitleStatus(status) {
  let title_status = "";
  if (status === "pending") {
    title_status = "Pendiente";
  } else if (status === "completed") {
    title_status = "Completado";
  } else if (status == "enroute") {
    title_status = "En ruta";
  } else if (status == "paused") {
    title_status = "Pausado";
  } else if (status == "cancelled") {
    title_status = "Cancelado";
  } else if (status == "checklist") {
    title_status = "En checklist";
  } else if (status == "checklist-pending") {
    title_status = "Pendiente de aprobar checklist";
  }
  return title_status;
}
function getContrast(hexColor) {
  if (hexColor.slice(0, 1) === "#") {
    hexColor = hexColor.slice(1);
  }
  if (hexColor.length === 3) {
    hexColor = hexColor.split("").map(function(hex) {
      return hex + hex;
    }).join("");
  }
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1e3;
  return yiq >= 128 ? "#414040" : "#fff";
}
function getActualFormattedDate() {
  var today = /* @__PURE__ */ new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { driverId } = $$props;
  let routes = [];
  let hasPendingRoutes = false;
  let flag = false;
  let dataSession = new Object();
  let refresher;
  function loadRoutes(driverId2) {
    var actualDate = getActualFormattedDate();
    const requestData = new FormData();
    requestData.append("actual_date", actualDate);
    fetch(`https://app.rutaflow.com/api/admin/report/seguimiento_list.php`, { method: "POST", body: requestData }).then((response) => response.json()).then((data) => {
      const seguimiento_info = data;
      routes = seguimiento_info.data.seguimiento_list;
      seguimiento_info.data.event_list;
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }
  function changePendingState(status) {
    status == "true" ? hasPendingRoutes = true : hasPendingRoutes = false;
    return "";
  }
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const showAlert = async (customHeader, customMessage) => {
    const alert = await alertController.create({
      header: customHeader || "Error",
      // Use customHeader or default value
      message: customMessage || "Vuelva a intentar",
      // Use customMessage or default value
      buttons: [{ text: "Cerrar" }]
    });
    await alert.present();
  };
  if ($$props.driverId === void 0 && $$bindings.driverId && driverId !== void 0) $$bindings.driverId(driverId);
  $$result.css.add(css);
  {
    {
      ({ driverId } = $page.params);
      const storedSession = localStorage.getItem("userSession");
      dataSession = JSON.parse(storedSession);
      if (dataSession) {
        if (driverId == "me" && dataSession.id_user) {
          if (dataSession.type == "admin" || dataSession.type == "super") {
            goto();
            loadRoutes();
            flag = true;
          } else {
            showAlert("Usuario no autorizado", "Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte");
            goto();
          }
        } else if (dataSession && driverId) {
          goto(`/drivers/${dataSession.id_driver}`);
          loadRoutes();
        }
      } else {
        showAlert("Sesión cerrada", "Será redireccionado para volver a ingresar");
        goto();
      }
    }
  }
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-qavk4j_START -->${$$result.title = `<title>Rutas - Rutaflow</title>`, ""}<!-- HEAD_svelte-qavk4j_END -->`, ""} ${dataSession ? `${validate_component(IonPage, "IonPage").$$render($$result, {}, {}, {
    default: () => {
      return `<ion-header translucent><ion-toolbar><ion-buttons slot="secondary"><ion-button>${escape(dataSession.name)}</ion-button></ion-buttons> <ion-title data-svelte-h="svelte-82wrsm">Rutas del día</ion-title> <ion-buttons slot="primary"><ion-button title="Salir" alt="Salir" data-svelte-h="svelte-1itonhq"><ion-icon${add_attribute("icon", logOut, 0)}></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header> <ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1wkherr"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Jale para actualizar" refreshing-spinner="circles" refreshing-text="Actualizando..."></ion-refresher-content></ion-refresher> <ion-list>${driverId == "me" && flag ? `${each(routes, (route) => {
        return `${compareDates(route.date_start) ? `${escape(changePendingState("true"))} <ion-item button><ion-avatar slot="start"><div class="route-color svelte-1xh3ip" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color: " + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-1xh3ip" style="">${escape(capitalizeFirstLetter(route.name.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name)}</h2> <h3 class="text-muted svelte-1xh3ip">Inicio: ${escape(route.date_start)}</h3></ion-label> <div slot="end"></div> </ion-item>` : `${escape(changePendingState("false"))}`}`;
      })}` : ` ${each(routes.filter((route) => route.id_driver === driverId), (route) => {
        return `${compareDates(route.date_start) ? `${escape(changePendingState("true"))} ${route.status != "completed" && route.status != "cancelled" ? `<ion-item button><ion-avatar slot="start"><div class="route-color svelte-1xh3ip" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color: " + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-1xh3ip" style="">${escape(capitalizeFirstLetter(route.name.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name)}</h2> <h3 class="text-muted svelte-1xh3ip">Inicio: ${escape(route.date_start)}</h3></ion-label> <div slot="end"></div> </ion-item>` : `${escape(changePendingState("false"))}`}` : `${escape(changePendingState("false"))}`}`;
      })}`} ${!hasPendingRoutes ? `<ion-grid class="ion-text-center h-full" data-svelte-h="svelte-3d9uou"><ion-row class="h-full items-center"><ion-col class="text-center"><h2 class="text-3xl text-muted mb-4 svelte-1xh3ip">No hay rutas pendientes para hoy</h2> <p class="text-muted svelte-1xh3ip">Espere indicaciones de su supervisor</p></ion-col></ion-row></ion-grid>` : ``}</ion-list></ion-content>`;
    }
  })}` : ``}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-gO4uXvCS.js.map
