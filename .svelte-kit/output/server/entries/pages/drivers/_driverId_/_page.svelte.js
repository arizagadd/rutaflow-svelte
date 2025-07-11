import { c as create_ssr_component, d as subscribe, v as validate_component, a as add_attribute, e as escape, f as each } from "../../../../chunks/ssr.js";
import { p as page, g as getJson, I as IonPage } from "../../../../chunks/index2.js";
import { alertController } from "@ionic/core";
import { logOut } from "ionicons/icons/index.mjs";
import { g as goto } from "../../../../chunks/client.js";
import { DATABASE_URL } from "../../../../chunks/hooks.js";
const css = {
  code: ".name-btn.svelte-13map4f{--max-width:5rem;width:5rem}.name-span.svelte-13map4f{display:block;--max-width:100%;overflow:hidden;text-overflow:ellipsis;--white-space:nowrap;--text-align:center}.route-color.svelte-13map4f{width:100%;height:100%;border-radius:50%;display:flex;justify-content:center}.route-symbol.svelte-13map4f{text-align:center;align-self:center;font-size:30px}h3.svelte-13map4f{font-size:13px}.text-muted.svelte-13map4f{color:#8e8e8e}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    export let driverId;\\n    import { page } from \\"$app/stores\\";\\n    import { alertController } from \\"@ionic/core\\";\\n    import { logOut } from \\"ionicons/icons\\";\\n    import { goto } from \\"$app/navigation\\";\\n    import IonPage from \\"ionic-svelte/components/IonPage.svelte\\";\\n    import { DATABASE_URL } from \\"../../../hooks\\";\\n    import { getJson } from \\"$lib\\";\\n\\n    /*Back URL*/\\n    let back_url = DATABASE_URL;\\n\\n    let routes = [];\\n    let events = [];\\n\\n    let filteredRoutes = [];\\n    let pendingRoutes = [];\\n    let hasPendingRoutes = false;\\n    let flag = false;\\n    let dataSession = new Object();\\n    let refresher;\\n    let selectedFilter = \\"routes-of-day\\";\\n\\n    const refresh = async () => {\\n        await loadRoutes();\\n        refresher.complete();\\n    };\\n\\n    $: {\\n        ({ driverId } = $page.params);\\n        dataSession = JSON.parse(localStorage.getItem(\\"userSession\\"));\\n        if (dataSession) {\\n            if (driverId == \\"me\\" && dataSession.id_user) {\\n                if (\\n                    dataSession.type == \\"admin\\" ||\\n                    dataSession.type == \\"super\\"\\n                ) {\\n                    goto(`/drivers/me`);\\n                    loadRoutes();\\n                    flag = true;\\n                } else {\\n                    showAlert(\\n                        \\"Usuario no autorizado\\",\\n                        \\"Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte\\"\\n                    );\\n                    goto(\\"/\\");\\n                }\\n            } else if (dataSession && driverId) {\\n                goto(`/drivers/${dataSession.id_driver}`);\\n                loadRoutes();\\n            }\\n        } else {\\n            showAlert(\\n                \\"Sesión cerrada\\",\\n                \\"Será redireccionado para volver a ingresar\\"\\n            );\\n            goto(\\"/\\");\\n        }\\n    }\\n\\n    function loadRoutes() {\\n        const lv = {\\n            id_enterprise: dataSession.id_enterprise || \\"null\\",\\n            id_user_over: dataSession.id_user,\\n            token: dataSession.token,\\n        };\\n\\n        const filterVal = selectedFilter?.value || selectedFilter;\\n        const today = getTodayDate();\\n\\n        if (filterVal === \\"enroute\\") {\\n            lv.status = \\"enroute\\";\\n        } else if (filterVal === \\"routes-of-day\\") {\\n            lv.actual_date = today.today;\\n        } else if (filterVal === \\"yesterday-routes\\") {\\n            let yesterday = new Date(today.date);\\n            yesterday.setDate(yesterday.getDate() - 1);\\n            lv.actual_date = yesterday.toISOString().split(\\"T\\")[0];\\n        } else if (filterVal === \\"week-routes\\") {\\n            let monday = new Date(today.date);\\n            let diff = today.date.getDay() === 0 ? 6 : today.date.getDay() - 1;\\n            monday.setDate(today.date.getDate() - diff);\\n            lv.actual_date = monday.toISOString().split(\\"T\\")[0];\\n            lv.actual_date2 = today.today;\\n        }\\n\\n        getJson(\\n            `${back_url}api/admin/report/seguimiento_list.php`,\\n            function (data) {\\n                routes = data.data.seguimiento_list;\\n                events = data.data.event_list;\\n\\n                // Admin sees all routes, drivers only their own\\n                if (driverId === \\"me\\" && flag) {\\n                    filteredRoutes = routes;\\n                } else {\\n                    filteredRoutes = routes.filter(\\n                        (route) => route.id_driver === driverId\\n                    );\\n                }\\n\\n                // Get only pending ones\\n                pendingRoutes = filteredRoutes.filter(\\n                    (route) =>\\n                        route.status !== \\"completed\\" &&\\n                        route.status !== \\"cancelled\\" &&\\n                        route.status !== \\"finished\\"\\n                );\\n\\n                hasPendingRoutes = pendingRoutes.length > 0;\\n            },\\n            lv\\n        );\\n    }\\n\\n    function openRoute(routeId, status) {\\n        //Here i need to get the actual status of the route going again to the database to get the actual status\\n        if (status == \\"checklist-pending\\") {\\n            showAlert(\\n                \\"Checklist Pendiente de Autorizar\\",\\n                \\"La lista de requerimientos de ruta está en revisión, podrás inciar la ruta una vez autorizado el checklist.\\"\\n            );\\n        } else {\\n            goto(`/drivers/${driverId}/routes/${routeId}`);\\n        }\\n    }\\n\\n    const capitalizeFirstLetter = (str) => {\\n        return str.charAt(0).toUpperCase() + str.slice(1);\\n    };\\n\\n    function getDeliveryColor(status) {\\n        let color = \\"#ffffff\\";\\n\\n        if (status === \\"pending\\") {\\n            color = \\"#FAD733\\";\\n        } else if (status === \\"completed\\") {\\n            color = \\"#27C24C\\";\\n        } else if (status == \\"enroute\\") {\\n            color = \\"#3BBAC2\\";\\n        } else if (status == \\"paused\\") {\\n            color = \\"#949DB9\\";\\n        } else if (status == \\"cancelled\\") {\\n            color = \\"#F05050\\";\\n        } else if (status == \\"checklist\\") {\\n            color = \\"#F6A833\\";\\n        } else if (status == \\"checklist-pending\\") {\\n            color = \\"#E98C00\\";\\n        }\\n\\n        return color;\\n    }\\n\\n    function setTitleStatus(status) {\\n        let title_status = \\"\\";\\n\\n        if (status === \\"pending\\") {\\n            title_status = \\"Pendiente\\";\\n        } else if (status === \\"completed\\") {\\n            title_status = \\"Completado\\";\\n        } else if (status == \\"enroute\\") {\\n            title_status = \\"En ruta\\";\\n        } else if (status == \\"paused\\") {\\n            title_status = \\"Pausado\\";\\n        } else if (status == \\"cancelled\\") {\\n            title_status = \\"Cancelado\\";\\n        } else if (status == \\"checklist\\") {\\n            title_status = \\"En checklist\\";\\n        } else if (status == \\"checklist-pending\\") {\\n            title_status = \\"Pendiente de aprobar checklist\\";\\n        }\\n\\n        return title_status;\\n    }\\n\\n    function getContrast(hexColor) {\\n        // If a leading # is provided, remove it\\n        if (hexColor.slice(0, 1) === \\"#\\") {\\n            hexColor = hexColor.slice(1);\\n        }\\n\\n        // If a three-character hexcode, make six-character\\n        if (hexColor.length === 3) {\\n            hexColor = hexColor\\n                .split(\\"\\")\\n                .map(function (hex) {\\n                    return hex + hex;\\n                })\\n                .join(\\"\\");\\n        }\\n\\n        // Convert to RGB value\\n        const r = parseInt(hexColor.substr(0, 2), 16);\\n        const g = parseInt(hexColor.substr(2, 2), 16);\\n        const b = parseInt(hexColor.substr(4, 2), 16);\\n\\n        // Get YIQ ratio\\n        const yiq = (r * 299 + g * 587 + b * 114) / 1000;\\n\\n        // Check contrast\\n        return yiq >= 128 ? \\"#414040\\" : \\"#fff\\";\\n    }\\n\\n    const showAlert = async (customHeader, customMessage) => {\\n        const alert = await alertController.create({\\n            header: customHeader || \\"Error\\", // Use customHeader or default value\\n            message: customMessage || \\"Vuelva a intentar\\", // Use customMessage or default value\\n            buttons: [\\n                {\\n                    text: \\"Cerrar\\",\\n                },\\n            ],\\n        });\\n\\n        await alert.present();\\n    };\\n\\n    function getTodayDate() {\\n        var date = new Date();\\n        var day = date.getDate();\\n        var month = date.getMonth() + 1;\\n        var year = date.getFullYear();\\n        var today = year + \\"-\\" + month + \\"-\\" + day;\\n\\n        return { today: today, year: year, month: month, date: date, day: day };\\n    }\\n    const logout = () => {\\n        // Redirect to login page or homepage\\n        goto(\\"/\\");\\n        flag = false;\\n        // Remove user session from localStorage\\n        localStorage.removeItem(\\"userSession\\");\\n    };\\n<\/script>\\n\\n<svelte:head>\\n    <title>Rutas - Rutaflow</title>\\n</svelte:head>\\n{#if dataSession}\\n    <IonPage>\\n        <ion-header translucent>\\n            <ion-toolbar>\\n                <ion-buttons slot=\\"start\\">\\n                    <ion-button class=\\"name-btn\\" title={dataSession.name}>\\n                        <span class=\\"name-span\\">{dataSession.name}</span>\\n                    </ion-button>\\n                </ion-buttons>\\n\\n                <!-- Centered Select Dropdown -->\\n                <ion-title>\\n                    <ion-select\\n                        bind:this={selectedFilter}\\n                        id=\\"quick-filter\\"\\n                        interface=\\"action-sheet\\"\\n                        value=\\"routes-of-day\\"\\n                        on:ionChange={loadRoutes}\\n                    >\\n                        <ion-select-option value=\\"enroute\\"\\n                            >Rutas en curso</ion-select-option\\n                        >\\n                        <ion-select-option value=\\"routes-of-day\\"\\n                            >Rutas del día</ion-select-option\\n                        >\\n                        <ion-select-option value=\\"yesterday-routes\\"\\n                            >Rutas de ayer</ion-select-option\\n                        >\\n                        <ion-select-option value=\\"week-routes\\"\\n                            >Rutas de la semana</ion-select-option\\n                        >\\n                    </ion-select>\\n                </ion-title>\\n\\n                <ion-buttons slot=\\"end\\">\\n                    <ion-button title=\\"Salir\\" alt=\\"Salir\\" on:click={logout}>\\n                        <ion-icon icon={logOut} />\\n                    </ion-button>\\n                </ion-buttons>\\n            </ion-toolbar>\\n        </ion-header>\\n\\n        <ion-content>\\n            <ion-refresher\\n                slot=\\"fixed\\"\\n                bind:this={refresher}\\n                on:ionRefresh={refresh}\\n            >\\n                <ion-refresher-content\\n                    pulling-icon=\\"arrow-dropdown\\"\\n                    pulling-text=\\"Jale para actualizar\\"\\n                    refreshing-spinner=\\"circles\\"\\n                    refreshing-text=\\"Actualizando...\\"\\n                />\\n            </ion-refresher>\\n            <ion-list>\\n                {#if hasPendingRoutes}\\n                    {#each pendingRoutes as route (route.id_route)}\\n                        <ion-item\\n                            button\\n                            on:click={openRoute(route.id_route, route.status)}\\n                        >\\n                            <ion-avatar slot=\\"start\\">\\n                                <div\\n                                    class=\\"route-color\\"\\n                                    style=\\"background-color:{getDeliveryColor(\\n                                        route.status\\n                                    )};color:{getContrast(\\n                                        getDeliveryColor(route.status)\\n                                    )}\\"\\n                                    title={setTitleStatus(route.status)}\\n                                >\\n                                    <div class=\\"route-symbol\\">\\n                                        {capitalizeFirstLetter(\\n                                            route.name?.charAt(0)\\n                                        )}\\n                                    </div>\\n                                </div>\\n                            </ion-avatar>\\n                            <ion-label>\\n                                <h2>{route.name?.toUpperCase()}</h2>\\n                                <h3 class=\\"text-muted\\">\\n                                    Inicio: {route.date_start}\\n                                </h3>\\n                            </ion-label>\\n                        </ion-item>\\n                    {/each}\\n                {:else}\\n                    <ion-grid class=\\"ion-text-center h-full\\">\\n                        <ion-row class=\\"h-full items-center\\">\\n                            <ion-col class=\\"text-center\\">\\n                                <h2 class=\\"text-3xl text-muted mb-4\\">\\n                                    No hay rutas pendientes para hoy\\n                                </h2>\\n                                <p class=\\"text-muted\\">\\n                                    Espere indicaciones de su supervisor\\n                                </p>\\n                            </ion-col>\\n                        </ion-row>\\n                    </ion-grid>\\n                {/if}\\n            </ion-list>\\n        </ion-content>\\n    </IonPage>\\n{/if}\\n\\n<style>\\n    .name-btn {\\n        --max-width: 5rem;\\n        width: 5rem;\\n    }\\n    .name-span {\\n        display: block;\\n        --max-width: 100%;\\n        overflow: hidden;\\n        text-overflow: ellipsis;\\n        --white-space: nowrap;\\n        --text-align: center;\\n    }\\n    .route-color {\\n        width: 100%;\\n        height: 100%;\\n        border-radius: 50%;\\n        display: flex;\\n        justify-content: center;\\n    }\\n\\n    .route-symbol {\\n        text-align: center;\\n        align-self: center;\\n        font-size: 30px;\\n    }\\n\\n    .total,\\n    .time {\\n        color: #86888f;\\n        font-size: 14px;\\n    }\\n\\n    .secret {\\n        color: #c05cea;\\n    }\\n    .fruti {\\n        color: #338be6;\\n    }\\n    .berry {\\n        color: #e82866;\\n    }\\n    .big {\\n        color: #e68633;\\n    }\\n    h3 {\\n        font-size: 13px;\\n    }\\n    .text-muted {\\n        color: #8e8e8e;\\n    }\\n    .mr-10 {\\n        margin-right: 10px;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA0VI,wBAAU,CACN,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IACX,CACA,yBAAW,CACP,OAAO,CAAE,KAAK,CACd,WAAW,CAAE,IAAI,CACjB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,aAAa,CAAE,MAAM,CACrB,YAAY,CAAE,MAClB,CACA,2BAAa,CACT,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MACrB,CAEA,4BAAc,CACV,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IACf,CAoBA,iBAAG,CACC,SAAS,CAAE,IACf,CACA,0BAAY,CACR,KAAK,CAAE,OACX"}'
};
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
function getTodayDate() {
  var date = /* @__PURE__ */ new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var today = year + "-" + month + "-" + day;
  return { today, year, month, date, day };
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { driverId } = $$props;
  let back_url = DATABASE_URL;
  let routes = [];
  let events = [];
  let filteredRoutes = [];
  let pendingRoutes = [];
  let hasPendingRoutes = false;
  let flag = false;
  let dataSession = new Object();
  let refresher;
  let selectedFilter = "routes-of-day";
  function loadRoutes() {
    const lv = {
      id_enterprise: dataSession.id_enterprise || "null",
      id_user_over: dataSession.id_user,
      token: dataSession.token
    };
    const filterVal = selectedFilter?.value || selectedFilter;
    const today = getTodayDate();
    if (filterVal === "enroute") {
      lv.status = "enroute";
    } else if (filterVal === "routes-of-day") {
      lv.actual_date = today.today;
    } else if (filterVal === "yesterday-routes") {
      let yesterday = new Date(today.date);
      yesterday.setDate(yesterday.getDate() - 1);
      lv.actual_date = yesterday.toISOString().split("T")[0];
    } else if (filterVal === "week-routes") {
      let monday = new Date(today.date);
      let diff = today.date.getDay() === 0 ? 6 : today.date.getDay() - 1;
      monday.setDate(today.date.getDate() - diff);
      lv.actual_date = monday.toISOString().split("T")[0];
      lv.actual_date2 = today.today;
    }
    getJson(
      `${back_url}api/admin/report/seguimiento_list.php`,
      function(data) {
        routes = data.data.seguimiento_list;
        events = data.data.event_list;
        if (driverId === "me" && flag) {
          filteredRoutes = routes;
        } else {
          filteredRoutes = routes.filter((route) => route.id_driver === driverId);
        }
        pendingRoutes = filteredRoutes.filter((route) => route.status !== "completed" && route.status !== "cancelled" && route.status !== "finished");
        hasPendingRoutes = pendingRoutes.length > 0;
      },
      lv
    );
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
      dataSession = JSON.parse(localStorage.getItem("userSession"));
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
      return `<ion-header translucent><ion-toolbar><ion-buttons slot="start"><ion-button class="name-btn svelte-13map4f"${add_attribute("title", dataSession.name, 0)}><span class="name-span svelte-13map4f">${escape(dataSession.name)}</span></ion-button></ion-buttons>  <ion-title><ion-select id="quick-filter" interface="action-sheet" value="routes-of-day"${add_attribute("this", selectedFilter, 0)} data-svelte-h="svelte-npp4es"><ion-select-option value="enroute">Rutas en curso</ion-select-option> <ion-select-option value="routes-of-day">Rutas del día</ion-select-option> <ion-select-option value="yesterday-routes">Rutas de ayer</ion-select-option> <ion-select-option value="week-routes">Rutas de la semana</ion-select-option></ion-select></ion-title> <ion-buttons slot="end"><ion-button title="Salir" alt="Salir" data-svelte-h="svelte-1uwf95q"><ion-icon${add_attribute("icon", logOut, 0)}></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header> <ion-content><ion-refresher slot="fixed"${add_attribute("this", refresher, 0)} data-svelte-h="svelte-1m9d3bo"><ion-refresher-content pulling-icon="arrow-dropdown" pulling-text="Jale para actualizar" refreshing-spinner="circles" refreshing-text="Actualizando..."></ion-refresher-content></ion-refresher> <ion-list>${hasPendingRoutes ? `${each(pendingRoutes, (route) => {
        return `<ion-item button><ion-avatar slot="start"><div class="route-color svelte-13map4f" style="${"background-color:" + escape(getDeliveryColor(route.status), true) + ";color:" + escape(getContrast(getDeliveryColor(route.status)), true)}"${add_attribute("title", setTitleStatus(route.status), 0)}><div class="route-symbol svelte-13map4f">${escape(capitalizeFirstLetter(route.name?.charAt(0)))}</div> </div></ion-avatar> <ion-label><h2>${escape(route.name?.toUpperCase())}</h2> <h3 class="text-muted svelte-13map4f">Inicio: ${escape(route.date_start)} </h3></ion-label> </ion-item>`;
      })}` : `<ion-grid class="ion-text-center h-full" data-svelte-h="svelte-g63gp8"><ion-row class="h-full items-center"><ion-col class="text-center"><h2 class="text-3xl text-muted mb-4 svelte-13map4f">No hay rutas pendientes para hoy</h2> <p class="text-muted svelte-13map4f">Espere indicaciones de su supervisor</p></ion-col></ion-row></ion-grid>`}</ion-list></ion-content>`;
    }
  })}` : ``}`;
});
export {
  Page as default
};
