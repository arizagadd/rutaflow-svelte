import { c as create_ssr_component, d as subscribe, v as validate_component, a as add_attribute, e as escape, f as each } from "../../../../chunks/ssr.js";
import { p as page, g as getJson, I as IonPage } from "../../../../chunks/index2.js";
import { alertController } from "@ionic/core";
import { logOut } from "ionicons/icons/index.mjs";
import { g as goto } from "../../../../chunks/client.js";
import { DATABASE_URL } from "../../../../chunks/hooks.js";
const css = {
  code: ".name-btn.svelte-13map4f{--max-width:5rem;width:5rem}.name-span.svelte-13map4f{display:block;--max-width:100%;overflow:hidden;text-overflow:ellipsis;--white-space:nowrap;--text-align:center}.route-color.svelte-13map4f{width:100%;height:100%;border-radius:50%;display:flex;justify-content:center}.route-symbol.svelte-13map4f{text-align:center;align-self:center;font-size:30px}h3.svelte-13map4f{font-size:13px}.text-muted.svelte-13map4f{color:#8e8e8e}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\r\\n    export let driverId;\\r\\n    import { page } from \\"$app/stores\\";\\r\\n    import { alertController } from \\"@ionic/core\\";\\r\\n    import { logOut } from \\"ionicons/icons\\";\\r\\n    import { goto } from \\"$app/navigation\\";\\r\\n    import IonPage from \\"ionic-svelte/components/IonPage.svelte\\";\\r\\n    import { DATABASE_URL } from \\"../../../hooks\\";\\r\\n    import { getJson } from \\"$lib\\";\\r\\n\\r\\n    /*Back URL*/\\r\\n    let back_url = DATABASE_URL;\\r\\n\\r\\n    let routes = [];\\r\\n    let events = [];\\r\\n\\r\\n    let filteredRoutes = [];\\r\\n    let pendingRoutes = [];\\r\\n    let hasPendingRoutes = false;\\r\\n    let flag = false;\\r\\n    let dataSession = new Object();\\r\\n    let refresher;\\r\\n    let selectedFilter = \\"routes-of-day\\";\\r\\n\\r\\n    const refresh = async () => {\\r\\n        await loadRoutes();\\r\\n        refresher.complete();\\r\\n    };\\r\\n\\r\\n    $: {\\r\\n        ({ driverId } = $page.params);\\r\\n        dataSession = JSON.parse(localStorage.getItem(\\"userSession\\"));\\r\\n        if (dataSession) {\\r\\n            if (driverId == \\"me\\" && dataSession.id_user) {\\r\\n                if (\\r\\n                    dataSession.type == \\"admin\\" ||\\r\\n                    dataSession.type == \\"super\\"\\r\\n                ) {\\r\\n                    goto(`/drivers/me`);\\r\\n                    loadRoutes();\\r\\n                    flag = true;\\r\\n                } else {\\r\\n                    showAlert(\\r\\n                        \\"Usuario no autorizado\\",\\r\\n                        \\"Este usuario no tiene acceso a la app de Rutaflow, entrar en contacto con soporte\\"\\r\\n                    );\\r\\n                    goto(\\"/\\");\\r\\n                }\\r\\n            } else if (dataSession && driverId) {\\r\\n                goto(`/drivers/${dataSession.id_driver}`);\\r\\n                loadRoutes();\\r\\n            }\\r\\n        } else {\\r\\n            showAlert(\\r\\n                \\"Sesión cerrada\\",\\r\\n                \\"Será redireccionado para volver a ingresar\\"\\r\\n            );\\r\\n            goto(\\"/\\");\\r\\n        }\\r\\n    }\\r\\n\\r\\n    function loadRoutes() {\\r\\n        const lv = {\\r\\n            id_enterprise: dataSession.id_enterprise || \\"null\\",\\r\\n            id_user_over: dataSession.id_user,\\r\\n            token: dataSession.token,\\r\\n        };\\r\\n\\r\\n        const filterVal = selectedFilter?.value || selectedFilter;\\r\\n        const today = getTodayDate();\\r\\n\\r\\n        if (filterVal === \\"enroute\\") {\\r\\n            lv.status = \\"enroute\\";\\r\\n        } else if (filterVal === \\"routes-of-day\\") {\\r\\n            lv.actual_date = today.today;\\r\\n        } else if (filterVal === \\"yesterday-routes\\") {\\r\\n            let yesterday = new Date(today.date);\\r\\n            yesterday.setDate(yesterday.getDate() - 1);\\r\\n            lv.actual_date = yesterday.toISOString().split(\\"T\\")[0];\\r\\n        } else if (filterVal === \\"week-routes\\") {\\r\\n            let monday = new Date(today.date);\\r\\n            let diff = today.date.getDay() === 0 ? 6 : today.date.getDay() - 1;\\r\\n            monday.setDate(today.date.getDate() - diff);\\r\\n            lv.actual_date = monday.toISOString().split(\\"T\\")[0];\\r\\n            lv.actual_date2 = today.today;\\r\\n        }\\r\\n\\r\\n        getJson(\\r\\n            `${back_url}api/admin/report/seguimiento_list.php`,\\r\\n            function (data) {\\r\\n                routes = data.data.seguimiento_list;\\r\\n                events = data.data.event_list;\\r\\n\\r\\n                // Admin sees all routes, drivers only their own\\r\\n                if (driverId === \\"me\\" && flag) {\\r\\n                    filteredRoutes = routes;\\r\\n                } else {\\r\\n                    filteredRoutes = routes.filter(\\r\\n                        (route) => route.id_driver === driverId\\r\\n                    );\\r\\n                }\\r\\n\\r\\n                // Get only pending ones\\r\\n                pendingRoutes = filteredRoutes.filter(\\r\\n                    (route) =>\\r\\n                        route.status !== \\"completed\\" &&\\r\\n                        route.status !== \\"cancelled\\" &&\\r\\n                        route.status !== \\"finished\\"\\r\\n                );\\r\\n\\r\\n                hasPendingRoutes = pendingRoutes.length > 0;\\r\\n            },\\r\\n            lv\\r\\n        );\\r\\n    }\\r\\n\\r\\n    function openRoute(routeId, status) {\\r\\n        //Here i need to get the actual status of the route going again to the database to get the actual status\\r\\n        if (status == \\"checklist-pending\\") {\\r\\n            showAlert(\\r\\n                \\"Checklist Pendiente de Autorizar\\",\\r\\n                \\"La lista de requerimientos de ruta está en revisión, podrás inciar la ruta una vez autorizado el checklist.\\"\\r\\n            );\\r\\n        } else {\\r\\n            goto(`/drivers/${driverId}/routes/${routeId}`);\\r\\n        }\\r\\n    }\\r\\n\\r\\n    const capitalizeFirstLetter = (str) => {\\r\\n        return str.charAt(0).toUpperCase() + str.slice(1);\\r\\n    };\\r\\n\\r\\n    function getDeliveryColor(status) {\\r\\n        let color = \\"#ffffff\\";\\r\\n\\r\\n        if (status === \\"pending\\") {\\r\\n            color = \\"#FAD733\\";\\r\\n        } else if (status === \\"completed\\") {\\r\\n            color = \\"#27C24C\\";\\r\\n        } else if (status == \\"enroute\\") {\\r\\n            color = \\"#3BBAC2\\";\\r\\n        } else if (status == \\"paused\\") {\\r\\n            color = \\"#949DB9\\";\\r\\n        } else if (status == \\"cancelled\\") {\\r\\n            color = \\"#F05050\\";\\r\\n        } else if (status == \\"checklist\\") {\\r\\n            color = \\"#F6A833\\";\\r\\n        } else if (status == \\"checklist-pending\\") {\\r\\n            color = \\"#E98C00\\";\\r\\n        }\\r\\n\\r\\n        return color;\\r\\n    }\\r\\n\\r\\n    function setTitleStatus(status) {\\r\\n        let title_status = \\"\\";\\r\\n\\r\\n        if (status === \\"pending\\") {\\r\\n            title_status = \\"Pendiente\\";\\r\\n        } else if (status === \\"completed\\") {\\r\\n            title_status = \\"Completado\\";\\r\\n        } else if (status == \\"enroute\\") {\\r\\n            title_status = \\"En ruta\\";\\r\\n        } else if (status == \\"paused\\") {\\r\\n            title_status = \\"Pausado\\";\\r\\n        } else if (status == \\"cancelled\\") {\\r\\n            title_status = \\"Cancelado\\";\\r\\n        } else if (status == \\"checklist\\") {\\r\\n            title_status = \\"En checklist\\";\\r\\n        } else if (status == \\"checklist-pending\\") {\\r\\n            title_status = \\"Pendiente de aprobar checklist\\";\\r\\n        }\\r\\n\\r\\n        return title_status;\\r\\n    }\\r\\n\\r\\n    function getContrast(hexColor) {\\r\\n        // If a leading # is provided, remove it\\r\\n        if (hexColor.slice(0, 1) === \\"#\\") {\\r\\n            hexColor = hexColor.slice(1);\\r\\n        }\\r\\n\\r\\n        // If a three-character hexcode, make six-character\\r\\n        if (hexColor.length === 3) {\\r\\n            hexColor = hexColor\\r\\n                .split(\\"\\")\\r\\n                .map(function (hex) {\\r\\n                    return hex + hex;\\r\\n                })\\r\\n                .join(\\"\\");\\r\\n        }\\r\\n\\r\\n        // Convert to RGB value\\r\\n        const r = parseInt(hexColor.substr(0, 2), 16);\\r\\n        const g = parseInt(hexColor.substr(2, 2), 16);\\r\\n        const b = parseInt(hexColor.substr(4, 2), 16);\\r\\n\\r\\n        // Get YIQ ratio\\r\\n        const yiq = (r * 299 + g * 587 + b * 114) / 1000;\\r\\n\\r\\n        // Check contrast\\r\\n        return yiq >= 128 ? \\"#414040\\" : \\"#fff\\";\\r\\n    }\\r\\n\\r\\n    const showAlert = async (customHeader, customMessage) => {\\r\\n        const alert = await alertController.create({\\r\\n            header: customHeader || \\"Error\\", // Use customHeader or default value\\r\\n            message: customMessage || \\"Vuelva a intentar\\", // Use customMessage or default value\\r\\n            buttons: [\\r\\n                {\\r\\n                    text: \\"Cerrar\\",\\r\\n                },\\r\\n            ],\\r\\n        });\\r\\n\\r\\n        await alert.present();\\r\\n    };\\r\\n\\r\\n    function getTodayDate() {\\r\\n        var date = new Date();\\r\\n        var day = date.getDate();\\r\\n        var month = date.getMonth() + 1;\\r\\n        var year = date.getFullYear();\\r\\n        var today = year + \\"-\\" + month + \\"-\\" + day;\\r\\n\\r\\n        return { today: today, year: year, month: month, date: date, day: day };\\r\\n    }\\r\\n    const logout = () => {\\r\\n        // Redirect to login page or homepage\\r\\n        goto(\\"/\\");\\r\\n        flag = false;\\r\\n        // Remove user session from localStorage\\r\\n        localStorage.removeItem(\\"userSession\\");\\r\\n    };\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>Rutas - Rutaflow</title>\\r\\n</svelte:head>\\r\\n{#if dataSession}\\r\\n    <IonPage>\\r\\n        <ion-header translucent>\\r\\n            <ion-toolbar>\\r\\n                <ion-buttons slot=\\"start\\">\\r\\n                    <ion-button class=\\"name-btn\\" title={dataSession.name}>\\r\\n                        <span class=\\"name-span\\">{dataSession.name}</span>\\r\\n                    </ion-button>\\r\\n                </ion-buttons>\\r\\n\\r\\n                <!-- Centered Select Dropdown -->\\r\\n                <ion-title>\\r\\n                    <ion-select\\r\\n                        bind:this={selectedFilter}\\r\\n                        id=\\"quick-filter\\"\\r\\n                        interface=\\"action-sheet\\"\\r\\n                        value=\\"routes-of-day\\"\\r\\n                        on:ionChange={loadRoutes}\\r\\n                    >\\r\\n                        <ion-select-option value=\\"enroute\\"\\r\\n                            >Rutas en curso</ion-select-option\\r\\n                        >\\r\\n                        <ion-select-option value=\\"routes-of-day\\"\\r\\n                            >Rutas del día</ion-select-option\\r\\n                        >\\r\\n                        <ion-select-option value=\\"yesterday-routes\\"\\r\\n                            >Rutas de ayer</ion-select-option\\r\\n                        >\\r\\n                        <ion-select-option value=\\"week-routes\\"\\r\\n                            >Rutas de la semana</ion-select-option\\r\\n                        >\\r\\n                    </ion-select>\\r\\n                </ion-title>\\r\\n\\r\\n                <ion-buttons slot=\\"end\\">\\r\\n                    <ion-button title=\\"Salir\\" alt=\\"Salir\\" on:click={logout}>\\r\\n                        <ion-icon icon={logOut} />\\r\\n                    </ion-button>\\r\\n                </ion-buttons>\\r\\n            </ion-toolbar>\\r\\n        </ion-header>\\r\\n\\r\\n        <ion-content>\\r\\n            <ion-refresher\\r\\n                slot=\\"fixed\\"\\r\\n                bind:this={refresher}\\r\\n                on:ionRefresh={refresh}\\r\\n            >\\r\\n                <ion-refresher-content\\r\\n                    pulling-icon=\\"arrow-dropdown\\"\\r\\n                    pulling-text=\\"Jale para actualizar\\"\\r\\n                    refreshing-spinner=\\"circles\\"\\r\\n                    refreshing-text=\\"Actualizando...\\"\\r\\n                />\\r\\n            </ion-refresher>\\r\\n            <ion-list>\\r\\n                {#if hasPendingRoutes}\\r\\n                    {#each pendingRoutes as route (route.id_route)}\\r\\n                        <ion-item\\r\\n                            button\\r\\n                            on:click={openRoute(route.id_route, route.status)}\\r\\n                        >\\r\\n                            <ion-avatar slot=\\"start\\">\\r\\n                                <div\\r\\n                                    class=\\"route-color\\"\\r\\n                                    style=\\"background-color:{getDeliveryColor(\\r\\n                                        route.status\\r\\n                                    )};color:{getContrast(\\r\\n                                        getDeliveryColor(route.status)\\r\\n                                    )}\\"\\r\\n                                    title={setTitleStatus(route.status)}\\r\\n                                >\\r\\n                                    <div class=\\"route-symbol\\">\\r\\n                                        {capitalizeFirstLetter(\\r\\n                                            route.name?.charAt(0)\\r\\n                                        )}\\r\\n                                    </div>\\r\\n                                </div>\\r\\n                            </ion-avatar>\\r\\n                            <ion-label>\\r\\n                                <h2>{route.name?.toUpperCase()}</h2>\\r\\n                                <h3 class=\\"text-muted\\">\\r\\n                                    Inicio: {route.date_start}\\r\\n                                </h3>\\r\\n                            </ion-label>\\r\\n                        </ion-item>\\r\\n                    {/each}\\r\\n                {:else}\\r\\n                    <ion-grid class=\\"ion-text-center h-full\\">\\r\\n                        <ion-row class=\\"h-full items-center\\">\\r\\n                            <ion-col class=\\"text-center\\">\\r\\n                                <h2 class=\\"text-3xl text-muted mb-4\\">\\r\\n                                    No hay rutas pendientes para hoy\\r\\n                                </h2>\\r\\n                                <p class=\\"text-muted\\">\\r\\n                                    Espere indicaciones de su supervisor\\r\\n                                </p>\\r\\n                            </ion-col>\\r\\n                        </ion-row>\\r\\n                    </ion-grid>\\r\\n                {/if}\\r\\n            </ion-list>\\r\\n        </ion-content>\\r\\n    </IonPage>\\r\\n{/if}\\r\\n\\r\\n<style>\\r\\n    .name-btn {\\r\\n        --max-width: 5rem;\\r\\n        width: 5rem;\\r\\n    }\\r\\n    .name-span {\\r\\n        display: block;\\r\\n        --max-width: 100%;\\r\\n        overflow: hidden;\\r\\n        text-overflow: ellipsis;\\r\\n        --white-space: nowrap;\\r\\n        --text-align: center;\\r\\n    }\\r\\n    .route-color {\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n        border-radius: 50%;\\r\\n        display: flex;\\r\\n        justify-content: center;\\r\\n    }\\r\\n\\r\\n    .route-symbol {\\r\\n        text-align: center;\\r\\n        align-self: center;\\r\\n        font-size: 30px;\\r\\n    }\\r\\n\\r\\n    .total,\\r\\n    .time {\\r\\n        color: #86888f;\\r\\n        font-size: 14px;\\r\\n    }\\r\\n\\r\\n    .secret {\\r\\n        color: #c05cea;\\r\\n    }\\r\\n    .fruti {\\r\\n        color: #338be6;\\r\\n    }\\r\\n    .berry {\\r\\n        color: #e82866;\\r\\n    }\\r\\n    .big {\\r\\n        color: #e68633;\\r\\n    }\\r\\n    h3 {\\r\\n        font-size: 13px;\\r\\n    }\\r\\n    .text-muted {\\r\\n        color: #8e8e8e;\\r\\n    }\\r\\n    .mr-10 {\\r\\n        margin-right: 10px;\\r\\n    }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AA0VI,wBAAU,CACN,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IACX,CACA,yBAAW,CACP,OAAO,CAAE,KAAK,CACd,WAAW,CAAE,IAAI,CACjB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,aAAa,CAAE,MAAM,CACrB,YAAY,CAAE,MAClB,CACA,2BAAa,CACT,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MACrB,CAEA,4BAAc,CACV,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IACf,CAoBA,iBAAG,CACC,SAAS,CAAE,IACf,CACA,0BAAY,CACR,KAAK,CAAE,OACX"}'
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
