import { c as create_ssr_component, d as subscribe, v as validate_component, a as add_attribute, e as escape, f as each } from "../../../../chunks/ssr.js";
import { p as page, g as getJson, I as IonPage } from "../../../../chunks/index2.js";
import { alertController } from "@ionic/core";
import { logOut } from "ionicons/icons/index.mjs";
import { g as goto } from "../../../../chunks/client.js";
import { DATABASE_URL } from "../../../../chunks/hooks.js";
const css = {
  code: ".name-btn.svelte-13map4f{--max-width:5rem;width:5rem}.name-span.svelte-13map4f{display:block;--max-width:100%;overflow:hidden;text-overflow:ellipsis;--white-space:nowrap;--text-align:center}.route-color.svelte-13map4f{width:100%;height:100%;border-radius:50%;display:flex;justify-content:center}.route-symbol.svelte-13map4f{text-align:center;align-self:center;font-size:30px}h3.svelte-13map4f{font-size:13px}.text-muted.svelte-13map4f{color:#8e8e8e}",
  map: null
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
  if ($$props.driverId === void 0 && $$bindings.driverId && driverId !== void 0)
    $$bindings.driverId(driverId);
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
